import { Component, ChangeDetectorRef, AfterViewInit, OnInit, HostListener } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

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
import { SitiosService } from '../../service/sitios/sitios.service';



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

// Dialog de información ATS
    showInfoDialog: boolean = false;

// Validación de campos requeridos pendientes
    showValidationPanel: boolean = false;
    camposRequeridosPendientes: string[] = [];

// Funcionalidad de búsqueda de sitio por ID    
    sitioIdSearch = '';
    isSearchingSitio = false;

// Formulario ATS - Datos de la empresa
    userResponse: UserById; // Aquí se almacenarán los datos del usuario obtenidos por ID  

constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private userByIdService: UserByIdService, private formularioATSService: FormATSService, private cdr: ChangeDetectorRef,
    private publishedFormsService: PublishedFormsService, private authService: AuthService,
    private sitiosService: SitiosService
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
                this.marcarCamposSitioComoReadonly();
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

  // Funciones para obtener campos antes y después del campo de sitio, para mostrar en secciones separadas del formulario para agregar la funcionalidad de búsqueda de sitio por ID y completar campos relacionados (nombre de sitio, etc)
    getFilteredFieldsDatosEmpresaAntesSitio() {
        const datosEmpresa = this.getFilteredFields();
        const splitIndex = this.getSitioSearchSplitIndex(datosEmpresa);
        return datosEmpresa.slice(0, splitIndex);
    }

    getFilteredFieldsDatosEmpresaDespuesSitio() {
        const datosEmpresa = this.getFilteredFields();
        const splitIndex = this.getSitioSearchSplitIndex(datosEmpresa);
        return datosEmpresa.slice(splitIndex);
    }

    private getSitioSearchSplitIndex(fields: FormlyFieldConfig[]): number {
        const indexNombreEmpresa = this.findFieldIndexByLabel(fields, 'nombre de la empresa');
        const indexIdSitio = this.findFieldIndexByLabel(fields, 'id de sitio');

        if (indexNombreEmpresa !== -1 && indexIdSitio !== -1) {
            if (indexNombreEmpresa < indexIdSitio) {
                return indexIdSitio;
            }
            return indexNombreEmpresa + 1;
        }

        if (indexIdSitio !== -1) {
            return indexIdSitio;
        }

        if (indexNombreEmpresa !== -1) {
            return indexNombreEmpresa + 1;
        }

        return 0;
    }

    private findFieldIndexByLabel(fields: FormlyFieldConfig[], expectedLabel: string): number {
        const normalizedExpected = this.normalizeText(expectedLabel);

        return fields.findIndex(field => {
            const label = String(field.props?.label || field.templateOptions?.label || '');
            return this.normalizeText(label) === normalizedExpected;
        });
    }

    private normalizeText(value: string): string {
        return (value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }
  
  // Funciones para filtrar campos por sección usando typeform y category   
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
    getFilteredFieldsPermisosTrabajoAlturas() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'PERMISOS_TRABAJO' &&
      (field as any).subcategory === 'TRABAJOS_ALTURA'
    );
  }
  getFilteredFieldsPermisosTrabajoEnergia() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'PERMISOS_TRABAJO' &&
      (field as any).subcategory === 'TRABAJOS_ENERGIAS_PELIGROSAS'
    );
  }
   getFilteredFieldsPermisosTrabajoQuimicos() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'PERMISOS_TRABAJO' &&
      (field as any).subcategory === 'TRABAJOS_QUIMICOS'
    );
  }
     getFilteredFieldsPermisosTrabajoEspaciosConfinados() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'PERMISOS_TRABAJO' &&
      (field as any).subcategory === 'TRABAJOS_ESPACIOS_CONFINADOS'
    );
  }
   getFilteredFieldsPermisosTrabajoExcavaciones() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'PERMISOS_TRABAJO' &&
      (field as any).subcategory === 'TRABAJOS_EXCAVACIONES'
    );
  }
    getFilteredFieldsFotosHerramientas() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'FOTOGRAFIA_HERRAMIENTAS'
    );
  }
    getFilteredFieldsFotosEquiposProteccion() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'FOTOGRAFIA_EQUIPO_PROTECCION'
    );
  }
   getFilteredFieldsMedidasPrevencion() {
    return this.fields.filter(field => 
      (field as any).typeform === 'ANALISIS_TRABAJO_SEGURO' && 
      (field as any).category === 'MEDIDAS_PREVENCION'
    );
  }


  onSubmit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model));
      console.log(this.model);
      console.warn('Formulario enviado con datos:', JSON.stringify(this.model));
    }
  }

  validarRespuestas() {
    const collectRequiredFields = (fields: FormlyFieldConfig[]): FormlyFieldConfig[] => {
      return fields.reduce((acc: FormlyFieldConfig[], field) => {
        if (field.props?.required && field.key) {
          acc.push(field);
        }
        if (field.fieldGroup) {
          acc.push(...collectRequiredFields(field.fieldGroup));
        }
        return acc;
      }, []);
    };

    const requiredFields = collectRequiredFields(this.fields);

    this.camposRequeridosPendientes = requiredFields
      .filter(field => {
        const value = this.form.get(String(field.key))?.value;
        if (field.type === 'checkbox') {
          return value !== true;
        }
        return value === null || value === undefined || value === '';
      })
      .map(field => String(field.props?.label || field.templateOptions?.label || field.key || ''));

    this.showValidationPanel = true;
  }

  get allRequiredCheckboxesChecked(): boolean {
    const collectCheckboxFields = (fields: FormlyFieldConfig[]): FormlyFieldConfig[] => {
      return fields.reduce((acc: FormlyFieldConfig[], field) => {
        if (field.type === 'checkbox' && field.props?.required) {
          acc.push(field);
        }
        if (field.fieldGroup) {
          acc.push(...collectCheckboxFields(field.fieldGroup));
        }
        return acc;
      }, []);
    };
    const requiredCheckboxes = collectCheckboxFields(this.fields);
    if (requiredCheckboxes.length === 0) return true;
    return requiredCheckboxes.every(
      field => this.form.get(String(field.key))?.value === true
    );
  }

