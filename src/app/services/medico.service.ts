import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Medico } from '../models/medico.model';
import { delay, map } from 'rxjs';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MedicoService {


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

  cargarMedicos(desde: number = 0) {
    const url = `${ base_url }/medicos?desde=${ desde }`;
    return this.http.get<{ok: boolean, medicos: Medico[], total: number}>(url, this.headers)
      .pipe(
        delay(500),
        map(resp => ({
          medicos: resp.medicos,
          total: resp.total
        }))
      );
  }

  obtenerMedicoPorId(id: string) {
    const url = `${ base_url }/medicos/${ id }`;
    return this.http.get<{ok: boolean, medico: Medico}>(url, this.headers)
      .pipe(
        map(
          resp => resp.medico
        )
      )
  }

  crearMedico(medico: {nombre: string, hospital: string}) {
    const url = `${ base_url }/medicos`;
    return this.http.post<{ok: boolean, medico: Medico}>(url, medico, this.headers)
    .pipe(
      map(
        resp => resp.medico
      )
    )
  }

  actualizarMedico(medico: {nombre: string, hospital: string}, _id: string) {
    const url = `${ base_url }/medicos/${_id}`;
    return this.http.put(url, medico, this.headers)
  }

  eliminarMedico(id: string) {
    const url = `${ base_url }/medicos/${id}`;
    return this.http.delete(url, this.headers)
  }

}
