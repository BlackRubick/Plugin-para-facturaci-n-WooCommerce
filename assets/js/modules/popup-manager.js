
class POSBillingPopupManager {
    constructor(config) {
        this.config = config;
        this.popup = null;
        this.isOpen = false;
        this.utils = window.POSBilling?.modules?.utils;
        this.retryCount = 0;
        this.maxRetries = 3;
        console.log('🚀 PopupManager inicializado');
    }
    
    /**
     * Abrir popup de facturación
     */
    openBillingPopup() {
        this.log('Abriendo popup de facturación...');
        
        if (this.isOpen && this.popup && !this.popup.closed) {
            this.popup.focus();
            this.log('Popup ya abierto, enfocando...');
            return;
        }
        
        try {
            this.popup = window.open(
                "about:blank",
                "pos_facturacion",
                "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
            );
            
            if (!this.popup || this.popup.closed) {
                this.handlePopupBlocked();
                return;
            }
            
            this.log('✅ Popup abierto exitosamente');
            this.isOpen = true;
            this.writePopupContent();
            this.setupPopupMonitoring();
            
        } catch (error) {
            this.log('❌ Error abriendo popup: ' + error.message, 'error');
            this.handlePopupBlocked();
        }
    }
    
    /**
     * Escribir contenido del popup
     */
    writePopupContent() {
        if (!this.popup || this.popup.closed) {
            this.log('❌ No se puede escribir contenido, popup cerrado', 'error');
            return;
        }
        
        try {
            this.log('📝 Escribiendo contenido del popup...');
            
            const htmlContent = this.generateCompleteHTML();
            
            this.popup.document.open();
            this.popup.document.write(htmlContent);
            this.popup.document.close();
            this.popup.focus();
            
            this.log('✅ Contenido del popup escrito exitosamente');
            
        } catch (error) {
            this.log('❌ Error escribiendo contenido: ' + error.message, 'error');
            this.closePopup();
        }
    }
    
