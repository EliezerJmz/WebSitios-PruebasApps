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

   products: any[] = [
        {id: '1000', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1001', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1002', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1003', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1004', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1005', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1006', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1007', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1008', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1009', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1000', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1001', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1002', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1003', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1004', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1005', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1006', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1007', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1008', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1009', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1000', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1001', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1002', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1003', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1004', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1005', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1006', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1007', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1008', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1009', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1000', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1001', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1002', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1003', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1004', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
        {id: '1005', name: 'Formulario ATS', status: 'ENVIADO'},
        {id: '1006', name: 'Formulario PT', status: 'ACEPTADO'},
        {id: '1007', name: 'Reporte de Accidentes', status: 'ENVIADO'},
        {id: '1008', name: 'Reporte de Riesgos', status: 'ACEPTADO'},
        {id: '1009', name: 'Reporte de Riesgos', status: 'RECHAZADO'},
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
