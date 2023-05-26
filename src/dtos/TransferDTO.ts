import { status_transfer } from "@prisma/client"
import { tipo_transfer } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime";

export interface TransferEntrada{
    id_remetente: number;
    id_destinatario: number;
    data_transferencia: Date;
    valor: Decimal;
    descricao: string;
    status: status_transfer;
    tipo: tipo_transfer
};

export interface TransferSaida{
};