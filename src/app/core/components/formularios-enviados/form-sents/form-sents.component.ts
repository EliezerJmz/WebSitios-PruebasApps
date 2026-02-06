import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, Message } from 'primeng/api';

@Component({
  selector: 'app-form-sents',
  standalone: false,
  templateUrl: './form-sents.component.html',
  styleUrl: './form-sents.component.scss'
})
export class FormSentsComponent 
{

   formularios: any[] = [
        {fecha: '01-01-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-02-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-03-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-04-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-05-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-06-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-07-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-08-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-09-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-10-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-11-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-12-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-01-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-02-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-03-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-04-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-05-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-06-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-07-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-08-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-09-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-10-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-11-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-12-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-01-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-02-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-03-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-04-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-05-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-06-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-07-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-08-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-09-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-10-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-11-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {fecha: '01-12-2026', name: 'Formulario ATS', status: 'ENVIADO'},
        {fecha: '01-01-2026', name: 'Formulario PT', status: 'ACEPTADO'},
        {fecha: '01-02-2026', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {fecha: '01-03-2026', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {fecha: '01-04-2026', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
    ];
 
constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

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

//CONFIRMACIÓN BOTON DE PANICO
confirmMessage() {
    this.confirmationService.confirm({
        key: "formSentsDialog",
        target: event.target as EventTarget,
        message: '¿Desea enviar un mensaje de pánico?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'success', summary: 'Enviado', detail: 'Se ha enviado un mensaje', life: 1000 });
           /**
            setTimeout(() => {
                this.redirectSearchAssignment()
              }, 1000);
             */   
           
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Envio cancelado', life: 2000 });
        }
    });
}


}
