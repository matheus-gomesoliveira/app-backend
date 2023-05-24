import { Request, Response } from "express";
import { TransferEntrada, TransferSaida } from "dtos/TransferDTO";
import TransferModel from "models/TransferModel";
import AccountModel from "models/AccountModel";
import UserModel from "models/UserModel";
import { ContaEntrada } from "dtos/AccountDTO";
import  bcrypt  from "bcrypt"

const transferModel = new TransferModel;
const accountModel = new AccountModel
const userModel = new UserModel

export default class TransferController {
    transfer = async (req: Request, res: Response) => {
        try {
            
            const transferencia: TransferEntrada = req.body
            const id_usuario_origem = parseInt(req.params.id)

            transferencia.data_transferencia = new Date()

            const conta_origem: ContaEntrada | null = await accountModel.getConta(id_usuario_origem)
            
            /*CHECAR EXISTENCIA/STATUS DA CONTA DE ORIGEM*/
            if(conta_origem){
                /*CHECAR SALDO DA CONTA DE ORIGEM*/
                if(conta_origem.saldo >= transferencia.valor && conta_origem.saldo != 0){
                    /*CHECAR SENHA DA CONTA DE ORIGEM*/
                    const is_valid_senha_transacional = await bcrypt.compare(req.params.senha_transacional, conta_origem.senha_transacional) 
                    if(is_valid_senha_transacional){
                        /*CHECAR EXISTENCIA/STATUS DA CONTA DESTINO*/
                        const conta_destino: ContaEntrada | null = await accountModel.getConta(transferencia.id_destinatario)
                        if(conta_destino){
                            /*CHECAR SE A CONTA DE ORIGEM NÃO É A MESMA DE DESTINO*/
                            if(id_usuario_origem != transferencia.id_destinatario){
                                /*ATUALIZAR O SALDO DAS CONTAS*/
                                transferencia.id_destinatario = conta_destino.id_usuario
                                transferencia.status = "confirmada"
                                const newTransfer = await transferModel.create(transferencia)
                                res.status(201).json(newTransfer)
                            } else {
                                res.status(500).send({
                                    error: "TRA-05",
                                    message: "Não é possível realizar transferencias pra própria conta"
                                })
                            }    
                        } else {
                            res.status(500).send({
                                error: "TRA-04",
                                message: "Conta de destino inexistente "
                            })
                        } 
                    } else {
                        res.status(500).send({
                            error: "TRA-04",
                            message: "Senha inválida"
                        })
                    }
                } else {
                    res.status(500).send({
                        error: "TRA-03",
                        message: "Saldo insuficiente"
                    })
                }
            } else {
                res.status(500).send({
                    error: "TRA-02",
                    message: "Não é possível realizar transferencias de contas desativadas"
                })
            }
            
        } catch (error) {
            res.status(500).send({
                error: "TRA-01",
                message: "Não foi possível realizar a transferência"
            })
        }
    
    
    }

}
