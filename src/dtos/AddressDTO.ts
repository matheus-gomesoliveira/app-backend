export interface EnderecoEntrada {
  id_usuario: number;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  numero: number;
  UF: string;
  complemento: string;
}

export interface EnderecoSaida{
  id: number
}