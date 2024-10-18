import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  public usuario: Usuario

  constructor(
    private _us: UsuarioService,
    private router: Router
  ){
    this.usuario = _us.usuario
  }

  logout(){
    this._us.logout()
  }

  buscar(termino: string){
    if (termino.length === 0 ){
      return
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }

}
