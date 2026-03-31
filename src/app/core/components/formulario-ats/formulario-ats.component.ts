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
import { PublishedFormsService } from '../../service/publishedForms/published-forms.service';
//recursos del token
import { AuthService } from '../../service/auth/auth.service';



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
  formularioId = ''; // ID del formulario ATS a cargar 

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
    private userByIdService: UserByIdService, private formularioATSService: FormATSService, private cdr: ChangeDetectorRef,
    private publishedFormsService: PublishedFormsService, private authService: AuthService 
) { }

ngOnInit() {
    this.getUserById(); 
    this.obtenerFormulariosPublicados();
}

obtenerFormulariosPublicados() {
    this.publishedFormsService.getPublishedForms('PUBLISHED').subscribe({
        next: (response) => {
            console.warn('Formularios publicados:', response);                     
            this.formularioId = response.data.find((form: any) => form.nombre === 'FORMULARIO ATS' && form.estado === 'PUBLISHED')?.id || '';   
            console.warn('ID del formulario ATS encontrado:', this.formularioId);
            
            // Cargar el formulario solo si se encontró el ID
            if (this.formularioId) {
                this.cargarFormularioATS();
            } else {
                console.error('No se encontró el formulario ATS publicado');
                this.isLoading = false;
            }
        },
        error: (error) => {
            console.error('Error al obtener formularios publicados:', error);
            this.isLoading = false;
        }
    });
}

    


// * Formulario ATS - Cargar campos dinámicos desde el backend
  cargarFormularioATS() {
    this.formularioATSService.getFormularioATS(this.formularioId).subscribe({
      next: (ats) => {
       //this.fields = ats.data.campos as FormlyFieldConfig[];
       this.fields.push(...ats.data.campos);
        this.isLoading = false;
        console.warn('FORM ATS RECONSTRUIDO PARA FORMLY:', ats.data.campos);
        console.warn('FORM ATS RECONSTRUIDO JSON:', JSON.stringify(ats.data.campos));
        this.actualizarCampoIVR();
        this.actualizarCampoEmpresaNombre();
        this.ocultarCamposGeolocation();
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

  // FORMULARIO ATS - Funciones para filtrar campos por sección usando typeform y category
  getFilteredFields() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'DATOS_EMPRESA'
    );
  }
  
   getFilteredFieldsFotoRostro() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'FOTOGRAFIA_ROSTRO_UBICACION'
    );
  }

    getFilteredFieldsAnalisisRiesgo() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'ANALISIS_RIESGO'
    );
  }
    getFilteredFieldsPermisosTrabajoCaliente() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'PERMISOS_TRABAJO' && 
      (field as any).subcategory === 'TRABAJOS_CALIENTE'
    );
  }

  onSubmit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
      console.log(this.model);
      console.warn('Formulario enviado con datos:', JSON.stringify(this.model));
    }
  }

getUserById(){
    //obtenemos el ID del usuario desde el token para cargar sus datos y asignar campos dinámicos en el formulario ATS
    const userId = this.authService.getTokenPayload()?.userId;
        console.warn('ID de usuario obtenido del token:', userId);
    
    if (userId) {    
        this.userByIdService.getUserById(userId).subscribe({
            next: (response) => {
                console.warn('Datos del usuario:', response);
                // Asignar toda la respuesta a la propiedad userResponse
                this.userResponse = response;
                this.actualizarCampoIVR();
                this.actualizarCampoEmpresaNombre();
            },
            error: (error) => {
                console.error('Error al obtener los datos del usuario:', error);
            },
        });
    }
}

// Actualizar campo IVR con el código IVR del usuario (búsqueda dinámica)
actualizarCampoIVR() {
    // Verificar que tengamos ambos datos disponibles
    if (this.fields.length === 0 || !this.userResponse?.data?.codigoIVR) {
        return;
    }
    
    // Buscar dinámicamente el campo que contenga '_ivr' en su key
    const campoIVR = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('_ivr')
    );
    
    if (campoIVR) {
        // Actualizar el valor por defecto del campo
        campoIVR.defaultValue = this.userResponse.data.codigoIVR;
        // También actualizar el modelo usando la key dinámica
        this.model[String(campoIVR.key)] = this.userResponse.data.codigoIVR;
        
        // Bloquear/deshabilitar el campo
        if (!campoIVR.props) {
            campoIVR.props = {};
        }
        //campoIVR.props.disabled = true;
        campoIVR.props.readonly = true;
        
        console.log(`Campo IVR actualizado y bloqueado: ${campoIVR.key} = ${this.userResponse.data.codigoIVR}`);
    } else {
        console.warn('No se encontró un campo con "_ivr" en su key');
    }
}

