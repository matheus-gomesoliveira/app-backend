import { ContaEntrada } from "./AccountDTO";
import { EnderecoEntrada } from "./AddressDTO";

export interface FullUsuarioEntrada {
  nome_completo: string;
  telefone: string;
  email: string;
  cpf: string;
  senha: string;
  data_nascimento: Date;
  endereco: EnderecoEntrada;
  conta_bancaria: ContaEntrada
}

export interface ParcUsuarioEntrada {
  nome_completo: string;
  telefone: string;
  email: string;
  senha: string;
}

export interface UsuarioSaida {
  id:number
  nome_completo: string;
  telefone: string;
  email: string;
  cpf: string;
  data_nascimento: Date;
}

export interface UpdateUsuarioDados {
  nome_completo:string;
  telefone:string;
  email:string;  
}