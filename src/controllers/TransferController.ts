import { Request, Response } from "express";
import { TransferEntrada, TransferSaida } from "dtos/TransferDTO";
import TransferModel from "models/TransferModel";
import AccountModel from "models/AccountModel";
import UserModel from "models/UserModel";
import { ContaEntrada } from "dtos/AccountDTO";
import bcrypt from "bcrypt";
import { FullUsuarioEntrada } from "dtos/UserDTO";
import { Decimal } from "@prisma/client/runtime";

const transferModel = new TransferModel();
const accountModel = new AccountModel();
const userModel = new UserModel();

export default class TransferController {
  transfer = async (req: Request, res: Response) => {
    try {
      const usuario_origem = await userModel.get(req.app.locals.payload);
      var conta_destino;
      var usuario_destino;
      var destinoCpf;
      var destinoNumeroConta;
      const transferencia = req.body;
      const destino = req.body.destino
      const senhaTransacao = req.body.senha_transacional;
      
      if(usuario_origem){
        const conta_origem = await accountModel.get(usuario_origem.id) 
          /*VERIFICAR SE CPF OU NUMERO DA CONTA FOI INFORMADO*/
        if(!destino){
          res.status(401).send({
            error:"TRA-11",
            message:"Campo de destino inválido",
          })
        }
        if(!transferencia.valor){
          res.status(401).send({
            error:"TRA-12",
            message:"Campo de valor inválido",
          })
        }

        if(!senhaTransacao){
          res.status(401).send({
            error:"TRA-13",
            message:"Campo de senha inválido",
          })
        }

        if (destino.length == 11) {
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

        if (conta_origem && conta_destino) {
          /*VALIDAÇAO SENHA*/
          const isValidSenhaTransacional = await bcrypt.compare(
            senhaTransacao,
            conta_origem?.senha_transacional
          );
          if (isValidSenhaTransacional) {
            /*VALIDAÇAO SALDO*/
            if (conta_origem.saldo >= transferencia.valor) {
              if (transferencia.valor <= 0) {
                res.status(401).send({
                  error: "TRA-07",
                  message: "o valor da transferência inválido",
                });
              } else {
                if (conta_origem.id != conta_destino.id) {
                  transferencia.id_destinatario = conta_destino.id;
                  transferencia.id_remetente = conta_origem.id;
                  transferencia.valor = req.body.valor;
                  transferencia.descricao = req.body.descricao;
                  transferencia.status = "confirmada";
  
                  await transferModel.transfer(
                    transferencia,
                    conta_origem,
                    conta_destino
                  );

                  res.status(201).json({
                    status:"sucesso",
                    message: "sua transferência foi realizada com sucesso"
                  });
                } else {
                  res.status(401).send({
                    error: "TRA-04",
                    message:
                      "Não podem ser realizadas transferências para a mesma conta de origem",
                  });
                }
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
        } else {
          res.status(401).send({
            error: "TRA-01",
            message: "Dados de destino inválidos",
          });
        }
      }
    } catch (e) {
      res.status(500).send({
        error: "TRA-00",
        message: "Não foi possível realizar a transferência",
      });
    }
  };

  getTransfer = async (req: Request, res: Response) => {
    try {
      const id_transferencia: number = parseInt(req.params.id_transferencia);
      const newTransfer = await transferModel.get(id_transferencia);

      if (newTransfer) {
        const id_usuario_alvo: number = parseInt(req.app.locals.payload);

        const id_conta_origem = newTransfer.id_remetente;
        const conta_origem = await accountModel.get(id_conta_origem);
        const id_usuario_origem = conta_origem?.id_usuario;
        const usuario_origem = await userModel.get(id_usuario_origem);

        const id_conta_destino = newTransfer.id_destinatario;
        const conta_destino = await accountModel.get(id_conta_destino);
        const id_usuario_destino = conta_destino?.id_usuario;
        const usuario_destino = await userModel.get(id_usuario_destino);

        const check_usuario_origem: boolean =
          id_usuario_alvo == id_usuario_origem;
        const check_usuario_destino: boolean =
          id_usuario_alvo == id_usuario_destino;

        if (!check_usuario_origem && !check_usuario_destino) {
          res.status(401).send({
            error: "TRA-09",
            message: "Não autorizado",
          });
        }

        var tipo_transfer;
        if (id_usuario_alvo == id_usuario_origem) {
          tipo_transfer = "SAIDA";
        } else {
          if (id_usuario_alvo == id_usuario_destino) {
            tipo_transfer = "ENTRADA";
          }
        }

        res.status(200).json({
          transferencia: {
            id_transferencia: id_transferencia,
            nome_origem: usuario_origem?.nome_completo,
            nome_destino: usuario_destino?.nome_completo,
            conta_origem: conta_origem?.numero_conta,
            conta_destino: conta_destino?.numero_conta,
            valor: newTransfer.valor,
            descricao: newTransfer.descricao,
            tipo: tipo_transfer,
          },
        });
      } else {
        res.status(404).send({
          error: "TRA-10",
          message: "Transferência não encontrada",
        });
      }
    } catch (e) {
      console.log("Failed to get transfer.", e);
      res.status(500).send({
        error: "TRA-05",
        message: "Falha ao encontrar tranferẽncia",
      });
    }
  };

  getExtrato = async (req: Request, res: Response) => {
    try {
      const id_usuario_alvo = parseInt(req.app.locals.payload)
      const conta_alvo = await accountModel.getConta(id_usuario_alvo)


      const tipo = (req.query.type)?.toString().toUpperCase() || 'TUDO'
      const pagina = Number(req.query.page) || 1


      const dataHoje = new Date();
      const fuso = dataHoje.getTimezoneOffset() * 60000;
      const dataFuso = new Date(dataHoje.getTime() - fuso);
      const dataHojeFormatada = dataFuso.toISOString().slice(0,10)

      function dataFormatada(data: string): string {
        const splits = data.split('/');
        const dataFormatada = `${splits[2]}-${splits[1]}-${splits[0]}`;
        return dataFormatada;
      }

      const take = 8
      const skip = (pagina-1)*take
      const ordem = (req.query.order)?.toString().toLowerCase() as 'asc'| 'desc' || 'asc'
      const data_inicio = req.query.start_date ? new Date(dataFormatada(req.query.start_date as string)) : new Date('2023-01-01');
      const data_final = req.query.end_date ? new Date(dataFormatada(req.query.end_date as string)) : new Date(dataHojeFormatada)

      const isIn:boolean = (tipo === "ENTRADA") 
      const isOut:boolean = (tipo === "SAIDA")
      
      let extrato
      let total_transferencias
      let total_paginas

      if(conta_alvo){
        const id_conta_alvo = conta_alvo.id

        if(isIn){
           extrato = await transferModel.getInTransfers(id_conta_alvo, skip, take, ordem, data_inicio, data_final) 
           total_transferencias = await transferModel.totalInTransfers(id_conta_alvo, data_inicio, data_final) 
           total_paginas = Math.ceil(total_transferencias/take)                    
        } else if(isOut){
           extrato = await transferModel.getOutTransfers(id_conta_alvo, skip, take, ordem, data_inicio, data_final) 
           total_transferencias = await transferModel.totalOutTransfers(id_conta_alvo, data_inicio, data_final) 
           total_paginas = Math.ceil(total_transferencias/take)   
        } else {
           extrato = await transferModel.getAllTransfers(id_conta_alvo, skip, take, ordem, data_inicio, data_final) 
           total_transferencias = await transferModel.totalTransfers(id_conta_alvo, data_inicio, data_final) 
           total_paginas = Math.ceil(total_transferencias/take)
        }

        const arr_extrato =[]
      
      for(const transferencia of extrato){

        const conta_origem = await accountModel.get(transferencia.id_remetente) 
        const conta_destino = await accountModel.get(transferencia.id_destinatario) 
                
        const usuario_origem = await userModel.get(conta_origem?.id_usuario)
        const usuario_destino = await userModel.get(conta_destino?.id_usuario)
        
        const is_conta_origem:boolean = (id_usuario_alvo == usuario_origem?.id) 
        const is_conta_destino:boolean = (id_usuario_alvo == usuario_destino?.id)

        var tipo_transfer;
        if (is_conta_origem) {
          tipo_transfer = "SAIDA";
        } else {
          if (is_conta_destino) {
            tipo_transfer = "ENTRADA";
          }
        }


        function formatDate(dateString: string): string {
          const parts = dateString.split('-');
          const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          return formattedDate;
        }

        const dia = formatDate(transferencia.data_transferencia.toISOString().slice(0, 10))
        const hora = transferencia.data_transferencia.toISOString().slice(11, 16)


        const transferencia_tratada = {
          id_transferencia:transferencia.id,
          conta_origem:conta_origem?.numero_conta,
          conta_destino:conta_destino?.numero_conta,
          data_transferencia:{
            dia:dia,
            hora:hora
          },
          valor:transferencia.valor,
          descricao:transferencia.descricao,
          status:transferencia.status,
          tipo:tipo_transfer,
        }
        arr_extrato.push(transferencia_tratada)
       }

        if(arr_extrato.length != 0){
          res.status(200).send({
            transferencias:arr_extrato,
            paginas:{
              pagina: pagina,
              total:total_paginas
            }
          })
        } else {
          res.status(200).send({
            message:'não há transferências referentes á esse periodo'
          })
        }

      }

    } catch (e) {
      console.log("Não foi possível recuperar o extrato", e)
      res.status(500).send({
        error:"EXT-00",
        message: "Não foi possível recuperar o extrato"
      })
    }
    
  }
}
