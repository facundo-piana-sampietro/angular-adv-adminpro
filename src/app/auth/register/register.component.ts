import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { RegisterForm } from '../../interfaces/register-form.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    public formSubmitted = false;

    public registerForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('123456', Validators.required),
      password2: new FormControl('1234567', Validators.required),
      terminos: new FormControl(false, [Validators.required, Validators.requiredTrue])
    },
      [
        this.passwordsIguales('password', 'password2'),
      ]
    );

    constructor(
      private _us: UsuarioService,
      private router: Router
    ) {}

    crearUsuario(){
      this.formSubmitted = true;

      if (this.registerForm.invalid){
        return
      }

      const formData = this.registerForm.value as RegisterForm;
      this._us.crearUsuario(formData).subscribe({
        next: () => {
          this.router.navigateByUrl("/")
        },
        error: (err) => {
          swal.fire('Error', err.error.msg, 'error')
        }
      })

    }

    campoNoValido( campo:string ): boolean {
      if (this.registerForm.get(campo)?.invalid && this.formSubmitted){
        return true;
      } else{
        return false
      }
    }

    constrasenasNoValidas() {
      const pass1 = this.registerForm.get('password')?.value
      const pass2 = this.registerForm.get('password2')?.value

      return pass1 !== pass2 && this.formSubmitted
    }


    aceptaTerminos(): boolean {
      return !this.registerForm.get('terminos')?.value && this.formSubmitted
    }

    passwordsIguales(pass1name: string, pass2name: string): ValidatorFn {
      return (form: AbstractControl): ValidationErrors | null => {
        const pass1Control = form.get(pass1name);
        const pass2Control = form.get(pass2name);

        if (!pass1Control || !pass2Control){
          return null
        }

        if (pass1Control.value === pass2Control.value){
          pass2Control.setErrors(null);
        } else{
          pass2Control.setErrors({noEsIgual: true});
        }

        return null;
      }
    }

}
