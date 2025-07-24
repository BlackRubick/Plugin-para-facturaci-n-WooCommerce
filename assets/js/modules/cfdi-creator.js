/**
 * Módulo de creación de CFDI para POS Facturación
 * assets/js/modules/cfdi-creator.js
 */

class POSBillingCFDICreator {
    constructor(config, modules) {
        this.config = config;
        this.modules = modules;
        this.utils = modules?.utils;
        this.isProcessing = false;
        this.retryCount = 0;
        this.maxRetries = 2;
        this.timeout = 45000;
        this.lastError = null;
    }
    
    /**
     * Crear CFDI con los datos proporcionados
     */
    async createCFDI(cfdiData) {
        if (this.isProcessing) {
            this.showError('Ya se está procesando una solicitud. Por favor espere...');
            return;
        }
        
        this.log('Iniciando creación de CFDI...');
        this.isProcessing = true;
        this.retryCount = 0;
        this.lastError = null;
        
        try {
            // Mostrar estado de carga
            this.showLoading(true);
            
            // Validar datos antes de enviar
            const validation = this.validateCFDIData(cfdiData);
            if (!validation.valid) {
                throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
            }
            
            // Formatear datos para la API
            const formattedData = this.formatDataForAPI(cfdiData);
            
            // Enviar a la API
            const result = await this.submitToAPI(formattedData);
            
            if (result.success) {
                this.handleSuccess(result.data);
            } else {
                this.handleError(result.data || result.message || 'Error desconocido');
            }
            
        } catch (error) {
            this.log(`Error creando CFDI: ${error.message}`, 'error');
            this.lastError = error.message;
            this.handleError(error.message);
        } finally {
            this.isProcessing = false;
            this.showLoading(false);
        }
    }
    
