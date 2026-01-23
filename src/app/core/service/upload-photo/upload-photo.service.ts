import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';


export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    path: string;
    url: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class UploadPhotoService {

  
  // URL del endpoint para subir archivos usando HTTP
  private apiUrl = 'http://10.175.80.179:3000/archivo/upload';
  //private apiUrl = 'http://localhost:3000/archivo/upload';
  constructor(private http: HttpClient) { }

  /**
   * Toma una foto usando la cámara del dispositivo
   * @returns Promise con la foto tomada
   */
  async takePicture(): Promise<Photo> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });
      return image;
    } catch (error) {
      throw new Error('Error al tomar la foto: ' + error);
    }
  }

  /**
   * Selecciona una foto de la galería
   * @returns Promise con la foto seleccionada
   */
  async pickFromGallery(): Promise<Photo> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });
      return image;
    } catch (error) {
      throw new Error('Error al seleccionar la foto: ' + error);
    }
  }

  /**
   * Sube una foto al servidor
   * @param photo - Foto capturada con Camera plugin
   * @param fileName - Nombre del archivo (opcional)
   * @returns Observable con la respuesta del servidor
   */
  uploadPhoto(photo: Photo, fileName?: string): Observable<UploadResponse> {
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    
    // Convertir base64 a Blob
    const imageBlob = this.base64toBlob(photo.base64String!, photo.format);
    
    // Agregar el archivo al FormData con el nombre 'foto' (como espera el servidor)
    const name = fileName || `photo_${Date.now()}.${photo.format}`;
    const file = new File([imageBlob], name, { type: `image/${photo.format}` });
    formData.append('foto', file);
    
    // Enviar la petición POST
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }

  /**
   * Sube una foto con progreso de carga
   * @param photo - Foto capturada con Camera plugin
   * @param fileName - Nombre del archivo (opcional)
   * @returns Observable que emite progreso (número) o respuesta final
   */
  uploadPhotoWithProgress(photo: Photo, fileName?: string): Observable<number | UploadResponse> {
    const formData = new FormData();
    const imageBlob = this.base64toBlob(photo.base64String!, photo.format);
    const name = fileName || `photo_${Date.now()}.${photo.format}`;
    const file = new File([imageBlob], name, { type: `image/${photo.format}` });
    formData.append('foto', file);

    return this.http.post<UploadResponse>(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((100 * event.loaded) / event.total);
          return progress;
        } else if (event.type === HttpEventType.Response) {
          return event.body!;
        }
        return 0;
      })
    );
  }

  /**
   * Convierte una cadena base64 a Blob
   * @param base64 - Cadena en formato base64
   * @param format - Formato de la imagen (jpeg, png, etc)
   * @returns Blob de la imagen
   */
  private base64toBlob(base64: string, format: string = 'jpeg'): Blob {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([arrayBuffer], { type: `image/${format}` });
  }

  /**
   * Toma una foto y la sube directamente al servidor
   * @param fileName - Nombre opcional del archivo
   * @returns Observable con la respuesta del servidor
   */
  async takePictureAndUpload(fileName?: string): Promise<Observable<UploadResponse>> {
    const photo = await this.takePicture();
    return this.uploadPhoto(photo, fileName);
  }

  /**
   * Selecciona una foto de la galería y la sube al servidor
   * @param fileName - Nombre opcional del archivo
   * @returns Observable con la respuesta del servidor
   */
  async pickFromGalleryAndUpload(fileName?: string): Promise<Observable<UploadResponse>> {
    const photo = await this.pickFromGallery();
    return this.uploadPhoto(photo, fileName);
  }

  /**
   * Obtener URL de una foto del servidor
   * @param filename - Nombre del archivo
   * @returns URL completa de la foto
   */
  getFotoUrl(filename: string): string {
    return `http://10.21.207.179:3000/archivo/foto/${filename}`;
  }

  /**
   * Listar todas las fotos del servidor
   * @returns Observable con la lista de fotos
   */
  listFotos(): Observable<any> {
    return this.http.get('http://10.21.207.179:3000/archivo/list');
  }


}
