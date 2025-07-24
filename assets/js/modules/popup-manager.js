/**
 * Módulo de gestión del popup para POS Facturación
 * assets/js/modules/popup-manager.js
 */

class POSBillingPopupManager {
    constructor(config) {
        this.config = config;
        this.popup = null;
        this.isOpen = false;
        this.utils = window.POSBilling?.modules?.utils;
    }
    
    /**
     * Abrir popup de facturación
     */
    openBillingPopup() {
        if (this.isOpen && this.popup && !this.popup.closed) {
            this.popup.focus();
            return;
        }
        
        this.log('Abriendo popup de facturación...');
        
        this.popup = window.open(
            "",
            "facturacion",
            "width=1200,height=800,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no"
        );
        
        if (!this.popup) {
            this.handlePopupBlocked();
            return;
        }
        
        this.isOpen = true;
        this.setupPopupContent();
        this.setupPopupEvents();
    }
    
    /**
     * Manejar popup bloqueado
     */
    handlePopupBlocked() {
        const message = "Por favor, permita ventanas emergentes para usar el módulo de facturación";
        
        if (this.utils) {
            this.utils.showNotification(message, 'warning', 8000);
        } else {
            alert(message);
        }
        
        this.log('Popup bloqueado por el navegador', 'warn');
    }
    
    /**
     * Configurar contenido del popup
     */
    setupPopupContent() {
        const htmlContent = this.generatePopupHTML();
        
        this.popup.document.write(htmlContent);
        this.popup.document.close();
        this.popup.focus();
        
        this.log('Contenido del popup configurado');
    }
    
    /**
     * Configurar eventos del popup
     */
    setupPopupEvents() {
        // Detectar cuando el popup se cierra
        const checkClosed = setInterval(() => {
            if (this.popup.closed) {
                this.isOpen = false;
                clearInterval(checkClosed);
                this.log('Popup cerrado');
            }
        }, 1000);
        
        // Configurar eventos cuando el popup cargue
        this.popup.addEventListener('load', () => {
            this.initializePopupModules();
        });
    }
    
    /**
     * Inicializar módulos dentro del popup
     */
    initializePopupModules() {
        // Esperar un poco para asegurar que el DOM esté listo
        setTimeout(() => {
            if (this.popup && !this.popup.closed) {
                this.popup.postMessage({
                    type: 'init',
                    config: this.config
                }, '*');
            }
        }, 500);
    }
    
    /**
     * Generar HTML del popup
     */
    generatePopupHTML() {
        return `<!DOCTYPE html>
<html>
<head>
    <title>Sistema de Facturación CFDI 4.0</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${this.generatePopupStyles()}
</head>
<body>
    <div class="container">
        ${this.generatePopupHeader()}
        ${this.generatePopupForm()}
    </div>
    ${this.generatePopupScripts()}
</body>
</html>`;
    }
    
