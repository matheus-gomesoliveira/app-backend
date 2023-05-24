import { Request, Response } from "express";
import { EnderecoEntrada, EnderecoSaida } from "dtos/AddressDTO";
import AddressModel from "models/AddresModel";

const addressModel = new AddressModel();

export default class AddressController{
    // create = async (req: Request, res: Response) => {
    // try {
    //     const address: EnderecoEntrada = req.body;
    //     const newAddress: EnderecoSaida = await addressModel.create(address);
    //     res.status(201).json(newAddress);
    //   } catch (e) {
    //     console.log("Failed to create address", e);
    //     res.status(500).send({
    //       error: "USR-01",
    //       message: "Failed to create address" + e,
    //     });
    //   }
    // };

    get = async (req: Request, res: Response) => {
        try {
          const id: number = parseInt(req.params.id);
          const newAddress: EnderecoSaida | null = await addressModel.get(id);
    
          if (newAddress) {
            res.status(200).json(newAddress);
          } else {
            res.status(404).json({
              error: "USR-06",
              message: "Address not found.",
            });
          }
        } catch (e) {
          console.log("Failed to get address", e);
          res.status(500).send({
            error: "USR-02",
            message: "Failed to get address",
          });
        }
      };

      getAll = async (req: Request, res: Response) => {
        try {
          const address: EnderecoSaida[] | null = await addressModel.getAll();
          res.status(200).json(address);
        } catch (e) {
          console.log("Failed to get all addresses", e);
          res.status(500).send({
            error: "USR-03",
            message: "Failed to get all addresses",
          });
        }
      };

      update = async (req: Request, res: Response) => {
        try {
          const id: number = parseInt(req.params.id);
          const updateUser: EnderecoEntrada = req.body;
          const userUpdated: EnderecoSaida | null = await addressModel.update(
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
            message: "Failed to update usuario"+e,
          });
        }
      };

      delete = async (req: Request, res: Response) => {
        try {
          const id: number = parseInt(req.params.id);
          const addressDeleted = await addressModel.delete(id);
          res.status(204).json(addressDeleted);
        } catch (e) {
          console.log("Failed to delete usuario", e);
          res.status(500).send({
            error: "USR-05",
            message: "Failed to delete usuario",
          });
        }
      };
};



