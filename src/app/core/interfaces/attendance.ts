export interface Attendance {
  id: number;
  dateTimestamp: string;
  ip: string;
  imagem: string;
  latitude: number;
  longitude: number;
  ativo: boolean;
  usuarioId: number;
}
