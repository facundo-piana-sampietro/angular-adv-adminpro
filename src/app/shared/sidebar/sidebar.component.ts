import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  public usuario: Usuario;


  constructor(
    public _ss: SidebarService,
    private _us: UsuarioService
  ){
    this.usuario = this._us.usuario;
  }
}
