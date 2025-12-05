import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { UserService } from 'src/app/core/service/user.service';
import { NotificationsService } from 'src/app/core/service/notifications.service';

@Component({
    selector: 'app-edit-user',
    standalone: false,
    templateUrl: './edit-user.component.html',
    styleUrl: './edit-user.css',
    providers: [MessageService, ConfirmationService, InputMaskModule],
})
export class EditUserComponent implements OnInit {
    id: string;
    roles: { label: string; value: string }[] = [];
    statusOptions: { nameStatus: string }[] = [];
    userPreferences: any[] = [];

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private notificationsService: NotificationsService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.id = this.userService.getUserId() || localStorage.getItem('userId');
        localStorage.setItem('userId', this.id);
        this.loadUserPreferences(this.id);

        this.loadRoles();
        this.loadStatusOptions();

        this.userService.getUser(this.id).subscribe((response) => {
            this.formularioUsers.patchValue({
                name: response.data.name,
                username: response.data.username,
                email: response.data.email,
                phone: response.data.phone,
                status: response.data.status,
                role: response.data.role.id,
            });
        });
    }

    loadUserPreferences(userId: string) {
        this.notificationsService.getUserPreferences(userId).subscribe(
            (data) => {
                if (
                    data &&
                    data.notificationPreferences &&
                    Array.isArray(data.notificationPreferences)
                ) {
                    this.userPreferences = data.notificationPreferences;

                    //console.log('Preferencias cargadas:', this.userPreferences);
                } else {
                    console.error('Estructura inesperada en la respuesta:', data);
                }
            },
            (error) => {
                console.error('Error al obtener las preferencias del usuario:', error);
            }
        );
    }

    userHasActivePreferences(): boolean {
        return this.userPreferences.some((pref) => pref.enable === true);
    }

    loadRoles(): void {
        this.userService
            .getRolData()
            .then((data) => {
                this.roles = data
                    .filter((role) => role.status !== 'INACTIVO')
                    .map((role) => ({ label: role.name, value: role.id }));
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            });
    }

    loadStatusOptions(): void {
        this.userService.getStatusCatalog().subscribe({
            next: (response) => {
                this.statusOptions = response.data
                    .filter((item: any) => item.isActive)
                    .map((item: any) => ({
                        nameStatus: item.name,
                        value: item.name,
                    }));

                // console.log('Opciones de estado cargadas:', this.statusOptions);
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    redirect() {
        localStorage.removeItem('userId');
        this.router.navigate(['users']);
    }

    status: SelectItem[] = [];

    phonePattern = /^[0-9\s*+\-(),]*$/;
    emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    formularioUsers = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(75)]),
        username: new FormControl('', [
            Validators.required,
            Validators.maxLength(75),
        ]),
        phone: new FormControl('', [
            Validators.maxLength(50),
            Validators.pattern(this.phonePattern),
            Validators.required,

        ]),
        email: new FormControl('', [
            Validators.required,
            Validators.pattern(this.emailPattern),
            Validators.maxLength(50),
        ]),
        status: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
    });

    getFormData(): any {
        return this.formularioUsers.value;
    }

    validateForm(): boolean {
        if (this.formularioUsers.valid) {
            return true;
        } else {
            this.markFormGroupTouched(this.formularioUsers);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Formulario inválido. Por favor, revisa los campos.',
            });
            return false;
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    submitForm() {
        if (this.validateForm()) {
            const formData = this.getFormData();

            if (formData.status === 'INACTIVO' && this.userHasActivePreferences()) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Acción no permitida',
                    detail:
                        'No puedes cambiar el estado del usuario a inactivo mientras tenga preferencias de notificaciones activas.',
                });
                return;
            }

            this.userService.updateUser(this.id, formData).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario editado exitosamente.',
                        life: 1000,
                    });
                    setTimeout(() => {
                        this.redirect();
                    }, 1500);
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al editar el usuario.',
                    });
                }
            );
        } else {
            console.error('Formulario inválido');
        }
    }
      confirm2() {
        this.confirmationService.confirm({
            key: 'confirm2',
            message: '¿Estás segur@ de actualizar el usuario?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.submitForm();
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la acción' });
            }
        });
    }

    confirm3() {
        this.confirmationService.confirm({
            key: 'confirm3',
            message: '¿Estas seguro que quieres salir?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.redirect()
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has Cancelado la acción' });
            }
        });

    }
}
