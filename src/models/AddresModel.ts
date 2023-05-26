import { PrismaClient } from '@prisma/client';
import { EnderecoEntrada } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  // create = async (address: EnderecoEntrada) => {
  //   return await prisma.endereco.create({
  //     data:{
  //       cep: address.cep,
  //       rua: address.rua,
  //       bairro: address.bairro,
  //       cidade: address.cidade,
  //       numero: address.numero,
  //       UF: address.UF,
  //       complemento:address.complemento,
  //     }

  //   });
  // }

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