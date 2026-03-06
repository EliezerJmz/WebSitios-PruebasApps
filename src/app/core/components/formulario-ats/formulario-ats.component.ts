import { Component, ChangeDetectorRef, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ParkingService } from 'src/app/core/service/parking.service';
import { Parking } from 'src/app/core/api/parkings';
import { SelectItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { StatusItem } from 'src/app/core/api/management-catalog/catalog';
import { CheckboxModule } from 'primeng/checkbox';
import { UserByIdService } from '../../service/user/user-by-id.service';
import { UserById } from '../../api/user-by-id/userById.model';
//formly
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormATSService } from '../../service/formATS/form-ats.service';



@Component({
    templateUrl: './formulario-ats.component.html',
    styleUrls: ['./formulario-ats.component.scss'],
    providers: [MessageService, ConfirmationService, TableModule, TagModule, RatingModule, ButtonModule, CommonModule, CheckboxModule]
})
export class FormularioAtsComponent implements AfterViewInit, OnInit {

// Propiedades formly para ATS
form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  fields: FormlyFieldConfig[] = [];
  formularioId = '213bf1e7-85aa-4c00-8d35-02c44dc4f4b5';

  isLoading = true;
// Fin Propiedades formly para ATS











// Propiedades para secciones del formulario analisis de riesgo
  selectedCategories: any[] = [];

    categories: any[] = [
        { name: 'Explosión', key: 'EXP' },
        { name: 'Incendio', key: 'INC' },
        { name: 'Quemaduras', key: 'QUEM' },
        { name: 'Choque eléctrico', key: 'CE' },
        { name: 'Arco eléctrico', key: 'AE' },
        { name: 'Caida de diferentes niveles', key: 'CDN' },
        { name: 'Caida de objetos desplomes', key: 'COD' },
        { name: 'Colisiones', key: 'COL' },
        { name: 'Atropellamiento', key: 'ATRO' },
        { name: 'inhalación de particulas', key: 'INH' },
        { name: 'Exposición a fluidos presurizados', key: 'EFP' },
        { name: 'Intoxicación/Asfixia/Irritación por quimicos', key: 'IQC' },
        { name: 'Contaminación por quimicos', key: 'CQC' },
        { name: 'Exposición a ruido', key: 'ER' },
        { name: 'Sobre esfuerzo por manipulación manual de carga', key: 'SEMMC' },
        { name: 'Generación de residuos', key: 'GR' },
        { name: 'Atrapamiento', key: 'ATRA' },
        { name: 'Derrumbes', key: 'DER' },
    ];


// Propiedad para los checkboxes del accordion
    pizza: string[] = [];

    valueEmp: string;
    valueId: string;
    valueTextArea: string;
    valueDate: string;
    valueDateFin: string;
    showInfoDialog: boolean = false;

 // Permisos de trabajo
  checkedCumplimiento: boolean = false;  
  checkedRecomendaciones: boolean = false; 

// Formulario ATS - Datos de la empresa
    userResponse: UserById; // Aquí se almacenarán los datos del usuario obtenidos por ID  

constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private userByIdService: UserByIdService, private formularioATSService: FormATSService, private cdr: ChangeDetectorRef
) { }

ngOnInit() {
    this.getUserById(); 
    this.cargarFormularioATS();
}

// Formulario ATS - Cargar campos dinámicos desde el backend
  cargarFormularioATS() {
    this.formularioATSService.getFormularioATS(this.formularioId).subscribe({
      next: (ats) => {
       //this.fields = ats.data.campos as FormlyFieldConfig[];
       this.fields.push(...ats.data.campos);
        this.isLoading = false;
        console.warn('Campos cargados:', ats.data.campos);
      },
      error: (error) => {
        console.error('Error al cargar formulario:', error);
        this.isLoading = false;
      }
    });
  }

 ngAfterViewInit() {
    // Detectar cambios después de que la vista se inicialice completamente
    this.cdr.detectChanges();
  }

  getFilteredFields() {
    return this.fields.filter(field => String(field.key).includes('ATSM1'));
  }
  
   getFilteredFieldsFotoRostro() {
    return this.fields.filter(field => String(field.key).includes('ATSM2'));
  }

    getFilteredFieldsAnalisisRiesgo() {
    return this.fields.filter(field => String(field.key).includes('ATSM3'));
  }

  onSubmit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
      console.log(this.model);
    }
  }
