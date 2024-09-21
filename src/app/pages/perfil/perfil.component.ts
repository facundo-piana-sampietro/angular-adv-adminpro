import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario} from '../../models/usuario.model';
import { ModalService } from '../../services/modal.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioResponse } from '../../interfaces/usuarios-response.interface';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: ``
})
export class PerfilComponent implements OnInit {

  protected usuario: Usuario;
  public imagenSubir: File | undefined;
  public imgTemp: any = ''
  public perfilForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private _us: UsuarioService,
    private _ms: ModalService,
    private _fus: FileUploadService
  ){
    this.usuario = _us.usuario
  }

  ngOnInit(): void {
    this.perfilForm.controls.nombre.setValue(this.usuario.nombre);
    this.perfilForm.controls.email.setValue(this.usuario.email);
  }

  actualizarPerfil(){
    const data = {
      nombre: this.perfilForm.controls.nombre.value ?? '',
      email: this.perfilForm.controls.email.value ?? '',
      role: this.usuario.role
    }

    this._us.actualizarUsuario(data).subscribe({
      next: (res: UsuarioResponse) => {
        const user = res.usuario
        this.usuario.nombre = user.nombre
        this.usuario.email = user.email
        this._ms.modalSatisfactorio('Usuario actualizado', 'El usuario fue actualizado con éxito')
      },
      error: (err) => {
        this._ms.modalError('Error al guardar usuario', err.error.msg)
      }
    })
  }

  cambiarImagen( event: Event ){
    const input = event.target as HTMLInputElement;

    if (!input?.files?.length) {
      this.imgTemp = null
      return;
    }

    this.imagenSubir = input.files[0];

    const reader = new FileReader();
    reader.readAsDataURL( this.imagenSubir );
    reader.onloadend = () => {
      this.imgTemp = reader.result
    }
  }

  subirImagen(){
    if (!this.imagenSubir){
      this._ms.modalError('Error al subir imagen', 'No existe ninguna imagen cargada');
      return
    }

    this._ms.modalSpinner()
    this._fus
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.id ?? '')
      .then(img => {
        this._ms.cerrarModalSpinner()
        this.usuario.img = img
        this._ms.modalSatisfactorio('Imagen actualizada', 'La imagen fue actualizada con éxito')
      }).catch(() => {
        this._ms.cerrarModalSpinner()
        this._ms.modalError('Error', 'No se pudo subir la imagen')
      });
  }
}
