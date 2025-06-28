export interface Notification {
  id: number;
  assunto: string;
  conteudo: string;
  dateTimestamp: string;
  gestorRhUsuarioId: number;
  avisoUsuario: AvisoUsuario[];
}

interface AvisoUsuario {
  status: string;
  dataLeitura: string;
  usuarioId: number;
  avisoId: number;
}
