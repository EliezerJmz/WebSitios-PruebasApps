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
// formly
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormATSService } from '../../service/formATS/form-ats.service';
import { PublishedFormsService } from '../../service/publishedForms/published-forms.service';
// recursos del token
import { AuthService } from '../../service/auth/auth.service';
// rutas
import { Router } from '@angular/router';

@Component({
    templateUrl: './formulario-reporte-accidentes.component.html',
    styleUrls: ['./formulario-reporte-accidentes.component.scss'],
    providers: [MessageService, ConfirmationService, TableModule, TagModule, RatingModule, ButtonModule, CommonModule, CheckboxModule]
})
export class FormularioReporteAccidentesComponent implements AfterViewInit, OnInit {

    // Propiedades formly para Reporte de Accidentes
    form = new FormGroup({});
    model: any = {};
    options: FormlyFormOptions = {
        formState: {
            awesomeIsForced: false,
        },
    };

    fields: FormlyFieldConfig[] = [];
    formularioId = '';

    isLoading = true;

    // Modo edición (formulario rechazado)
    modoEdicion: boolean = false;
    respuestaId: string = '';
    answersEdicion: any = null;

    // Modo visualización (solo lectura)
    modoVisualizacion: boolean = false;

    // Dialog de información
    showInfoDialog: boolean = false;

    // Dialog de mensaje de edición
    showMensajeEdicionDialog: boolean = false;

    // Validación de campos requeridos pendientes
    showValidationPanel: boolean = false;
    camposRequeridosPendientes: string[] = [];

