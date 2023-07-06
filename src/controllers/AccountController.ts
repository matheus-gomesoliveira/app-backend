import { Request, Response } from "express";
import { ContaEntrada, ContaSaida } from "dtos/AccountDTO";
import AccountModel from "models/AccountModel";
import {
  novaSenhaTransacionalValidacao,
  novaSenhaValidacao,
} from "functions/ValidationFunctions";
import { hash } from "bcrypt";
const accountModel = new AccountModel();

export default class AccountController {
  get = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const newAccount: ContaEntrada | null = await accountModel.get(id);

      if (newAccount) {
        res.status(200).json(newAccount);
      } else {
        res.status(404).json({
          error: "ACC-06",
          message: "Conta não encontrada",
        });
      }
    } catch (e) {
      console.log("Failed to get account.", e);
      res.status(500).send({
        error: "ACC-02",
        message: "Falha ao buscar conta",
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const account: ContaEntrada[] | null = await accountModel.getAll();
      res.status(200).json(account);
    } catch (e) {
      console.log("Failed to get all accounts", e);
      res.status(500).send({
        error: "USR-03",
        message: "Failed to get all accounts",
      });
    }
  };

  updateTransactionPassword = async (req: Request, res: Response) => {
    try {
      const id_usuario: number = parseInt(req.app.locals.payload);
      const conta = await accountModel.get(id_usuario);
      const id_conta = conta?.id       
      const senha = conta?.senha_transacional;
      const senha_atual = req.body.senha_atual;
      const nova_senha = req.body.nova_senha;
      const confirmar_nova_senha = req.body.confirmar_nova_senha;
      if(senha){
        const errors = await novaSenhaTransacionalValidacao(
          senha,
          senha_atual,
          nova_senha,
          confirmar_nova_senha
        );
        if (errors) {
          if (errors?.length > 0) {
            res.status(400).send({
              status: "failed",
              errors: errors,
            });
          } else {
            const senha_def = await hash(nova_senha,8)
            if (conta) await accountModel.updateSenha(id_conta, senha_def);
            res.status(200).send({
              message: "Senha transacional atualizada com sucesso.",
            });
          }
        }
      }
    } catch (e) {
      console.log("Falha ao atualizar a senha transacional", e);
      res.status(500).send({
        error: "TRP-04",
        message: "Falha ao atualizar a senha transacional" + e,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.app.locals.payload);
      const conta = await accountModel.get(id);

      if (conta) {
        await accountModel.updateStatusConta(conta?.id);
        res
          .status(204)
          .json({ status: "confirmed", message: "conta deletada com sucesso" });
      }
    } catch (e) {
      console.log("Falha ao deletar conta", e);
      res.status(500).send({
        error: "ACC-05",
        message: "Falha ao deletar conta",
      });
    }
  };

  getBalance = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.app.locals.payload);
      const newAccount = await accountModel.get(id);
      if (newAccount) {
        res.status(200).json({
          nome_banco: newAccount.nome_banco,
          numero_conta: newAccount.numero_conta,
          agencia: newAccount.agencia,
          saldo: newAccount.saldo,
        });
      } else {
        res.status(404).json({
          error: "ACC-06",
          message: "Conta não encontrada",
        });
      }
    } catch (e) {
      console.log("Failed to get account.", e);
      res.status(500).send({
        error: "ACC-02",
        message: "Falha ao encontrar conta",
      });
    }
  };

  updateBalance = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      const updateAccount: ContaEntrada = req.body;
      const accountUpdated: ContaEntrada | null = await accountModel.update(
        id,
        updateAccount
      );

      if (accountUpdated) {
        res.status(200).json(accountUpdated);
      } else {
        res.status(404).json({
          error: "ACC-06",
          message: "Account not fount.",
        });
      }
    } catch (e) {
      console.log("Failed do update account", e);
      res.status(500).send({
        error: "ACC-04",
        message: "Failed to update account" + e,
      });
    }
  };
}
