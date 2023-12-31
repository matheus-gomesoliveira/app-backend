import { PrismaClient } from "@prisma/client";
import { FullUsuarioEntrada, ParcUsuarioEntrada, UpdateUsuarioDados } from "dtos/UserDTO";

const prisma = new PrismaClient();

export default class UserModel {
  create = async (usuario: FullUsuarioEntrada) => {
   const {
      nome_completo,
      telefone,
      email,
      cpf,
      senha,
      data_nascimento,
      endereco,
      conta_bancaria ,
    } = usuario;

    return await prisma.usuario.create({
      data: {
        nome_completo,
        telefone,
        email,
        cpf,
        senha,
        data_nascimento,

        endereco: {
          create: {
            cep: endereco.cep,
            rua: endereco.rua,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            numero: endereco.numero,
            uf: endereco.uf,
            complemento: endereco.complemento,
          },
        },
        conta_bancaria: {
          create: {
            numero_conta: conta_bancaria.numero_conta,
            saldo: 0,
            senha_transacional: conta_bancaria.senha_transacional,
            tipo_conta: "individual",
            status_conta: conta_bancaria.status_conta,
          },
        },
      },
    });
  };

  getAll = async () => {
    return await prisma.usuario.findMany();
  };

  get = async (id: number | undefined) => {
    return await prisma.usuario.findUnique({
      where: {
        id: id,
      },
    });
  };

  delete = async (id: number) => {
    return await prisma.usuario.delete({
      where: {
        id,
      },
    });
  };

  update = async (id: number, usuario: UpdateUsuarioDados) => {
    return await prisma.usuario.update({
      where: {
        id,
      },
      data: {
        ...usuario,
      },
    });
  };

  updateSenha = async (id:number, nova_senha:string) => {
    return await prisma.usuario.update({
      where:{
        id:id
      },
      data:{
        senha:nova_senha
      }
    })
    
  }

  getUserCPF = async (cpf: string) => {
    return await prisma.usuario.findUnique({
      where: {
        cpf: cpf
      }
    });
  };

  getUserEmail = async (email: string) => {
    return await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });
  };

    getUserTelefone = async (telefone: string) => {
    return await prisma.usuario.findUnique({
      where: {
        telefone:telefone 
      }
    })
  }
}
