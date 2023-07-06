import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { ContaEntrada } from "dtos/AccountDTO";
import { TransferEntrada } from "dtos/TransferDTO";
import { DateTime } from "luxon";

const prisma = new PrismaClient();

export default class TransferModel {
  transfer = async (
    transferencia: TransferEntrada,
    conta_origem: ContaEntrada,
    conta_destino: ContaEntrada
  ) => {
    const contaOrigemNovoSaldo: Decimal = Decimal.add(
      conta_origem.saldo,
      -transferencia.valor
    );
    const contaDestinoNovoSaldo: Decimal = Decimal.add(
      conta_destino.saldo,
      transferencia.valor
    );

    /*CONTA ORIGEM*/
    await prisma.conta_Bancaria.update({
      where: {
        id: conta_origem.id,
      },
      data: {
        saldo: contaOrigemNovoSaldo,
      },
    });

    /*CONTA DESTINO*/
    await prisma.conta_Bancaria.update({
      where: {
        id: conta_destino.id,
      },
      data: {
        saldo: contaDestinoNovoSaldo,
      },
    });

    const dataHoje = new Date();
    const fuso = dataHoje.getTimezoneOffset() * 60000;
    const dataFuso = new Date(dataHoje.getTime() - fuso);
    const dataHojeFormatada = dataFuso.toISOString().slice(0, 19) + ".000Z"

    return await prisma.transferencia.create({
      data: {
        id_remetente: transferencia.id_remetente,
        id_destinatario: transferencia.id_destinatario,
        valor: transferencia.valor,
        descricao: transferencia.descricao,
        status: transferencia.status,
        data_transferencia: dataHojeFormatada,
      },
    });
  };

  get = async (id: number) => {
    return await prisma.transferencia.findUnique({
      where: {
        id: id,
      },
    });
  };

  create = async (transfer: TransferEntrada) => {
    return await prisma.transferencia.create({
      data: {
        id_remetente: transfer.id_remetente,
        id_destinatario: transfer.id_destinatario,
        valor: transfer.valor,
        data_transferencia: transfer.data_transferencia,
        descricao: transfer.descricao,
        status: transfer.status,
      },
    });
  };

  getAllTransfers = async (id_conta: number, skip: number, take: number, ordem: 'asc'| 'desc', data_inicio?:Date, data_final?:Date) => {
    
    data_final?.setDate(data_final.getDate() + 1) 
    data_final?.setHours(20)
    data_final?.setMinutes(59)
    data_final?.setSeconds(59)
    data_final?.setMilliseconds(999)

    return await prisma.transferencia.findMany({
      where: {
        OR: [
          {
            id_remetente: id_conta,
          },
          {
            id_destinatario: id_conta,
          },
        ],
        data_transferencia:{
          gte:data_inicio,
          lte:data_final
        }
      },
      take: take,
      skip: skip,
      orderBy: {
        data_transferencia: ordem 
      }
    });
  };

  getInTransfers = async (id_conta: number, skip: number, take: number, ordem: 'asc'| 'desc', data_inicio:Date, data_final:Date) => {
    
    data_final?.setDate(data_final.getDate() + 1) 
    data_final?.setHours(20)
    data_final?.setMinutes(59)
    data_final?.setSeconds(59)
    data_final?.setMilliseconds(999)
    
    return await prisma.transferencia.findMany({
      where: {
        id_destinatario: id_conta,
        data_transferencia:{
          gte:data_inicio,
          lte:data_final
        }
      },
      take: take,
      skip: skip,
      orderBy: {
        data_transferencia: ordem 
      }
    });
  };

  getOutTransfers = async (id_conta: number, skip: number, take: number, ordem: 'asc'| 'desc', data_inicio:Date, data_final:Date) => {
    
    data_final?.setDate(data_final.getDate() + 1) 
    data_final?.setHours(20)
    data_final?.setMinutes(59)
    data_final?.setSeconds(59)
    data_final?.setMilliseconds(999)
    
    return await prisma.transferencia.findMany({
      where: {
        id_remetente: id_conta,
        data_transferencia:{
          gte:data_inicio,
          lte:data_final
        }
      },
      take: take,
      skip: skip,
      orderBy: {
        data_transferencia: ordem 
      }
    });
  };

  totalTransfers = async (id_conta: number, data_inicio:Date, data_final:Date) => {
    return await prisma.transferencia.count({
      where: {
        OR: [
          {
            id_remetente: id_conta,
          },
          {
            id_destinatario: id_conta,
          },
        ],
        data_transferencia:{
          gte:data_inicio,
          lte:data_final
        }
      },
    });
  };

  totalInTransfers = async (id_conta: number, data_inicio:Date, data_final:Date) => {
    return await prisma.transferencia.count({
      where: {
        id_destinatario: id_conta,
        data_transferencia:{
          gte:data_inicio,
          lte:data_final
        }
      },
    });
  };

  totalOutTransfers = async (id_conta: number, data_inicio:Date, data_final:Date) => {
    return await prisma.transferencia.count({
      where: {
        id_remetente: id_conta,
        data_transferencia:{
          gte:data_inicio,
          lte:data_final
        }
      },
    });
  };
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
