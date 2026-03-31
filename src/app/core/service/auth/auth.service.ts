import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as JwtDecode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private resources: string[] = [];
  private authLogin: string;
  private authLogout: string;
  private authRefresh: string;
  private tokenRefreshInterval: any;

  constructor(
    private http: HttpClient,
    private apiUrlService: ApiUrlService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.authLogin = this.apiUrlService.apiAuthLogin();
    this.authLogout = this.apiUrlService.apiAuthlogout();
    this.authRefresh = this.apiUrlService.apiRefreshToken();
    this.initializeSession();
    this.setupTokenRefresh();
  }

  /** 🔑 Inicia sesión con el backend */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.authLogin, credentials, {
      observe: 'response',
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      tap((response: any) => {
        console.log('📥 Respuesta completa del login:', response);
        console.log('📦 Body de la respuesta:', response.body);
        console.log('🍪 Headers de la respuesta:', response.headers.keys());
        
        // Si el token viene en el body, guardarlo manualmente
        if (response.body?.token) {
          console.log('✅ Token encontrado en el body, guardándolo manualmente');
          this.cookieService.set('jwt-token', response.body.token, {
            path: '/',
            secure: false,
            sameSite: 'Lax'
          });
          if (response.body?.refreshToken) {
            this.cookieService.set('refresh_token', response.body.refreshToken, {
              path: '/',
              secure: false,
              sameSite: 'Lax'
            });
          }
        }
        
        this.setResourcesFromToken();
        this.setupTokenRefresh();
      })
    );
  }

  // En tu AuthService
handleSamlAuthSuccess(token: string, refreshToken: string): void {
    console.log('💾 Guardando tokens de SAML...');
    // Guardar los tokens en cookies (configuración para desarrollo)
    this.cookieService.set('jwt-token', token, {
      path: '/',
      secure: false,  // Para desarrollo HTTP
      sameSite: 'Lax' // Más permisivo para desarrollo
    });

    this.cookieService.set('refresh_token', refreshToken, {
      path: '/',
      secure: false,  // Para desarrollo HTTP  
      sameSite: 'Lax' // Más permisivo para desarrollo
    });
    
    console.log('✅ Tokens guardados correctamente');

    // Actualizar el estado de autenticación
    this.setResourcesFromToken();
    this.userSubject.next(this.getTokenPayload());
  }

  /** 🛡️ Verifica si el usuario está autenticado */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload: any = JwtDecode.jwtDecode(token);
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  /** 🧩 Decodifica el token */
  getTokenPayload(): any | null {
    const token = this.getToken();
    console.log("TOKEN EN PAYLOAD", token);

    if (!token) return null;

    try {
      const payload = JwtDecode.jwtDecode(token);
      // Verifica que el payload tenga la estructura esperada
      if (!payload || typeof payload !== 'object') {
        console.error('Token payload inválido');
        return null;
      }
      return payload;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  /** 🔄 Configura el refresco automático del token */
  private setupTokenRefresh(): void {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }

    this.tokenRefreshInterval = setInterval(() => {
      if (this.shouldRefreshToken()) {
        this.refreshToken().subscribe({
          error: (err) => {
            console.error('Error al refrescar token:', err);
            this.clearSession();
          }
        });
      }
    }, 300000); // Verifica cada 5 minutos
  }

  /** ⏳ Determina si debe refrescarse el token */
  private shouldRefreshToken(): boolean {
    if (!this.isAuthenticated()) return false;

    const payload = this.getTokenPayload();
    const expTime = payload.exp * 1000;
    const now = Date.now();
    const timeLeft = expTime - now;

    return timeLeft < 1800000; // 30 minutos restantes
  }

  /** 🔄 Refresca el token */
  refreshToken(): Observable<any> {
    return this.http.post(this.authRefresh, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.setResourcesFromToken();
      })
    );
  }

  /** 📂 Manejo de recursos del token */
  setResourcesFromToken(): string[] {
    const payload = this.getTokenPayload();
    this.resources = payload?.resources || [];
    this.userSubject.next(payload || null);
    return this.resources;
  }

  getResources(): string[] {
    console.warn('Recursos actuales del usuario:', this.resources);
    return this.resources;
  }

  hasAccessToRoute(slug: string): boolean {
    return this.resources.includes(slug);
  }

  /** 🔑 Obtiene el token desde la cookie */
  getToken(): string | null {
    console.log('🔍 Buscando token en cookies...');
    console.log('🍪 Cookies disponibles:', this.cookieService.getAll());
    console.log('📄 document.cookie:', document.cookie);
    
    // Intentar diferentes nombres de cookies
    const possibleNames = ['jwt-token', 'token', 'access_token', 'accessToken'];
    
    for (const name of possibleNames) {
      const token = this.cookieService.get(name);
      if (token) {
        console.log(`✅ Token encontrado en cookie: ${name}`);
        return token;
      }
    }
    
    console.warn('⚠️ No se encontró ningún token en las cookies');
    console.warn('⚠️ Si el backend usa cookies HttpOnly, no serán accesibles desde JavaScript');
    return null;
  }
  
  getRefreshToken(): string | null {
    return this.cookieService.get('refresh_token') || null;
    }


  /** 🚪 Cierra la sesión */
  logout(): void {
    this.http.post(this.authLogout, {}, {
      withCredentials: true
    }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  /** 🧹 Limpia la sesión */
  public clearSession(): void {
    // Limpiar cookies (para desarrollo) - todos los posibles nombres
    const cookieNames = ['jwt-token', 'token', 'access_token', 'accessToken', 'refresh_token'];
    cookieNames.forEach(name => {
      this.cookieService.delete(name, '/');
    });

    // Limpiar estado local
    this.resources = [];
    this.userSubject.next(null);

    // Detener el refresco automático
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }

    this.router.navigate(['/']);
  }

  /** 🚀 Inicializa la sesión */
// En el AuthService
public initializeSession(): void {
    const token = this.getToken();
    if (token && this.isAuthenticated()) {
      try {
        const payload = this.getTokenPayload();
        this.resources = payload?.resources || [];
        this.userSubject.next(payload || null);

        // Verificar si tenemos los recursos necesarios
        if (!payload || !payload.resources || payload.resources.length === 0) {
          console.warn('Token válido pero sin recursos asignados');
          this.clearSession();
        }
      } catch (error) {
        console.error('Error al inicializar sesión:', error);
        this.clearSession();
      }
    } else {
      this.userSubject.next(null);
    }
  }

  /** ⏳ Obtiene tiempo restante del token */
  getTokenExpirationTime(): string {
    const payload = this.getTokenPayload();
    if (!payload?.exp) return 'Token inválido';

    const expTime = payload.exp * 1000;
    const now = Date.now();
    const timeLeft = expTime - now;

    if (timeLeft <= 0) return 'El token ha expirado';

    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return `Expira en ${minutes} min ${seconds} seg`;
  }
}
