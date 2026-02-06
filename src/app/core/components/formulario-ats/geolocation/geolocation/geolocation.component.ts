import { Component, Input, OnInit } from '@angular/core';
// Paso 1: Importar el plugin de Geolocation de Capacitor
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrl: './geolocation.component.scss'
})
export class GeolocationComponent implements OnInit {
   
  // Configuración de google map visibles
  @Input() showMap: boolean = true;
  
  // Paso 2: Definir las propiedades para almacenar las coordenadas
  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  ngOnInit() {
    // Paso 3: Solicitar permisos al iniciar la aplicación
    this.checkPermissions();
  }

  // Paso 4: Verificar y solicitar permisos de geolocalización
  async checkPermissions() {
    try {
      const permission = await Geolocation.checkPermissions();
      
      if (permission.location !== 'granted') {
        const requestPermission = await Geolocation.requestPermissions();
        
        if (requestPermission.location === 'granted') {
          console.log('Permisos de geolocalización concedidos');
        } else {
          this.error = 'Permisos de geolocalización denegados';
        }
      }
    } catch (err) {
      console.error('Error al verificar permisos:', err);
      this.error = 'Error al verificar permisos de geolocalización';
    }
  }

  // Paso 5: Obtener la posición actual del dispositivo
  async getCurrentPosition() {
    this.loading = true;
    this.error = null;
    
    try {
      // Paso 6: Llamar al método getCurrentPosition del plugin
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true, // Solicitar alta precisión
        timeout: 10000, // Timeout de 10 segundos
        maximumAge: 0 // No usar posiciones en caché
      });
      
      // Paso 7: Extraer las coordenadas de la respuesta
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.accuracy = coordinates.coords.accuracy;
      
      console.log('Coordenadas obtenidas:', coordinates);
    } catch (err: any) {
      // Paso 8: Manejar errores
      console.error('Error al obtener la posición:', err);
      this.error = `Error: ${err.message || 'No se pudo obtener la ubicación'}`;
    } finally {
      this.loading = false;
    }
  }


}
