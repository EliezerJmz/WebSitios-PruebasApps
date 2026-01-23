import { Component } from '@angular/core';
import { UploadPhotoService, UploadResponse } from 'src/app/core/service/upload-photo/upload-photo.service';
import { Photo } from '@capacitor/camera';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,

  ],
  templateUrl: './upload-photo.component.html',
  styleUrl: './upload-photo.component.scss'
})
export class UploadPhotoComponent {

  uploading: boolean = false;
  selectedPhoto: Photo | null = null;
  previewUrl: string | null = null;

  constructor(
    private uploadPhotoService: UploadPhotoService,
    private messageService: MessageService
  ) {}

  /**
   * Toma una foto con la cámara
   */
  async takePhoto() {
    try {
      this.selectedPhoto = await this.uploadPhotoService.takePicture();
      this.previewUrl = `data:image/${this.selectedPhoto.format};base64,${this.selectedPhoto.base64String}`;
      this.messageService.add({
        severity: 'success',
        summary: 'Foto capturada',
        detail: 'Foto tomada correctamente'
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al tomar la foto'
      });
    }
  }

  /**
   * Selecciona una foto de la galería
   */
  async selectFromGallery() {
    try {
      this.selectedPhoto = await this.uploadPhotoService.pickFromGallery();
      this.previewUrl = `data:image/${this.selectedPhoto.format};base64,${this.selectedPhoto.base64String}`;
      this.messageService.add({
        severity: 'success',
        summary: 'Foto seleccionada',
        detail: 'Foto cargada correctamente'
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al seleccionar la foto'
      });
    }
  }

  /**
   * Sube la foto seleccionada al servidor
   */
  uploadPhoto() {
    if (!this.selectedPhoto) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Primero debes tomar o seleccionar una foto'
      });
      return;
    }

    this.uploading = true;
    this.uploadPhotoService.uploadPhoto(this.selectedPhoto).subscribe({
      next: (response: UploadResponse) => {
        this.uploading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Foto subida: ${response.data.filename}`
        });
        console.log('Respuesta del servidor:', response);
        console.log('URL de la foto:', response.data.url);
        this.clearPhoto();
      },
      error: (error) => {
        this.uploading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al subir la foto: ' + (error.error?.message || error.message || 'Error desconocido')
        });
        console.error('Error al subir:', error);
      }
    });
  }

  /**
   * Toma foto y sube directamente
   */
  async takeAndUpload() {
    try {
      const photo = await this.uploadPhotoService.takePicture();
      this.selectedPhoto = photo;
      this.previewUrl = `data:image/${photo.format};base64,${photo.base64String}`;
      this.uploadPhoto();
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Error al procesar la foto'
      });
    }
  }

  /**
   * Limpia la foto seleccionada
   */
  clearPhoto() {
    this.selectedPhoto = null;
    this.previewUrl = null;
  }

}
