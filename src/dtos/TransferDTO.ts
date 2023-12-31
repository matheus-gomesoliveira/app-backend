import { status_transfer } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime";

export interface TransferEntrada{
    id_remetente: number;
    id_destinatario: number;
    data_transferencia: Date;
    valor: Decimal;
    descricao: string;
    status: status_transfer;
};

export interface TransferSaida{
    id_remetente: number;
    id_destinatario: number;
    data_transferencia: Date;
    valor: Decimal;
    descricao: string;
    status: status_transfer;
};