    /**
     * Generar HTML completo del popup
     */
    generateCompleteHTML() {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POS Facturación - CFDI 4.0</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { 
            background: white; 
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 1000px; 
            margin: 0 auto; 
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }
        .header h1 {
            color: #333;
            margin: 0;
            font-size: 28px;
        }
        .status {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2196f3;
        }
        .form-group { 
            margin-bottom: 20px; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 600; 
            color: #333;
        }
        .form-group input, .form-group select, .form-group textarea { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #e1e5e9; 
            border-radius: 8px; 
            font-size: 14px;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus, .form-group select:focus { 
            outline: none; 
            border-color: #667eea; 
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .form-row { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
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
        .btn-cancel { background: #6c757d; }
        .btn-cancel:hover { background: #545b62; }
        .btn-reload { 
            background: #17a2b8; 
            font-size: 12px; 
            padding: 8px 12px; 
            margin-left: 10px;
        }
        .required { color: #dc3545; }
        .totals {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid #dee2e6;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .total-final {
            font-weight: bold;
            font-size: 20px;
            color: #28a745;
            border-top: 2px solid #333;
            padding-top: 10px;
        }
        .loading { 
            display: none; 
            text-align: center; 
            padding: 30px;
            background: rgba(255,255,255,0.9);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
        }
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .result {
            margin-top: 20px;
            padding: 20px;
            border-radius: 8px;
            display: none;
        }
        .result.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .result.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .help-text {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
        }
        
        @media (max-width: 768px) {
            .container { padding: 15px; margin: 10px; }
            .form-row { grid-template-columns: 1fr; }
            .header h1 { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📄 Sistema de Facturación CFDI 4.0</h1>
            <p>Integración con Factura.com</p>
        </div>
        
        <div class="status">
            <strong>Estado:</strong> <span id="status">Inicializando...</span>
        </div>
        
        <form id="facturacionForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Cliente <span class="required">*</span>
                        <button type="button" onclick="recargarClientes()" class="btn btn-reload">🔄</button>
                    </label>
                    <select id="cliente" required>
                        <option value="">⏳ Cargando clientes...</option>
                    </select>
                    <div class="help-text">Selecciona un cliente de tu catálogo</div>
                </div>
                
                <div class="form-group">
                    <label>Serie <span class="required">*</span></label>
                    <input type="number" id="serie" placeholder="ej: 5483035" required>
                    <div class="help-text">ID de la serie configurada en Factura.com</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Descripción <span class="required">*</span></label>
                    <input type="text" id="descripcion" placeholder="Descripción del producto/servicio" required>
                </div>
                <div class="form-group">
                    <label>Clave Producto/Servicio <span class="required">*</span></label>
                    <input type="text" id="claveProd" placeholder="ej: 43232408" required>
                    <div class="help-text">Clave del SAT del producto</div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Cantidad <span class="required">*</span></label>
                    <input type="number" id="cantidad" value="1" step="0.01" min="0.01" required>
                </div>
                <div class="form-group">
                    <label>Precio Unitario <span class="required">*</span></label>
                    <input type="number" id="precio" step="0.01" min="0.01" required>
                </div>
            </div>
            
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span id="subtotal">$0.00</span>
                </div>
                <div class="total-row">
                    <span>IVA (16%):</span>
                    <span id="iva">$0.00</span>
                </div>
                <div class="total-row total-final">
                    <span>Total:</span>
                    <span id="total">$0.00</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button type="submit" class="btn" id="generarBtn">📄 Generar CFDI</button>
                <button type="button" onclick="limpiarFormulario()" class="btn btn-cancel">🗑️ Limpiar</button>
                <button type="button" onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>
            </div>
        </form>
        
        <div id="resultado" class="result"></div>
    </div>
    
    <div id="loading" class="loading">
        <div class="loading-spinner"></div>
        <h3>⏳ Generando CFDI...</h3>
        <p>Por favor espere...</p>
    </div>

    <script>
        console.log('🚀 Script del popup iniciando...');
        
        let clientes = [];
        let isProcessing = false;
        let urlFuncional = null;
        
        window.addEventListener('load', function() {
            console.log('📄 DOM del popup cargado');
            updateStatus('Conectando con WordPress...');
            
            setTimeout(() => {
                inicializarPopup();
            }, 100);
        });
        
        async function inicializarPopup() {
            console.log('🔧 Inicializando popup...');
            
            try {
                updateStatus('Cargando clientes...');
                await cargarClientes();
                
                updateStatus('Configurando eventos...');
                configurarEventos();
                
                updateStatus('✅ Listo para facturar');
                console.log('✅ Popup inicializado correctamente');
                
            } catch (error) {
                console.error('❌ Error inicializando popup:', error);
                updateStatus('❌ Error de inicialización: ' + error.message);
            }
        }
        
        function updateStatus(mensaje) {
            const statusElement = document.getElementById('status');
            if (statusElement) {
                statusElement.textContent = mensaje;
                console.log('📊 Estado:', mensaje);
            }
        }
        
        async function cargarClientes() {
            console.log('🔄 Cargando clientes...');
            const selectCliente = document.getElementById('cliente');
            
            const urls = [
                '/wp-admin/admin-ajax.php',
                '/pos-dashboard/wp-admin/admin-ajax.php',
                window.location.origin + '/wp-admin/admin-ajax.php',
                window.location.origin + '/pos-dashboard/wp-admin/admin-ajax.php'
            ];
            
            for (const url of urls) {
                try {
                    console.log('🌐 Probando URL:', url);
                    
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'action=pos_billing_get_clients'
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && Array.isArray(data.data)) {
                            console.log('✅ Clientes cargados exitosamente:', data.data.length);
                            
                            selectCliente.innerHTML = '<option value="">Seleccionar cliente...</option>';
                            data.data.forEach(client => {
                                const option = document.createElement('option');
                                option.value = client.uid;
                                option.textContent = client.display_name;
                                selectCliente.appendChild(option);
                            });
                            
                            clientes = data.data;
                            urlFuncional = url;
                            return;
                        }
                    }
                } catch (e) {
                    console.log('⚠️ Error con URL ' + url + ':', e.message);
                }
            }
            
            throw new Error('No se pudo conectar con WordPress');
        }
        
        async function recargarClientes() {
            updateStatus('Recargando clientes...');
            try {
                await cargarClientes();
                updateStatus('✅ Clientes recargados');
            } catch (error) {
                updateStatus('❌ Error recargando clientes');
            }
        }
        
        function configurarEventos() {
            console.log('⚙️ Configurando eventos...');
            
            const cantidad = document.getElementById('cantidad');
            const precio = document.getElementById('precio');
            
            function calcularTotales() {
                console.log('🧮 Calculando totales...');
                const c = parseFloat(cantidad.value) || 0;
                const p = parseFloat(precio.value) || 0;
                const subtotal = c * p;
                const iva = subtotal * 0.16;
                const total = subtotal + iva;
                
                console.log('📊 Cálculos:', {
                    cantidad: c,
                    precio: p,
                    subtotal: subtotal,
                    iva: iva,
                    total: total
                });
                
                document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
                document.getElementById('iva').textContent = '$' + iva.toFixed(2);
                document.getElementById('total').textContent = '$' + total.toFixed(2);
            }
            
            if (cantidad && precio) {
                cantidad.addEventListener('input', calcularTotales);
                cantidad.addEventListener('change', calcularTotales);
                cantidad.addEventListener('keyup', calcularTotales);
                
                precio.addEventListener('input', calcularTotales);
                precio.addEventListener('change', calcularTotales);
                precio.addEventListener('keyup', calcularTotales);
                
                console.log('✅ Eventos de cálculo configurados');
                calcularTotales();
            } else {
                console.error('❌ No se encontraron los campos cantidad o precio');
            }
            
            const form = document.getElementById('facturacionForm');
            if (form) {
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('📝 Formulario enviado');
                    await generarCFDI();
                });
                console.log('✅ Evento de envío configurado');
            } else {
                console.error('❌ No se encontró el formulario');
            }
            
            console.log('✅ Todos los eventos configurados');
        }
        
        async function generarCFDI() {
            if (isProcessing) {
                alert('⏳ Ya se está procesando una solicitud...');
                return;
            }
            
            console.log('📝 Iniciando generación de CFDI...');
            isProcessing = true;
            
            document.getElementById('loading').style.display = 'block';
            const generarBtn = document.getElementById('generarBtn');
            generarBtn.disabled = true;
            generarBtn.textContent = '⏳ Generando...';
            
            try {
                console.log('🔍 Validando formulario...');
                if (!validarFormulario()) {
                    console.log('❌ Validación fallida');
                    return;
                }
                
                console.log('📋 Recopilando datos...');
                const cantidad = parseFloat(document.getElementById('cantidad').value);
                const precio = parseFloat(document.getElementById('precio').value);
                const subtotal = cantidad * precio;
                const iva = subtotal * 0.16;
                const total = subtotal + iva;
                
                const cfdiData = {
                    Receptor: {
                        UID: document.getElementById('cliente').value.trim()
                    },
                    TipoDocumento: "factura",
                    Conceptos: [{
                        ClaveProdServ: document.getElementById('claveProd').value.trim(),
                        Cantidad: cantidad,
                        ClaveUnidad: "E48",
                        Unidad: "Unidad de servicio",
                        Descripcion: document.getElementById('descripcion').value.trim(),
                        ValorUnitario: precio,
                        Importe: subtotal,
                        ObjetoImp: "02",
                        Impuestos: {
                            Traslados: [{
                                Base: subtotal,
                                Impuesto: "002",
                                TipoFactor: "Tasa",
                                TasaOCuota: "0.16",
                                Importe: iva
                            }]
                        }
                    }],
                    UsoCFDI: "G01",
                    Serie: parseInt(document.getElementById('serie').value),
                    FormaPago: "01",
                    MetodoPago: "PUE",
                    Moneda: "MXN",
                    EnviarCorreo: false
                };
                
                console.log('📡 Datos del CFDI preparados:', cfdiData);
                console.log('💰 Totales calculados:', {
                    subtotal: subtotal,
                    iva: iva,
                    total: total
                });
                
                if (!urlFuncional) {
                    console.log('🔍 URL funcional no detectada, usando fallback...');
                    urlFuncional = '/wp-admin/admin-ajax.php';
                }
                
                console.log('🌐 Enviando a:', urlFuncional);
                
                const formData = new FormData();
                formData.append('action', 'pos_billing_create_cfdi');
                formData.append('cfdi_data', JSON.stringify(cfdiData));
                
                const response = await fetch(urlFuncional, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                console.log('📨 Respuesta HTTP:', response.status, response.statusText);
                
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status + ': ' + response.statusText);
                }
                
                const result = await response.json();
                console.log('📨 Respuesta completa:', result);
                
                if (result.success) {
                    console.log('✅ CFDI generado exitosamente');
                    mostrarResultado(
                        '🎉 ¡CFDI generado exitosamente!\\n\\n' +
                        '📄 UUID: ' + (result.data.uuid || 'N/A') + '\\n' +
                        '🔢 Folio: ' + (result.data.folio || 'N/A') + '\\n' +
                        '💰 Total: $' + (result.data.total || total.toFixed(2)) + '\\n' +
                        '📅 Fecha: ' + (result.data.fecha_timbrado || new Date().toLocaleString()),
                        'success'
                    );
                } else {
                    console.error('❌ Error en la respuesta:', result);
                    
                    let errorMsg = 'Error desconocido';
                    if (typeof result.data === 'string') {
                        errorMsg = result.data;
                    } else if (result.data && result.data.message) {
                        errorMsg = result.data.message;
                    } else if (result.message) {
                        errorMsg = result.message;
                    }
                    
                    mostrarResultado(
                        '❌ Error al generar CFDI:\\n\\n' + errorMsg + '\\n\\n' +
                        '💡 Posibles soluciones:\\n' +
                        '• Verifica que la serie esté activa en Factura.com\\n' +
                        '• Confirma que el cliente exista y esté activo\\n' +
                        '• Revisa tus certificados SAT\\n' +
                        '• Contacta al administrador si persiste el error',
                        'error'
                    );
                }
                
            } catch (error) {
                console.error('❌ Error de conexión:', error);
                mostrarResultado(
                    '❌ Error de conexión:\\n\\n' + error.message + '\\n\\n' +
                    '🔧 Verifica:\\n' +
                    '• Tu conexión a internet\\n' +
                    '• Que WordPress esté funcionando\\n' +
                    '• La configuración del plugin',
                    'error'
                );
            } finally {
                isProcessing = false;
                document.getElementById('loading').style.display = 'none';
                generarBtn.disabled = false;
                generarBtn.textContent = '📄 Generar CFDI';
            }
        }
        
        function validarFormulario() {
            console.log('🔍 Validando formulario...');
            
            const campos = [
                { id: 'cliente', nombre: 'Cliente', tipo: 'select' },
                { id: 'serie', nombre: 'Serie', tipo: 'number', min: 1 },
                { id: 'descripcion', nombre: 'Descripción', tipo: 'text' },
                { id: 'claveProd', nombre: 'Clave de producto', tipo: 'text', minLength: 6 },
                { id: 'cantidad', nombre: 'Cantidad', tipo: 'number', min: 0.01 },
                { id: 'precio', nombre: 'Precio', tipo: 'number', min: 0.01 }
            ];
            
            for (const campo of campos) {
                const elemento = document.getElementById(campo.id);
                
                if (!elemento) {
                    console.error('❌ Campo no encontrado:', campo.id);
                    alert('Error interno: Campo ' + campo.nombre + ' no encontrado');
                    return false;
                }
                
                const valor = elemento.value.trim();
                
                if (!valor) {
                    console.log('❌ Campo vacío:', campo.nombre);
                    alert('❌ El campo "' + campo.nombre + '" es requerido');
                    elemento.focus();
                    elemento.style.borderColor = '#dc3545';
                    return false;
                }
                
                if (campo.tipo === 'number') {
                    const numero = parseFloat(valor);
                    if (isNaN(numero)) {
                        console.log('❌ No es un número válido:', campo.nombre, valor);
                        alert('❌ El campo "' + campo.nombre + '" debe ser un número válido');
                        elemento.focus();
                        elemento.style.borderColor = '#dc3545';
                        return false;
                    }
                    if (campo.min !== undefined && numero < campo.min) {
                        console.log('❌ Número menor al mínimo:', campo.nombre, numero, '<', campo.min);
                        alert('❌ El campo "' + campo.nombre + '" debe ser mayor o igual a ' + campo.min);
                        elemento.focus();
                        elemento.style.borderColor = '#dc3545';
                        return false;
                    }
                }
                
                if (campo.minLength && valor.length < campo.minLength) {
                    console.log('❌ Texto muy corto:', campo.nombre, valor.length, '<', campo.minLength);
                    alert('❌ El campo "' + campo.nombre + '" debe tener al menos ' + campo.minLength + ' caracteres');
                    elemento.focus();
                    elemento.style.borderColor = '#dc3545';
                    return false;
                }
                
                elemento.style.borderColor = '';
                console.log('✅ Campo válido:', campo.nombre, '=', valor);
            }
            
            const cantidad = parseFloat(document.getElementById('cantidad').value);
            const precio = parseFloat(document.getElementById('precio').value);
            const total = cantidad * precio;
            
            if (total <= 0) {
                alert('❌ El total debe ser mayor a $0.00');
                return false;
            }
            
            console.log('✅ Formulario válido. Total calculado: $' + total.toFixed(2));
            return true;
        }
        
        function mostrarResultado(mensaje, tipo) {
            const resultado = document.getElementById('resultado');
            resultado.className = 'result ' + tipo;
            resultado.innerHTML = '<pre>' + mensaje + '</pre>';
            resultado.style.display = 'block';
            resultado.scrollIntoView({ behavior: 'smooth' });
        }
        
        function limpiarFormulario() {
            if (confirm('¿Estás seguro de limpiar el formulario?')) {
                document.getElementById('facturacionForm').reset();
                document.getElementById('cantidad').value = '1';
                document.getElementById('resultado').style.display = 'none';
                document.getElementById('cantidad').dispatchEvent(new Event('input'));
            }
        }
        
        console.log('✅ Script del popup cargado completamente');
    </script>
</body>
</html>`;
    }
    
    /**
     * Configurar monitoreo del popup
     */
    setupPopupMonitoring() {
        const checkInterval = setInterval(() => {
            if (!this.popup || this.popup.closed) {
                this.log('Popup cerrado por el usuario');
                this.isOpen = false;
                clearInterval(checkInterval);
            }
        }, 1000);
        
        try {
            this.popup.addEventListener('beforeunload', () => {
                this.log('Popup a punto de cerrarse');
                this.isOpen = false;
            });
        } catch (e) {
            // Ignorar errores de cross-origin
        }
    }
    
    /**
     * Manejar popup bloqueado
     */
    handlePopupBlocked() {
        this.log('Popup bloqueado por el navegador', 'warn');
        
        const message = '🚫 Ventana emergente bloqueada\n\nPara usar el sistema de facturación, necesitas:\n\n1. Permitir ventanas emergentes para este sitio\n2. Desactivar bloqueadores de popups\n3. Actualizar la página y volver a intentar\n\n¿Deseas intentar nuevamente?';
        
        if (confirm(message)) {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                this.log(`Reintentando abrir popup (${this.retryCount}/${this.maxRetries})`);
                setTimeout(() => this.openBillingPopup(), 1000);
            } else {
                alert('Se alcanzó el máximo de reintentos. Por favor, configura tu navegador para permitir ventanas emergentes.');
            }
        }
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
        this.retryCount = 0;
        this.log('Popup cerrado manualmente');
    }
    
    /**
     * Verificar si el popup está abierto
     */
    isPopupOpen() {
        return this.isOpen && this.popup && !this.popup.closed;
    }
    
    /**
     * Log con prefijo del módulo
     */
    log(message, type = 'info', data = null) {
        if (this.utils) {
            this.utils.log(`[Popup] ${message}`, type, data);
        } else {
            const prefix = `[POS Popup] ${message}`;
            if (type === 'error') {
                console.error(prefix, data);
            } else if (type === 'warn') {
                console.warn(prefix, data);
            } else {
                console.log(prefix, data);
            }
        }
    }
}

// Hacer disponible globalmente
window.POSBillingPopupManager = POSBillingPopupManager;

console.log('✅ POSBillingPopupManager con sintaxis corregida cargado correctamente');