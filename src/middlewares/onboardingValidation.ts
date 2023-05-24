import { Request, Response, NextFunction } from "express";
import { validacaoDadosUsuario } from "functions/ValidationFunctions"
import { FullUsuarioEntrada } from "dtos/UserDTO";
import { EnderecoEntrada } from "dtos/AddressDTO";
import { ContaEntrada } from "dtos/AccountDTO";

export const validacaoUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const usuario: FullUsuarioEntrada = req.body.usuario;
  const endereco: EnderecoEntrada = req.body.usuario.endereco;
  const conta: ContaEntrada = req.body.usuario.conta_bancaria;
  const errors = validacaoDadosUsuario(usuario, endereco, conta);
  if (errors.length > 0) {
    return res.status(401).send({
      status: "failed",
      errors: errors,
    });
  }
  next();
};