buscarSitioPorId() {
    const sitioId = (this.sitioIdSearch || '').trim();

    if (!sitioId) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Campo requerido',
            detail: 'Debe ingresar un ID de sitio para buscar.'
        });
        return;
    }

    this.isSearchingSitio = true;

    this.sitiosService.getSitioById(sitioId).subscribe({
        next: (response) => {
            const sitio = Array.isArray(response?.data)
                ? response.data[0]
                : response?.data;

            if (!sitio?.id) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Sin resultados',
                    detail: response?.message || 'No se encontró un sitio con el ID ingresado.'
                });
                this.isSearchingSitio = false;
                return;
            }

            this.actualizarCamposSitio(sitio.id, sitio.nombre || '');
            this.messageService.add({
                severity: 'success',
                summary: 'Sitio encontrado',
                detail: 'Se completaron los campos del formulario.'
            });

            this.isSearchingSitio = false;
        },
        error: (error) => {
            console.error('Error al buscar sitio por ID:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error de búsqueda',
                detail: 'No fue posible obtener la información del sitio.'
            });
            this.isSearchingSitio = false;
        }
    });
}

private actualizarCamposSitio(idSitio: string, nombreSitio: string) {
    if (this.fields.length === 0) {
        return;
    }

    const campoIdSitio = this.buscarCampoSitio('id de sitio', ['sitio', 'id']);
    const campoNombreSitio = this.buscarCampoSitio('nombre de sitio', ['sitio', 'nombre']);

    if (campoIdSitio?.key) {
        campoIdSitio.defaultValue = idSitio;
        this.model[String(campoIdSitio.key)] = idSitio;
    }

    if (campoNombreSitio?.key) {
        campoNombreSitio.defaultValue = nombreSitio;
        this.model[String(campoNombreSitio.key)] = nombreSitio;
    }

    this.cdr.detectChanges();
}

private marcarCamposSitioComoReadonly() {
    const campoIdSitio = this.buscarCampoSitio('id de sitio', ['sitio', 'id']);
    const campoNombreSitio = this.buscarCampoSitio('nombre de sitio', ['sitio', 'nombre']);

    if (campoIdSitio) {
        if (!campoIdSitio.props) {
            campoIdSitio.props = {};
        }
        campoIdSitio.props.readonly = true;
    }

    if (campoNombreSitio) {
        if (!campoNombreSitio.props) {
            campoNombreSitio.props = {};
        }
        campoNombreSitio.props.readonly = true;
    }
}

private buscarCampoSitio(labelEsperado: string, keyIncludes: string[]): FormlyFieldConfig | undefined {
    const normalizar = (valor: string) =>
        valor
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

    const labelNormalizado = normalizar(labelEsperado);

    const porLabel = this.fields.find(field => {
        const label = (field.props?.label || field.templateOptions?.label || '').toString();
        return label && normalizar(label) === labelNormalizado;
    });

    if (porLabel) {
        return porLabel;
    }

    return this.fields.find(field => {
        const key = (field.key || '').toString().toLowerCase();
        return keyIncludes.every(term => key.includes(term));
    });
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