    /**
     * Validar datos del CFDI antes de enviar
     */
    validateCFDIData(data) {
        const errors = [];
        
        // Validar receptor
        if (!data.Receptor?.UID?.trim()) {
            errors.push('UID del receptor es requerido');
        }
        
        // Validar campos básicos
        const requiredFields = ['TipoDocumento', 'UsoCFDI', 'Serie', 'FormaPago', 'MetodoPago', 'Moneda'];
        requiredFields.forEach(field => {
            if (!data[field]) {
                errors.push(`El campo ${field} es requerido`);
            }
        });
        
        // Validar conceptos
        if (!data.Conceptos || !Array.isArray(data.Conceptos) || data.Conceptos.length === 0) {
            errors.push('Debe incluir al menos un concepto');
        } else {
            data.Conceptos.forEach((concepto, index) => {
                const conceptErrors = this.validateConcept(concepto, index + 1);
                errors.push(...conceptErrors);
            });
        }
        
        // Validar serie como número
        if (data.Serie && isNaN(parseInt(data.Serie))) {
            errors.push('La serie debe ser un número válido');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Validar un concepto individual
     */
    validateConcept(concepto, index) {
        const errors = [];
        
        const requiredFields = ['ClaveProdServ', 'Cantidad', 'ClaveUnidad', 'Unidad', 'Descripcion', 'ValorUnitario'];
        requiredFields.forEach(field => {
            if (concepto[field] === undefined || concepto[field] === null || concepto[field] === '') {
                errors.push(`Concepto ${index}: ${field} es requerido`);
            }
        });
        
        // Validar valores numéricos
        if (concepto.Cantidad <= 0) {
            errors.push(`Concepto ${index}: La cantidad debe ser mayor a 0`);
        }
        
        if (concepto.ValorUnitario <= 0) {
            errors.push(`Concepto ${index}: El valor unitario debe ser mayor a 0`);
        }
        
        // Validar descuento
        if (concepto.Descuento && concepto.Descuento > concepto.Importe) {
            errors.push(`Concepto ${index}: El descuento no puede ser mayor al importe`);
        }
        
        return errors;
    }
    
    /**
     * Formatear datos para la API con tipos correctos
     */
    formatDataForAPI(data) {
        this.log('Formateando datos para API...');
        
        const formatted = {
            Receptor: {
                UID: String(data.Receptor.UID).trim()
            },
            TipoDocumento: String(data.TipoDocumento),
            UsoCFDI: String(data.UsoCFDI),
            Serie: parseInt(data.Serie, 10),
            FormaPago: String(data.FormaPago).padStart(2, '0'),
            MetodoPago: String(data.MetodoPago),
            Moneda: String(data.Moneda),
            EnviarCorreo: Boolean(data.EnviarCorreo)
        };
        
        // Campos opcionales
        if (data.Receptor.ResidenciaFiscal) {
            formatted.Receptor.ResidenciaFiscal = String(data.Receptor.ResidenciaFiscal);
        }
        
        if (data.NumOrder) {
            formatted.NumOrder = String(data.NumOrder);
        }
        
        if (data.Comentarios) {
            formatted.Comentarios = String(data.Comentarios);
        }
        
        if (data.TipoCambio) {
            formatted.TipoCambio = parseFloat(data.TipoCambio);
        }
        
        // Formatear conceptos
        formatted.Conceptos = data.Conceptos.map(concepto => {
            const formattedConcepto = {
                ClaveProdServ: String(concepto.ClaveProdServ).padStart(8, '0'),
                Cantidad: parseFloat(concepto.Cantidad),
                ClaveUnidad: String(concepto.ClaveUnidad),
                Unidad: String(concepto.Unidad),
                Descripcion: String(concepto.Descripcion),
                ValorUnitario: parseFloat(concepto.ValorUnitario),
                Importe: parseFloat(concepto.Importe),
                ObjetoImp: String(concepto.ObjetoImp).padStart(2, '0')
            };
            
            // Descuento opcional
            if (concepto.Descuento && parseFloat(concepto.Descuento) > 0) {
                formattedConcepto.Descuento = parseFloat(concepto.Descuento);
            }
            
            // Impuestos
            if (concepto.Impuestos?.Traslados) {
                formattedConcepto.Impuestos = {
                    Traslados: concepto.Impuestos.Traslados.map(traslado => ({
                        Base: parseFloat(traslado.Base),
                        Impuesto: String(traslado.Impuesto).padStart(3, '0'),
                        TipoFactor: String(traslado.TipoFactor),
                        TasaOCuota: String(traslado.TasaOCuota),
                        Importe: parseFloat(traslado.Importe)
                    }))
                };
            }
            
            return formattedConcepto;
        });
        
        this.log('Datos formateados correctamente', 'success', formatted);
        return formatted;
    }
    
    /**
     * Enviar datos a la API de WordPress
     */
    async submitToAPI(data) {
        this.log('Enviando datos a la API...');
        
        // Detectar URL funcional
        const ajaxUrl = await this.getWorkingAjaxUrl();
        
        if (!ajaxUrl) {
            throw new Error('No se pudo detectar una URL de WordPress funcional');
        }
        
        // Preparar datos para envío
        const formData = new FormData();
        formData.append('action', 'pos_billing_create_cfdi');
        formData.append('cfdi_data', JSON.stringify(data));
        
        if (this.config.nonce) {
            formData.append('nonce', this.config.nonce);
        }
        
        // Enviar petición
        const response = await fetch(ajaxUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: this.timeout
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        this.log('Respuesta de la API recibida:', 'info', {
            success: result.success,
            hasData: !!result.data
        });
        
        return result;
    }
    
    /**
     * Obtener URL de AJAX funcional
     */
    async getWorkingAjaxUrl() {
        // Si ya tenemos una URL funcional, usarla
        if (window.urlAjaxFuncional) {
            return window.urlAjaxFuncional;
        }
        
        const urls = [
            this.config.ajaxUrl,
            '/wp-admin/admin-ajax.php',
            '/pos-dashboard/wp-admin/admin-ajax.php',
            window.location.origin + '/wp-admin/admin-ajax.php',
            window.location.origin + '/pos-dashboard/wp-admin/admin-ajax.php'
        ];
        
        // Filtrar URLs duplicadas
        const uniqueUrls = [...new Set(urls)];
        
        for (const url of uniqueUrls) {
            try {
                const testResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'action=heartbeat&_wpnonce=test'
                });
                
                if (testResponse.status === 200 || testResponse.status === 400) {
                    // 400 es aceptable porque indica que WordPress está respondiendo
                    this.log(`URL funcional encontrada: ${url}`, 'success');
                    window.urlAjaxFuncional = url;
                    return url;
                }
            } catch (error) {
                this.log(`URL no funcional: ${url}`, 'warn');
            }
        }
        
        return null;
    }
    
    /**
     * Manejar respuesta exitosa
     */
    handleSuccess(data) {
        this.log('CFDI creado exitosamente', 'success', data);
        
        // Mostrar resultado de éxito
        this.showSuccessResult(data);
        
        // Notificar éxito
        if (this.utils) {
            this.utils.showNotification(
                `CFDI generado exitosamente. Folio: ${data.folio || 'N/A'}`,
                'success',
                10000
            );
        }
        
        // Limpiar formulario si está disponible
        if (this.modules.formHandler) {
            setTimeout(() => {
                const clearForm = confirm('¿Desea limpiar el formulario para crear una nueva factura?');
                if (clearForm) {
                    this.modules.formHandler.clearForm();
                }
            }, 3000);
        }
    }
    
    /**
     * Manejar error en la creación
     */
    handleError(errorData) {
        this.log('Error en la creación del CFDI', 'error', errorData);
        
        let errorMessage = 'Error desconocido';
        let canRetry = false;
        
        if (typeof errorData === 'string') {
            errorMessage = errorData;
        } else if (errorData && typeof errorData === 'object') {
            if (errorData.specific_analysis) {
                errorMessage = this.formatSpecificError(errorData.specific_analysis);
            } else if (errorData.message) {
                errorMessage = errorData.message;
            } else {
                errorMessage = JSON.stringify(errorData);
            }
            
            // Determinar si se puede reintentar
            canRetry = this.canRetryError(errorData);
        }
        
        // Mostrar error
        this.showErrorResult(errorMessage, errorData);
        
        // Notificar error
        if (this.utils) {
            this.utils.showNotification(
                `Error al generar CFDI: ${errorMessage.substring(0, 100)}...`,
                'error',
                15000
            );
        }
        
        // Ofrecer reintento si es apropiado
        if (canRetry && this.retryCount < this.maxRetries) {
            setTimeout(() => {
                const retry = confirm('¿Desea reintentar la creación del CFDI?');
                if (retry) {
                    this.retryCount++;
                    this.log(`Reintentando... (${this.retryCount}/${this.maxRetries})`);
                }
            }, 2000);
        }
    }
    
    /**
     * Formatear error específico para mostrar al usuario
     */
    formatSpecificError(analysis) {
        if (analysis.error_type === 'facturacion_blocked') {
            return `No se puede facturar: ${analysis.likely_causes?.[0] || 'Problema de configuración'}. 
                    Revisa tu configuración en Factura.com.`;
        }
        
        return analysis.message || 'Error específico no identificado';
    }
    
    /**
     * Determinar si un error permite reintento
     */
    canRetryError(errorData) {
        // Errores que no permiten reintento
        const nonRetryableErrors = [
            'facturacion_blocked',
            'invalid_credentials',
            'validation_error',
            'insufficient_permissions'
        ];
        
        if (errorData.specific_analysis?.error_type) {
            return !nonRetryableErrors.includes(errorData.specific_analysis.error_type);
        }
        
        // Errores de conexión generalmente permiten reintento
        return errorData.message?.includes('conexión') || 
               errorData.message?.includes('timeout') ||
               errorData.message?.includes('network');
    }
    
    /**
     * Mostrar estado de carga
     */
    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        const submitButton = document.getElementById('submitBtn');
        
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
        
        if (submitButton) {
            submitButton.disabled = show;
            submitButton.textContent = show ? '⏳ Generando...' : '📄 Generar CFDI';
        }
    }
    
