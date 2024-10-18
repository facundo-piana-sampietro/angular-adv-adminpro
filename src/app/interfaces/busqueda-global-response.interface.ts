import { Hospital } from "../models/hospital.model";
import { Medico } from "../models/medico.model";
import { Usuario } from "../models/usuario.model";

export interface BusquedaGlobalResponse{
  usuarios: Usuario[],
  medicos: Medico[],
  hospitales: Hospital[]
}
