import { PrismaClient } from '@prisma/client';
import { ContaEntrada, ContaSaida } from 'dtos/AccountDTO';

const prisma = new PrismaClient();

export default class AccountModel{

    // create = async (account:ContaEntrada) => {
    //     return await prisma.conta_Bancaria.create({
    //         data: {
    //             numero_conta: account.numero_conta,
    //             agencia: account.agencia,
    //             saldo: 0,
    //             senha_transacional: account.senha_transacional,
    //             nome_banco: account.nome_banco,
    //             status_conta: account.status_conta,


    //         }
    //     });
        
    // }

    getAll = async () => {
        return await prisma.conta_Bancaria.findMany();
    };

    get = async (id: number) => {
        return await prisma.conta_Bancaria.findUnique({
            where: {
                id_usuario: id,
            }
        });
    }

    getConta = async (id: number) => {
        return await prisma.conta_Bancaria.findFirst({
            where: {
                id_usuario: id,
                status_conta: 'ativa'
            }
        });
    }


    delete = async (id: number) => {
        return await prisma.conta_Bancaria.delete({
            where: {
                id
            }
        });
    }

    update = async (id:number, account: ContaEntrada) => {
        return await prisma.conta_Bancaria.update({
            where: {
                id
            },
            data: {
                ...account
            }
        });
    }
}