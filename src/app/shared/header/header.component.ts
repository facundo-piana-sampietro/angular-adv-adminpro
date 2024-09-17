import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  constructor(
    private _us: UsuarioService
  ){}

  logout(){
    this._us.logout()
  }

}