    /**
     * Generar estilos del popup
     */
    generatePopupStyles() {
        return `<style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
            line-height: 1.6; 
        }
        .container { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            max-width: 1100px; 
            margin: 0 auto; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 20px; 
        }
        .header h1 { 
            color: #333; 
            margin: 0; 
            font-size: 28px; 
        }
        .header p { 
            color: #666; 
            margin: 10px 0 0 0; 
            font-size: 16px; 
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 600; 
            color: #333; 
            font-size: 14px; 
        }
        .form-group input, .form-group select, .form-group textarea { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #e1e5e9; 
            border-radius: 8px; 
            box-sizing: border-box; 
            font-size: 14px; 
            transition: border-color 0.3s ease; 
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { 
            outline: none; 
            border-color: #667eea; 
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); 
        }
        .form-row { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
        }
        .form-row-3 { 
            display: grid; 
            grid-template-columns: 1fr 1fr 1fr; 
            gap: 15px; 
        }
        .btn { 
            padding: 12px 24px; 
            background: #28a745; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            margin: 5px; 
            font-size: 16px; 
            font-weight: 600; 
            transition: all 0.3s ease; 
        }
        .btn:hover { 
            background: #218838; 
            transform: translateY(-1px); 
        }
        .btn:disabled { 
            background: #6c757d; 
            cursor: not-allowed; 
            transform: none; 
        }
        .btn-cancel { 
            background: #6c757d; 
        }
        .btn-cancel:hover { 
            background: #545b62; 
        }
        .btn-add { 
            background: #007bff; 
        }
        .btn-add:hover { 
            background: #0056b3; 
        }
        .btn-remove { 
            background: #dc3545; 
            color: white; 
            border: none; 
            border-radius: 50%; 
            width: 30px; 
            height: 30px; 
            cursor: pointer; 
            position: absolute; 
            top: 15px; 
            right: 15px; 
            font-size: 18px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        .btn-reload { 
            background: #17a2b8; 
            font-size: 12px; 
            padding: 8px 12px; 
            margin-left: 10px; 
        }
        .btn-reload:hover { 
            background: #138496; 
        }
        .totals { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 25px; 
            border-radius: 10px; 
            margin: 25px 0; 
            border: 2px solid #dee2e6; 
        }
        .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            font-size: 16px; 
        }
        .total-final { 
            font-weight: bold; 
            font-size: 20px; 
            border-top: 2px solid #333; 
            padding-top: 15px; 
            color: #28a745; 
        }
        .producto-row { 
            display: grid; 
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 40px; 
            gap: 15px; 
            margin-bottom: 20px; 
            padding: 20px; 
            background: #f8f9fa; 
            border-radius: 10px; 
            position: relative; 
            border: 2px solid #e9ecef; 
        }
        .producto-row-secondary { 
            margin-bottom: 20px; 
            padding: 20px; 
            background: #f1f3f4; 
            border-radius: 10px; 
            border: 1px solid #dee2e6; 
        }
        .section { 
            margin-bottom: 35px; 
            padding-bottom: 25px; 
            border-bottom: 2px solid #eee; 
        }
        .section:last-child { 
            border-bottom: none; 
        }
        .section h3 { 
            color: #333; 
            margin-bottom: 20px; 
            font-size: 20px; 
            display: flex; 
            align-items: center; 
            gap: 10px; 
        }
        .form-actions { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 25px; 
            border-top: 2px solid #eee; 
        }
        .required { 
            color: #dc3545; 
        }
        .help-text { 
            font-size: 12px; 
            color: #6c757d; 
            margin-top: 5px; 
        }
        .alert { 
            padding: 15px; 
            margin-bottom: 20px; 
            border: 1px solid transparent; 
            border-radius: 8px; 
        }
        .alert-info { 
            color: #0c5460; 
            background-color: #d1ecf1; 
            border-color: #bee5eb; 
        }
        .alert-success { 
            color: #155724; 
            background-color: #d4edda; 
            border-color: #c3e6cb; 
        }
        .alert-danger { 
            color: #721c24; 
            background-color: #f8d7da; 
            border-color: #f5c6cb; 
        }
        .loading { 
            display: none; 
            text-align: center; 
            padding: 20px; 
        }
        .loading-spinner { 
            border: 4px solid #f3f3f3; 
            border-top: 4px solid #667eea; 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 15px; 
        }
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        .result-container { 
            display: none; 
            background: #f8f9fa; 
            border-radius: 10px; 
            padding: 25px; 
            margin-top: 20px; 
        }
        .result-success { 
            border-left: 5px solid #28a745; 
        }
        .result-error { 
            border-left: 5px solid #dc3545; 
        }
        .readonly-field { 
            background-color: #f8f9fa !important; 
            color: #495057; 
        }
        
        /* Estilos responsivos */
        @media (max-width: 768px) {
            .container { padding: 15px; }
            .form-row, .form-row-3 { grid-template-columns: 1fr; }
            .producto-row { grid-template-columns: 1fr; }
            .header h1 { font-size: 22px; }
        }
        </style>`;
    }
    
    /**
     * Generar header del popup
     */
    generatePopupHeader() {
        return `
        <div class="header">
            <h1>📄 Sistema de Facturación CFDI 4.0</h1>
            <p>Integración con Factura.com - Generar nueva factura</p>
        </div>
        
        <div class="alert alert-info">
            <strong>ℹ️ Información:</strong> Los totales se calculan automáticamente cuando ingresas cantidad y precio.
        </div>`;
    }
    
    /**
     * Generar formulario del popup
     */
    generatePopupForm() {
        return `
        <form id="cfdiformulario">
            ${this.generateReceptorSection()}
            ${this.generateConfigSection()}
            ${this.generateConceptosSection()}
            ${this.generateTotalsSection()}
            ${this.generateOptionsSection()}
            ${this.generateLoadingSection()}
            ${this.generateResultSection()}
            ${this.generateFormActions()}
        </form>`;
    }
    
