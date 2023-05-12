import { NextFunction, Request, Response } from "express";

export default function AddressValidation(req: Request, res: Response, next: NextFunction){   
    next();
}