// Actualizar campo EmpresaNombre con el nombre de la empresa (búsqueda dinámica)
actualizarCampoEmpresaNombre() {
    // Verificar que tengamos ambos datos disponibles
    if (this.fields.length === 0 || !this.userResponse?.data?.empresaNombre) {
        return;
    }
    
    // Buscar dinámicamente el campo que contenga 'empresa' y 'nombre' en su key
    const campoEmpresa = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('_empresa')
    );
    
    if (campoEmpresa) {
        // Actualizar el valor por defecto del campo
        campoEmpresa.defaultValue = this.userResponse.data.empresaNombre;
        // También actualizar el modelo usando la key dinámica
        this.model[String(campoEmpresa.key)] = this.userResponse.data.empresaNombre;
        
        // Bloquear/deshabilitar el campo
        if (!campoEmpresa.props) {
            campoEmpresa.props = {};
        }
       // campoEmpresa.props.disabled = true;
        campoEmpresa.props.readonly = true;
        
        console.log(`Campo Empresa actualizado y bloqueado: ${campoEmpresa.key} = ${this.userResponse.data.empresaNombre}`);
    } else {
        console.warn('No se encontró un campo con "empresa" y "nombre" en su key');
    }
}

// Ocultar campos de geolocalización al cargar el formulario
ocultarCamposGeolocation() {
    if (this.fields.length === 0) {
        return;
    }
    
    // Buscar y ocultar campo de latitud
    const campoLatitud = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('latitud')
    );
    
    if (campoLatitud) {
        campoLatitud.hide = true;
        console.log(`Campo Latitud ocultado: ${campoLatitud.key}`);
    }
    
    // Buscar y ocultar campo de longitud
    const campoLongitud = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('longitud')
    );
    
    if (campoLongitud) {
        campoLongitud.hide = true;
        console.log(`Campo Longitud ocultado: ${campoLongitud.key}`);
    }
    
    // Buscar y ocultar campo de precisión
    const campoPrecision = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('precision')
    );
    
    if (campoPrecision) {
        campoPrecision.hide = true;
        console.log(`Campo Precisión ocultado: ${campoPrecision.key}`);
    }
}

// Actualizar campos de geolocalización (latitud, longitud, precisión)
actualizarCamposGeolocation(coordenadas: { latitud: number, longitud: number, precision: number }) {
    if (this.fields.length === 0) {
        console.warn('No hay campos disponibles para actualizar');
        return;
    }
    
    // Buscar y actualizar campo de latitud
    const campoLatitud = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('latitud')
    );
    
    if (campoLatitud) {
        campoLatitud.defaultValue = coordenadas.latitud;
        this.model[String(campoLatitud.key)] = coordenadas.latitud;
        console.log(`Campo Latitud actualizado: ${campoLatitud.key} = ${coordenadas.latitud}`);
    } else {
        console.warn('No se encontró un campo con "latitud" en su key');
    }
    
    // Buscar y actualizar campo de longitud
    const campoLongitud = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('longitud')
    );
    
    if (campoLongitud) {
        campoLongitud.defaultValue = coordenadas.longitud;
        this.model[String(campoLongitud.key)] = coordenadas.longitud;
        console.log(`Campo Longitud actualizado: ${campoLongitud.key} = ${coordenadas.longitud}`);
    } else {
        console.warn('No se encontró un campo con "longitud" en su key');
    }
    
    // Buscar y actualizar campo de precisión
    const campoPrecision = this.fields.find(field => 
        field.key && String(field.key).toLowerCase().includes('precision')
    );
    
    if (campoPrecision) {
        campoPrecision.defaultValue = coordenadas.precision;
        this.model[String(campoPrecision.key)] = coordenadas.precision;
        console.log(`Campo Precisión actualizado: ${campoPrecision.key} = ${coordenadas.precision}`);
    } else {
        console.warn('No se encontró un campo con "precision" en su key');
    }
    
    // Forzar detección de cambios en el formulario
    this.cdr.detectChanges();
}

// * Fin Formulario ATS - Cargar campos dinámicos desde el backend





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
           this.onSubmit();
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




}