    userResponse: UserById;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private userByIdService: UserByIdService,
        private formularioService: FormATSService,
        private cdr: ChangeDetectorRef,
        private publishedFormsService: PublishedFormsService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const state = history.state;
        if (state?.modoEdicion) {
            this.modoEdicion = true;
            this.respuestaId = state.respuestaId;
            this.answersEdicion = state.answers ?? null;
        }
        if (state?.modoVisualizacion) {
            this.modoVisualizacion = true;
            this.answersEdicion = state.answers ?? null;
        }
        this.getUserById();
        this.obtenerFormulariosPublicados();
    }

    obtenerFormulariosPublicados() {
        this.publishedFormsService.getPublishedForms('PUBLISHED').subscribe({
            next: (response) => {
                console.warn('Formularios publicados (nombres):', response.data.map((f: any) => f.nombre));
                const formulario = response.data.find((form: any) =>
                    form.estado === 'PUBLISHED' &&
                    (
                        (form.nombre || '').toUpperCase().includes('ACCIDENTE') ||
                        (form.nombre || '').toUpperCase() === 'REPORTE_ACCIDENTES'
                    )
                );
                this.formularioId = formulario?.id || '';
                console.warn('Formulario encontrado:', formulario?.nombre, '| ID:', this.formularioId);
                if (this.formularioId) {
                    this.cargarFormulario();
                } else {
                    console.error('No se encontró el formulario Reporte de Accidentes publicado');
                    this.isLoading = false;
                }
            },
            error: (error) => {
                console.error('Error al obtener formularios publicados:', error);
                this.isLoading = false;
            }
        });
    }

    cargarFormulario() {
        this.formularioService.getFormularioATS(this.formularioId).subscribe({
            next: (res) => {
                this.fields.push(...res.data.campos);
                this.aplicarValidacionTextarea(this.fields);
                this.aplicarValidacionInput(this.fields);
                this.isLoading = false;
                console.warn('FORM REPORTE ACCIDENTES - campos cargados:', res.data.campos.length);
                console.warn('FORM REPORTE ACCIDENTES - typeforms/categorias:', res.data.campos.map((f: any) => ({ typeform: f.typeform, category: f.category, key: f.key })));
                this.actualizarCampoIVR();
                this.actualizarCampoEmpresaNombre();
                if (this.modoEdicion && this.answersEdicion) {
                    this.model = { ...this.answersEdicion };
                    this.convertirFechasEnModel();
                }
                if (this.modoVisualizacion && this.answersEdicion) {
                    this.model = { ...this.answersEdicion };
                    this.convertirFechasEnModel();
                    this.marcarTodosLosCamposComoReadonly();
                }
                if (!this.modoVisualizacion) {
                    this.ocultarCamposGeolocation();
                }
            },
            error: (error) => {
                console.error('Error al cargar formulario:', error);
                this.isLoading = false;
            }
        });
    }

    private aplicarValidacionTextarea(fields: FormlyFieldConfig[]): void {
        fields.forEach(field => {
            if (field.type === 'textarea') {
                field.props = { ...field.props, maxLength: 250 };
                field.validation = { ...field.validation, messages: { maxlength: 'No puede superar los 250 caracteres.' } };
            }
            if (field.fieldGroup?.length) {
                this.aplicarValidacionTextarea(field.fieldGroup);
            }
        });
    }

    private aplicarValidacionInput(fields: FormlyFieldConfig[]): void {
        fields.forEach(field => {
            if (field.type === 'input') {
                field.props = { ...field.props, maxLength: 75 };
                field.validation = { ...field.validation, messages: { maxlength: 'No puede superar los 75 caracteres.' } };
            }
            if (field.fieldGroup?.length) {
                this.aplicarValidacionInput(field.fieldGroup);
            }
        });
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    // ── Funciones de filtrado por typeform / category ──────────────────────────

    getFilteredFieldsLugarAccidente() {
        return this.fields.filter(field =>
            (field as any).typeform === 'REPORTE_ACCIDENTES' &&
            (field as any).category === 'LUGAR_ACCIDENTE'
        );
    }

    getFilteredFieldsDatosColaborador() {
        return this.fields.filter(field =>
            (field as any).typeform === 'REPORTE_ACCIDENTES' &&
            (field as any).category === 'DATOS_COLABORADOR_IVR'
        );
    }

    getFilteredFieldsDatosColaboradorContratista() {
        const campos = this.getFilteredFieldsDatosColaborador();
        const splitIndex = this.getColaboradorClaroSplitIndex(campos);
        return campos.slice(0, splitIndex);
    }

    getFilteredFieldsDatosColaboradorClaro() {
        const campos = this.getFilteredFieldsDatosColaborador();
        const splitIndex = this.getColaboradorClaroSplitIndex(campos);
        return campos.slice(splitIndex);
    }

    private getColaboradorClaroSplitIndex(fields: FormlyFieldConfig[]): number {
        const normalizar = (v: string) =>
            (v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        const idx = fields.findIndex(field => {
            const label = normalizar(String(field.props?.label || ''));
            const key   = normalizar(String(field.key   || ''));
            return label.includes('colaborador claro') || key.includes('colaborador_claro');
        });
        return idx !== -1 ? idx : fields.length;
    }

    getFilteredFieldsCondicionesAmbientales() {
        return this.fields.filter(field =>
            (field as any).typeform === 'REPORTE_ACCIDENTES' &&
            (field as any).category === 'CONDICIONES_AMBIENTALES'
        );
    }

    getFilteredFieldsDatosOcurrencia() {
        return this.fields.filter(field =>
            (field as any).typeform === 'REPORTE_ACCIDENTES' &&
            (field as any).category === 'DATOS_OCURRENCIA'
        );
    }

    getFilteredFieldsAnalisisPreliminar() {
        return this.fields.filter(field =>
            (field as any).typeform === 'REPORTE_ACCIDENTES' &&
            (field as any).category === 'ANALISIS_PRELIMINAR'
        );
    }

    getFilteredFieldsDescripcionAccidente() {
        return this.fields.filter(field =>
            (field as any).typeform === 'REPORTE_ACCIDENTES' &&
            (field as any).category === 'DESCRIPCION_ACCIDENTE'
        );
    }

    // ── Submit / Edit ──────────────────────────────────────────────────────────

    onSubmitAnswers() {
        if (this.form.valid) {
            const userId = this.authService.getTokenPayload()?.userId ?? '';
            this.formularioService.submitFormAnswersATS(this.formularioId, this.model, { submittedAt: new Date().toISOString() }, userId).subscribe({
                next: (response) => { console.log('Formulario Reporte Accidentes enviado:', response); },
                error: (error) => { console.error('Error al enviar:', error); }
            });
        }
    }

    onEditAnswers() {
        if (this.form.valid) {
            const userId = this.authService.getTokenPayload()?.userId ?? '';
            this.formularioService.editFormAnswersATS(this.respuestaId, this.model, { submittedAt: new Date().toISOString(), usuarioId: userId }).subscribe({
                next: (response) => { console.log('Formulario editado:', response); },
                error: (error) => { console.error('Error al editar:', error); }
            });
        }
    }

    validarRespuestas() {
        const collectRequiredFields = (fields: FormlyFieldConfig[]): FormlyFieldConfig[] => {
            return fields.reduce((acc: FormlyFieldConfig[], field) => {
                if (field.props?.required && field.key) acc.push(field);
                if (field.fieldGroup) acc.push(...collectRequiredFields(field.fieldGroup));
                return acc;
            }, []);
        };
        const requiredFields = collectRequiredFields(this.fields);
        this.camposRequeridosPendientes = requiredFields
            .filter(field => {
                const key = String(field.key);
                const value = field.hide ? this.model[key] : this.form.get(key)?.value;
                if (field.type === 'checkbox') return value !== true;
                return value === null || value === undefined || value === '';
            })
            .map(field => String(field.props?.label || field.key || ''));
        this.showValidationPanel = true;
    }

    get allRequiredCheckboxesChecked(): boolean {
        const collectCheckboxFields = (fields: FormlyFieldConfig[]): FormlyFieldConfig[] => {
            return fields.reduce((acc: FormlyFieldConfig[], field) => {
                if (field.type === 'checkbox' && field.props?.required) acc.push(field);
                if (field.fieldGroup) acc.push(...collectCheckboxFields(field.fieldGroup));
                return acc;
            }, []);
        };
        const requiredCheckboxes = collectCheckboxFields(this.fields);
        if (requiredCheckboxes.length === 0) return true;
        return requiredCheckboxes.every(field => this.form.get(String(field.key))?.value === true);
    }

    redirectFormulariosEnviados() {
        this.router.navigate(['formularios-enviados']);
    }

    confirmSubmitForm() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Desea enviar el Formulario Reporte de Accidentes?',
            header: 'Confirmar Envío',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.modoEdicion ? this.onEditAnswers() : this.onSubmitAnswers();
                this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Formulario enviado', life: 1000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Envío cancelado', life: 2000 });
            }
        });
    }

    confirmCancelForm() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Desea borrar el formulario?',
            header: 'Confirmar Borrado',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.form.reset();
                this.model = {};
                this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Formulario borrado', life: 1000 });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Borrado cancelado', life: 2000 });
            }
        });
    }

    getUserById() {
        const userId = this.authService.getTokenPayload()?.userId;
        if (userId) {
            this.userByIdService.getUserById(userId).subscribe({
                next: (response) => {
                    this.userResponse = response;
                    this.actualizarCampoIVR();
                    this.actualizarCampoEmpresaNombre();
                },
                error: (error) => { console.error('Error al obtener datos del usuario:', error); }
            });
        }
    }

    actualizarCampoIVR() {
        if (this.fields.length === 0 || !this.userResponse?.data?.codigoIVR) return;
        const campoIVR = this.fields.find(field => field.key && String(field.key).toLowerCase().includes('_ivr'));
        if (campoIVR) {
            campoIVR.defaultValue = this.userResponse.data.codigoIVR;
            this.model[String(campoIVR.key)] = this.userResponse.data.codigoIVR;
            if (!campoIVR.props) campoIVR.props = {};
            campoIVR.props.readonly = true;
        }
    }

    actualizarCampoEmpresaNombre() {
        if (this.fields.length === 0 || !this.userResponse?.data?.empresaNombre) return;
        const campoEmpresa = this.fields.find(field => field.key && String(field.key).toLowerCase().includes('_empresa'));
        if (campoEmpresa) {
            campoEmpresa.defaultValue = this.userResponse.data.empresaNombre;
            this.model[String(campoEmpresa.key)] = this.userResponse.data.empresaNombre;
            if (!campoEmpresa.props) campoEmpresa.props = {};
            campoEmpresa.props.readonly = true;
        }
    }

    private ocultarCamposGeolocation() {
        ['latitud', 'longitud', 'precision'].forEach(term => {
            const campo = this.fields.find(field => field.key && String(field.key).toLowerCase().includes(term));
            if (campo) campo.hide = true;
        });
    }

    private marcarTodosLosCamposComoReadonly() {
        const marcar = (fields: FormlyFieldConfig[]) => {
            fields.forEach(field => {
                if (!field.props) field.props = {};
                field.props.readonly = true;
                if (field.fieldGroup) marcar(field.fieldGroup);
            });
        };
        marcar(this.fields);
    }

    private convertirFechasEnModel() {
        this.fields.forEach(field => {
            if ((field.type === 'calendar' || field.type === 'datepicker') && field.key) {
                const key = String(field.key);
                const value = this.model[key];
                if (value && typeof value === 'string') {
                    this.model[key] = new Date(value);
                }
            }
        });
    }

    // ── Accordion scroll ───────────────────────────────────────────────────────

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const accordionHeader = target.closest('.p-accordion-header') as HTMLElement;
        if (accordionHeader) {
            const isMobile = window.innerWidth < 768;
            const delay = isMobile ? 500 : 300;
            setTimeout(() => {
                const topbar = document.querySelector('.layout-topbar') as HTMLElement;
                const menuHeight = topbar ? topbar.offsetHeight : 100;
                const margin = isMobile ? 65 : 15;
                const offset = menuHeight + margin;
                const rect = accordionHeader.getBoundingClientRect();
                const pageYOffset = window.pageYOffset || 0;
                const docElementScrollTop = document.documentElement.scrollTop || 0;
                const bodyScrollTop = document.body.scrollTop || 0;
                const currentScroll = Math.max(pageYOffset, docElementScrollTop, bodyScrollTop);
                const absolutePosition = rect.top + currentScroll;
                const targetPosition = Math.max(0, absolutePosition - offset);
                const startPosition = currentScroll;
                const distance = targetPosition - startPosition;
                const duration = 400;
                let startTime: number | null = null;
                const smoothScrollStep = (currentTime: number) => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    const newPosition = startPosition + (distance * ease);
                    if (bodyScrollTop > 0 || isMobile) document.body.scrollTop = newPosition;
                    if (docElementScrollTop > 0 || !isMobile) document.documentElement.scrollTop = newPosition;
                    if (progress < 1) requestAnimationFrame(smoothScrollStep);
                };
                requestAnimationFrame(smoothScrollStep);
            }, delay);
        }
    }
}
