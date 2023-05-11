export interface UsuarioEntrada {
  nome_completo: string;
  telefone: string;
  email: string;
  cpf: string;
  senha: string;
  data_nascimento: Date;
}

export interface UsuarioSaida {
  id: number;
  email: string;
  nome_completo: string | null;
}