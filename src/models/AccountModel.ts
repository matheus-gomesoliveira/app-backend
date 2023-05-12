import { PrismaClient } from '@prisma/client';
import { ContaEntrada } from 'dtos/AccountDTO';

const prisma = new PrismaClient();

export default class AccountModel{

    create = async (account:ContaEntrada) => {
        return await prisma.conta_Bancaria.create({
            data: account
        });
        
    }

    getAll = async () => {
        return await prisma.conta_Bancaria.findMany();
    };

    get = async (id: number) => {
        return await prisma.conta_Bancaria.findUnique({
            where: {
                id
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
};