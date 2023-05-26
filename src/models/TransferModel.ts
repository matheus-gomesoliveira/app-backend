import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { ContaEntrada } from 'dtos/AccountDTO';
import { TransferEntrada } from 'dtos/TransferDTO';

const prisma = new PrismaClient();

export default class TransferModel {
    
        transfer = async (transferencia: TransferEntrada, conta_origem: ContaEntrada, conta_destino:ContaEntrada ) => {
        const contaOrigemNovoSaldo: Decimal = Decimal.add(conta_origem.saldo,  -transferencia.valor)
        const contaDestinoNovoSaldo: Decimal = Decimal.add(conta_destino.saldo, transferencia.valor )


        /*CONTA ORIGEM*/ 
        await prisma.conta_Bancaria.update({
            where:{
                id: conta_origem.id
            },
            data: {
                saldo: contaOrigemNovoSaldo                
            }
        })

        /*CONTA DESTINO*/
        await prisma.conta_Bancaria.update({
            where:{
                id: conta_destino.id
            },
            data:{
                saldo: contaDestinoNovoSaldo
            }
        })

        return await prisma.transferencia.create({
            data:{
                id_remetente: transferencia.id_remetente,
                id_destinatario: transferencia.id_destinatario,
                valor: transferencia.valor,
                descricao: transferencia.descricao,
                status: transferencia.status,
                data_transferencia: new Date()
            }
        })
    }

    get = async (id: number) => {
        return await prisma.transferencia.findUnique({
          where: {
            id: id
          }
        });
      }


  create = async (transfer: TransferEntrada) => {
    return await prisma.transferencia.create({
      data: {
        id_remetente: transfer.id_remetente,
        id_destinatario: transfer.id_destinatario,
        valor: transfer.valor,
        data_transferencia: transfer.data_transferencia,
        descricao: transfer.descricao,
        status: transfer.status
      }
    });
  }

  getAllTransfers = async (id_conta: number) => {
    return await prisma.transferencia.findMany({
      where: {
        OR:[
          {
            id_remetente: id_conta
          },
          {
            id_destinatario: id_conta
          }
        ]
      }
    })
  }

//   getAll = async () => {
//     return await prisma.transferencia.findMany();
//   }


//   delete = async (id: number) => {
//     return await prisma.transferencia.delete({
//       where: {
//         id
//       }
//     })
//   }

//   update = async (id: number, transfer: TransferEntrada) => {
//     return await prisma.transferencia.update({
//       where: {
//         id
//       },
//       data: {
//         ...transfer
//       }
//     })
//   }
};