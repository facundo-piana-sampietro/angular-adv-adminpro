import { Usuario } from "../models/usuario.model";

export interface UsuarioResponse {
  ok: boolean;
  usuario: Usuario;
}

export interface CargarUsuariosResponse {
  total: number;
  usuarios: Usuario[];
}
