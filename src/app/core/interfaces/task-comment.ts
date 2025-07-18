export interface TaskComment {
  id: number;
  conteudo: string;
  dateTimestamp: string;
  dataAlteracao: string;
  demandaId: number;
  usuarioId: number;
  usuario: Usuario;
}

interface Usuario {
  id: number;
  nome: string;
}
