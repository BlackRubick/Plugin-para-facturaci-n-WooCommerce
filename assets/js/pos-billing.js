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
        '<h1> Solución para "No puedes facturar 2"</h1>' +
        '<div class="warning">' +
        '<strong> Este error indica que tu cuenta de Factura.com no está completamente configurada.</strong>' +
        '</div>' +
        '<div class="step">' +
        '<h3> Verificar Certificados SAT</h3>' +
        '<p>Ve a <a href="https://sandbox.factura.com" target="_blank">Factura.com</a> → Configuración → Certificados</p>' +
        '<ul><li>Debe aparecer tu certificado .cer</li><li>Debe aparecer tu llave .key</li><li>Estado: "Válido"</li></ul>' +
        '</div>' +
        '<div class="step">' +
        '<h3> Verificar Series</h3>' +
        '<p>Ve a Configuración → Series</p>' +
        '<ul><li>Debe existir la serie ID: 1212</li><li>Estado: "Activa"</li><li>Tipo: "Factura"</li></ul>' +
        '</div>' +
        '<div class="step">' +
        '<h3> Verificar Receptor</h3>' +
        '<p>Ve a Receptores → Buscar</p>' +
        '<ul><li>Busca UID: 67a93f71cdddb</li><li>Debe existir y estar activo</li></ul>' +
        '</div>' +
        '<div class="success">' +
        '<strong> Si todo está configurado y sigue fallando:</strong><br>' +
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

document.addEventListener("DOMContentLoaded", function () {
  const billingBtn = document.getElementById("pos-billing-btn");

  if (billingBtn) {
    billingBtn.addEventListener("click", function () {
      abrirModuloFacturacion();
    });

    billingBtn.addEventListener("mouseover", function () {
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
    });

    billingBtn.addEventListener("mouseout", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
    });
  }
});

