export interface Group {
  id: number;
  nome: string;
  descricao: string;
  gestores: Usuario[];
  usuarios: Usuario[];
}

interface Usuario {
  usuarioId: number;
  grupoId: number;
  usuario: UsuarioGrupo;
}

interface UsuarioGrupo {
  nome: string;
  email: string;
  cargo: string;
}