    /**
     * Generar sección de receptor
     */
    generateReceptorSection() {
        return `
        <div class="section">
            <h3>👤 Datos del Receptor</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Cliente <span class="required">*</span>
                        <button type="button" onclick="recargarClientes()" class="btn btn-reload" title="Recargar lista de clientes">🔄</button>
                    </label>
                    <select id="receptorUID" required>
                        <option value="">⏳ Cargando clientes...</option>
                    </select>
                    <div class="help-text">Selecciona un cliente de tu catálogo de Factura.com</div>
                    <div class="help-text" style="font-size: 11px; color: #888;">
                        💡 <strong>Tip:</strong> Si no aparece tu cliente, agrégalo en el panel de Factura.com y recarga la lista
                    </div>
                </div>
                <div class="form-group">
                    <label>Residencia Fiscal</label>
                    <input type="text" id="residenciaFiscal" placeholder="Solo para extranjeros">
                    <div class="help-text">Opcional - Solo para clientes del extranjero</div>
                </div>
            </div>
            
            <div id="clienteInfo" style="
                display: none; 
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                padding: 20px; 
                border-radius: 10px; 
                margin-top: 15px; 
                border-left: 4px solid #667eea;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">
                <h4 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                    ℹ️ Información del Cliente Seleccionado
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                    <div><strong>RFC:</strong> <span id="clienteRFC" style="color: #666;">-</span></div>
                    <div><strong>Email:</strong> <span id="clienteEmail" style="color: #666;">-</span></div>
                    <div><strong>Uso CFDI:</strong> <span id="clienteUsoCFDI" style="color: #666;">-</span></div>
                    <div><strong>Ciudad:</strong> <span id="clienteCiudad" style="color: #666;">-</span></div>
                </div>
            </div>
        </div>`;
    }
    
    /**
     * Generar sección de configuración
     */
    generateConfigSection() {
        return `
        <div class="section">
            <h3>⚙️ Configuración del CFDI</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de Documento <span class="required">*</span></label>
                    <select id="tipoDocumento" required>
                        <option value="">Seleccionar...</option>
                        <option value="factura" selected>Factura</option>
                        <option value="nota_credito">Nota de Crédito</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Uso de CFDI <span class="required">*</span></label>
                    <select id="usoCFDI" required>
                        <option value="">Seleccionar...</option>
                        <option value="G01">G01 - Adquisición de mercancías</option>
                        <option value="G02">G02 - Devoluciones, descuentos</option>
                        <option value="G03">G03 - Gastos en general</option>
                        <option value="S01" selected>S01 - Sin efectos fiscales</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row-3">
                <div class="form-group">
                    <label>Serie <span class="required">*</span></label>
                    <input type="number" id="serie" required placeholder="ej: 5483035">
                </div>
                <div class="form-group">
                    <label>Forma de Pago <span class="required">*</span></label>
                    <select id="formaPago" required>
                        <option value="">Seleccionar...</option>
                        <option value="01">01 - Efectivo</option>
                        <option value="03">03 - Transferencia</option>
                        <option value="04">04 - Tarjeta de crédito</option>
                        <option value="28">28 - Tarjeta de débito</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Método de Pago <span class="required">*</span></label>
                    <select id="metodoPago" required>
                        <option value="">Seleccionar...</option>
                        <option value="PUE" selected>PUE - Pago en una exhibición</option>
                        <option value="PPD">PPD - Pago en parcialidades</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Moneda <span class="required">*</span></label>
                    <select id="moneda" required>
                        <option value="MXN" selected>Peso Mexicano</option>
                        <option value="USD">Dólar Americano</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Número de Orden</label>
                    <input type="text" id="numOrder" placeholder="Se genera automáticamente">
                </div>
            </div>
        </div>`;
    }
    
