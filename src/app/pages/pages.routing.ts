import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medicos/medico/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guard/admin.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
          {path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
          {path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de cuenta'} },
          {path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Búsquedas'} },
          {path: 'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica #1'} },
          {path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil'}},
          {path: 'progress', component: ProgressComponent, data: {titulo: 'ProgressBar'}},
          {path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'} },
          {path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'} },

          //Mantenimientos
          {path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'} },
          {path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de médicos'} },
          {path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de médicos'} },
          {path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard], data: {titulo: 'Mantenimiento de usuarios'} },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
