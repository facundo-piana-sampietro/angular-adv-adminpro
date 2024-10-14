import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalService } from '../../../services/modal.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription, tap } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: ``
})
export class MedicosComponent implements OnInit, OnDestroy{


  protected cargandoLoader: boolean = true;
  public cargando: boolean = false
  public medicos: Medico[] = [];
  public totalMedicos: number = 0;
  public desde: number = 0;
  public pagina: number = 0;
  public imgSubs: Subscription

  constructor(
    private _mes: MedicoService,
    private _ms: ModalService,
    private _mos: ModalImagenService,
    private _bs: BusquedasService
  ){
    this.imgSubs = this._mos.nuevaImagen
    .pipe(delay(100))
    .subscribe((img) => {
      this.cargarMedicos();
    })
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarMedicos()
  }

  cargarMedicos(){
    this.cargandoLoader  = true
    this._mes.cargarMedicos(this.desde).subscribe({
      next: ({medicos, total}) => {

        this.medicos = medicos
        this.totalMedicos = total
        this.pagina = Math.ceil(this.desde/5) + 1
      },
      error: (err) => {
        this._ms.modalError("Error al obtener médicos", err.error.msg)
      }
    }).add(() => this.cargandoLoader = false)
  }

  cambiarPagina(valor: number){
    this.desde += valor;
    this.cargarMedicos();
  }

  abrirModal (medico: Medico){
    this._mos.abrirModal('medicos', medico._id ?? '', medico.img);
  }

  buscar(termino: string){
    if (termino.length == 0){
      //Si borra el criterio de busqueda, volvemos a poner los médicos anteriores
      this.cargarMedicos()
      return
    }

    this._bs.buscar('medicos', termino).subscribe({
      next: (resultados: Medico[]) => {
        this.medicos = resultados ?? this.medicos
      },
      error: (err) => {
        this._ms.modalError("Error al buscar médicos", err.error.msg)
      }
    }).add()
  }

  crearMedico(){

  }

  eliminarMedico(medico: Medico){
    if (!medico._id){
      this._ms.modalError('Error', 'No existe el médico que quiere eliminar.')
      return;
    }
    this._ms.modalPregunta('¿Borrar médico?', `Está a punto de borrar al médico "${medico.nombre}"`, 'Eliminar', 'Cancelar')
    .then((result) => {
      if (result.value){
        this.cargando = true
        this._mes.eliminarMedico(medico._id!).subscribe({
          next: () => {
            this._ms.modalSatisfactorio('Eliminado', `El médico "${medico.nombre}" fue eliminado`)
            this.cargarMedicos();
          },
          error: (err) => {
            this._ms.modalError(`Error al eliminar el médico "${medico.nombre}"`, err.error.msg);
          }
        }).add(() => this.cargando= false)
      }
    })
  }



}