function abrirModuloFacturacion() {
  const popup = window.open(
    "",
    "facturacion",
    "width=1200,height=800,scrollbars=yes,resizable=yes"
  );

  if (popup) {
    const htmlContent = 
`<!DOCTYPE html>
<html>
<head>
    <title>Sistema de Facturación CFDI 4.0</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; line-height: 1.6; }
        .container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 1100px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
        .header h1 { color: #333; margin: 0; font-size: 28px; }
        .header p { color: #666; margin: 10px 0 0 0; font-size: 16px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; box-sizing: border-box; font-size: 14px; transition: border-color 0.3s ease; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
        .btn { padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px; font-weight: 600; transition: all 0.3s ease; }
        .btn:hover { background: #218838; transform: translateY(-1px); }
        .btn:disabled { background: #6c757d; cursor: not-allowed; transform: none; }
        .btn-cancel { background: #6c757d; }
        .btn-cancel:hover { background: #545b62; }
        .btn-add { background: #007bff; }
        .btn-add:hover { background: #0056b3; }
        .btn-remove { background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; position: absolute; top: 15px; right: 15px; font-size: 18px; display: flex; align-items: center; justify-content: center; }
        .totals { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #dee2e6; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; }
        .total-final { font-weight: bold; font-size: 20px; border-top: 2px solid #333; padding-top: 15px; color: #28a745; }
        .producto-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 40px; gap: 15px; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px; position: relative; border: 2px solid #e9ecef; }
        .producto-row-secondary { margin-bottom: 20px; padding: 20px; background: #f1f3f4; border-radius: 10px; border: 1px solid #dee2e6; }
        .section { margin-bottom: 35px; padding-bottom: 25px; border-bottom: 2px solid #eee; }
        .section:last-child { border-bottom: none; }
        .section h3 { color: #333; margin-bottom: 20px; font-size: 20px; display: flex; align-items: center; gap: 10px; }
        .form-actions { text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #eee; }
        .required { color: #dc3545; }
        .help-text { font-size: 12px; color: #6c757d; margin-top: 5px; }
        .alert { padding: 15px; margin-bottom: 20px; border: 1px solid transparent; border-radius: 8px; }
        .alert-info { color: #0c5460; background-color: #d1ecf1; border-color: #bee5eb; }
        .alert-success { color: #155724; background-color: #d4edda; border-color: #c3e6cb; }
        .alert-danger { color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; }
        .loading { display: none; text-align: center; padding: 20px; }
        .loading-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .result-container { display: none; background: #f8f9fa; border-radius: 10px; padding: 25px; margin-top: 20px; }
        .result-success { border-left: 5px solid #28a745; }
        .result-error { border-left: 5px solid #dc3545; }
        .readonly-field { background-color: #f8f9fa !important; color: #495057; }
        .btn-reload { background: #17a2b8; font-size: 12px; padding: 8px 12px; margin-left: 10px; }
        .btn-reload:hover { background: #138496; }
        
        /* NUEVOS ESTILOS PARA IMPORTAR PEDIDO */
        .import-order-section { 
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 25px; 
            border-left: 4px solid #2196f3; 
        }
        .import-order-section h3 { 
            color: #1976d2; 
            margin: 0 0 15px 0; 
            font-size: 18px; 
        }
        .btn-import { 
            background: #2196f3; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px; 
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-import:hover { 
            background: #1976d2; 
            transform: translateY(-1px); 
        }
        .import-order-input { 
            display: none; 
            margin-top: 15px; 
        }
        .import-order-input.show { 
            display: block; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1> Sistema de Facturación CFDI 4.0</h1>
            <p>Integración con Factura.com - Generar nueva factura</p>
        </div>
        
        <div class="alert alert-info">
            <strong> Información:</strong> Los totales se calculan automáticamente cuando ingresas cantidad y precio.
        </div>
        
        <form id="cfdiformulario">
            <div class="section">
                <h3> Datos del Receptor</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente <span class="required">*</span>
                            <button type="button" onclick="recargarClientes()" class="btn btn-reload" title="Recargar lista de clientes">🔄</button>
                        </label>
                        <select id="receptorUID" required>
                            <option value=""> Cargando clientes...</option>
                        </select>
                        <div class="help-text">Selecciona un cliente de tu catálogo de Factura.com</div>
                        <div class="help-text" style="font-size: 11px; color: #888;">
                             <strong>Tip:</strong> Si no aparece tu cliente, agrégalo en el panel de Factura.com y recarga la lista
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
                         Información del Cliente Seleccionado
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div><strong>RFC:</strong> <span id="clienteRFC" style="color: #666;">-</span></div>
                        <div><strong>Email:</strong> <span id="clienteEmail" style="color: #666;">-</span></div>
                        <div><strong>Uso CFDI:</strong> <span id="clienteUsoCFDI" style="color: #666;">-</span></div>
                        <div><strong>Ciudad:</strong> <span id="clienteCiudad" style="color: #666;">-</span></div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3> Configuración del CFDI</h3>
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
            </div>
            
            <!-- NUEVA SECCIÓN PARA IMPORTAR PEDIDO -->
            <div class="import-order-section">
                <h3>📦 Importar Pedido</h3>
                <p style="margin: 0 0 15px 0; color: #666;">Importa los datos de un pedido existente para agilizar la creación de la factura.</p>
                <button type="button" id="toggleImportOrder" class="btn-import">
                    📥 Importar Pedido
                </button>
                <div id="importOrderInput" class="import-order-input">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Número de Pedido</label>
                            <input type="text" id="numeroPedido" placeholder="Ingresa el número de pedido">
                            <div class="help-text">Ejemplo: PED-2024-001, ORD-123456, etc.</div>
                        </div>
                        <div class="form-group" style="display: flex; align-items: end; gap: 10px;">
                            <button type="button" id="buscarPedido" class="btn btn-add" style="margin: 0;">
                                🔍 Buscar Pedido
                            </button>
                            <button type="button" id="cancelarImport" class="btn btn-cancel" style="margin: 0;">
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                    <div id="pedidoInfo" style="display: none; margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #ddd;">
                        <h4 style="margin: 0 0 10px 0; color: #28a745;">✅ Pedido Encontrado</h4>
                        <div id="pedidoDetalles"></div>
                        <button type="button" id="aplicarPedido" class="btn" style="margin-top: 10px;">
                            ✅ Aplicar Datos del Pedido
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3> Conceptos/Productos</h3>
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
            </div>
            
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
            </div>
            
            <div class="section">
                <h3> Opciones Adicionales</h3>
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
            </div>
            
            <div id="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>Generando CFDI, por favor espere...</p>
            </div>
            
            <div id="result-container" class="result-container">
                <div id="result-content"></div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn" id="submitBtn"> Generar CFDI</button>
                <button type="button" onclick="window.close()" class="btn btn-cancel"> Cancelar</button>
            </div>
        </form>
    </div>
    
    <script>
      // ✅ PASO 3: AGREGAR FUNCIONALIDAD CREAR CFDI
console.log('🔥 PASO 3 - Agregando funcionalidad crear CFDI');

let isProcessing = false;

/**
 * ✅ FUNCIÓN PARA CARGAR CLIENTES (que ya sabemos que funciona)
 */
function cargarClientes() {
    console.log(' Cargando clientes desde Factura.com...');
    
    const selectElement = document.getElementById('receptorUID');
    if (!selectElement) {
        console.error('❌ No se encontró el elemento receptorUID');
        return;
    }
    
    console.log(' Elemento receptorUID encontrado: SÍ');
    
    selectElement.innerHTML = '<option value="" disabled>⏳ Detectando WordPress y cargando clientes...</option>';
    selectElement.disabled = true;
    
    console.log('🔍 DETECTANDO URL CORRECTA...');
    
    const urls = [
        '/wp-admin/admin-ajax.php',
        '/pos-dashboard/wp-admin/admin-ajax.php',
        window.location.origin + '/wp-admin/admin-ajax.php',
        window.location.origin + '/pos-dashboard/wp-admin/admin-ajax.php'
    ];
    
    console.log('URL actual del popup:', window.location.href);
    console.log('Origin:', window.location.origin);
    
    probarURLsClientes(urls, selectElement);
}

/**
 * ✅ FUNCIÓN PARA PROBAR URLs (que ya sabemos que funciona)
 */
async function probarURLsClientes(urls, selectElement) {
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log('🧪 Probando URL ' + (i + 1) + ': ' + url);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=pos_billing_get_clients'
            });
            
            console.log('   📡 Status: ' + response.status);
            
            if (response.status === 200) {
                const data = await response.json();
                console.log('   ✅ ¡FUNCIONA! URL correcta: ' + url);
                console.log('   📋 Respuesta:', data);
                
                if (data.success && data.data && Array.isArray(data.data)) {
                    selectElement.innerHTML = '<option value="">Seleccionar cliente...</option>';
                    
                    data.data.forEach((client, index) => {
                        const option = document.createElement('option');
                        option.value = client.uid;
                        option.textContent = client.display_name;
                        
                        option.setAttribute('data-rfc', client.rfc || '');
                        option.setAttribute('data-email', client.email || '');
                        option.setAttribute('data-uso-cfdi', client.uso_cfdi || 'G01');
                        option.setAttribute('data-ciudad', client.ciudad || '');
                        option.setAttribute('data-razon-social', client.razon_social || '');
                        
                        selectElement.appendChild(option);
                        
                        if (index === 0) {
                            console.log('🔍 Debug primer cliente:', {
                                uid: client.uid,
                                display_name: client.display_name,
                                rfc: client.rfc,
                                email: client.email
                            });
                        }
                    });
                    
                    selectElement.disabled = false;
                    console.log('🎉 ¡Clientes cargados exitosamente!');
                    
                    // ✅ CONFIGURAR EVENTO DE SELECCIÓN DE CLIENTE
                    configurarEventoCliente(selectElement);
                    
                    window.urlAjaxFuncional = url;
                    return;
                } else {
                    console.log('⚠️ Respuesta exitosa pero sin clientes válidos');
                    selectElement.innerHTML = '<option value="">❌ No hay clientes</option>';
                    selectElement.disabled = false;
                    return;
                }
            } else {
                console.log('   ❌ Error HTTP: ' + response.status);
            }
        } catch (error) {
            console.log('   ❌ Error: ' + error.message);
        }
    }
    
    console.error('❌ No se pudo conectar con ninguna URL');
    selectElement.innerHTML = '<option value="">❌ Error de conexión</option>';
    selectElement.disabled = false;
}

/**
 * ✅ NUEVA: CONFIGURAR EVENTO CUANDO SE SELECCIONA UN CLIENTE
 */
function configurarEventoCliente(selectElement) {
    if (!selectElement.hasAttribute('data-event-configured')) {
        selectElement.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value) {
                // Auto-completar uso CFDI si está disponible
                const usoCfdi = selectedOption.getAttribute('data-uso-cfdi');
                if (usoCfdi) {
                    const usoCfdiSelect = document.getElementById('usoCFDI');
                    if (usoCfdiSelect) {
                        usoCfdiSelect.value = usoCfdi;
                    }
                }
                
                // Mostrar información del cliente
                mostrarInfoCliente(selectedOption);
                
                console.log('✅ Cliente seleccionado:', {
                    uid: selectedOption.value,
                    rfc: selectedOption.getAttribute('data-rfc'),
                    razon_social: selectedOption.getAttribute('data-razon-social')
                });
            } else {
                mostrarInfoCliente(null);
            }
        });
        
        selectElement.setAttribute('data-event-configured', 'true');
    }
}

/**
 * ✅ NUEVA: MOSTRAR INFORMACIÓN DEL CLIENTE
 */
function mostrarInfoCliente(option) {
    const infoDiv = document.getElementById('clienteInfo');
    
    if (!option || !option.value || option.value === '') {
        if (infoDiv) {
            infoDiv.style.display = 'none';
        }
        return;
    }
    
    const elementos = {
        'clienteRFC': option.getAttribute('data-rfc') || '-',
        'clienteEmail': option.getAttribute('data-email') || '-',
        'clienteUsoCFDI': option.getAttribute('data-uso-cfdi') || '-',
        'clienteCiudad': option.getAttribute('data-ciudad') || '-'
    };
    
    Object.keys(elementos).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = elementos[id];
        }
    });
    
    if (infoDiv) {
        infoDiv.style.display = 'block';
    }
}

function recargarClientes() {
    console.log('🔄 Recargando lista de clientes...');
    const selectElement = document.getElementById('receptorUID');
    if (selectElement) {
        selectElement.removeAttribute('data-event-configured');
    }
    cargarClientes();
}

/**
 * ✅ FUNCIÓN CALCULAR TOTALES (que ya sabemos que funciona)
 */
function calcularTotales() {
    console.log('🧮 Calculando totales...');
    
    let subtotal = 0;
    let totalDescuentos = 0;
    
    const conceptos = document.querySelectorAll('.producto-row');
    
    conceptos.forEach(function(concepto) {
        const cantidad = parseFloat(concepto.querySelector('.cantidad').value) || 0;
        const precio = parseFloat(concepto.querySelector('.precioUnitario').value) || 0;
        const filaSecundaria = concepto.nextElementSibling;
        const descuento = filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary') ? 
            parseFloat(filaSecundaria.querySelector('.descuento').value) || 0 : 0;
        
        const importeConcepto = cantidad * precio;
        const totalConcepto = importeConcepto - descuento;
        
        const campoTotal = concepto.querySelector('.totalConcepto');
        if (campoTotal) {
            campoTotal.value = totalConcepto.toFixed(2);
        }
        
        subtotal += importeConcepto;
        totalDescuentos += descuento;
    });
    
    const subtotalFinal = subtotal - totalDescuentos;
    const iva = subtotalFinal * 0.16;
    const total = subtotalFinal + iva;
    
    const subtotalEl = document.getElementById('subtotal');
    const totalDescuentosEl = document.getElementById('totalDescuentos');
    const ivaEl = document.getElementById('iva');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = ' + subtotal.toFixed(2);
    if (totalDescuentosEl) totalDescuentosEl.textContent = ' + totalDescuentos.toFixed(2);
    if (ivaEl) ivaEl.textContent = ' + iva.toFixed(2);
    if (totalEl) totalEl.textContent = ' + total.toFixed(2);
}

/**
 * ✅ FUNCIÓN EVENT LISTENERS (que ya sabemos que funciona)
 */
function agregarEventListeners(elemento) {
    const campos = elemento.querySelectorAll('.cantidad, .precioUnitario, .descuento');
    campos.forEach(function(campo) {
        campo.addEventListener('input', calcularTotales);
        campo.addEventListener('change', calcularTotales);
    });
    
    const claveUnidad = elemento.querySelector('.claveUnidad');
    if (claveUnidad) {
        claveUnidad.addEventListener('change', function() {
            const unidadInput = elemento.querySelector('.unidad');
            if (this.value === 'E48') unidadInput.value = 'Unidad de servicio';
            else if (this.value === 'H87') unidadInput.value = 'Pieza';
            else if (this.value === 'KGM') unidadInput.value = 'Kilogramo';
        });
    }
}

// ✅ NUEVAS FUNCIONES PARA CREAR CFDI

/**
 * ✅ NUEVA: FORMATEAR DATOS PARA API
 */
function formatearDatosParaAPI(datos) {
    console.log('📝 Formateando datos para API...');
    
    const datosFormateados = {
        Receptor: { UID: String(datos.Receptor.UID).trim() },
        TipoDocumento: String(datos.TipoDocumento), 
        UsoCFDI: String(datos.UsoCFDI),
        Serie: parseInt(datos.Serie, 10),
        FormaPago: String(datos.FormaPago).padStart(2, '0'),
        MetodoPago: String(datos.MetodoPago),
        Moneda: String(datos.Moneda),
        EnviarCorreo: Boolean(datos.EnviarCorreo)
    };
    
    if (datos.Receptor.ResidenciaFiscal) {
        datosFormateados.Receptor.ResidenciaFiscal = String(datos.Receptor.ResidenciaFiscal);
    }
    
    if (datos.NumOrder) datosFormateados.NumOrder = String(datos.NumOrder);
    if (datos.Comentarios) datosFormateados.Comentarios = String(datos.Comentarios);
    
    datosFormateados.Conceptos = datos.Conceptos.map(concepto => {
        const conceptoFormateado = {
            ClaveProdServ: String(concepto.ClaveProdServ).padStart(8, '0'),
            Cantidad: parseFloat(concepto.Cantidad),
            ClaveUnidad: String(concepto.ClaveUnidad),
            Unidad: String(concepto.Unidad),
            Descripcion: String(concepto.Descripcion),
            ValorUnitario: parseFloat(concepto.ValorUnitario),
            Importe: parseFloat(concepto.Cantidad) * parseFloat(concepto.ValorUnitario),
            ObjetoImp: String(concepto.ObjetoImp).padStart(2, '0')
        };
        
        if (concepto.Descuento && parseFloat(concepto.Descuento) > 0) {
            conceptoFormateado.Descuento = parseFloat(concepto.Descuento);
        }
        
        if (concepto.Impuestos && concepto.Impuestos.Traslados) {
            conceptoFormateado.Impuestos = {
                Traslados: concepto.Impuestos.Traslados.map(traslado => ({
                    Base: parseFloat(traslado.Base),
                    Impuesto: String(traslado.Impuesto).padStart(3, '0'),
                    TipoFactor: String(traslado.TipoFactor),
                    TasaOCuota: String(traslado.TasaOCuota),
                    Importe: parseFloat(traslado.Importe)
                }))
            };
        }
        
        return conceptoFormateado;
    });
    
    console.log('✅ Datos formateados:', datosFormateados);
    return datosFormateados;
}

/**
 * ✅ NUEVA: RECOPILAR DATOS DEL FORMULARIO
 */
function recopilarDatos() {
    console.log(' Recopilando datos del formulario...');
    
    const conceptos = [];
    const filasConceptos = document.querySelectorAll('.producto-row');
    
    filasConceptos.forEach(function(fila) {
        const filaSecundaria = fila.nextElementSibling;
        
        const cantidad = parseFloat(fila.querySelector('.cantidad').value);
        const precioUnitario = parseFloat(fila.querySelector('.precioUnitario').value);
        const descuento = filaSecundaria ? parseFloat(filaSecundaria.querySelector('.descuento').value) || 0 : 0;
        const importe = cantidad * precioUnitario;
        
        const concepto = {
            ClaveProdServ: fila.querySelector('.claveProdServ').value.trim(),
            ClaveUnidad: filaSecundaria ? filaSecundaria.querySelector('.claveUnidad').value : 'E48',
            Unidad: filaSecundaria ? filaSecundaria.querySelector('.unidad').value : 'Unidad de servicio',
            Descripcion: fila.querySelector('.descripcion').value.trim(),
            ObjetoImp: filaSecundaria ? filaSecundaria.querySelector('.objetoImp').value : '02',
            Cantidad: cantidad,
            ValorUnitario: precioUnitario,
            Importe: importe,
            Descuento: descuento
        };
        
        if (concepto.ObjetoImp === '02') {
            const baseGravable = importe - descuento;
            const ivaImporte = baseGravable * 0.16;
            
            concepto.Impuestos = {
                Traslados: [{
                    Base: baseGravable,
                    Impuesto: '002',
                    TipoFactor: 'Tasa',
                    TasaOCuota: 0.16,
                    Importe: ivaImporte
                }]
            };
        }
        
        conceptos.push(concepto);
    });
    
    const datosBasicos = {
        Receptor: {
            UID: document.getElementById('receptorUID').value.trim()
        },
        TipoDocumento: document.getElementById('tipoDocumento').value,
        Conceptos: conceptos,
        UsoCFDI: document.getElementById('usoCFDI').value,
        Serie: document.getElementById('serie').value,
        FormaPago: document.getElementById('formaPago').value,
        MetodoPago: document.getElementById('metodoPago').value,
        Moneda: document.getElementById('moneda').value,
        EnviarCorreo: document.getElementById('enviarCorreo').checked,
        NumOrder: document.getElementById('numOrder').value || null,
        Comentarios: document.getElementById('comentarios').value || null
    };
    
    const residenciaFiscal = document.getElementById('residenciaFiscal').value.trim();
    if (residenciaFiscal) {
        datosBasicos.Receptor.ResidenciaFiscal = residenciaFiscal;
    }
    
    console.log(' Datos recopilados:', datosBasicos);
    return formatearDatosParaAPI(datosBasicos);
}

/**
 * ✅ NUEVA: VALIDAR DATOS
 */
function validarDatos(datos) {
    console.log('✅ Validando datos...');
    
    if (!datos.Receptor.UID) {
        alert('❌ El UID del receptor es obligatorio');
        return false;
    }
    if (!datos.Serie) {
        alert('❌ La serie es obligatoria');
        return false;
    }
    if (datos.Conceptos.length === 0) {
        alert('❌ Debe agregar al menos un concepto');
        return false;
    }
    
    for (let i = 0; i < datos.Conceptos.length; i++) {
        const concepto = datos.Conceptos[i];
        if (!concepto.ClaveProdServ || !concepto.Descripcion) {
            alert('❌ El concepto ' + (i + 1) + ' debe tener descripción y clave de producto/servicio');
            return false;
        }
        if (concepto.Cantidad <= 0) {
            alert('❌ El concepto ' + (i + 1) + ' debe tener cantidad mayor a 0');
            return false;
        }
        if (concepto.ValorUnitario <= 0) {
            alert('❌ El concepto ' + (i + 1) + ' debe tener precio unitario mayor a 0');
            return false;
        }
    }
    
    console.log('✅ Datos válidos');
    return true;
}

/**
 * ✅ NUEVA: ENVIAR CFDI
 */
function enviarCFDI(datos) {
    if (isProcessing) {
        alert('⏳ Ya se está procesando una solicitud...');
        return;
    }
    
    console.log(' Enviando CFDI...');
    isProcessing = true;
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submitBtn').disabled = true;
    
    let ajaxUrl = window.urlAjaxFuncional || '/wp-admin/admin-ajax.php';
    let nonce = '';
    
    if (window.parent && window.parent.pos_billing_ajax) {
        ajaxUrl = window.parent.pos_billing_ajax.ajax_url || ajaxUrl;
        nonce = window.parent.pos_billing_ajax.nonce || '';
    } else if (window.opener && window.opener.pos_billing_ajax) {
        ajaxUrl = window.opener.pos_billing_ajax.ajax_url || ajaxUrl;
        nonce = window.opener.pos_billing_ajax.nonce || '';
    }
    
    console.log('📡 Enviando CFDI a:', ajaxUrl);
    
    const formData = new FormData();
    formData.append('action', 'pos_billing_create_cfdi');
    if (nonce) {
        formData.append('nonce', nonce);
    }
    formData.append('cfdi_data', JSON.stringify(datos));
    
    fetch(ajaxUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('📨 Respuesta del servidor:', data);
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;
        
        if (data.success) {
            console.log('✅ CFDI creado exitosamente');
            document.getElementById('result-container').className = 'result-container result-success';
            document.getElementById('result-content').innerHTML = 
                '<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #28a745;">' +
                    '✅ CFDI Generado Exitosamente' +
                '</div>' +
                '<div style="background: white; padding: 15px; border-radius: 5px;">' +
                    '<p><strong>UUID:</strong> ' + (data.data.uuid || 'N/A') + '</p>' +
                    '<p><strong>Folio:</strong> ' + (data.data.folio || 'N/A') + '</p>' +
                    '<p><strong>Total:</strong>  + (data.data.total || '0.00') + '</p>' +
                '</div>' +
                '<div style="margin-top: 20px; text-align: center;">' +
                    '<button onclick="window.location.reload()" class="btn">🔄 Nueva Factura</button>' +
                    '<button onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>' +
                '</div>';
            document.getElementById('result-container').style.display = 'block';
        } else {
            console.error('❌ Error creando CFDI:', data);
            let errorMsg = data.data || data.message || 'Error desconocido';
            if (typeof errorMsg === 'object') {
                if (errorMsg.specific_analysis) {
                    errorMsg = errorMsg.specific_analysis.error_type + ': ' + (errorMsg.message || 'Error en la API');
                } else {
                    errorMsg = JSON.stringify(errorMsg);
                }
            }
            alert('❌ Error: ' + errorMsg);
        }
    })
    .catch(error => {
        console.error('❌ Error de conexión:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;
        alert('❌ Error de conexión: ' + error.message);
    })
    .finally(() => {
        isProcessing = false;
    });
}

// ✅ NUEVAS FUNCIONES PARA IMPORTAR PEDIDO

/**
 * 📦 FUNCIÓN PARA MANEJAR LA FUNCIONALIDAD DE IMPORTAR PEDIDO
 */
function configurarImportarPedido() {
    console.log('📦 Configurando funcionalidad de importar pedido...');
    
    const toggleBtn = document.getElementById('toggleImportOrder');
    const importInput = document.getElementById('importOrderInput');
    const buscarBtn = document.getElementById('buscarPedido');
    const cancelarBtn = document.getElementById('cancelarImport');
    const aplicarBtn = document.getElementById('aplicarPedido');
    
    // Mostrar/ocultar input de importar pedido
    if (toggleBtn && importInput) {
        toggleBtn.addEventListener('click', function() {
            if (importInput.classList.contains('show')) {
                importInput.classList.remove('show');
                toggleBtn.textContent = '📥 Importar Pedido';
            } else {
                importInput.classList.add('show');
                toggleBtn.textContent = '📥 Ocultar Importar';
                // Enfocar el campo de número de pedido
                const numeroPedido = document.getElementById('numeroPedido');
                if (numeroPedido) {
                    numeroPedido.focus();
                }
            }
        });
    }
    
    // Buscar pedido
    if (buscarBtn) {
        buscarBtn.addEventListener('click', function() {
            buscarPedidoPorNumero();
        });
    }
    
    // Cancelar importación
    if (cancelarBtn) {
        cancelarBtn.addEventListener('click', function() {
            cancelarImportacion();
        });
    }
    
    // Aplicar datos del pedido
    if (aplicarBtn) {
        aplicarBtn.addEventListener('click', function() {
            aplicarDatosPedido();
        });
    }
    
    // Permitir buscar con Enter
    const numeroPedido = document.getElementById('numeroPedido');
    if (numeroPedido) {
        numeroPedido.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarPedidoPorNumero();
            }
        });
    }
}

/**
 * 🔍 FUNCIÓN PARA BUSCAR PEDIDO POR NÚMERO
 */
function buscarPedidoPorNumero() {
    const numeroPedido = document.getElementById('numeroPedido').value.trim();
    
    if (!numeroPedido) {
        alert('❌ Por favor, ingresa un número de pedido');
        return;
    }
    
    console.log('🔍 Buscando pedido:', numeroPedido);
    
    // Deshabilitar botón mientras busca
    const buscarBtn = document.getElementById('buscarPedido');
    const originalText = buscarBtn.textContent;
    buscarBtn.disabled = true;
    buscarBtn.textContent = '🔍 Buscando...';
    
    // Simular búsqueda de pedido (aquí puedes integrar con tu API real)
    setTimeout(() => {
        // Datos de ejemplo - reemplaza con tu lógica real
        const pedidoEjemplo = simularBusquedaPedido(numeroPedido);
        
        buscarBtn.disabled = false;
        buscarBtn.textContent = originalText;
        
        if (pedidoEjemplo) {
            mostrarPedidoEncontrado(pedidoEjemplo);
        } else {
            mostrarPedidoNoEncontrado();
        }
    }, 1500); // Simular delay de API
}

/**
 * 🎭 FUNCIÓN PARA SIMULAR BÚSQUEDA DE PEDIDO (reemplaza con tu lógica real)
 */
function simularBusquedaPedido(numeroPedido) {
    // Simulación de datos - en tu implementación real, aquí harías una llamada a tu API
    const pedidosEjemplo = {
        'PED-2024-001': {
            numero: 'PED-2024-001',
            cliente: {
                nombre: 'ACME Corporation',
                rfc: 'ACM123456789',
                uid: '67a93f71cdddb' // Usar UID existente en tu sistema
            },
            productos: [
                {
                    descripcion: 'Disco Duro SSD 1TB',
                    claveProdServ: '43201830',
                    cantidad: 2,
                    precioUnitario: 1500.00,
                    claveUnidad: 'H87',
                    unidad: 'Pieza'
                },
                {
                    descripcion: 'Memoria RAM 16GB',
                    claveProdServ: '43201604',
                    cantidad: 1,
                    precioUnitario: 2800.00,
                    claveUnidad: 'H87',
                    unidad: 'Pieza'
                }
            ],
            total: 5800.00,
            fecha: '2024-01-15'
        },
        'ORD-123456': {
            numero: 'ORD-123456',
            cliente: {
                nombre: 'Tech Solutions SA',
                rfc: 'TSO987654321',
                uid: '67a93f71cdddb'
            },
            productos: [
                {
                    descripcion: 'Laptop Business',
                    claveProdServ: '43211507',
                    cantidad: 1,
                    precioUnitario: 15000.00,
                    claveUnidad: 'H87',
                    unidad: 'Pieza'
                }
            ],
            total: 15000.00,
            fecha: '2024-01-20'
        }
    };
    
    return pedidosEjemplo[numeroPedido.toUpperCase()] || null;
}

/**
 * ✅ FUNCIÓN PARA MOSTRAR PEDIDO ENCONTRADO
 */
function mostrarPedidoEncontrado(pedido) {
    console.log('✅ Pedido encontrado:', pedido);
    
    const pedidoInfo = document.getElementById('pedidoInfo');
    const pedidoDetalles = document.getElementById('pedidoDetalles');
    
    if (!pedidoInfo || !pedidoDetalles) return;
    
    // Guardar datos del pedido para uso posterior
    window.pedidoActual = pedido;
    
    // Mostrar detalles
    let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">';
    html += '<div><strong>📋 Número:</strong> ' + pedido.numero + '</div>';
    html += '<div><strong>👤 Cliente:</strong> ' + pedido.cliente.nombre + '</div>';
    html += '<div><strong>🏢 RFC:</strong> ' + pedido.cliente.rfc + '</div>';
    html += '<div><strong>💰 Total:</strong>  + pedido.total.toFixed(2) + '</div>';
    html += '</div>';
    
    html += '<div style="margin-top: 15px;"><strong>📦 Productos:</strong></div>';
    html += '<div style="max-height: 150px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 5px;">';
    
    pedido.productos.forEach((producto, index) => {
        html += '<div style="padding: 8px; border-bottom: 1px solid #ddd;">';
        html += '<strong>' + (index + 1) + '.</strong> ' + producto.descripcion;
        html += '<br><small>Cantidad: ' + producto.cantidad + ' | Precio:  + producto.precioUnitario.toFixed(2) + '</small>';
        html += '</div>';
    });
    
    html += '</div>';
    
    pedidoDetalles.innerHTML = html;
    pedidoInfo.style.display = 'block';
}

/**
 * ❌ FUNCIÓN PARA MOSTRAR PEDIDO NO ENCONTRADO
 */
function mostrarPedidoNoEncontrado() {
    console.log('❌ Pedido no encontrado');
    
    const pedidoInfo = document.getElementById('pedidoInfo');
    const pedidoDetalles = document.getElementById('pedidoDetalles');
    
    if (!pedidoInfo || !pedidoDetalles) return;
    
    pedidoDetalles.innerHTML = 
        '<div style="text-align: center; padding: 20px; color: #dc3545;">' +
        '<h4 style="margin: 0 0 10px 0;">❌ Pedido No Encontrado</h4>' +
        '<p style="margin: 0;">El número de pedido ingresado no existe en el sistema.</p>' +
        '<p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Verifica el número e intenta nuevamente.</p>' +
        '</div>';
    
    pedidoInfo.style.display = 'block';
    
    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
        if (pedidoInfo) {
            pedidoInfo.style.display = 'none';
        }
    }, 3000);
}

/**
 * 🚫 FUNCIÓN PARA CANCELAR IMPORTACIÓN
 */
function cancelarImportacion() {
    console.log('🚫 Cancelando importación...');
    
    // Limpiar campos
    const numeroPedido = document.getElementById('numeroPedido');
    if (numeroPedido) {
        numeroPedido.value = '';
    }
    
    // Ocultar información del pedido
    const pedidoInfo = document.getElementById('pedidoInfo');
    if (pedidoInfo) {
        pedidoInfo.style.display = 'none';
    }
    
    // Ocultar sección de importar
    const importInput = document.getElementById('importOrderInput');
    const toggleBtn = document.getElementById('toggleImportOrder');
    
    if (importInput && toggleBtn) {
        importInput.classList.remove('show');
        toggleBtn.textContent = '📥 Importar Pedido';
    }
    
    // Limpiar datos del pedido actual
    window.pedidoActual = null;
}

/**
 * ✅ FUNCIÓN PARA APLICAR DATOS DEL PEDIDO AL FORMULARIO
 */
function aplicarDatosPedido() {
    if (!window.pedidoActual) {
        alert('❌ No hay datos de pedido para aplicar');
        return;
    }
    
    console.log('✅ Aplicando datos del pedido al formulario...');
    
    const pedido = window.pedidoActual;
    
    // 1. Seleccionar cliente si existe
    const clienteSelect = document.getElementById('receptorUID');
    if (clienteSelect && pedido.cliente.uid) {
        // Buscar la opción que coincida con el UID
        const options = clienteSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === pedido.cliente.uid) {
                clienteSelect.selectedIndex = i;
                // Disparar evento change para mostrar info del cliente
                clienteSelect.dispatchEvent(new Event('change'));
                break;
            }
        }
    }
    
    // 2. Limpiar conceptos existentes (excepto el primero)
    limpiarConceptosExistentes();
    
    // 3. Aplicar productos del pedido
    pedido.productos.forEach((producto, index) => {
        if (index === 0) {
            // Usar el primer concepto existente
            aplicarProductoAConcepto(producto, 0);
        } else {
            // Agregar nuevos conceptos
            agregarNuevoConcepto();
            aplicarProductoAConcepto(producto, index);
        }
    });
    
    // 4. Actualizar número de orden con referencia al pedido
    const numOrderField = document.getElementById('numOrder');
    if (numOrderField) {
        numOrderField.value = 'REF-' + pedido.numero + '-' + Date.now();
    }
    
    // 5. Agregar comentario con referencia al pedido
    const comentariosField = document.getElementById('comentarios');
    if (comentariosField) {
        comentariosField.value = 'Factura generada a partir del pedido: ' + pedido.numero;
    }
    
    // 6. Recalcular totales
    calcularTotales();
    
    // 7. Mostrar confirmación
    alert('✅ Datos del pedido aplicados correctamente\n\n' +
          '📋 Pedido: ' + pedido.numero + '\n' +
          '👤 Cliente: ' + pedido.cliente.nombre + '\n' +
          '📦 Productos: ' + pedido.productos.length + '\n' +
          '💰 Total:  + pedido.total.toFixed(2));
    
    // 8. Cerrar sección de importar
    cancelarImportacion();
    
    console.log('✅ Datos del pedido aplicados exitosamente');
}

/**
 * 🗑️ FUNCIÓN PARA LIMPIAR CONCEPTOS EXISTENTES (excepto el primero)
 */
function limpiarConceptosExistentes() {
    const conceptos = document.querySelectorAll('.producto-row');
    
    // Eliminar todos los conceptos excepto el primero
    for (let i = conceptos.length - 1; i > 0; i--) {
        const concepto = conceptos[i];
        const filaSecundaria = concepto.nextElementSibling;
        
        if (filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary')) {
            filaSecundaria.remove();
        }
        concepto.remove();
    }
    
    // Limpiar el primer concepto
    const primerConcepto = document.querySelector('.producto-row');
    if (primerConcepto) {
        limpiarCamposConcepto(primerConcepto);
    }
}

/**
 * 🧹 FUNCIÓN PARA LIMPIAR CAMPOS DE UN CONCEPTO
 */
function limpiarCamposConcepto(conceptoRow) {
    const descripcion = conceptoRow.querySelector('.descripcion');
    const claveProdServ = conceptoRow.querySelector('.claveProdServ');
    const cantidad = conceptoRow.querySelector('.cantidad');
    const precioUnitario = conceptoRow.querySelector('.precioUnitario');
    const totalConcepto = conceptoRow.querySelector('.totalConcepto');
    
    if (descripcion) descripcion.value = '';
    if (claveProdServ) claveProdServ.value = '';
    if (cantidad) cantidad.value = '1';
    if (precioUnitario) precioUnitario.value = '';
    if (totalConcepto) totalConcepto.value = '';
    
    // Limpiar fila secundaria
    const filaSecundaria = conceptoRow.nextElementSibling;
    if (filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary')) {
        const claveUnidad = filaSecundaria.querySelector('.claveUnidad');
        const unidad = filaSecundaria.querySelector('.unidad');
        const descuento = filaSecundaria.querySelector('.descuento');
        const objetoImp = filaSecundaria.querySelector('.objetoImp');
        
        if (claveUnidad) claveUnidad.value = 'E48';
        if (unidad) unidad.value = 'Unidad de servicio';
        if (descuento) descuento.value = '0';
        if (objetoImp) objetoImp.value = '02';
    }
}

/**
 * 📦 FUNCIÓN PARA APLICAR PRODUCTO A UN CONCEPTO ESPECÍFICO
 */
function aplicarProductoAConcepto(producto, index) {
    const conceptos = document.querySelectorAll('.producto-row');
    const concepto = conceptos[index];
    
    if (!concepto) {
        console.error('❌ No se encontró el concepto en el índice:', index);
        return;
    }
    
    // Aplicar datos principales
    const descripcion = concepto.querySelector('.descripcion');
    const claveProdServ = concepto.querySelector('.claveProdServ');
    const cantidad = concepto.querySelector('.cantidad');
    const precioUnitario = concepto.querySelector('.precioUnitario');
    
    if (descripcion) descripcion.value = producto.descripcion;
    if (claveProdServ) claveProdServ.value = producto.claveProdServ;
    if (cantidad) cantidad.value = producto.cantidad;
    if (precioUnitario) precioUnitario.value = producto.precioUnitario;
    
    // Aplicar datos secundarios
    const filaSecundaria = concepto.nextElementSibling;
    if (filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary')) {
        const claveUnidad = filaSecundaria.querySelector('.claveUnidad');
        const unidad = filaSecundaria.querySelector('.unidad');
        
        if (claveUnidad && producto.claveUnidad) claveUnidad.value = producto.claveUnidad;
        if (unidad && producto.unidad) unidad.value = producto.unidad;
    }
}

/**
 * ➕ FUNCIÓN PARA AGREGAR NUEVO CONCEPTO (utilizando la lógica existente)
 */
function agregarNuevoConcepto() {
    // Utilizar la función existente de agregar concepto
    const agregarBtn = document.getElementById('agregarConcepto');
    if (agregarBtn) {
        agregarBtn.click();
    }
}

/**
 * ✅ EVENTO LOAD PRINCIPAL
 */
window.addEventListener('load', function() {
    console.log('🚀 EVENTO LOAD DISPARADO - PASO 3 (clientes + totales + crear CFDI + importar pedido)');
    
    const testElement = document.getElementById('receptorUID');
    console.log('📋 Elemento receptorUID encontrado:', testElement ? 'SÍ' : 'NO');
    
    // ✅ CARGAR CLIENTES
    cargarClientes();
    
    // ✅ CONFIGURAR FUNCIONALIDAD DE IMPORTAR PEDIDO
    configurarImportarPedido();
    
    // ✅ CONFIGURAR EVENT LISTENERS PARA CONCEPTOS INICIALES
    const conceptoInicial = document.querySelector('.producto-row');
    const secundarioInicial = document.querySelector('.producto-row-secondary');
    
    if (conceptoInicial) agregarEventListeners(conceptoInicial);
    if (secundarioInicial) agregarEventListeners(secundarioInicial);
    
    // ✅ CONFIGURAR FORMULARIO PRINCIPAL (CREAR CFDI)
    const formulario = document.getElementById('cfdiformulario');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('📝 Formulario enviado - procesando...');
            
            if (isProcessing) {
                alert('⏳ Ya se está procesando una solicitud...');
                return;
            }
            
            const datos = recopilarDatos();
            
            if (validarDatos(datos)) {
                enviarCFDI(datos);
            }
        });
        console.log('✅ Formulario CFDI configurado');
    } else {
        console.error('❌ No se encontró el formulario cfdiformulario');
    }
    
    // ✅ GENERAR NÚMERO DE ORDEN AUTOMÁTICO
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const numOrderEl = document.getElementById('numOrder');
    if (numOrderEl) {
        numOrderEl.value = 'ORD-' + timestamp + '-' + random;
    }
    
    // ✅ CALCULAR TOTALES INICIAL
    setTimeout(calcularTotales, 100);
    
    console.log('✅ PASO 3 - Todo configurado: clientes + totales + crear CFDI + importar pedido');
});

console.log('✅ PASO 3 completado - Script cargado con funcionalidad crear CFDI e importar pedido');
    </script>
</body>
</html>`;
    
    popup.document.write(htmlContent);
    popup.document.close();
    popup.focus();
  } else {
    alert("Por favor, permita ventanas emergentes para usar el módulo de facturación");
  }
}