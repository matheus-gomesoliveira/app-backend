import { Request, Response } from "express";
import { EnderecoEntrada } from "dtos/AddressDTO";
import AddressModel from "models/AddresModel";
import { updateAddressValidations } from "functions/ValidationFunctions";

const addressModel = new AddressModel();

export default class AddressController{

    get = async (req: Request, res: Response) => {
        try {
          const id: number = parseInt(req.params.id);
          const newAddress: EnderecoEntrada | null = await addressModel.get(id);
    
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
          const address: EnderecoEntrada[] | null = await addressModel.getAll();
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
          const id: number = parseInt(req.app.locals.payload);
          const updateAddress: EnderecoEntrada = req.body;
          const enderecoAlvo = await addressModel.get(id)
          const validacaoUpdate = updateAddressValidations(updateAddress, enderecoAlvo)

          if(validacaoUpdate){
            res.status(400).send(validacaoUpdate)
          } else {
            const userUpdated: EnderecoEntrada | null = await addressModel.update(
              id,
              updateAddress
            );

            if (userUpdated) {
              res.status(200).json(userUpdated);
            } else {
              res.status(404).json({
                error: "USR-06",
                message: "usuario not found.",
              });
            }
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



