import { status_conta } from "@prisma/client";

export interface ContaEntrada{
    id_usuario: number;
    numero_conta: string;
    agencia: string;
    saldo: number;
    senha_transacional: string;
    nome_banco: string;
    status_conta: status_conta;
};

export interface ContaSaida{
    id: number;
};

  