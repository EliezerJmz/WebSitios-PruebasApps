import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'WebSitios S.I.',
  webDir: 'dist/web_sitios_s.i',
  
  // ⚠️ SOLO PARA DEBUG/DESARROLLO - REMOVER EN PRODUCCIÓN ⚠️
  server: {
    // PELIGRO: Permite conexiones HTTP no seguras - Solo para desarrollo
    cleartext: true,
    // Forzar HTTP para evitar mixed content issues en desarrollo
    androidScheme: 'http',
    // Opcional: Configurar servidor local específico para desarrollo
     //url: 'http://10.166.61.179:3500', // Se conecta por medio del frontend Angular
    // url: 'http://10.166.61.179:4200',
    // hostname: 'localhost'
  },
  
  // Configuración para permitir cookies HTTPnp
  plugins: {
    CapacitorCookies: {
      enabled: true
    },
    CapacitorHttp: {
      enabled: true
    },
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT", //Tema oscuro pone iconos claros / Tema claro pone iconos oscuros
      backgroundColor: "#B9B9B9",
    }
  },
  
  // ⚠️ CONFIGURACIÓN DE DEBUG PARA ANDROID - REMOVER EN PRODUCCIÓN ⚠️
  android: {
    // PELIGRO: Permite contenido mixto HTTP/HTTPS - Solo para desarrollo
    allowMixedContent: true,
    // Habilita entrada táctil - OK para producción
    captureInput: true,
    // PELIGRO: Habilita debugging de WebView - Solo para desarrollo
    webContentsDebuggingEnabled: true,
    // Configuraciones adicionales para cookies HTTP
    appendUserAgent: 'CapacitorApp',
    backgroundColor: '#ffffff '
  }
};


export default config;
