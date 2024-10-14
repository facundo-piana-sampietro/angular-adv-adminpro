import { Component, OnDestroy, OnInit } from '@angular/core';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalService } from '../../../services/modal.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { delay, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: ``
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public cargandoLoader: boolean = true
  public cargando: boolean = false
  public desde: number = 0
  public pagina: number = 0;
  public imgSubs: Subscription;

  constructor(
    private _us: UsuarioService,
    private _bs: BusquedasService,
    private _mis: ModalImagenService,
    private _ms: ModalService
  ){
    this.imgSubs = this._mis.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarUsuarios());
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){
    this.cargandoLoader = true;
    this._us.cargarUsuarios(this.desde).subscribe({
      next: ({total, usuarios}) => {
        this.totalUsuarios = total
        this.pagina = Math.ceil(this.desde/5) + 1
        this.usuarios = usuarios
        this.usuariosTemp = usuarios
      },
      error: (err) => {
        this._ms.modalError("Error al obtener usuarios", err.error.msg)
      }
    }).add(() => this.cargandoLoader = false)
  }

  cambiarPagina(valor: number){
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscar(termino: string){
    if (termino.length == 0){
      this.usuarios = this.usuariosTemp;
      return
    }

    this._bs.buscar('usuarios', termino).subscribe({
      next: (resultados: Usuario[]) => {
        this.usuarios = resultados ?? this.usuarios
      },
      error: (err) => {
        this._ms.modalError("Error al buscar usuarios", err.error.msg)
      }
    }).add()
  }

  eliminarUsuario (usuario: Usuario){
    if (usuario._id == this._us._id){
      this._ms.modalError('Error', 'No puede borrarse a si mismo')
      return
    }

    this._ms.modalPregunta('¿Borrar usuario?', `Está a punto de borrar a ${usuario.nombre}`, 'Eliminar', 'Cancelar')
    .then((result) => {
      if (result.value){
        this.cargando = true;
        this._us.eliminarUsuario(usuario).subscribe({
          next: () => {
            this._ms.modalSatisfactorio('Eliminado', `El usuario ${usuario.nombre} fue eliminado`)
            this.cargarUsuarios();
          },
          error: (err) => {
            this._ms.modalError('Error al eliminar usuario', err.error.msg);
          }
        }).add(() => this.cargando = false)
      }
    })
  }

  cambiarRole(usuario: Usuario){
    this._us.guardarUsuario(usuario).subscribe({
      error: (err) => {
        this._ms.modalError('Error al guardar rol', err.error.msg);
      }
    })
  }

  abrirModal(usuario: Usuario){
    this._mis.abrirModal('usuarios', usuario._id ?? '', usuario.img);
  }


}
