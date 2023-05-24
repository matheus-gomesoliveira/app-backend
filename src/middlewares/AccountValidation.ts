import { Request, Response, NextFunction } from "express";

export const validacaoAdmin= async (req: Request, res: Response, next:NextFunction) => {
    const tipoConta = req.params.tipo_conta
    if(!(tipoConta == "admin")){
        return res.status(401).send({
            status:"acesso negado"
        })
    }
    next()
}