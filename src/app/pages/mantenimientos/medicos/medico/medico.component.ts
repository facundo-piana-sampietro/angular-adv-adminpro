import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HospitalService } from '../../../../services/hospital.service';
import { Hospital } from '../../../../models/hospital.model';
import { ModalService } from '../../../../services/modal.service';
import { delay, tap } from 'rxjs';
import { MedicoService } from '../../../../services/medico.service';
import { Medico } from '../../../../models/medico.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: ``
})
export class MedicoComponent implements OnInit {

  protected medicoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    hospital: new FormControl('', Validators.required)
  })
  protected hospitales: Hospital[] = []
  protected hospitalSeleccionado?: Hospital;
  protected medicoSeleccionado?: Medico;
  protected cargando: boolean = false

  constructor(
    private _hs: HospitalService,
    private _ms: ModalService,
    private _mes: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarMedico(id);
    })

    this.cargarHospitales();
    this.medicoForm.get('hospital')?.valueChanges
      .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h._id == hospitalId);
      })
  }

  private cargarHospitales() {
    this.cargando = true
    this._hs.cargarHospitales().subscribe({
      next: ({hospitales}) => {
        this.hospitales = hospitales
      },
      error: (err) => {
        this._ms.modalError("Error al obtener hospitales", err.error.msg)
      }
    }).add(() => this.cargando = false)
  }

  private cargarMedico(id: string){

    if (id === 'nuevo'){
      return
    }

    this.cargando = true;
    this._mes.obtenerMedicoPorId(id)
    .pipe(delay(1000))
    .subscribe({
      next: (medico) => {
        const { nombre, hospital: { _id: id } = { _id: '' } } = medico;
        this.medicoForm.setValue({nombre, hospital: id ?? ''});
        this.medicoSeleccionado = medico;
      },
      error: (err) => {
        console.error(err)
        this.router.navigateByUrl(`/dashboard/medicos`);
      }
    }).add(() => this.cargando = false)
  }

  protected guardarMedico(){

    const data = {
      nombre: this.medicoForm.controls.nombre.value ?? '',
      hospital: this.medicoForm.controls.hospital.value ?? ''
    }

    if (this.medicoSeleccionado){
      this._mes.actualizarMedico(data, this.medicoSeleccionado._id ?? '').subscribe({
        next: () => {
          this._ms.modalSatisfactorio('Actualizado', `El médico con nombre "${this.medicoForm.controls.nombre.value}" fue actualizado con éxito.`)
        },
        error: (err) => {
          this._ms.modalError(`Error al actualizar el médico ${this.medicoForm.controls.nombre.value}`, err.error.msg)
        }
      }).add(() => this.cargando = false)

    } else {
      this.cargando = true;
      this._mes.crearMedico(data).subscribe({
        next: (res) => {
          this._ms.modalSatisfactorio('Creado', `El médico con nombre "${this.medicoForm.controls.nombre.value}" fue creado con éxito. Se lo redirigirá a la página de mantenimiento del usuario.`)
          .then(() => this.router.navigateByUrl(`/dashboard/medico/${res._id}`))
        },
        error: (err) => {
          this._ms.modalError(`Error al crear el médico ${this.medicoForm.controls.nombre.value}`, err.error.msg)
        }
      }).add(() => this.cargando = false)
    }
  }

}
