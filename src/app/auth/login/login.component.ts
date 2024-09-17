import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import swal from 'sweetalert2';
import { LoginForm } from '../../interfaces/login-form.interface';

declare const google: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public loginForm = new FormGroup({
    email: new FormControl( localStorage.getItem('email') || '', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false)
  });

  constructor(
    private router: Router,
    private _us: UsuarioService
  ){}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "848168248590-fo77c7uftqur2j3csgm21hs5rhsh538t.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    google.accounts.id.renderButton(
     this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ){
    this._us.loginGoogle( response.credential ).subscribe({
      next: () => {
        this.router.navigateByUrl("/")
      },
      error: (err) => {
        swal.fire('Error', err.error.msg, 'error')
      }
    })
  }

  login(){
    const formData = this.loginForm.value as LoginForm;
    this._us.login(formData).subscribe({
      next: (res) => {
        const email = this.loginForm.get('email')?.value
        if (this.loginForm.get('remember')?.value && email){
          localStorage.setItem('email', email)
        } else {
          localStorage.removeItem('email')
        }

        this.router.navigateByUrl("/")
      },
      error: (err) => {
        swal.fire('Error', err.error.msg, 'error')
      }
    })
  }
}
