/**
 * Módulo de utilidades para POS Facturación
 * assets/js/modules/utils.js
 */

class POSBillingUtils {
    constructor(config) {
        this.config = config;
    }
    
    /**
     * Función para mostrar ayuda detallada
     */
    showDetailedHelp() {
        const helpWindow = window.open('', 'ayuda_detallada', 'width=800,height=600,scrollbars=yes,resizable=yes');
        
        const helpContent = this.getHelpContent();
        
        helpWindow.document.write(helpContent);
        helpWindow.document.close();
        helpWindow.focus();
    }
    
    /**
     * Obtener contenido de ayuda
     */
    getHelpContent() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Ayuda - Error "No puedes facturar 2"</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .container { max-width: 700px; margin: 0 auto; }
        .step { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007cba; }
        .warning { background: #fff3cd; padding: 10px; border-radius: 5px; color: #856404; }
        .success { background: #d4edda; padding: 10px; border-radius: 5px; color: #155724; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Solución para "No puedes facturar 2"</h1>
        <div class="warning">
            <strong>⚠️ Este error indica que tu cuenta de Factura.com no está completamente configurada.</strong>
        </div>
        <div class="step">
            <h3>📋 Verificar Certificados SAT</h3>
            <p>Ve a <a href="https://sandbox.factura.com" target="_blank">Factura.com</a> → Configuración → Certificados</p>
            <ul>
                <li>Debe aparecer tu certificado .cer</li>
                <li>Debe aparecer tu llave .key</li>
                <li>Estado: "Válido"</li>
            </ul>
        </div>
        <div class="step">
            <h3>🔢 Verificar Series</h3>
            <p>Ve a Configuración → Series</p>
            <ul>
                <li>Debe existir la serie ID: 1212</li>
                <li>Estado: "Activa"</li>
                <li>Tipo: "Factura"</li>
            </ul>
        </div>
        <div class="step">
            <h3>👤 Verificar Receptor</h3>
            <p>Ve a Receptores → Buscar</p>
            <ul>
                <li>Busca UID: 67a93f71cdddb</li>
                <li>Debe existir y estar activo</li>
            </ul>
        </div>
        <div class="success">
            <strong>✅ Si todo está configurado y sigue fallando:</strong><br>
            Contacta al soporte de Factura.com con esta información específica.
        </div>
        <p style="text-align: center; margin-top: 30px;">
            <button onclick="window.close()" style="background: #007cba; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cerrar</button>
        </p>
    </div>
</body>
</html>`;
    }
    
    /**
     * Función para logging con debug
     */
    log(message, type = 'info', data = null) {
        if (!this.config.debug) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[POS Billing ${timestamp}]`;
        
        switch (type) {
            case 'error':
                console.error(prefix, message, data);
                break;
            case 'warn':
                console.warn(prefix, message, data);
                break;
            case 'success':
                console.log(`%c${prefix} ✅ ${message}`, 'color: green', data);
                break;
            default:
                console.log(prefix, message, data);
        }
    }
    
    /**
     * Función para formatear moneda
     */
    formatCurrency(amount) {
        return '$' + parseFloat(amount || 0).toFixed(2);
    }
    
    /**
     * Función para generar número de orden
     */
    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }
    
    /**
     * Función para validar email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    /**
     * Función para validar RFC
     */
    validateRFC(rfc) {
        // RFC para personas físicas: 4 letras + 6 números + 3 caracteres
        // RFC para personas morales: 3 letras + 6 números + 3 caracteres
        const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
        return rfcPattern.test(rfc.toUpperCase());
    }
    
    /**
     * Función para debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Función para mostrar notificaciones
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `pos-billing-notification pos-billing-notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 300px;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove después del tiempo especificado
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
    
    /**
     * Obtener color de notificación según el tipo
     */
    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }
    
    /**
     * Obtener icono de notificación según el tipo
     */
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * Función para hacer peticiones AJAX
     */
    async makeRequest(action, data = {}, method = 'POST') {
        const url = this.config.ajaxUrl;
        const formData = new FormData();
        
        formData.append('action', action);
        formData.append('nonce', this.config.nonce);
        
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                formData.append(key, JSON.stringify(data[key]));
            } else {
                formData.append(key, data[key]);
            }
        });
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            this.log('Error en petición AJAX', 'error', { action, error: error.message });
            throw error;
        }
    }
    
    /**
     * Función para sanitizar entrada de usuario
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remover < y >
            .replace(/javascript:/gi, '') // Remover javascript:
            .replace(/on\w+=/gi, ''); // Remover atributos on*
    }
    
    /**
     * Función para escapar HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Hacer disponible globalmente
window.POSBillingUtils = POSBillingUtils;