export interface FinancialReport {
  id: number;
  descricao: string;
  data: string;
  valor: string;
  imagem: string;
  dateTimestamp: string;
  status: string;
  usuarioId: number;
  usuario: { nome: string };
  gerenciamentoPrestacao: GerenciamentoPrestacao[];
}

interface GerenciamentoPrestacao {
  dateTimestamp: string;
  prestacaoId: number;
  rhUsuarioId: number;
}
