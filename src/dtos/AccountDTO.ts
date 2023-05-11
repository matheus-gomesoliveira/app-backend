import { status_conta } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export interface AccountEntrada{
    id_usuario: number;
    numero_conta: string;
    agencia: string;
    saldo: number;
    senha_transacional: number;
    nome_banco: string;
    status_conta: status_conta;
};

export interface AccountSaida{
    id: number;
};

enum status_conta {
    ativa,
    inativa,
    bloqueada
  };
  