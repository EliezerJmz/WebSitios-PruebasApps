import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioReporteAccidentesComponent } from './formulario-reporte-accidentes.component';

const routes: Routes = [
  { path: '',component: FormularioReporteAccidentesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioReporteAccidentesRoutingModule { }
