import { Request, Response } from "express";
import { FullUsuarioEntrada, UsuarioSaida } from "dtos/UserDTO";
import UserModel from "models/UserModel";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "@prisma/client";


const userModel = new UserModel();

export default class UserController {
  create = async (req: Request, res: Response) => {
    try {
      
      const usuario: FullUsuarioEntrada = req.body.usuario;
      const usuarioCPFExiste: boolean =
        (await userModel.getUserCPF(usuario.cpf)) == null;
      const usuarioEmailExiste: boolean = 
        (await userModel.getUserEmail(usuario.email)) == null;
      const usuarioTelefoneExiste: boolean = 
        (await userModel.getUserTelefone(usuario.telefone)) == null

        
      if (usuarioCPFExiste && usuarioEmailExiste && usuarioTelefoneExiste) {
        usuario.data_nascimento = new Date(
          usuario.data_nascimento + "T00:00:00.000Z"
        );
        usuario.senha = await hash(usuario.senha, 8);
        usuario.conta_bancaria.senha_transacional = await hash(
          usuario.conta_bancaria.senha_transacional,
          8
        );
      } else {
        res.status(500).send({
          error: "REG-08",
          message: "Conta de usuário já existe",
        });
      }
      const newUser: UsuarioSaida = await userModel.create(usuario);
      res.status(201).json(newUser);
    } catch (e) {
      console.log("Failed to create usuario", e);
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

      if (newUser) {
        res.status(200).json(newUser);
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

  update = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateUser: FullUsuarioEntrada = req.body;
      const userUpdated: UsuarioSaida | null = await userModel.update(
        id,
        updateUser
      );

      if (userUpdated) {
        res.status(200).json(userUpdated);
      } else {
        res.status(404).json({
          error: "USR-06",
          message: "usuario not found.",
        });
      }
    } catch (e) {
      console.log("Failed to update usuario", e);
      res.status(500).send({
        error: "USR-04",
        message: "Failed to update usuario" + e,
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
    let senha = req.body.senha;
    const usuario: Usuario | null = await userModel.getUserCPF(cpf);
    if (!usuario)
      res.status(500).send({
        error: "LOG-01",
        message: "E-mail ou senha inválidos",
      });
    else {
      const senhaexiste = await compare(senha, usuario.senha);
      if (!senhaexiste) {
        res.status(500).send({
          error: "LOG-01",
          message: "E-mail ou senha inválidos",
        });
      }
      const token = jwt.sign(
        { id: usuario.id },
        process.env.SECRET_JWT ?? "",
        { expiresIn: "1d" }
      );      
      return res.status(201).send({
        mensagem: "Login efetuado com sucesso",
        token: token,
      });
    }
  };
}
