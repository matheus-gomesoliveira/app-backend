import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "@prisma/client";
import UserModel from "models/UserModel";

const userModel = new UserModel();

type JwtPayLoad = {
  id: number;
};

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send({ message: "Não autorizado" });
  }
  const token = auth.split(" ")[1];

  const { id } = jwt.verify(token, process.env.SECRET_JWT ?? "") as JwtPayLoad;
  const usuario: Usuario | null = await userModel.get(id);

  if (!usuario)
    res.status(500).send({
      error: "LOG-01",
      message: "Não autorizado",
    });

  req.app.locals.payload = id

  next();
};
