// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  // ⚠️ CONFIGURACIÓN DE API PARA DESARROLLO - CAMBIAR EN PRODUCCIÓN ⚠️
  // URL HTTPS para producción (comentada para desarrollo):
  //apiUrlBase:'https://api.devparqueosrrhh.claro.com.gt/',
  
  // URLs HTTP para desarrollo local (SOLO PARA DEBUG):
  //apiUrlBase:'http://localhost:8080/', // Para emulador solamente
  apiUrlBase:'http://10.204.227.179:8080/', // ipv4 local GIO

  apiVersion:'api/v1/',
  
  // URL HTTPS para login (segura - OK para producción)
  loginOfficeUrl: 'https://api.devparqueosrrhh.claro.com.gt/api/v1/auth/saml/login',
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