    /**
     * Generar sección de conceptos
     */
    generateConceptosSection() {
        return `
        <div class="section">
            <h3>📦 Conceptos/Productos</h3>
            <div id="conceptos">
                <div class="producto-row">
                    <div class="form-group">
                        <label>Descripción <span class="required">*</span></label>
                        <input type="text" class="descripcion" placeholder="Descripción del producto/servicio" required>
                    </div>
                    <div class="form-group">
                        <label>Clave Prod/Serv <span class="required">*</span></label>
                        <input type="text" class="claveProdServ" placeholder="ej: 43232408" required>
                    </div>
                    <div class="form-group">
                        <label>Cantidad <span class="required">*</span></label>
                        <input type="number" class="cantidad" value="1" min="0.000001" step="0.000001" required>
                    </div>
                    <div class="form-group">
                        <label>Precio Unitario <span class="required">*</span></label>
                        <input type="number" class="precioUnitario" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Total</label>
                        <input type="number" class="totalConcepto" readonly class="readonly-field">
                    </div>
                    <div></div>
                </div>
                
                <div class="producto-row-secondary">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Clave Unidad <span class="required">*</span></label>
                            <select class="claveUnidad" required>
                                <option value="">Seleccionar...</option>
                                <option value="E48" selected>E48 - Unidad de servicio</option>
                                <option value="H87">H87 - Pieza</option>
                                <option value="KGM">KGM - Kilogramo</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Unidad <span class="required">*</span></label>
                            <input type="text" class="unidad" value="Unidad de servicio" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Descuento</label>
                            <input type="number" class="descuento" value="0" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>Objeto Impuesto <span class="required">*</span></label>
                            <select class="objetoImp" required>
                                <option value="02" selected>02 - Sí objeto de impuesto</option>
                                <option value="01">01 - No objeto de impuesto</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <button type="button" id="agregarConcepto" class="btn btn-add">➕ Agregar Concepto</button>
        </div>`;
    }
    
    /**
     * Generar sección de totales
     */
    generateTotalsSection() {
        return `
        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span id="subtotal">$0.00</span>
            </div>
            <div class="total-row">
                <span>Descuentos:</span>
                <span id="totalDescuentos">$0.00</span>
            </div>
            <div class="total-row">
                <span>IVA (16%):</span>
                <span id="iva">$0.00</span>
            </div>
            <div class="total-row total-final">
                <span>Total:</span>
                <span id="total">$0.00</span>
            </div>
        </div>`;
    }
    
    /**
     * Generar sección de opciones
     */
    generateOptionsSection() {
        return `
        <div class="section">
            <h3>⚙️ Opciones Adicionales</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enviarCorreo" checked>
                        Enviar factura por correo electrónico
                    </label>
                </div>
                <div class="form-group">
                    <label>Comentarios</label>
                    <textarea id="comentarios" rows="2" placeholder="Comentarios adicionales"></textarea>
                </div>
            </div>
        </div>`;
    }
    
    /**
     * Generar sección de carga
     */
    generateLoadingSection() {
        return `
        <div id="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>Generando CFDI, por favor espere...</p>
        </div>`;
    }
    
    /**
     * Generar sección de resultados
     */
    generateResultSection() {
        return `
        <div id="result-container" class="result-container">
            <div id="result-content"></div>
        </div>`;
    }
    
    /**
     * Generar acciones del formulario
     */
    generateFormActions() {
        return `
        <div class="form-actions">
            <button type="submit" class="btn" id="submitBtn">📄 Generar CFDI</button>
            <button type="button" onclick="window.close()" class="btn btn-cancel">❌ Cancelar</button>
        </div>`;
    }
    
