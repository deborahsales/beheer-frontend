export interface Notification {
  id: number;
  assunto: string;
  conteudo: string;
  dateTimestamp: string;
  gestorRhUsuarioId: number;
  avisoUsuario: AvisoUsuario[];
  gestor: Gestor;
}

interface AvisoUsuario {
  status: string;
  dataLeitura: string;
  usuarioId: number;
  avisoId: number;
}

interface Gestor {
  id: number;
  nome: string;
}

export interface NotificationWithSender extends Notification {
  remetenteNome: string;
}
