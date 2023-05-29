import { PrismaClient } from '@prisma/client';
import { EnderecoEntrada } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  getAll = async () => {
    return await prisma.endereco.findMany();
  }

  get = async (id: number) => {
    return await prisma.endereco.findUnique({
      where: {
        id_usuario: id
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