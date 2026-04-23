import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { Data } from 'src/app/core/api/responsesSent/responsesSent.model';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { ResponsesSentService } from 'src/app/core/service/responsesSent/responses-sent.service';
import { Router } from '@angular/router';
import { FormATSService } from 'src/app/core/service/formATS/form-ats.service';

@Component({
  selector: 'app-form-sents',
  standalone: false,
  templateUrl: './form-sents.component.html',
  styleUrl: './form-sents.component.scss'
})
export class FormSentsComponent implements OnInit {


formularios: Data[] = [];
loading: boolean = false;
mostrarDetalle: boolean = false;
formularioSeleccionado: Data | null = null;
loadingDetalle: boolean = false;
seccionDetalle: Array<{
    titulo: string;
    campos: Array<{ label: string; value: any }>;
    subsecciones?: Array<{ titulo: string; campos: Array<{ label: string; value: any }> }>;
}> = [];
 
constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private responsesSentService: ResponsesSentService, private authService: AuthService,
    private router: Router, private formularioATSService: FormATSService
        
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




  

//VER DETALLE DE FORMULARIO
verFormulario(formulario: Data) {
    const typeform = this.detectarTypeform(formulario);
    if (typeform === 'REPORTE_ACCIDENTES') {
        this.router.navigate(['formulario-reporte-accidentes'], {
            state: { modoVisualizacion: true, answers: formulario.answers }
        });
    } else {
        this.router.navigate(['formulario-ats'], {
            state: { modoVisualizacion: true, answers: formulario.answers }
        });
    }
}

private construirSeccionesDetalle(campos: any[], answers: any) {
    // Detectar si es REPORTE_ACCIDENTES o ANALISIS_TRABAJO_SEGURO
    const tieneReporte = campos.some(f => f.typeform === 'REPORTE_ACCIDENTES');
    const typeform = tieneReporte ? 'REPORTE_ACCIDENTES' : 'ANALISIS_TRABAJO_SEGURO';

    const SECCIONES_ATS: any[] = [
        { titulo: 'Datos de la Empresa', category: 'DATOS_EMPRESA' },
        { titulo: 'Fotografía del Rostro con Ubicación', category: 'FOTOGRAFIA_ROSTRO_UBICACION' },
        { titulo: 'Análisis de Riesgo', category: 'ANALISIS_RIESGO' },
        {
            titulo: 'Permisos de Trabajo', category: 'PERMISOS_TRABAJO',
            subcategorias: [
                { titulo: 'Trabajos en caliente', subcategory: 'TRABAJOS_CALIENTE' },
                { titulo: 'Trabajos en alturas', subcategory: 'TRABAJOS_ALTURA' },
                { titulo: 'Trabajos con energías peligrosas', subcategory: 'TRABAJOS_ENERGIAS_PELIGROSAS' },
                { titulo: 'Trabajos con químicos', subcategory: 'TRABAJOS_QUIMICOS' },
                { titulo: 'Trabajos en espacios confinados', subcategory: 'TRABAJOS_ESPACIOS_CONFINADOS' },
                { titulo: 'Trabajos de excavaciones', subcategory: 'TRABAJOS_EXCAVACIONES' },
            ]
        },
        { titulo: 'Fotografías de Herramientas', category: 'FOTOGRAFIA_HERRAMIENTAS' },
        { titulo: 'Fotografías de Equipo de Protección', category: 'FOTOGRAFIA_EQUIPO_PROTECCION' },
        { titulo: 'Medidas de prevención', category: 'MEDIDAS_PREVENCION' },
    ];

    const SECCIONES_REPORTE: any[] = [
        { titulo: 'Datos del Colaborador', category: 'DATOS_COLABORADOR_IVR' },
        { titulo: 'Lugar del Accidente', category: 'LUGAR_ACCIDENTE' },
        { titulo: 'Condiciones Ambientales en lugar del Accidente', category: 'CONDICIONES_AMBIENTALES' },
        { titulo: 'Datos Ocurrencia del Accidente', category: 'DATOS_OCURRENCIA' },
        { titulo: 'Análisis Preliminar del Accidente', category: 'ANALISIS_PRELIMINAR' },
        { titulo: 'Descripción del Accidente', category: 'DESCRIPCION_ACCIDENTE' },
    ];

    const SECCIONES = tieneReporte ? SECCIONES_REPORTE : SECCIONES_ATS;

    this.seccionDetalle = SECCIONES.map(seccion => {
        if (seccion.subcategorias) {
            const subsecciones = seccion.subcategorias.map((sub: any) => {
                const camposSub = campos.filter(f =>
                    f.typeform === typeform &&
                    f.category === seccion.category &&
                    f.subcategory === sub.subcategory
                );
                return {
                    titulo: sub.titulo,
                    campos: camposSub
                        .map((f: any) => ({ label: f.props?.label || f.key || '', value: answers?.[f.key] ?? null }))
                        .filter((c: any) => c.value !== null && c.value !== undefined && c.value !== '')
                };
            }).filter((sub: any) => sub.campos.length > 0);
            return { titulo: seccion.titulo, campos: [], subsecciones };
        }
        const camposSec = campos.filter(f =>
            f.typeform === typeform &&
            f.category === seccion.category
        );
        return {
            titulo: seccion.titulo,
            campos: camposSec
                .map((f: any) => ({ label: f.props?.label || f.key || '', value: answers?.[f.key] ?? null }))
                .filter((c: any) => c.value !== null && c.value !== undefined && c.value !== ''),
            subsecciones: undefined
        };
    }).filter(s => s.campos.length > 0 || (s.subsecciones && s.subsecciones.length > 0));
}

formatearValor(value: any): string {
    if (value === true) return 'Sí';
    if (value === false) return 'No';
    if (value === null || value === undefined) return '-';
    return String(value);
}

get answersEntries(): { key: string, value: any }[] {
    if (!this.formularioSeleccionado?.answers) return [];
    return Object.entries(this.formularioSeleccionado.answers).map(([key, value]) => ({ key, value }));
}

//EDITAR FORMULARIO RECHAZADO
editarFormulario(formulario: Data) {
    const typeform = this.detectarTypeform(formulario);
    if (typeform === 'REPORTE_ACCIDENTES') {
        this.router.navigate(['formulario-reporte-accidentes'], {
            state: { modoEdicion: true, respuestaId: formulario.id, answers: formulario.answers }
        });
    } else {
        this.router.navigate(['formulario-ats'], {
            state: { modoEdicion: true, respuestaId: formulario.id, answers: formulario.answers }
        });
    }
}

private detectarTypeform(formulario: Data): string | null {
    if (!formulario?.answers) return null;
    // Buscar en los campos cargados el typeform correspondiente
    // Se detecta por el nombre del formulario si está disponible, sino se busca en las claves del answers
    if ((formulario as any).formularioNombre?.includes('REPORTE') || (formulario as any).formularioNombre?.includes('ACCIDENTE')) {
        return 'REPORTE_ACCIDENTES';
    }
    if ((formulario as any).formularioNombre?.includes('ATS') || (formulario as any).formularioNombre?.includes('ANALISIS')) {
        return 'ANALISIS_TRABAJO_SEGURO';
    }
    // Fallback: detectar por typeform en metadata si existe
    if ((formulario as any).metadata?.typeform) {
        return (formulario as any).metadata.typeform;
    }
    return null;
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
