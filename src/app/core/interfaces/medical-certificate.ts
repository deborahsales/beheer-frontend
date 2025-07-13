export interface MedicalCertificate {
  id: number;
  dateTimestamp: string;
  dataAtestado: string;
  horaInicio: string;
  horaTermino: string;
  diaInteiro: string;
  imagem: string;
  status: string;
  usuarioId: number;
  gerenciamentoAtestado: GerenciamentoAtestado[];
}

interface GerenciamentoAtestado {
  dateTimestamp: string;
  atestadoId: number;
  rhUsuarioId: number;
}
