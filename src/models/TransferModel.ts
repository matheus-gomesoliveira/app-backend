import { PrismaClient } from '@prisma/client';
import { TransferEntrada } from 'dtos/TransferDTO';

const prisma = new PrismaClient();

export default class TransferModel {

  create = async (transfer: TransferEntrada) => {
    return await prisma.transferencia.create({
      data: transfer
    });
  }

  getAll = async () => {
    return await prisma.transferencia.findMany();
  }

  get = async (id: number) => {
    return await prisma.transferencia.findUnique({
      where: {
        id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.transferencia.delete({
      where: {
        id
      }
    })
  }

  update = async (id: number, transfer: TransferEntrada) => {
    return await prisma.transferencia.update({
      where: {
        id
      },
      data: {
        ...transfer
      }
    })
  }
};