import { Timeline } from './timeline';

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
  gestor: { nome: string };
  usuariosDemanda: UsuariosDemanda[];
  gruposDemanda: GruposDemanda[];
  cronograma: Timeline;
}

interface UsuariosDemanda {
  demandaId: number;
  usuarioId: number;
  usuario: { nome: string };
}

interface GruposDemanda {
  demandaId: number;
  grupoId: number;
  grupo: { nome: string };
}
