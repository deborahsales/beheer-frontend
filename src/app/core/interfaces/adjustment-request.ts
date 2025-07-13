export interface AdjustmentRequest {
  id: number;
  dateTimestampAjustado: string;
  motivo: string;
  status: string;
  dateTimestamp: string;
  usuarioId: number;
  pontoId: number;
  gerenciamentoAJuste: GerenciamentoAjuste[];
}

interface GerenciamentoAjuste {
  dateTimestamp: string;
  ajustePontoId: number;
  rhUsuarioId: number;
}
