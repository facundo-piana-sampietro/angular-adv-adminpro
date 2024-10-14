import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { TipoEntidad } from '../types/tipo-entidad.type';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios( resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.role, user.img, user.google, user.id)
    )
  }

  private transformarHospitales( resultados: any[]): Hospital[]{
    return resultados
  }

  private transformarMedicos( resultados: any[]): Medico[]{
    return resultados
  }

  //Utilizando sobrecarga de funciones, le decimos que, si nos pasa un tipo de entidad usuarios, nos devuelve Observable de Usuario
  //si nos pasa un tipo de entidad Hospital, nos devuelve Observable de Hospital
  //si nos pasa un tipo de entidad Médico, nos devuelve Observable de Médico
  buscar(tipo: 'usuarios', termino: string): Observable<Usuario[]>;
  buscar(tipo: 'hospitales', termino: string): Observable<Hospital[]>;
  buscar(tipo: 'medicos', termino: string): Observable<Medico[]>;
  buscar( tipo: TipoEntidad, termino: string){
    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any) => {
          switch ( tipo ) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados);

            case 'hospitales':
              return this.transformarHospitales(resp.resultados)

              case 'medicos':
                return this.transformarMedicos(resp.resultados)

            default:
              return []
          }
        })
      )
  }

}