    /**
     * Generar scripts del popup
     */
    generatePopupScripts() {
        return `<script>
        console.log('🚀 POPUP - Inicializando módulos...');
        
        // Variables globales del popup
        let isProcessing = false;
        let popupModules = {};
        
        // Configuración del popup
        const popupConfig = {
            debug: true,
            ajaxUrl: window.parent?.pos_billing_ajax?.ajax_url || '/wp-admin/admin-ajax.php',
            nonce: window.parent?.pos_billing_ajax?.nonce || '',
            userInfo: window.parent?.pos_billing_ajax?.user_info || {}
        };
        
        // Simulador de módulos en el popup
        class PopupClients {
            constructor() {
                this.clients = [];
                this.init();
            }
            
            async init() {
                await this.loadClients();
            }
            
            async loadClients() {
                console.log('🔄 Cargando clientes...');
                const selectElement = document.getElementById('receptorUID');
                
                if (!selectElement) {
                    console.error('❌ No se encontró el elemento receptorUID');
                    return;
                }
                
                try {
                    const urls = [
                        '/wp-admin/admin-ajax.php',
                        '/pos-dashboard/wp-admin/admin-ajax.php',
                        window.location.origin + '/wp-admin/admin-ajax.php',
                        window.location.origin + '/pos-dashboard/wp-admin/admin-ajax.php'
                    ];
                    
                    for (const url of urls) {
                        try {
                            const response = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: 'action=pos_billing_get_clients'
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.success && Array.isArray(data.data)) {
                                    this.populateSelect(selectElement, data.data);
                                    this.setupEvents(selectElement);
                                    console.log('✅ Clientes cargados:', data.data.length);
                                    window.urlAjaxFuncional = url;
                                    return;
                                }
                            }
                        } catch (e) {
                            console.log('⚠️ Error con URL:', url);
                        }
                    }
                    
                    throw new Error('No se pudo conectar con WordPress');
                } catch (error) {
                    console.error('❌ Error cargando clientes:', error);
                    selectElement.innerHTML = '<option value="">❌ Error de conexión</option>';
                }
            }
            
            populateSelect(selectElement, clients) {
                selectElement.innerHTML = '<option value="">Seleccionar cliente...</option>';
                
                clients.forEach(client => {
                    const option = document.createElement('option');
                    option.value = client.uid;
                    option.textContent = client.display_name;
                    option.setAttribute('data-rfc', client.rfc || '');
                    option.setAttribute('data-email', client.email || '');
                    option.setAttribute('data-uso-cfdi', client.uso_cfdi || 'G01');
                    option.setAttribute('data-ciudad', client.ciudad || '');
                    option.setAttribute('data-razon-social', client.razon_social || '');
                    selectElement.appendChild(option);
                });
                
                selectElement.disabled = false;
                this.clients = clients;
            }
            
            setupEvents(selectElement) {
                selectElement.addEventListener('change', (e) => {
                    const option = e.target.options[e.target.selectedIndex];
                    if (option.value) {
                        this.showClientInfo(option);
                        // Auto-completar uso CFDI
                        const usoCfdi = option.getAttribute('data-uso-cfdi');
                        if (usoCfdi) {
                            const usoCfdiSelect = document.getElementById('usoCFDI');
                            if (usoCfdiSelect) usoCfdiSelect.value = usoCfdi;
                        }
                    } else {
                        this.hideClientInfo();
                    }
                });
            }
            
            showClientInfo(option) {
                const infoDiv = document.getElementById('clienteInfo');
                if (!infoDiv) return;
                
                document.getElementById('clienteRFC').textContent = option.getAttribute('data-rfc') || '-';
                document.getElementById('clienteEmail').textContent = option.getAttribute('data-email') || '-';
                document.getElementById('clienteUsoCFDI').textContent = option.getAttribute('data-uso-cfdi') || '-';
                document.getElementById('clienteCiudad').textContent = option.getAttribute('data-ciudad') || '-';
                
                infoDiv.style.display = 'block';
            }
            
            hideClientInfo() {
                const infoDiv = document.getElementById('clienteInfo');
                if (infoDiv) infoDiv.style.display = 'none';
            }
        }
        
        class PopupCalculations {
            constructor() {
                this.setupEvents();
            }
            
            setupEvents() {
                document.addEventListener('input', (e) => {
                    if (e.target.matches('.cantidad, .precioUnitario, .descuento')) {
                        this.calculateTotals();
                    }
                });
                
                document.addEventListener('change', (e) => {
                    if (e.target.matches('.claveUnidad')) {
                        const unidadField = e.target.closest('.producto-row-secondary').querySelector('.unidad');
                        if (e.target.value === 'E48') unidadField.value = 'Unidad de servicio';
                        else if (e.target.value === 'H87') unidadField.value = 'Pieza';
                        else if (e.target.value === 'KGM') unidadField.value = 'Kilogramo';
                    }
                });
            }
            
            calculateTotals() {
                let subtotal = 0, totalDescuentos = 0;
                
                document.querySelectorAll('.producto-row').forEach(row => {
                    const cantidad = parseFloat(row.querySelector('.cantidad').value) || 0;
                    const precio = parseFloat(row.querySelector('.precioUnitario').value) || 0;
                    const secondary = row.nextElementSibling;
                    const descuento = secondary?.querySelector('.descuento') ? 
                        parseFloat(secondary.querySelector('.descuento').value) || 0 : 0;
                    
                    const importe = cantidad * precio;
                    const total = importe - descuento;
                    
                    const totalField = row.querySelector('.totalConcepto');
                    if (totalField) totalField.value = total.toFixed(2);
                    
                    subtotal += importe;
                    totalDescuentos += descuento;
                });
                
                const subtotalNeto = subtotal - totalDescuentos;
                const iva = subtotalNeto * 0.16;
                const total = subtotalNeto + iva;
                
                document.getElementById('subtotal').textContent = ' + subtotal.toFixed(2);
                document.getElementById('totalDescuentos').textContent = ' + totalDescuentos.toFixed(2);
                document.getElementById('iva').textContent = ' + iva.toFixed(2);
                document.getElementById('total').textContent = ' + total.toFixed(2);
            }
        }
        
        class PopupFormHandler {
            constructor() {
                this.setupFormEvents();
                this.generateOrderNumber();
            }
            
            setupFormEvents() {
                const form = document.getElementById('cfdiformulario');
                if (form) {
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        this.handleSubmit();
                    });
                }
            }
            
            generateOrderNumber() {
                const numOrderEl = document.getElementById('numOrder');
                if (numOrderEl) {
                    const timestamp = Date.now();
                    const random = Math.floor(Math.random() * 1000);
                    numOrderEl.value = 'ORD-' + timestamp + '-' + random;
                }
            }
            
            async handleSubmit() {
                if (isProcessing) {
                    alert('⏳ Ya se está procesando una solicitud...');
                    return;
                }
                
                console.log('📝 Procesando formulario...');
                
                const data = this.collectFormData();
                if (!this.validateData(data)) return;
                
                await this.submitCFDI(data);
            }
            
            collectFormData() {
                const conceptos = [];
                document.querySelectorAll('.producto-row').forEach(row => {
                    const secondary = row.nextElementSibling;
                    const cantidad = parseFloat(row.querySelector('.cantidad').value) || 0;
                    const precio = parseFloat(row.querySelector('.precioUnitario').value) || 0;
                    const descuento = secondary?.querySelector('.descuento') ? 
                        parseFloat(secondary.querySelector('.descuento').value) || 0 : 0;
                    
                    const concepto = {
                        ClaveProdServ: row.querySelector('.claveProdServ').value.trim(),
                        ClaveUnidad: secondary?.querySelector('.claveUnidad').value || 'E48',
                        Unidad: secondary?.querySelector('.unidad').value || 'Unidad de servicio',
                        Descripcion: row.querySelector('.descripcion').value.trim(),
                        ObjetoImp: secondary?.querySelector('.objetoImp').value || '02',
                        Cantidad: cantidad,
                        ValorUnitario: precio,
                        Importe: cantidad * precio,
                        Descuento: descuento
                    };
                    
                    if (concepto.ObjetoImp === '02') {
                        const base = concepto.Importe - concepto.Descuento;
                        concepto.Impuestos = {
                            Traslados: [{
                                Base: base,
                                Impuesto: '002',
                                TipoFactor: 'Tasa',
                                TasaOCuota: '0.16',
                                Importe: base * 0.16
                            }]
                        };
                    }
                    
                    conceptos.push(concepto);
                });
                
                return {
                    Receptor: { UID: document.getElementById('receptorUID').value.trim() },
                    TipoDocumento: document.getElementById('tipoDocumento').value,
                    Conceptos: conceptos,
                    UsoCFDI: document.getElementById('usoCFDI').value,
                    Serie: parseInt(document.getElementById('serie').value),
                    FormaPago: document.getElementById('formaPago').value,
                    MetodoPago: document.getElementById('metodoPago').value,
                    Moneda: document.getElementById('moneda').value,
                    EnviarCorreo: document.getElementById('enviarCorreo').checked,
                    NumOrder: document.getElementById('numOrder').value || null,
                    Comentarios: document.getElementById('comentarios').value || null
                };
            }
            
            validateData(data) {
                if (!data.Receptor.UID) {
                    alert('❌ Debe seleccionar un cliente');
                    return false;
                }
                if (!data.Serie) {
                    alert('❌ La serie es obligatoria');
                    return false;
                }
                if (!data.Conceptos.length) {
                    alert('❌ Debe agregar al menos un concepto');
                    return false;
                }
                return true;
            }
            
            async submitCFDI(data) {
                isProcessing = true;
                document.getElementById('loading').style.display = 'block';
                document.getElementById('submitBtn').disabled = true;
                
                try {
                    const ajaxUrl = window.urlAjaxFuncional || popupConfig.ajaxUrl;
                    const formData = new FormData();
                    formData.append('action', 'pos_billing_create_cfdi');
                    formData.append('cfdi_data', JSON.stringify(data));
                    if (popupConfig.nonce) formData.append('nonce', popupConfig.nonce);
                    
                    console.log('📡 Enviando a:', ajaxUrl);
                    
                    const response = await fetch(ajaxUrl, {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        this.showSuccess(result.data);
                    } else {
                        this.showError(result.data || result.message || 'Error desconocido');
                    }
                } catch (error) {
                    console.error('❌ Error:', error);
                    this.showError('Error de conexión: ' + error.message);
                } finally {
                    isProcessing = false;
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('submitBtn').disabled = false;
                }
            }
            
            showSuccess(data) {
                document.getElementById('result-container').className = 'result-container result-success';
                document.getElementById('result-content').innerHTML = 
                    '<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #28a745;">' +
                        '✅ CFDI Generado Exitosamente' +
                    '</div>' +
                    '<div style="background: white; padding: 15px; border-radius: 5px;">' +
                        '<p><strong>UUID:</strong> ' + (data.uuid || 'N/A') + '</p>' +
                        '<p><strong>Folio:</strong> ' + (data.folio || 'N/A') + '</p>' +
                        '<p><strong>Total:</strong>  + (data.total || '0.00') + '</p>' +
                    '</div>' +
                    '<div style="margin-top: 20px; text-align: center;">' +
                        '<button onclick="window.location.reload()" class="btn">🔄 Nueva Factura</button>' +
                        '<button onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>' +
                    '</div>';
                document.getElementById('result-container').style.display = 'block';
            }
            
            showError(error) {
                let errorMsg = typeof error === 'object' ? JSON.stringify(error) : error;
                alert('❌ Error: ' + errorMsg);
            }
        }
        
        // Funciones globales del popup
        function recargarClientes() {
            if (popupModules.clients) {
                popupModules.clients.loadClients();
            }
        }
        
        function mostrarAyudaDetallada() {
            const helpWindow = window.open('', 'ayuda_detallada', 'width=800,height=600,scrollbars=yes,resizable=yes');
            
            const helpContent = '<!DOCTYPE html>' +
                '<html><head><title>Ayuda - Error "No puedes facturar 2"</title>' +
                '<style>' +
                'body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }' +
                '.container { max-width: 700px; margin: 0 auto; }' +
                '.step { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #007cba; }' +
                '.warning { background: #fff3cd; padding: 10px; border-radius: 5px; color: #856404; }' +
                '.success { background: #d4edda; padding: 10px; border-radius: 5px; color: #155724; }' +
                '</style></head><body>' +
                '<div class="container">' +
                '<h1>🔧 Solución para "No puedes facturar 2"</h1>' +
                '<div class="warning">' +
                '<strong>⚠️ Este error indica que tu cuenta de Factura.com no está completamente configurada.</strong>' +
                '</div>' +
                '<div class="step">' +
                '<h3>📋 Verificar Certificados SAT</h3>' +
                '<p>Ve a <a href="https://sandbox.factura.com" target="_blank">Factura.com</a> → Configuración → Certificados</p>' +
                '<ul><li>Debe aparecer tu certificado .cer</li><li>Debe aparecer tu llave .key</li><li>Estado: "Válido"</li></ul>' +
                '</div>' +
                '<div class="step">' +
                '<h3>🔢 Verificar Series</h3>' +
                '<p>Ve a Configuración → Series</p>' +
                '<ul><li>Debe existir la serie ID: 1212</li><li>Estado: "Activa"</li><li>Tipo: "Factura"</li></ul>' +
                '</div>' +
                '<div class="step">' +
                '<h3>👤 Verificar Receptor</h3>' +
                '<p>Ve a Receptores → Buscar</p>' +
                '<ul><li>Busca UID: 67a93f71cdddb</li><li>Debe existir y estar activo</li></ul>' +
                '</div>' +
                '<div class="success">' +
                '<strong>✅ Si todo está configurado y sigue fallando:</strong><br>' +
                'Contacta al soporte de Factura.com con esta información específica.' +
                '</div>' +
                '<p style="text-align: center; margin-top: 30px;">' +
                '<button onclick="window.close()" style="background: #007cba; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cerrar</button>' +
                '</p>' +
                '</div></body></html>';
            
            helpWindow.document.write(helpContent);
            helpWindow.document.close();
            helpWindow.focus();
        }
        
        // Inicialización del popup
        window.addEventListener('load', function() {
            console.log('🚀 Inicializando popup...');
            
            // Inicializar módulos
            popupModules.clients = new PopupClients();
            popupModules.calculations = new PopupCalculations();
            popupModules.formHandler = new PopupFormHandler();
            
            // Calcular totales inicial
            setTimeout(() => {
                if (popupModules.calculations) {
                    popupModules.calculations.calculateTotals();
                }
            }, 100);
            
            console.log('✅ Popup inicializado correctamente');
        });
        </script>`;
    }
    
