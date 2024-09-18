import { Usuario, UsuarioResponse } from './../models/usuario.model';
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
  public usuario!: Usuario // --> Lo creamos con '!' ya que, siempre que lo usemos en otras rutas, va a haber un usuario autenticado.


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get id():string{
    return this.usuario.id ?? '';
  }

  crearUsuario( formData: RegisterForm ): Observable<UsuarioResponse>{
    return this.http.post<UsuarioResponse>(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
  }

  actualizarUsuario(data: {email:string, nombre: string, role?: string}): Observable<UsuarioResponse>{
    return this.http.put<UsuarioResponse>(`${base_url}/usuarios/${this.id}`, data, {  headers: {
      'x-token': this.token
    }})
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
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
       map( (resp: any) => {
          const { nombre, email, role, img = '', google, id } = resp.usuario
          this.usuario = new Usuario( nombre, email, '', role, img, google, id);
          localStorage.setItem('token', resp.token)
          return true;
        }),
        catchError(err => of(false))
      );
  }

  logout(){
    localStorage.removeItem('token')
    //REEMPLAZAR CON THIS.USUARIO.EMAIL

    if (this.usuario.google){
      google.accounts.id.revoke( this.usuario.email , () => {
        this.router.navigateByUrl("/login")
      })
    } else {
      this.router.navigateByUrl("/login")
    }
  }

}
