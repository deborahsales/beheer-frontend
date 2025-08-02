export interface Notification {
  id: number;
  assunto: string;
  conteudo: string;
  dateTimestamp: string;
  gestorRhUsuarioId: number;
  avisoUsuario: AvisoUsuario[];
  gruposAviso: GruposAviso[];
  gestor: Gestor;
}

interface GruposAviso {
  grupoId: number;
  avisoId: number;
  grupo: { nome: string };
}

interface AvisoUsuario {
  status: string;
  dataLeitura: string;
  usuarioId: number;
  avisoId: number;
  usuario: {
    nome: string;
    email: string;
  };
}

interface Gestor {
  id: number;
  nome: string;
}

export interface NotificationWithSender extends Notification {
  remetenteNome: string;
}