    /**
     * Cerrar popup
     */
    closePopup() {
        if (this.popup && !this.popup.closed) {
            this.popup.close();
        }
        this.isOpen = false;
        this.popup = null;
    }
    
    /**
     * Verificar si el popup está abierto
     */
    isPopupOpen() {
        return this.isOpen && this.popup && !this.popup.closed;
    }
    
    /**
     * Enviar mensaje al popup
     */
    sendMessageToPopup(message) {
        if (this.popup && !this.popup.closed) {
            this.popup.postMessage(message, '*');
        }
    }
    
    /**
     * Manejar mensajes del popup
     */
    setupMessageHandling() {
        window.addEventListener('message', (event) => {
            if (event.source === this.popup) {
                this.handlePopupMessage(event.data);
            }
        });
    }
    
    /**
     * Manejar mensajes recibidos del popup
     */
    handlePopupMessage(data) {
        switch (data.type) {
            case 'popup_ready':
                this.log('Popup está listo');
                break;
            case 'cfdi_created':
                this.log('CFDI creado exitosamente', 'success', data.cfdi);
                break;
            case 'error':
                this.log('Error en popup', 'error', data.error);
                break;
            case 'close_request':
                this.closePopup();
                break;
        }
    }
    
    /**
     * Recargar el popup
     */
    reloadPopup() {
        if (this.popup && !this.popup.closed) {
            this.popup.location.reload();
        }
    }
    
