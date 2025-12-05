import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/service/auth/auth.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    user$ = this.authService.user$; // 🚀 Reactivo al usuario

    constructor(
        private primengConfig: PrimeNGConfig, 
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.authService.initializeSession(); // ✅ Cargar sesión al iniciar la app
        this.setupBackButton();
    }

    private setupBackButton() {
        // Solo configurar en dispositivos nativos
        if (Capacitor.getPlatform() === 'web') return;

        App.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
                // Si no puede retroceder, cerrar la app
                App.exitApp();
            } else {
                // Navegar hacia atrás usando el router de Angular
                window.history.back();
            }
        });
    }
}
