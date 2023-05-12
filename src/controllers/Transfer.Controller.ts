import { Request, Response } from "express";
import { TransferEntrada, TransferSaida } from "dtos/TransferDTO";
import TransferModel from "models/TransferModel";

const transferModel = new TransferModel;

export default class TransferController {
    create = async (req: Request, res: Response) => {
        try{
            const transfer: TransferEntrada = req.body;
            const newTransfer : TransferSaida = await transferModel.create(transfer);
            res.status(201).json(newTransfer);
        }   catch(e){
            console.log("Failed to crate transference.", e);
            res.status(500).send({
                error: "TRA-01",
                message: "Failed to create transference." + e,
            });
        }
        
    };

    get = async (req: Request, res: Response) => {
        try{
            const id: number = parseInt(req.params.id);
            const newTransfer: TransferEntrada | null = await transferModel.get(id);

            if (newTransfer){
                res.status(200).json(newTransfer);
            }   else {
                res.status(404).json({
                    error: "TRA-06",
                    message: "Transference not found.",
                })
            }
        }   catch(e){
            console.log("Failed to get transference.", e);
            res.status(500).send({
                error: "ACC-02",
                message: "Failed to get transference",
            });
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const transfer: TransferEntrada[] | null = await transferModel.getAll();
            res.status(200).json(transfer);
        } catch (e) {
            console.log("Failed to get all transferences", e);
            res.status(500).send({
                error: "TRA-03",
                message: "Failed to get all transferences",
            });
        }
    };
};
