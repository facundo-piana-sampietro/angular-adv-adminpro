import { Usuario} from './../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { catchError, delay, map, tap } from 'rxjs/operators'

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CargarUsuariosResponse, UsuarioResponse } from '../interfaces/usuarios-response.interface';
import { MenuItem } from '../interfaces/menu.interface';

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

  get _id():string{
    return this.usuario._id ?? '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage(token: string, menu: MenuItem[]){
    localStorage.setItem('token', token)
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  crearUsuario( formData: RegisterForm ): Observable<UsuarioResponse>{
    return this.http.post<UsuarioResponse>(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  actualizarUsuario(data: {email:string, nombre: string, role?: string}): Observable<UsuarioResponse>{
    return this.http.put<UsuarioResponse>(`${base_url}/usuarios/${this._id}`, data, this.headers)
  }

  guardarUsuario( usuario: Usuario): Observable<UsuarioResponse>{
    return this.http.put<UsuarioResponse>(`${base_url}/usuarios/${usuario._id}`, usuario, this.headers)
  }

  cargarUsuarios(desde: number = 0): Observable<CargarUsuariosResponse>{
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuariosResponse>(url, this.headers)
    .pipe(
      delay(500),
      map( resp => {
        const usuarios = resp.usuarios.map(
          user => new Usuario(user.nombre, user.email, user.role, '', user.img, user.google, user._id)
        )

        return {
          total: resp.total,
          usuarios
        }
      })
    )
  }

  eliminarUsuario( usuario: Usuario){
    return this.http.delete<UsuarioResponse>(`${base_url}/usuarios/${usuario._id}`, this.headers)
  }

  login( formData: LoginForm ){
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                );
  }

  loginGoogle( token: string ){
    return this.http.post(`${base_url}/login/google`, {/*token: token*/ token})
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
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
          const { nombre, email, role, img = '', google, _id } = resp.usuario
          this.usuario = new Usuario( nombre, email, role, '', img, google, _id);
          this.guardarLocalStorage(resp.token, resp.menu);
          return true;
        }),
        catchError(err => of(false))
      );
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('menu')
    if (this.usuario.google){
      google.accounts.id.revoke( this.usuario.email , () => {
        this.router.navigateByUrl("/login")
      })
    } else {
      this.router.navigateByUrl("/login")
    }
  }

}
