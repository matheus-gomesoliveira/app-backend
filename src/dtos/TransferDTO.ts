import { status_transfer } from "@prisma/client"

export interface TransferEntrada{
    id: number;
    id_remetente: number;
    data_transferencia: Date;
    id_destinatario: number;
    valor: number;
    descricao: string;
    status: status_transfer;
};

export interface TransferSaida{
    id: number;
};