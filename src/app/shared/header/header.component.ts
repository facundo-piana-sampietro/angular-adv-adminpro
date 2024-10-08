import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  public usuario: Usuario

  constructor(
    private _us: UsuarioService
  ){
    this.usuario = _us.usuario
  }

  logout(){
    this._us.logout()
  }

}
