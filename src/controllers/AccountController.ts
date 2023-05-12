import { Request, Response } from "express";
import { ContaEntrada, ContaSaida } from "dtos/AccountDTO";
import AccountModel from "models/AccountModel";

const accountModel = new AccountModel;

export default class AccountController {
    create =async (req: Request, res: Response) => {
        try{
            const account: ContaEntrada = req.body;
            const newAccount : ContaSaida = await accountModel.create(account);
            res.status(201).json(newAccount);
        }   catch(e){
            console.log("Failed to crate account.", e);
            res.status(500).send({
                error: "ACC-01",
                message: "Failed to create account." + e,
            });
        }
        
    };

    get = async (req: Request, res: Response) => {
        try{
            const id: number = parseInt(req.params.id);
            const newAccount: ContaEntrada | null = await accountModel.get(id);

            if (newAccount){
                res.status(200).json(newAccount);
            }   else {
                res.status(404).json({
                    error: "ACC-06",
                    message: "Account not found.",
                })
            }
        }   catch(e){
            console.log("Failed to get account.", e);
            res.status(500).send({
                error: "ACC-02",
                message: "Failed to get account",
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
    
    update = async (req: Request, res: Response) => {
        try {
            const id: number =  parseInt(req.params.id);
            const updateAccount: ContaEntrada = req.body;
            const accountUpdated: ContaSaida | null = await accountModel.update(
                id,
                updateAccount
            );

            if (accountUpdated) {
                res.status(200).json(accountUpdated)
            } else {
                res.status(404).json({
                    error: "ACC-06",
                    message: "Account not fount.",
                });
            }
        }   catch(e){
            console.log("Failed do update account", e);
            res.status(500).send({
                error:"ACC-04",
                message:"Failed to update account" + e,
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id: number = parseInt(req.params.id);
            const accountDeleted = await accountModel.delete(id);
            res.status(204).json(accountDeleted);
        }   catch (e) {
            console.log("Failed to delete account", e);
            res.status(500).send({
                error: "ACC-05",
                message: "Failed to delete account",
            });
        }
    };
};