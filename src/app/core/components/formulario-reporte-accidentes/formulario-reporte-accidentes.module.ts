import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioReporteAccidentesRoutingModule } from './formulario-reporte-accidentes-routing.module';
import { FormularioReporteAccidentesComponent } from './formulario-reporte-accidentes.component';


@NgModule({
  imports: [
    CommonModule,
    FormularioReporteAccidentesRoutingModule
  ],
  declarations: [
    FormularioReporteAccidentesComponent,
  ]
})
export class FormularioReporteAccidentesModule { }
