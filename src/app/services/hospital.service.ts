import { Hospital } from './../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { delay, map } from 'rxjs';


const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
   constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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

  cargarHospitales() {
    const url = `${ base_url }/hospitales`;
    return this.http.get<{ok: boolean, hospitales: Hospital[]}>(url, this.headers)
      .pipe(
        delay(500),
        map(resp => ({
          hospitales: resp.hospitales
        }))
      );
  }


  cargarHospitalesPaginado(desde: number) {
    const url = `${ base_url }/hospitales/paginado?desde=${ desde }`;
    return this.http.get<{ok: boolean, hospitales: Hospital[], total: number}>(url, this.headers)
      .pipe(
        delay(500),
        map(resp => ({
          hospitales: resp.hospitales,
          total: resp.total
        }))
      );
  }

  crearHospital(nombre: string) {
    const url = `${ base_url }/hospitales`;
    return this.http.post<{ok: boolean, hospital: Hospital}>(url, {nombre}, this.headers)
    .pipe(
      map(
        resp => resp.hospital
      )
    )
  }

  actualizarHospital(id: string, nombre: string) {
    const url = `${ base_url }/hospitales/${id}`;
    return this.http.put(url, {nombre}, this.headers)
  }

  eliminarHospital(id: string) {
    const url = `${ base_url }/hospitales/${id}`;
    return this.http.delete(url, this.headers)
  }


}
