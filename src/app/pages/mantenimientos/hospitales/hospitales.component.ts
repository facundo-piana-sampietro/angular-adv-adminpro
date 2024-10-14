import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { ModalService } from '../../../services/modal.service';
import { Hospital } from '../../../models/hospital.model';
import { delay, finalize, Subscription, tap } from 'rxjs';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: ``
})
export class HospitalesComponent implements OnInit, OnDestroy{

  public hospitales: Hospital[] = [];
  public cargandoLoader: boolean = true
  public cargando: boolean = false
  public totalHospitales: number = 0;
  public desde: number = 0;
  public pagina: number = 0;
  public imgSubs: Subscription;

  constructor(
    private _hs: HospitalService,
    private _ms: ModalService,
    private _mis: ModalImagenService,
    private _bs: BusquedasService
  ){
    this.imgSubs = this._mis.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarHospitales());
  }


  ngOnInit(): void {
    this.cargarHospitales()
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(){
    this.cargandoLoader = true;
    this._hs.cargarHospitalesPaginado(this.desde).subscribe({
      next: ({hospitales,  total}) => {
        this.hospitales = hospitales
        this.pagina = Math.ceil(this.desde/5) + 1
        this.totalHospitales = total;
      },
      error: (err) => {
        this._ms.modalError("Error al obtener hospitales", err.error.msg)
      }
    }).add(() => this.cargandoLoader = false)
  }

  cambiarPagina(valor: number){
    this.desde += valor;
    this.cargarHospitales();
  }

  actualizarHospital(hospital: Hospital){
    if (!hospital._id){
      this._ms.modalError('Error', 'No existe el hospital que quiere actualizar.')
      return;
    }
    this.cargando = true
    this._hs.actualizarHospital(hospital._id , hospital.nombre).subscribe({
      next: () => {
        this._ms.modalSatisfactorio('Actualizado', `El hospital ${hospital.nombre} fue actualizado`)
      },
      error: (err) => {
        this._ms.modalError('Error al actualizar hospital', err.error.msg);
      }
    }).add(() => this.cargando = false)
  }

  eliminarHospital(hospital: Hospital){
    if (!hospital._id){
      this._ms.modalError('Error', 'No existe el hospital que quiere eliminar.')
      return;
    }
    this._ms.modalPregunta('¿Borrar hospital?', `Está a punto de borrar el hospital "${hospital.nombre}"`, 'Eliminar', 'Cancelar')
    .then((result) => {
      if (result.value){
        this.cargando = true
        this._hs.eliminarHospital(hospital._id!).subscribe({
          next: () => {
            this._ms.modalSatisfactorio('Eliminado', `El hospital "${hospital.nombre}" fue eliminado`)
            this.cargarHospitales();
          },
          error: (err) => {
            this._ms.modalError(`Error al eliminar el hospital "${hospital.nombre}"`, err.error.msg);
          }
        }).add(() => this.cargando = false)
      }
    })
  }

  async crearHospital(){
    this._ms.modalInput('Crear hospital', 'Ingrese el nombre del nuevo hospital', 'Nombre del hospital', 'Crear', 'Cancelar')
    .then((result) => {
      if (result.isConfirmed){
        const value = result.value;
        if (value?.trim().length){
          this.cargando = true
          this._hs.crearHospital( value ).subscribe({
            next: (hospital) => {
              this._ms.modalSatisfactorio('Creado', `El hospital "${hospital.nombre}" fue creado`)
              this.cargarHospitales();
            },
            error: (err) => {
              this._ms.modalError(`Error al crear el hospital "${value}"`, err.error.msg);
            }
          }).add(() => this.cargando = false)
        } else {
          this._ms.modalError('Error', 'Debe ingresar un nombre para el hospital');
          return
        }
      }
    });
  }
  buscar(termino: string){
    if (termino.length == 0){
      //Si borra el criterio de busqueda, volvemos a poner los hospitales anteriores
      this.cargarHospitales()
      return
    }

    this._bs.buscar('hospitales', termino).subscribe({
      next: (resultados: Hospital[]) => {
        this.hospitales = resultados ?? this.hospitales
      },
      error: (err) => {
        this._ms.modalError("Error al buscar hospitales", err.error.msg)
      }
    }).add()
  }

  abrirModal(hospital: Hospital){
    this._mis.abrirModal('hospitales', hospital._id ?? '', hospital.img);
  }

}
