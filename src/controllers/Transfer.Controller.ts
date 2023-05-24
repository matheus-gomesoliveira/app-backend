import { Request, Response } from "express";
import { TransferEntrada, TransferSaida } from "dtos/TransferDTO";
import TransferModel from "models/TransferModel";
import AccountModel from "models/AccountModel";
import UserModel from "models/UserModel";
import { ContaEntrada } from "dtos/AccountDTO";
import bcrypt from "bcrypt";
import { FullUsuarioEntrada } from "dtos/UserDTO";

const transferModel = new TransferModel();
const accountModel = new AccountModel();
const userModel = new UserModel();

export default class TransferController {
  transfer = async (req: Request, res: Response) => {
    try {
      const conta_origem = await accountModel.get(req.app.locals.payload);
      const usuario_origem = await userModel.get(req.app.locals.payload)
      var conta_destino;
      var usuario_destino;
      var destinoCpf;
      var destinoNumeroConta;
      const transferencia = req.body
      const destino = req.body.destino;
      const senhaTransacao = req.body.senha_transacional
      /*VERIFICAR SE CPF OU NUMERO DA CONTA FOI INFORMADO*/
      if(destino.length == 11) {
        destinoCpf = destino;
      } else {
        destinoNumeroConta = destino;
      }

      /*BUSCAR CONTA CASO CPF*/ 
      if (destinoCpf) {
        usuario_destino = await userModel.getUserCPF(destinoCpf);
        if (usuario_destino) {
          conta_destino = await accountModel.getConta(usuario_destino?.id);
        } else {
          res.status(401).send({
            error: "TRA-01",
            message: "Dados de destino inválidos",
          });
        }
      } else {
        conta_destino = await accountModel.getNumeroConta(destinoNumeroConta);
      }
    
      if(conta_origem && conta_destino){
        /*VALIDAÇAO SENHA*/
        const isValidSenhaTransacional = await bcrypt.compare(senhaTransacao, conta_origem?.senha_transacional)
        if(isValidSenhaTransacional){
            /*VALIDAÇAO SALDO*/
            if(conta_origem.saldo >= transferencia.valor){
                if(conta_origem.id != conta_destino.id){
                    transferencia.id_destinatario = conta_destino.id
                    transferencia.id_remetente = conta_origem.id
                    transferencia.valor = req.body.valor
                    transferencia.descricao = req.body.descricao
                    transferencia.status = "confirmada"

                    const newTransfer = await transferModel.transfer(transferencia, conta_origem, conta_destino)
                    
                    res.status(201).json({transferencia:{
                        id: newTransfer.id,
                        nome_origem: usuario_origem?.nome_completo,
                        nome_destino: usuario_destino?.nome_completo,
                        conta_origem: conta_origem.numero_conta,
                        conta_destino: conta_destino.numero_conta,
                        agencia_origem:conta_origem.agencia,
                        agencia_destino:conta_destino.agencia,
                        valor_transferencia: newTransfer.valor,
                        saldo_atual:conta_origem.saldo,
                    }})
                } else {
                    res.status(401).send({
                        error: "TRA-04",
                        message: "Não podem ser realizadas transferências para a mesma conta de origem",
                      });
                }
            } else {
                res.status(401).send({
                    error: "TRA-03",
                    message: "Saldo insuficiente",
                  });
            }
        } else {
            res.status(401).send({
                error: "TRA-02",
                message: "Senha transacional inválida",
              });
        }
      } else{
        res.status(401).send({
            error: "TRA-01",
            message: "Dados de destino inválidos",
          });
      }

    } catch (e) {
      res.status(500).send({
        error: e,
      });
    }
  };

  getTransfer = async (req: Request, res: Response) => {
    try{
        const id: number = parseInt(req.params.id);
        const newTransfer = await transferModel.get(id);
        if (newTransfer){
            res.status(200).json({tranferencia:{
                id: newTransfer.id,
            }});
        }   else {
            res.status(404).json({
                error: "ACC-06",
                message: "Conta não encontrada",
            })
        }
    }   catch(e){
        console.log("Failed to get account.", e);
        res.status(500).send({
            error: "ACC-02",
            message: "Falha ao encontrar conta",
        });
    }
};

}
