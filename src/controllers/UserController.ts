import { Request, Response } from "express";
import {
  FullUsuarioEntrada,
  UpdateUsuarioDados,
  UsuarioSaida,
} from "dtos/UserDTO";
import UserModel from "models/UserModel";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import AddressModel from "models/AddresModel";
import AccountModel from "models/AccountModel";
import {
  novaSenhaValidacao,
  updateUserValidations,
} from "functions/ValidationFunctions";

const userModel = new UserModel();
const addressModel = new AddressModel();
const accountModel = new AccountModel();

export default class UserController {
  create = async (req: Request, res: Response) => {
    try {
      const usuario: FullUsuarioEntrada = req.body.usuario;
      const usuarioCPFExiste: boolean =
        (await userModel.getUserCPF(usuario.cpf)) == null;
      const usuarioEmailExiste: boolean =
        (await userModel.getUserEmail(usuario.email)) == null;
      const usuarioTelefoneExiste: boolean =
        (await userModel.getUserTelefone(usuario.telefone)) == null;

      if (usuarioCPFExiste && usuarioEmailExiste && usuarioTelefoneExiste) {
        usuario.data_nascimento = new Date(
          usuario.data_nascimento + "T00:00:00.000Z"
        );
        usuario.senha = await hash(usuario.senha, 8);
        usuario.conta_bancaria.senha_transacional = await hash(
          usuario.conta_bancaria.senha_transacional,
          8
        );
        const newUser: UsuarioSaida = await userModel.create(usuario);
        res.status(201).json({
          status: "Cadastro realizado com sucesso",
          message: "Bem-vindo ao RubBank, " + newUser.nome_completo,
        });
      } else {
        res.status(500).send({
          error: "REG-08",
          message: "Conta de usuário já existe",
        });
      }
    } catch (e) {
      console.log("Failed to create user", e);
      res.status(500).send({
        error: "REG-00",
        message: "Falha ao criar usuário " + e,
      });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.app.locals.payload);
      const newUser: UsuarioSaida | null = await userModel.get(id);
      const endereco = await addressModel.get(id);
      const conta = await accountModel.get(id);

      if (newUser && endereco && conta) {
        res.status(200).json({
          usuario: {
            nome: newUser.nome_completo,
            telefone: newUser.telefone,
            email: newUser.email,
            cpf: newUser.cpf,
            data_nascimento: newUser.data_nascimento,
          },
          endereco: {
            rua: endereco.rua,
            bairro: endereco.bairro,
            numero: endereco.numero,
            cep: endereco.cep,
            cidade: endereco.cidade,
            uf: endereco.uf,
            complemento: endereco.complemento,
          },
          conta: {
            banco: conta.nome_banco,
            agencia: conta.agencia,
            numero_conta: conta.numero_conta,
            saldo: conta.saldo,
          },
        });
        console.log()
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "Usuário não encontrado",
        });
      }
    } catch (e) {
      console.log("Failed to get user", e);
      res.status(500).send({
        error: "USR-02",
        message: "Falha ao encontrar usuário",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users: UsuarioSaida[] | null = await userModel.getAll();
      res.status(200).json(users);
    } catch (e) {
      console.log("Failed to get all users", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all users",
      });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.app.locals.payload);
      const usuarioAlvo = await userModel.get(id);
      const updateUser: UpdateUsuarioDados = req.body;
      const errors = updateUserValidations(updateUser, usuarioAlvo);

      if (errors) {
        if (errors.length > 0) {
          return res.status(400).send({
            status: "failed",
            errors: errors,
          });
        }
      }

      const userUpdated: UsuarioSaida | null = await userModel.update(
        id,
        updateUser
      );

      if (userUpdated) {
        res.status(200).json({
          id: userUpdated.id,
          nome_completo: userUpdated.nome_completo,
          telefone: userUpdated.telefone,
          email: userUpdated.email,
          cpf: userUpdated.cpf,
          data_nascimento: userUpdated.data_nascimento,
        });
      } else {
        res.status(404).json({
          error: "ATT-01",
          message: "Usuario não econtrado",
        });
      }
    } catch (e) {
      console.log("Failed to update usuario", e);
      res.status(500).send({
        error: "ATT-02",
        message: "Falha ao atualizar dados de usuário" + e,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const userDeleted = await userModel.delete(id);
      res.status(204).json(userDeleted);
    } catch (e) {
      console.log("Failed to delete usuario", e);
      res.status(500).send({
        error: "USR-05",
        message: "Failed to delete usuario",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    const cpf = req.body.cpf;
    var senha = req.body.senha;
    const usuario = await userModel.getUserCPF(cpf);
    if (!usuario)
      res.status(400).send({
        error: "LOG-01",
        message: "CPF ou senha inválidos",
      });
    else {
      const senhaexiste = await compare(senha, usuario.senha);
      if (!senhaexiste) {
        res.status(400).send({
          error: "LOG-01",
          message: "CPF ou senha inválidos",
        });
      }
      const token = jwt.sign({ id: usuario.id }, process.env.SECRET_JWT ?? "", {
        expiresIn: "1d",
      });
      return res.status(201).send({
        mensagem: "Login efetuado com sucesso",
        token: token,
      });
    }
  };

  updateSenha = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.app.locals.payload);
      const usuario = await userModel.get(id);
      const senhaAtual = req.body.senha_atual;
      const novaSenha = req.body.nova_senha;
      const confirmarNovaSenha = req.body.confirmar_nova_senha;

      if (usuario) {
        const errors = await novaSenhaValidacao(
          usuario,
          senhaAtual,
          novaSenha,
          confirmarNovaSenha
        );
        if (errors) {
          if (errors?.length > 0) {
            res.status(400).send({
              status: "failed",
              errors: errors,
            });
          } else {
            const senhaDef = await hash(novaSenha, 8);
            await userModel.updateSenha(id, senhaDef);
            res.status(200).send({
              status: "confirmed",
              message: "Senha atualizada com sucesso",
            });
          }
        }
      }
    } catch (e) {
      console.log("Falha ao atualizar senha " + e);
      res.status(500).send({
        error: "ATT-",
        message: "Não foi possível atualizar a senha",
      });
    }
  };
}
