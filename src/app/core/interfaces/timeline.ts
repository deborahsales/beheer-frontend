export interface Timeline {
  id: number;
  titulo: string;
  descricao: string;
  dateTimestamp: string;
  gestorUsuarioId: number;
  dataInicio: string;
  dataTermino: string;
  demandasCronograma: Demanda[];
}

interface Demanda {
  id: number;
}
