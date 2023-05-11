import { PrismaClient } from '@prisma/client';
import { EnderecoEntrada } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  create = async (address: EnderecoEntrada) => {
    return await prisma.endereco.create({
      data: address
    });
  }

  getAll = async () => {
    return await prisma.endereco.findMany();
  }

  get = async (id: number) => {
    return await prisma.endereco.findUnique({
      where: {
        id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.endereco.delete({
      where: {
        id
      }
    })
  }

  update = async (id: number, address: EnderecoEntrada) => {
    return await prisma.endereco.update({
      where: {
        id
      },
      data: {
        ...address
      }
    })
  }
};