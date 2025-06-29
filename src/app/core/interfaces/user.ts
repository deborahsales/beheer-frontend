export interface AuthUser {
  sub: number;
  nome: string;
  email: string;
  funcao: string;
}

export interface User {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  senha?: string;
  telefone: string;
  dataNascimento: string;
  dataAdmissao: string;
  dataDesligamento?: string;
  cargo: string;
  funcao: string;
}
