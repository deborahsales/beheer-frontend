export interface Timeline {
  id: number;
  titulo: string;
  descricao: string;
  dateTimestamp: string;
  gestorUsuarioId: number;
  demandasCronograma: Demanda[];
}

interface Demanda {
  id: number;
}
