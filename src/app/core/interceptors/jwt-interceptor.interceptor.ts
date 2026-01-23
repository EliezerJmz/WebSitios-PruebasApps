import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Método que obtendrá el token desde las cookies

    // Configurar headers para aceptar cookies HTTP
    const headers: { [key: string]: string } = {
      'Accept': 'application/json'
    };

    // Solo agregar Content-Type si NO es FormData (para permitir uploads de archivos)
    if (!(req.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Si hay un token, agregarlo al header Authorization
    if (token) {
      // Asegurar que el token tenga el prefijo "Bearer "
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers['Authorization'] = authToken;
    }

    // Clonar la solicitud con configuraciones para cookies HTTP
    const clonedRequest = req.clone({
      setHeaders: headers,
      withCredentials: true // Crucial para recibir y enviar cookies
    });

    return next.handle(clonedRequest);
  }
}
