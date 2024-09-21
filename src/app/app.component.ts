import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ModalService } from './services/modal.service';

declare const google: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'adminpro';

  constructor(
    private _us: UsuarioService,
    private _ms: ModalService,
    private router: Router
  ){}

  ngOnInit() {
    this.initializeGoogleAPI();
  }

  initializeGoogleAPI(){
    google.accounts.id.initialize({
      client_id: "848168248590-fo77c7uftqur2j3csgm21hs5rhsh538t.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
  }

  handleCredentialResponse( response: any ){
    this._ms.modalSpinner();
    this._us.loginGoogle( response.credential ).subscribe({
      next: () => {
        this._ms.cerrarModalSpinner()
        this.router.navigateByUrl("/")
      },
      error: (err) => {
        this._ms.cerrarModalSpinner()
        this._ms.modalError('Error al loguearse', err.error)
      }
    })
  }

}
