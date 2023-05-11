import { PrismaClient } from '@prisma/client';
import { UsuarioEntrada } from 'dtos/UsersDTO';

const prisma = new PrismaClient();

export default class UserModel {

  create = async (user: UsuarioEntrada) => {
    return await prisma.usuario.create({
      data: user
    });
  }

  getAll = async () => {
    return await prisma.usuario.findMany();
  }

  get = async (id: number) => {
    return await prisma.usuario.findUnique({
      where: {
        id
      }
    });
  }

  delete = async (id: number) => {
    return await prisma.usuario.delete({
      where: {
        id
      }
    })
  }

  update = async (id: number, user: UsuarioEntrada) => {
    return await prisma.usuario.update({
      where: {
        id
      },
      data: {
        ...user
      }
    })
  }
};