    /**
     * Obtener estado del popup
     */
    getPopupState() {
        return {
            isOpen: this.isOpen,
            isClosed: !this.popup || this.popup.closed,
            url: this.popup ? this.popup.location.href : null
        };
    }
    
    /**
     * Aplicar tema al popup
     */
    applyTheme(theme = 'default') {
        if (!this.popup || this.popup.closed) return;
        
        const themes = {
            dark: {
                '--bg-primary': '#1a1a1a',
                '--bg-secondary': '#2d2d2d',
                '--text-primary': '#ffffff',
                '--text-secondary': '#cccccc',
                '--border-color': '#404040'
            },
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8f9fa',
                '--text-primary': '#333333',
                '--text-secondary': '#666666',
                '--border-color': '#e1e5e9'
            }
        };
        
        if (themes[theme]) {
            const style = this.popup.document.createElement('style');
            style.textContent = `:root { ${Object.entries(themes[theme]).map(([key, value]) => `${key}: ${value}`).join('; ')} }`;
            this.popup.document.head.appendChild(style);
        }
    }
    
    /**
     * Configurar atajos de teclado del popup
     */
    setupKeyboardShortcuts() {
        if (!this.popup || this.popup.closed) return;
        
        this.popup.document.addEventListener('keydown', (e) => {
            // Ctrl + S para enviar formulario
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                const form = this.popup.document.getElementById('cfdiformulario');
                if (form) form.dispatchEvent(new Event('submit'));
            }
            
            // Escape para cerrar
            if (e.key === 'Escape') {
                this.closePopup();
            }
            
            // Ctrl + R para recargar clientes
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                if (this.popup.recargarClientes) {
                    this.popup.recargarClientes();
                }
            }
        });
    }
    
    /**
     * Log con prefijo del módulo
     */
    log(message, type = 'info', data = null) {
        if (this.utils) {
            this.utils.log(`[Popup] ${message}`, type, data);
        } else {
            console.log(`[POS Billing - Popup] ${message}`, data);
        }
    }
}

// Hacer disponible globalmente
window.POSBillingPopupManager = POSBillingPopupManager;