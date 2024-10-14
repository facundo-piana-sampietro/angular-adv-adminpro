import { Injectable } from '@angular/core';
import { SweetAlertIcon } from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  modalSatisfactorio(titulo: string, mensaje: string){
    return Swal.fire(titulo, mensaje, 'success')
  }

  modalError(titulo: string, mensaje?: string){
    return Swal.fire(titulo, mensaje ?? 'Error interno del servidor', 'error')
  }

  modalPregunta(titulo: string, texto: string, txtBtnConfirmar?: string, txtBtnCancelar?: string, icono?: SweetAlertIcon){
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: icono ?? "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: txtBtnConfirmar ?? "Confirmar",
      cancelButtonText: txtBtnCancelar ?? "Cancelar",

    })
  }

  async modalInput(titulo: string, text: string, placeholder: string,txtBtnConfirmar?: string, txtBtnCancelar?: string){
    return await Swal.fire<string>({
      title: titulo,
      text: text,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: txtBtnConfirmar ?? "Confirmar",
      cancelButtonText: txtBtnCancelar ?? "Cancelar"
    })
  }



}
