/**
 * Archivo principal del plugin POS Facturación
 * Orquesta todos los módulos y maneja la inicialización
 * assets/js/pos-billing.js
 */

// Objeto principal del plugin
window.POSBilling = {
    modules: {},
    config: {},
    initialized: false,
    version: '2.1.1',
    
    /**
     * Inicializar el plugin completo
     */
    init: function() {
        if (this.initialized) {
            console.log('🔄 POS Facturación ya está inicializado');
            return;
        }
        
        console.log('🚀 Inicializando POS Facturación v' + this.version + '...');
        
        try {
            // Cargar configuración
            this.loadConfig();
            
            // Verificar dependencias
            if (!this.checkDependencies()) {
                console.error('❌ Faltan dependencias críticas');
                return false;
            }
            
            // Inicializar módulos
            this.initModules();
            
            // Configurar eventos principales
            this.setupMainEvents();
            
            // Configurar manejo global de errores
            this.setupErrorHandling();
            
            this.initialized = true;
            console.log('✅ POS Facturación inicializado correctamente');
            
            // Notificar inicialización exitosa
            if (this.modules.utils) {
                this.modules.utils.log('Plugin inicializado correctamente', 'success', {
                    version: this.version,
                    modules: Object.keys(this.modules),
                    config: this.config
                });
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando POS Facturación:', error);
            return false;
        }
    },
    
    /**
     * Cargar configuración desde WordPress
     */
    loadConfig: function() {
        this.config = {
            debug: window.pos_billing_ajax?.debug?.wp_debug || false,
            ajaxUrl: window.pos_billing_ajax?.ajax_url || '/wp-admin/admin-ajax.php',
            nonce: window.pos_billing_ajax?.nonce || '',
            restNonce: window.pos_billing_ajax?.rest_nonce || '',
            apiUrl: window.pos_billing_ajax?.api_url || '',
            userInfo: window.pos_billing_ajax?.user_info || {},
            settings: window.pos_billing_ajax?.settings || {},
            version: this.version,
            timestamp: Date.now()
        };
        
        // Validar configuración crítica
        if (!this.config.ajaxUrl) {
            console.warn('⚠️ AJAX URL no configurada, usando fallback');
            this.config.ajaxUrl = '/wp-admin/admin-ajax.php';
        }
        
        if (this.config.debug) {
            console.log('📋 Configuración cargada:', this.config);
        }
    },
    
    /**
     * Verificar que las dependencias estén disponibles
     */
    checkDependencies: function() {
        const requiredClasses = [
            'POSBillingUtils',
            'POSBillingClients', 
            'POSBillingCalculations',
            'POSBillingPopupManager',
            'POSBillingFormHandler',
            'POSBillingCFDICreator'
        ];
        
        const missingDependencies = [];
        
        requiredClasses.forEach(className => {
            if (typeof window[className] === 'undefined') {
                missingDependencies.push(className);
            }
        });
        
        if (missingDependencies.length > 0) {
            console.error('❌ Dependencias faltantes:', missingDependencies);
            console.log('💡 Asegúrate de que todos los módulos estén cargados antes del archivo principal');
            return false;
        }
        
        console.log('✅ Todas las dependencias están disponibles');
        return true;
    },
    
    /**
     * Inicializar todos los módulos
     */
    initModules: function() {
        console.log('🔧 Inicializando módulos...');
        
        try {
            // Inicializar utilidades primero (otros módulos dependen de él)
            if (typeof POSBillingUtils !== 'undefined') {
                this.modules.utils = new POSBillingUtils(this.config);
                console.log('✅ Utils inicializado');
            }
            
            // Inicializar gestión de popup
            if (typeof POSBillingPopupManager !== 'undefined') {
                this.modules.popupManager = new POSBillingPopupManager(this.config);
                console.log('✅ PopupManager inicializado');
            }
            
            // Inicializar gestión de clientes
            if (typeof POSBillingClients !== 'undefined') {
                this.modules.clients = new POSBillingClients(this.config);
                console.log('✅ Clients inicializado');
            }
            
            // Inicializar cálculos
            if (typeof POSBillingCalculations !== 'undefined') {
                this.modules.calculations = new POSBillingCalculations(this.config);
                console.log('✅ Calculations inicializado');
            }
            
            // Inicializar manejo de formularios
            if (typeof POSBillingFormHandler !== 'undefined') {
                this.modules.formHandler = new POSBillingFormHandler(this.config, this.modules);
                console.log('✅ FormHandler inicializado');
            }
            
            // Inicializar creador de CFDI
            if (typeof POSBillingCFDICreator !== 'undefined') {
                this.modules.cfdiCreator = new POSBillingCFDICreator(this.config, this.modules);
                console.log('✅ CFDICreator inicializado');
            }
            
            console.log(`✅ ${Object.keys(this.modules).length} módulos inicializados correctamente`);
            
        } catch (error) {
            console.error('❌ Error inicializando módulos:', error);
            throw error;
        }
    },
    
    /**
     * Configurar eventos principales del plugin
     */
    setupMainEvents: function() {
        console.log('🔗 Configurando eventos principales...');
        
        // Configurar botón principal de facturación
        this.setupBillingButton();
        
        // Configurar eventos de teclado globales
        this.setupKeyboardShortcuts();
        
        // Configurar eventos de visibilidad de página
        this.setupVisibilityEvents();
        
        console.log('✅ Eventos principales configurados');
    },
    
    /**
     * Configurar botón principal de facturación
     */
    setupBillingButton: function() {
        const billingBtn = document.getElementById("pos-billing-btn");
        
        if (!billingBtn) {
            console.log('ℹ️ Botón de facturación no encontrado en esta página');
            return;
        }
        
        // Evento principal de click
        billingBtn.addEventListener("click", (event) => {
            event.preventDefault();
            this.openBillingModule();
        });
        
        // Efectos visuales
        billingBtn.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-2px)";
            this.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
        });
        
        billingBtn.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
        });
        
        // Mejorar accesibilidad
        billingBtn.setAttribute('aria-label', 'Abrir módulo de facturación CFDI');
        billingBtn.setAttribute('title', 'Generar nueva factura CFDI 4.0');
        
        console.log('✅ Botón de facturación configurado');
    },
    
    /**
     * Configurar atajos de teclado globales
     */
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (event) => {
            // Ctrl + Alt + F para abrir facturación
            if (event.ctrlKey && event.altKey && event.key === 'f') {
                event.preventDefault();
                this.openBillingModule();
            }
            
            // Ctrl + Alt + D para toggle debug
            if (event.ctrlKey && event.altKey && event.key === 'd') {
                event.preventDefault();
                this.toggleDebugMode();
            }
            
            // Ctrl + Alt + I para mostrar info del plugin
            if (event.ctrlKey && event.altKey && event.key === 'i') {
                event.preventDefault();
                this.showPluginInfo();
            }
        });
        
        console.log('✅ Atajos de teclado configurados (Ctrl+Alt+F, Ctrl+Alt+D, Ctrl+Alt+I)');
    },
    
    /**
     * Configurar eventos de visibilidad de página
     */
    setupVisibilityEvents: function() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.log('Página oculta, pausando operaciones no críticas');
            } else {
                this.log('Página visible, reanudando operaciones');
                
                // Verificar estado de popup si existe
                if (this.modules.popupManager && this.modules.popupManager.isPopupOpen()) {
                    this.modules.popupManager.popup.focus();
                }
            }
        });
    },
    
    /**
     * Configurar manejo global de errores
     */
    setupErrorHandling: function() {
        // Capturar errores JavaScript no manejados
        window.addEventListener('error', (event) => {
            if (event.filename && event.filename.includes('pos-billing')) {
                this.log(`Error JavaScript: ${event.message}`, 'error', {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error
                });
                
                // Mostrar notificación al usuario si es crítico
                if (this.modules.utils && event.message.includes('is not defined')) {
                    this.modules.utils.showNotification(
                        'Error de carga del plugin. Recarga la página.',
                        'error',
                        10000
                    );
                }
            }
        });
        
        // Capturar promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.toString().includes('pos_billing')) {
                this.log(`Promesa rechazada: ${event.reason}`, 'error');
                event.preventDefault(); // Evitar que aparezca en consola
            }
        });
        
        console.log('✅ Manejo de errores configurado');
    },
    
    /**
     * Abrir módulo de facturación
     */
    openBillingModule: function() {
        this.log('Abriendo módulo de facturación...');
        
        // Verificar que el usuario pueda usar el plugin
        if (!this.canUserCreateInvoices()) {
            this.showPermissionError();
            return;
        }
        
        // Verificar que la API esté configurada
        if (!this.isAPIConfigured()) {
            this.showConfigurationError();
            return;
        }
        
        // Abrir popup de facturación
        if (this.modules.popupManager) {
            this.modules.popupManager.openBillingPopup();
        } else {
            console.error('❌ PopupManager no disponible');
            alert('Error: Módulo de popup no disponible. Recarga la página.');
        }
    },
    
    /**
     * Verificar si el usuario puede crear facturas
     */
    canUserCreateInvoices: function() {
        return this.config.userInfo?.can_create_invoices || false;
    },
    
    /**
     * Verificar si la API está configurada
     */
    isAPIConfigured: function() {
        return this.config.settings?.api_configured || false;
    },
    
    /**
     * Mostrar error de permisos
     */
    showPermissionError: function() {
        const message = 'No tienes permisos para crear facturas. Contacta al administrador.';
        
        if (this.modules.utils) {
            this.modules.utils.showNotification(message, 'error', 8000);
        } else {
            alert(message);
        }
        
        this.log('Acceso denegado por permisos insuficientes', 'warn');
    },
    
    /**
     * Mostrar error de configuración
     */
    showConfigurationError: function() {
        const message = 'La API de Factura.com no está configurada. Contacta al administrador.';
        
        if (this.modules.utils) {
            this.modules.utils.showNotification(message, 'warning', 10000);
        } else {
            alert(message);
        }
        
        this.log('Acceso denegado por API no configurada', 'warn');
    },
    
    /**
     * Toggle modo debug
     */
    toggleDebugMode: function() {
        this.config.debug = !this.config.debug;
        
        const status = this.config.debug ? 'activado' : 'desactivado';
        console.log(`🔧 Modo debug ${status}`);
        
        if (this.modules.utils) {
            this.modules.utils.showNotification(
                `Modo debug ${status}`,
                'info',
                3000
            );
        }
    },
    
    /**
     * Mostrar información del plugin
     */
    showPluginInfo: function() {
        const info = this.getPluginInfo();
        
        if (this.modules.utils) {
            console.table(info);
            this.modules.utils.showNotification(
                `POS Facturación v${this.version} - Info mostrada en consola`,
                'info',
                5000
            );
        } else {
            alert(`POS Facturación v${this.version}\nMódulos: ${Object.keys(this.modules).length}\nVer consola para más detalles`);
            console.log('📋 Información del plugin:', info);
        }
    },
    
    /**
     * Obtener información completa del plugin
     */
    getPluginInfo: function() {
        return {
            version: this.version,
            initialized: this.initialized,
            modules: Object.keys(this.modules),
            config: {
                debug: this.config.debug,
                ajaxUrl: this.config.ajaxUrl,
                apiConfigured: this.isAPIConfigured(),
                userCanCreateInvoices: this.canUserCreateInvoices()
            },
            user: {
                loggedIn: this.config.userInfo?.logged_in || false,
                displayName: this.config.userInfo?.display_name || 'Desconocido',
                roles: this.config.userInfo?.roles || []
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled,
                onlineStatus: navigator.onLine
            },
            performance: {
                loadTime: Date.now() - this.config.timestamp,
                memoryUsage: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB'
                } : 'No disponible'
            }
        };
    },
    
    /**
     * Reiniciar plugin completamente
     */
    restart: function() {
        this.log('Reiniciando plugin...');
        
        // Reiniciar módulos
        Object.keys(this.modules).forEach(moduleName => {
            if (this.modules[moduleName].reset) {
                this.modules[moduleName].reset();
            }
        });
        
        // Reiniciar configuración
        this.initialized = false;
        this.modules = {};
        this.config = {};
        
        // Reinicializar
        this.init();
        
        if (this.modules.utils) {
            this.modules.utils.showNotification('Plugin reiniciado correctamente', 'success');
        }
    },
    
    /**
     * Método de logging centralizado
     */
    log: function(message, type = 'info', data = null) {
        if (this.modules.utils) {
            this.modules.utils.log(`[Main] ${message}`, type, data);
        } else {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[POS Billing ${timestamp}] ${message}`, data);
        }
    },
    
    /**
     * Mostrar ayuda detallada
     */
    showDetailedHelp: function() {
        if (this.modules.utils) {
            this.modules.utils.showDetailedHelp();
        } else {
            console.log('📖 Módulo de ayuda no disponible');
        }
    },
    
    /**
     * Obtener estado de salud del plugin
     */
    getHealthStatus: function() {
        const health = {
            status: 'healthy',
            issues: [],
            modules: {},
            config: {
                valid: true,
                missing: []
            }
        };
        
        // Verificar módulos
        const expectedModules = ['utils', 'popupManager', 'clients', 'calculations', 'formHandler', 'cfdiCreator'];
        expectedModules.forEach(moduleName => {
            if (this.modules[moduleName]) {
                health.modules[moduleName] = 'loaded';
            } else {
                health.modules[moduleName] = 'missing';
                health.issues.push(`Módulo ${moduleName} no cargado`);
                health.status = 'warning';
            }
        });
        
        // Verificar configuración
        const requiredConfig = ['ajaxUrl', 'nonce'];
        requiredConfig.forEach(configKey => {
            if (!this.config[configKey]) {
                health.config.missing.push(configKey);
                health.config.valid = false;
                health.issues.push(`Configuración ${configKey} faltante`);
                health.status = 'error';
            }
        });
        
        return health;
    }
};

// Funciones globales para mantener compatibilidad hacia atrás
function abrirModuloFacturacion() {
    if (POSBilling.initialized) {
        POSBilling.openBillingModule();
    } else {
        console.error('❌ POS Billing no está inicializado');
        alert('Error: Plugin no inicializado. Recarga la página.');
    }
}

function mostrarAyudaDetallada() {
    if (POSBilling.initialized) {
        POSBilling.showDetailedHelp();
    } else {
        console.error('❌ POS Billing no está inicializado');
    }
}

// Función de debug global
function debugPOSBilling() {
    console.log('🔍 Debug POS Billing:', POSBilling.getPluginInfo());
    console.log('🏥 Estado de salud:', POSBilling.getHealthStatus());
    return POSBilling;
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    console.log('📄 DOM cargado, inicializando POS Facturación...');
    
    // Pequeño delay para asegurar que todos los módulos estén cargados
    setTimeout(() => {
        const success = POSBilling.init();
        
        if (!success) {
            console.error('❌ Falló la inicialización de POS Facturación');
            
            // Mostrar mensaje de error al usuario
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px; 
                background: #dc3545; color: white; 
                padding: 15px; border-radius: 5px; 
                z-index: 10000; font-family: Arial, sans-serif;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            `;
            errorMsg.innerHTML = `
                <strong>⚠️ Error POS Facturación</strong><br>
                <small>Plugin no pudo inicializarse. Revisa la consola o recarga la página.</small>
                <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;float:right;cursor:pointer;">×</button>
            `;
            document.body.appendChild(errorMsg);
            
            // Auto-remover después de 10 segundos
            setTimeout(() => {
                if (errorMsg.parentElement) {
                    errorMsg.remove();
                }
            }, 10000);
        }
    }, 100);
});

// Funciones de utilidad global
window.POSBillingGlobal = {
    restart: () => POSBilling.restart(),
    debug: () => debugPOSBilling(),
    health: () => POSBilling.getHealthStatus(),
    info: () => POSBilling.getPluginInfo(),
    version: POSBilling.version
};

console.log('📦 POS Facturación - Archivo principal cargado v' + POSBilling.version);