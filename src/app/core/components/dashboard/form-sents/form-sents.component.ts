import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-sents',
  standalone: false,
  templateUrl: './form-sents.component.html',
  styleUrl: './form-sents.component.scss'
})
export class FormSentsComponent 
{
   products: any[] = [
        {id: '1000', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1001', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1002', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1003', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1004', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1005', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1006', name: 'Formulario PT', status: 'ACEPTADO'},
    ];
 

  getSeverity(status: string) {
      switch (status) {
          case 'ENVIADO':
            return 'warning';
            case 'ACEPTADO':
              return 'success';
          case 'RECHAZADO':
              return 'danger';
      }
      return null
  }



}
