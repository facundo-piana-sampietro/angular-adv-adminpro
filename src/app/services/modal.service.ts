import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

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

}