    /**
     * Mostrar resultado de éxito
     */
    showSuccessResult(data) {
        const resultContainer = document.getElementById('result-container');
        const resultContent = document.getElementById('result-content');
        
        if (!resultContainer || !resultContent) return;
        
        resultContainer.className = 'result-container result-success';
        resultContent.innerHTML = this.generateSuccessHTML(data);
        resultContainer.style.display = 'block';
        
        // Scroll al resultado
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Generar HTML para resultado exitoso
     */
    generateSuccessHTML(data) {
        return `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #28a745;">
                ✅ CFDI Generado Exitosamente
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div><strong>UUID:</strong><br><code style="font-size: 12px;">${data.uuid || 'N/A'}</code></div>
                    <div><strong>Folio:</strong><br><span style="font-size: 18px; color: #007bff;">${data.folio || 'N/A'}</span></div>
                    <div><strong>Total:</strong><br><span style="font-size: 18px; color: #28a745;">$${data.total || '0.00'}</span></div>
                    <div><strong>Fecha:</strong><br>${data.fecha_timbrado || new Date().toLocaleString()}</div>
                </div>
                ${data.sat_data ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                        <small><strong>Información SAT:</strong><br>
                        Certificado: ${data.sat_data.NoCertificadoSAT || 'N/A'}<br>
                        Versión: ${data.sat_data.Version || 'N/A'}</small>
                    </div>
                ` : ''}
            </div>
            <div style="text-align: center;">
                <button onclick="window.location.reload()" class="btn">🔄 Nueva Factura</button>
                <button onclick="window.print()" class="btn" style="background: #6f42c1;">🖨️ Imprimir</button>
                <button onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>
            </div>
        `;
    }
    
    /**
     * Mostrar resultado de error
     */
    showErrorResult(message, errorData) {
        const resultContainer = document.getElementById('result-container');
        const resultContent = document.getElementById('result-content');
        
        if (!resultContainer || !resultContent) {
            // Fallback a alert si no hay contenedor
            alert(`Error: ${message}`);
            return;
        }
        
        resultContainer.className = 'result-container result-error';
        resultContent.innerHTML = this.generateErrorHTML(message, errorData);
        resultContainer.style.display = 'block';
        
        // Scroll al resultado
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Generar HTML para resultado de error
     */
    generateErrorHTML(message, errorData) {
        let additionalInfo = '';
        
        if (errorData?.specific_analysis) {
            const analysis = errorData.specific_analysis;
            additionalInfo = `
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Posibles Soluciones:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${analysis.recommended_actions?.map(action => `<li>${action}</li>`).join('') || '<li>Contacta al administrador</li>'}
                    </ul>
                </div>
            `;
        }
        
        return `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #dc3545;">
                ❌ Error al Generar CFDI
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #721c24; font-weight: bold;">${message}</p>
                ${additionalInfo}
                ${this.config.debug && errorData ? `
                    <details style="margin-top: 15px;">
                        <summary style="cursor: pointer; color: #6c757d;">Ver detalles técnicos</summary>
                        <pre style="background: #f8f9fa; padding: 10px; border-radius: 3px; font-size: 12px; overflow-x: auto; margin-top: 10px;">${JSON.stringify(errorData, null, 2)}</pre>
                    </details>
                ` : ''}
            </div>
            <div style="text-align: center;">
                ${this.retryCount < this.maxRetries ? '<button onclick="location.reload()" class="btn">🔄 Reintentar</button>' : ''}
                <button onclick="mostrarAyudaDetallada()" class="btn" style="background: #17a2b8;">❓ Ayuda Detallada</button>
                <button onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>
            </div>
        `;
    }
    
    /**
     * Mostrar error simple
     */
    showError(message) {
        if (this.utils) {
            this.utils.showNotification(message, 'error', 8000);
        } else {
            alert(`Error: ${message}`);
        }
    }
    
    /**
     * Obtener resumen del estado actual
     */
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            retryCount: this.retryCount,
            maxRetries: this.maxRetries,
            hasWorkingUrl: !!window.urlAjaxFuncional,
            lastError: this.lastError,
            timeout: this.timeout
        };
    }
    
    /**
     * Reiniciar estado
     */
    reset() {
        this.isProcessing = false;
        this.retryCount = 0;
        this.lastError = null;
        this.showLoading(false);
        
        // Limpiar resultados
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }
        
        this.log('Estado reiniciado');
    }
    
    /**
     * Reintentar último CFDI con mejoras
     */
    async retryLastCFDI(originalData) {
        if (this.retryCount >= this.maxRetries) {
            this.showError('Se ha alcanzado el máximo número de reintentos');
            return;
        }
        
        this.retryCount++;
        this.log(`Reintentando creación de CFDI (${this.retryCount}/${this.maxRetries})`);
        
        // Pequeña pausa antes del reintento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reintentar con los datos originales
        await this.createCFDI(originalData);
    }
    
    /**
     * Validar conexión antes de crear CFDI
     */
    async validateConnection() {
        try {
            const url = await this.getWorkingAjaxUrl();
            if (!url) {
                throw new Error('No se pudo establecer conexión con WordPress');
            }
            
            // Probar conexión con heartbeat
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=heartbeat'
            });
            
            if (!response.ok) {
                throw new Error(`Error de conexión: HTTP ${response.status}`);
            }
            
            this.log('Conexión validada correctamente', 'success');
            return true;
        } catch (error) {
            this.log(`Error validando conexión: ${error.message}`, 'error');
            return false;
        }
    }
    
    /**
     * Obtener estadísticas de creación de CFDIs
     */
    getStats() {
        return {
            totalAttempts: this.retryCount + 1,
            maxRetries: this.maxRetries,
            currentStatus: this.isProcessing ? 'processing' : 'idle',
            hasWorkingUrl: !!window.urlAjaxFuncional,
            lastError: this.lastError,
            timeout: this.timeout,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Configurar parámetros avanzados
     */
    configure(options = {}) {
        if (options.maxRetries !== undefined) {
            this.maxRetries = Math.max(0, Math.min(5, options.maxRetries));
        }
        
        if (options.timeout !== undefined) {
            this.timeout = Math.max(5000, Math.min(60000, options.timeout));
        }
        
        this.log('Configuración actualizada', 'info', {
            maxRetries: this.maxRetries,
            timeout: this.timeout
        });
    }
    
    /**
     * Exportar datos del CFDI para backup
     */
    exportCFDIData(cfdiData) {
        const exportData = {
            timestamp: new Date().toISOString(),
            data: cfdiData,
            config: {
                sandbox: this.config.sandbox_mode,
                version: '2.1.1',
                maxRetries: this.maxRetries,
                timeout: this.timeout
            },
            stats: this.getStats()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cfdi-backup-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.log('Datos del CFDI exportados para backup');
    }
    
    /**
     * Importar configuración desde backup
     */
    importFromBackup(backupData) {
        try {
            if (backupData.config) {
                this.configure({
                    maxRetries: backupData.config.maxRetries,
                    timeout: backupData.config.timeout
                });
            }
            
            this.log('Configuración importada desde backup', 'success');
            return backupData.data;
        } catch (error) {
            this.log(`Error importando backup: ${error.message}`, 'error');
            return null;
        }
    }
    
    /**
     * Obtener información de debug detallada
     */
    getDebugInfo() {
        return {
            module: 'CFDICreator',
            version: '2.1.1',
            status: this.getStatus(),
            config: {
                hasUtils: !!this.utils,
                hasModules: !!this.modules,
                debug: this.config.debug,
                ajaxUrl: this.config.ajaxUrl
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                cookieEnabled: navigator.cookieEnabled
            },
            urls: {
                current: window.location.href,
                working: window.urlAjaxFuncional || 'No detectada'
            },
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Log con prefijo del módulo
     */
    log(message, type = 'info', data = null) {
        if (this.utils) {
            this.utils.log(`[CFDI Creator] ${message}`, type, data);
        } else {
            console.log(`[POS Billing - CFDI Creator] ${message}`, data);
        }
    }
}

// Hacer disponible globalmente
window.POSBillingCFDICreator = POSBillingCFDICreator;