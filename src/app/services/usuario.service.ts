import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators'

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google: any

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  crearUsuario( formData: RegisterForm ){
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  login( formData: LoginForm ){
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  loginGoogle( token: string ){
    return this.http.post(`${base_url}/login/google`, {/*token: token*/ token})
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        }),
        map( resp => true ),
        catchError(err => of(false))
      );
  }

  logout(){
    localStorage.removeItem('token')
    //REEMPLAZAR CON THIS.USUARIO.EMAIL
    google.accounts.id.revoke( 'facusampi@hotmail.com' , () => {
      this.router.navigateByUrl("/login")
    })
  }

}
