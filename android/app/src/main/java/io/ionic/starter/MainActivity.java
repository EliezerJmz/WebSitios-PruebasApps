package io.ionic.starter;

import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Configurar WebView para aceptar cookies HTTP
        configureCookiesForDevelopment();
    }
    
    private void configureCookiesForDevelopment() {
        // ⚠️ SOLO PARA DESARROLLO - REMOVER EN PRODUCCIÓN ⚠️
        
        // Habilitar cookies para el WebView
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(this.bridge.getWebView(), true);
        
        // Configuraciones adicionales del WebView
        WebView webView = this.bridge.getWebView();
        WebSettings webSettings = webView.getSettings();
        
        // Habilitar almacenamiento DOM y cookies
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        
        // PELIGRO: Permitir contenido mixto para desarrollo
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Configurar user agent para incluir información de la app
        String currentUserAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(currentUserAgent + " CapacitorApp");
    }
}