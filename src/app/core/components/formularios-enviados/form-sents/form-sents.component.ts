import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { Data } from 'src/app/core/api/responsesSent/responsesSent.model';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { ResponsesSentService } from 'src/app/core/service/responsesSent/responses-sent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-sents',
  standalone: false,
  templateUrl: './form-sents.component.html',
  styleUrl: './form-sents.component.scss'
})
export class FormSentsComponent implements OnInit {


formularios: Data[] = [];
loading: boolean = false;
 
constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private responsesSentService: ResponsesSentService, private authService: AuthService,
    private router: Router
        
) { }

ngOnInit() {                                
    this.FormulariosEnviados();
}

 FormulariosEnviados() {

    const userId = this.authService.getTokenPayload()?.userId ?? '';
    this.loading = true;
   
      this.responsesSentService.getFormulariosEnviadosByUserId(userId).subscribe({
        next: (response) => {                  
            console.log('Formularios enviados:', response.data);
            this.formularios = response.data;
            console.warn('Formularios enviados:', this.formularios);
            this.loading = false;
        },
        error: (error) => {
            console.error('Error al obtener los formularios enviados:', error);
            this.loading = false;
        }
    });
 }





  getSeverity(status: string) {
      switch (status) {
          case 'PENDIENTE':
            return 'warning';
            case 'APROBADO':
              return 'success';
          case 'RECHAZADO':
              return 'danger';
      }
      return null
  }




  

//EDITAR FORMULARIO RECHAZADO
editarFormulario(formulario: Data) {
    this.router.navigate(['formulario-ats'], {
        state: {
            modoEdicion: true,
            respuestaId: formulario.id,
            answers: formulario.answers
        }
    });
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