// Fin Formulario ATS - Cargar campos dinámicos desde el backend





// Función para manejar el click en los headers del acordeón y hacer scroll al contenido
@HostListener('click', ['$event'])
onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const accordionHeader = target.closest('.p-accordion-header') as HTMLElement;
    
    if (accordionHeader) {
        // Aumentar timeout en móvil para dar tiempo a la animación
        const isMobile = window.innerWidth < 768;
        const delay = isMobile ? 500 : 300; // 600ms en móvil, 400ms en desktop 
        
        setTimeout(() => {
            // Calcular la altura real del menú
            const topbar = document.querySelector('.layout-topbar') as HTMLElement;
            const menuHeight = topbar ? topbar.offsetHeight : 100;
            
            // Agregar pequeño margen adicional (20px en móvil, 15px en desktop)
            const margin = isMobile ? 65 : 15;
            const offset = menuHeight + margin;
            
            // Obtener posición del header relativa al viewport
            const rect = accordionHeader.getBoundingClientRect();
            
            // Obtener el scroll actual - usar múltiples métodos para compatibilidad móvil
            const pageYOffset = window.pageYOffset || 0;
            const docElementScrollTop = document.documentElement.scrollTop || 0;
            const bodyScrollTop = document.body.scrollTop || 0;
            
            const currentScroll = Math.max(pageYOffset, docElementScrollTop, bodyScrollTop);
            
            // Calcular posición absoluta en el documento: posición en viewport + scroll actual
            const absolutePosition = rect.top + currentScroll;
            
            // Calcular posición final: posición absoluta menos el offset del menú
            const targetPosition = Math.max(0, absolutePosition - offset);
            
            // Implementar smooth scroll manual para mejor compatibilidad móvil
            const startPosition = currentScroll;
            const distance = targetPosition - startPosition;
            const duration = 400; // 500ms de animación
            let startTime: number | null = null;
            
            const smoothScrollStep = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function (ease-in-out)
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                const newPosition = startPosition + (distance * ease);
                
                // Aplicar scroll en el elemento correcto según el dispositivo
                if (bodyScrollTop > 0 || isMobile) {
                    document.body.scrollTop = newPosition;
                }
                if (docElementScrollTop > 0 || !isMobile) {
                    document.documentElement.scrollTop = newPosition;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(smoothScrollStep);
                }
            };
            
            requestAnimationFrame(smoothScrollStep);
        }, delay);
    }
}

// Log de categorías seleccionadas
onSelectedCategoriesChange(selected: any[]) {
    const nombres = (selected || []).map((c: any) => c.name);
    console.log('Categorías seleccionadas:', nombres);

}

selectedCheckCategories(){
    console.log("CHEKEADAS:", this.selectedCategories);
}

//CONFIRMACIÓN BOTON DE ENVIAR FORMULARIO ATS
confirmSubmitFormATS() {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Desea Enviar un Formulario ATS?',
        header: 'Confirmar Envío',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Se ha enviado un Formulario ATS', life: 1000 });
           /**
            setTimeout(() => {
                this.redirectSearchAssignment()
              }, 1000);
             */   
           
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Envio Cancelado', life: 2000 });
        }
    });
}

//CONFIRMACIÓN BOTON DE BORRAR FORMULARIO ATS
confirmCancelFormATS() {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Desea Borrar el Formulario ATS?',
        header: 'Confirmar Borrado',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Borrado Confirmado', life: 1000 });
           /**
            setTimeout(() => {
                this.redirectSearchAssignment()
              }, 1000);
             */   
           
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Borrado Cancelado', life: 2000 });
        }
    });
}


// FORMULARIO ATS
    //DATOS DE LA EMPRESA
getUserById(){

    this.userByIdService.getUserById('eb5da338-fd5e-44e9-afc9-8d6e5f84fbea').subscribe({
        next: (response) => {
            console.warn('Datos del usuario:', response);
            // Asignar toda la respuesta a la propiedad userResponse
            this.userResponse = response;
        },
        error: (error) => {
            console.error('Error al obtener los datos del usuario:', error);
        }
    });
     
}


}
