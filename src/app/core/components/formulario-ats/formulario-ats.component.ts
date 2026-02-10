import { Component, OnInit } from '@angular/core';
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



@Component({
    templateUrl: './formulario-ats.component.html',
    styleUrls: ['./formulario-ats.component.scss'],
    providers: [MessageService, ConfirmationService, TableModule, TagModule, RatingModule, ButtonModule, CommonModule, CheckboxModule]
})
export class FormularioAtsComponent  {

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

constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

ngOnInit() {
  
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



/** 

    id: string;
    productDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    parkings: Parking[] = [];
    parking: Parking = {};
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    menuItems: MenuItem[] = [];
    loading = [false, false, false, false];
    status_parkings: { nameStatus: string }[] = [];

    rowsPerPage = 5;
    totalRows = 0;

    get shouldScroll(): boolean {
        return this.totalRows > this.rowsPerPage;
    }

    updateTotalRows() {
        this.totalRows = this.parkings.length;
    }


    constructor(private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService, private parkingService: ParkingService) { }

    getParkingData() {
        this.parkingService.getParkingData()
            .then(data => {
                this.parkings = data;
                this.updateTotalRows();
            })
            .catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer la información de la Base de datos, revisa tu conexión.' }); // Muestra un mensaje de error al usuario
            });
    }

    redirigir() {
        this.router.navigate(['parking-crud/create-parking']);
    }

    statusOptions: SelectItem[] = [];
    selected_drop: SelectItem = { value: '' };

    ngOnInit() {

        this.getParkingData()

        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'availableSlots', header: 'availableslots' },
            { field: 'occupiedSlots', header: 'occupiedslots' },
            { field: 'unavailableSlots', header: 'unavailablslots' },
            { field: 'status', header: 'status' },
            { field: 'actions', header: 'actions' }
        ];

        this.loadStatusOptions();
    }

    loadStatusOptions(): void {
        this.parkingService.getStatusCatalog().subscribe({
            next: (response) => {
                this.status_parkings = response.data
                    .filter((item: StatusItem) => item.isActive)
                    .map((item: StatusItem) => ({
                        nameStatus: item.name,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
    }

    editProduct(parking: Parking) {
        this.parking = { ...parking };
        this.productDialog = true;
    }

    onEdit(id: string) {
        this.parkingService.setParkingId(id);
        this.router.navigate(['parking-crud/edit-parking']);
    }

    onViewParking(id: string) {
        this.parkingService.setParkingId(id);

        this.router.navigate(['parking-crud/view-parking']);
    }

    deleteProduct(parking: Parking) {
        this.confirmDelete(parking);
    }

    deleteParking() {
        if (this.parking.occupiedSlots > 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar el parqueo porque tiene espacios ocupados', life: 3000 });
            return;
        }

        this.parkingService.deleteLocation(this.parking.id).subscribe(
            () => {
                this.parkings = this.parkings.filter(p => p.id !== this.parking.id);
                this.messageService.add({ severity: 'success', summary: 'Hecho', detail: 'Parqueo eliminado con éxito', life: 3000 });
                this.parking = {};
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el parqueo', life: 3000 });
                console.error('Error al eliminar el parqueo', error);
            }
        );
    }




    confirmDelete(parking: Parking) {
        this.parking = parking;
        this.confirmationService.confirm({
            key: 'confirm',
            message: `¿Estás seguro que quieres eliminar el parqueo: ${parking.name}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.deleteParking();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'No se eliminó el parqueo',
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.parkings.length; i++) {
            if (this.parkings[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        table.filter('', 'anyField', 'custom');

        table.filterGlobal(inputValue, 'contains');
    }


    getSeverity(statusOptions: string) {
        switch (statusOptions) {
            case 'ACTIVO':
                return 'success';
            case 'INACTIVO':
                return 'danger';
            default:
                return 'unknown';
        }
    }

*/

}
