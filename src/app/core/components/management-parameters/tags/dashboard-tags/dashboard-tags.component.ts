import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TagsService } from 'src/app/core/service/tags/tags.service';
import { TagResponse, Tags } from 'src/app/core/api/tags/tags';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { StatusItem } from 'src/app/core/api/management-catalog/catalog';

@Component({
    selector: 'app-dashboard-tags',
    templateUrl: './dashboard-tags.component.html',
    styleUrls: ['./dashboard-tags.css'],
    providers: [MessageService, ConfirmationService],
    standalone: false,
})
export class DashboardTagsComponent implements OnInit {
    groups: Tags;
    cols: any[] = [];
    formTags: FormGroup;
    TagsDetail: boolean = false;
    statusOptions: { nameStatus: string }[] = [];

    constructor(
        private tagsService: TagsService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.formTags = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
        });

        this.cols = [
            { field: 'name', header: 'Nombre' },
            { field: 'description', header: 'Descripción' },
            { field: 'status', header: 'Estado' },
            { field: 'actions', header: 'Acciones' },
        ];

        this.loadGroups();
        this.loadStatusOptions();
    }

    loadStatusOptions(): void {
        this.tagsService.getStatusCatalog().subscribe({
            next: (response) => {
                this.statusOptions = response.data
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

    getSeverity(status: string) {
        switch (status) {
            case 'ACTIVO':
                return 'success';
            case 'INACTIVO':
                return 'danger';
            default:
                return 'unknown';
        }
    }

    loadGroups() {
        this.tagsService.getTagsData(20, 1).subscribe(
            (response: TagResponse) => {
                this.groups = response.data;
                // console.log('Grupos cargados:', this.groups);

            },
            (error) => {
                console.error('Error al obtener los grupos:', error);
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value
            .trim()
            .toLowerCase();
        table.filter('', 'anyField', 'custom');
        table.filterGlobal(inputValue, 'contains');
    }

    onAddNewGroup() {
        this.router.navigate(['/management-parameters/create-tags']);
    }

    onEdit(tag: Tags) {
        this.tagsService.setTagsId(tag.id);
        this.router.navigate(['/management-parameters/edit-tags']);
    }

    onView(tag: Tags) {
        this.tagsService.getTags(tag.id).subscribe({
            next: (response: TagResponse) => {
                const tagData = response.data;
                if (tagData) {
                    this.formTags.patchValue({
                        name: tagData.name,
                        description: tagData.description,
                        status: tagData.status,
                    });
                    //console.log('Formulario actualizado:', this.formTags.value);

                    this.TagsDetail = true;
                }
            },
            error: (error) => {
                console.error('Error al obtener el tag:', error);
            },
        });
    }

    hideDialog() {
        this.TagsDetail = false;
    }

    onDelete(group: Tags) {
        this.confirmationService.confirm({
            key: 'confirmDeleteTag',
            message: `¿Estás seguro de que deseas eliminar el grupo "${group.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.tagsService.deleteTags(group.id).subscribe(
                    () => {
                        this.loadGroups();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Grupo eliminado exitosamente!',
                        });
                    },
                    () => {
                        //console.error('Error al eliminar el grupo:', error);

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail:
                                'No se puede eliminar el grupo, porque tiene usuarios asignados.',
                        });
                    }
                );
            },
        });
    }
}
