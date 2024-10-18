import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BusquedasService } from '../../services/busquedas.service';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: ``
})
export class BusquedaComponent implements OnInit{

  protected cargando: boolean = false
  public usuarios: Usuario[] = []
  public medicos: Medico[] = []
  public hospitales: Hospital[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private _bs: BusquedasService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({termino}) => {
      this.busquedaGlobal(termino);
    })
  }

  private busquedaGlobal(termino: string){
    this.cargando = true
    this._bs.busquedaGlobal(termino).subscribe({
      next: (res) => {
        this.usuarios = res.usuarios;
        this.hospitales = res.hospitales;
        this.medicos = res.medicos;
      },
      error: (err) => {

      }
    }).add(() => this.cargando = false)
  }

  protected abrirMedico(medico: Medico){
    this.router.navigateByUrl(`/dashboard/medico/${medico._id}`)
  }

}
