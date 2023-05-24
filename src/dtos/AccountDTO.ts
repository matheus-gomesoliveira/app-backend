import { status_conta } from "@prisma/client";
import { tipo_conta } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";


export interface ContaEntrada{
    id: number;
    id_usuario: number;
    numero_conta: number ;
    agencia: string;
    saldo: Decimal | number ;
    senha_transacional: string;
    nome_banco: string;
    tipo_conta: tipo_conta;
    status_conta: status_conta;
};

export interface ContaSaida{
    numero_conta: number ;
    agencia: string;
    saldo: number;
};

  