import { Injectable } from '@angular/core';
import swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }


  modalSatisfactorio(titulo: string, mensaje: string){
    swal.fire(titulo, mensaje, 'success')
  }

  modalError(titulo: string, mensaje?: string){
    swal.fire(titulo, mensaje ?? 'Error interno del servidor', 'error')
  }

  modalPregunta(titulo: string, texto: string, txtBtnConfirmar?: string, txtBtnCancelar?: string, icono?: SweetAlertIcon){
    return swal.fire({
      title: titulo,
      text: texto,
      icon: icono ?? "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: txtBtnConfirmar ?? "Confirmar",
      cancelButtonText: txtBtnCancelar ?? "Cancelar"

    })
  }

  modalSpinner(){
    swal.fire({
      title: 'Cargando...',
      text: 'Espere mientras se realiza la operación',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen : () => {
        swal.showLoading();
      }
    })
  }

  cerrarModalSpinner(){
    swal.close();
  }

}
