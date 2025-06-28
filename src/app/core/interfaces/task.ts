export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  prazo: string;
  status: string;
  dateTimestamp: string;
  prioridade: string;
  cronogramaId: number;
  gestorUsuarioId: number;
  usuariosDemanda: UsuariosDemanda[];
  gruposDemanda: GruposDemanda[];
}

interface UsuariosDemanda {
  demandaId: number;
  usuarioId: number;
}

interface GruposDemanda {
  demandaId: number;
  grupoId: number;
}
