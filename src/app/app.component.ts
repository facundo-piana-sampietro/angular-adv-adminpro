import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { Router } from '@angular/router';
import { ModalService } from './services/modal.service';

declare const google: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'adminpro';
  protected cargando: boolean = false

  constructor(
    private _us: UsuarioService,
    private _ms: ModalService,
    private router: Router
  ){
  }

  ngAfterViewInit(): void {
    this.initializeGoogleAPI();
  }

  initializeGoogleAPI(){
    google.accounts.id.initialize({
      client_id: "848168248590-fo77c7uftqur2j3csgm21hs5rhsh538t.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
  }

  handleCredentialResponse( response: any ){
    this.cargando = true;
    this._us.loginGoogle( response.credential )
    .subscribe({
      next: () => {
        this.router.navigateByUrl("/")
      },
      error: (err) => {
        this._ms.modalError('Error al loguearse', err.error.msg)
      }
    }).add(() => this.cargando = false);
  }

}
