import { PrismaClient } from "@prisma/client";
import { ContaEntrada, ContaSaida } from "dtos/AccountDTO";

const prisma = new PrismaClient();

export default class AccountModel {
  getAll = async () => {
    return await prisma.conta_Bancaria.findMany();
  };

  get = async (id: number) => {
    return await prisma.conta_Bancaria.findUnique({
      where: {
        id_usuario: id,
      },
    });
  };

  getConta = async (id: number) => {
    return await prisma.conta_Bancaria.findFirst({
      where: {
        id_usuario: id,
        status_conta: "ativa",
      },
    });
  };

  getNumeroConta = async (numero_conta: number) => {
    return await prisma.conta_Bancaria.findFirst({
      where: {
        numero_conta: numero_conta,
      },
    });
  };

  delete = async (id: number) => {
    return await prisma.conta_Bancaria.delete({
      where: {
        id,
      },
    });
  };

  update = async (id_conta:number, data:any) => {
    return await prisma.conta_Bancaria.update({
        where:{
            id:id_conta
        },
        data:{
            ...data
        }
    })
  }

  updateSenha = async (id_conta:number | undefined, nova_senha:string) => {
    return await prisma.conta_Bancaria.update({
      where:{
        id:id_conta
      },
      data:{
        senha_transacional:nova_senha
      }
    })  
  }

  updateStatusConta = async (id_conta: number) => {
    return await prisma.conta_Bancaria.update({
      where: {
        id: id_conta,
      },
      data: {
        status_conta: "inativa",
      },
    });
  };
}
