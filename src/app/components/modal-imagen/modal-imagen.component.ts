import { Component } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: ``
})
export class ModalImagenComponent {

   public imagenSubir: File | undefined;
  public imgTemp: any = ''

  constructor(
    protected _mis: ModalImagenService,
    public _fus: FileUploadService,
    private _ms: ModalService
  ){}

  cerrarModal() {
    this.imgTemp = null
    this._mis.cerrarModal();
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
    const id = this._mis.id
    const tipo = this._mis.tipo

    this._ms.modalSpinner()
    this._fus
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then(img => {
        this._ms.cerrarModalSpinner()
        this._ms.modalSatisfactorio('Imagen actualizada', 'La imagen fue actualizada con éxito')

        this._mis.nuevaImagen.emit(img);

        this.cerrarModal()
      }).catch(() => {
        this._ms.cerrarModalSpinner()
        this._ms.modalError('Error', 'No se pudo subir la imagen')
        this.cerrarModal()
      });
  }

}
