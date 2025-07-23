// ✅ FUNCIÓN PARA MOSTRAR AYUDA DETALLADA
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💼 Sistema de Facturación CFDI 4.0</h1>
            <p>Integración con Factura.com - Generar nueva factura</p>
        </div>
        
        <div class="alert alert-info">
            <strong>ℹ️ Información:</strong> Los totales se calculan automáticamente cuando ingresas cantidad y precio.
        </div>
        
        <form id="cfdiformulario">
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
                        📋 Información del Cliente Seleccionado
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
            </div>
            
            <div class="section">
                <h3>🛍️ Conceptos/Productos</h3>
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
                <h3>📋 Opciones Adicionales</h3>
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
                <button type="submit" class="btn" id="submitBtn">💾 Generar CFDI</button>
                <button type="button" onclick="window.close()" class="btn btn-cancel">❌ Cancelar</button>
            </div>
        </form>
    </div>
    
    <script>
        let isProcessing = false;
        
        function cargarClientes() {
            console.log('🔄 Cargando clientes...');
            
            const selectElement = document.getElementById('receptorUID');
            if (!selectElement) {
                console.error('❌ No se encontró el elemento receptorUID');
                return;
            }
            
            const loadingOption = document.createElement('option');
            loadingOption.value = '';
            loadingOption.textContent = '⏳ Cargando clientes...';
            loadingOption.disabled = true;
            
            selectElement.innerHTML = '';
            selectElement.appendChild(loadingOption);
            selectElement.disabled = true;
            
            let ajaxUrl = '/wp-admin/admin-ajax.php';
            let nonce = '';
            
            if (window.parent && window.parent.pos_billing_ajax) {
                ajaxUrl = window.parent.pos_billing_ajax.ajax_url || ajaxUrl;
                nonce = window.parent.pos_billing_ajax.nonce || '';
            } else if (window.opener && window.opener.pos_billing_ajax) {
                ajaxUrl = window.opener.pos_billing_ajax.ajax_url || ajaxUrl;
                nonce = window.opener.pos_billing_ajax.nonce || '';
            }
            
            const formData = new FormData();
            formData.append('action', 'pos_billing_get_clients');
            if (nonce) {
                formData.append('nonce', nonce);
            }
            
            fetch(ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('📋 Respuesta clientes:', data);
                
                selectElement.innerHTML = '';
                selectElement.disabled = false;
                
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Seleccionar cliente...';
                selectElement.appendChild(defaultOption);
                
                if (data.success && data.data && data.data.length > 0) {
                    data.data.forEach(client => {
                        const option = document.createElement('option');
                        option.value = client.uid;
                        option.textContent = client.display_name;
                        option.setAttribute('data-rfc', client.rfc);
                        option.setAttribute('data-email', client.email);
                        option.setAttribute('data-uso-cfdi', client.uso_cfdi);
                        option.setAttribute('data-ciudad', client.ciudad);
                        option.setAttribute('data-razon-social', client.razon_social);
                        selectElement.appendChild(option);
                    });
                    
                    console.log('✅ Se cargaron ' + data.data.length + ' clientes');
                    
                    selectElement.addEventListener('change', function() {
                        const selectedOption = this.options[this.selectedIndex];
                        if (selectedOption.value) {
                            const usoCfdi = selectedOption.getAttribute('data-uso-cfdi');
                            if (usoCfdi) {
                                const usoCfdiSelect = document.getElementById('usoCFDI');
                                if (usoCfdiSelect) {
                                    usoCfdiSelect.value = usoCfdi;
                                }
                            }
                            
                            mostrarInfoCliente(selectedOption);
                            
                            console.log('✅ Cliente seleccionado:', {
                                uid: selectedOption.value,
                                rfc: selectedOption.getAttribute('data-rfc'),
                                email: selectedOption.getAttribute('data-email'),
                                uso_cfdi: usoCfdi
                            });
                        } else {
                            mostrarInfoCliente(null);
                        }
                    });
                    
                } else {
                    const noClientsOption = document.createElement('option');
                    noClientsOption.value = '';
                    noClientsOption.textContent = '❌ No se encontraron clientes';
                    noClientsOption.disabled = true;
                    selectElement.appendChild(noClientsOption);
                    
                    const manualOption = document.createElement('option');
                    manualOption.value = 'manual';
                    manualOption.textContent = '✏️ Ingresar UID manualmente';
                    selectElement.appendChild(manualOption);
                    
                    console.warn('⚠️ No se pudieron cargar clientes:', data.data || 'Sin datos');
                }
            })
            .catch(error => {
                console.error('❌ Error cargando clientes:', error);
                
                selectElement.innerHTML = '';
                selectElement.disabled = false;
                
                const errorOption = document.createElement('option');
                errorOption.value = '';
                errorOption.textContent = '❌ Error cargando clientes';
                errorOption.disabled = true;
                selectElement.appendChild(errorOption);
                
                const manualOption = document.createElement('option');
                manualOption.value = 'manual';
                manualOption.textContent = '✏️ Ingresar UID manualmente';
                selectElement.appendChild(manualOption);
                
                selectElement.addEventListener('change', function() {
                    if (this.value === 'manual') {
                        convertirAInputManual();
                    }
                });
            });
        }
        
        function mostrarInfoCliente(option) {
            const infoDiv = document.getElementById('clienteInfo');
            
            if (!option || !option.value || option.value === '') {
                if (infoDiv) {
                    infoDiv.style.display = 'none';
                }
                return;
            }
            
            const clienteRFC = document.getElementById('clienteRFC');
            const clienteEmail = document.getElementById('clienteEmail');
            const clienteUsoCFDI = document.getElementById('clienteUsoCFDI');
            const clienteCiudad = document.getElementById('clienteCiudad');
            
            if (clienteRFC) clienteRFC.textContent = option.getAttribute('data-rfc') || '-';
            if (clienteEmail) clienteEmail.textContent = option.getAttribute('data-email') || '-';
            if (clienteUsoCFDI) clienteUsoCFDI.textContent = option.getAttribute('data-uso-cfdi') || '-';
            if (clienteCiudad) clienteCiudad.textContent = option.getAttribute('data-ciudad') || '-';
            
            if (infoDiv) {
                infoDiv.style.display = 'block';
                infoDiv.style.opacity = '0';
                setTimeout(() => {
                    infoDiv.style.transition = 'opacity 0.3s ease';
                    infoDiv.style.opacity = '1';
                }, 10);
            }
        }
        
        function convertirAInputManual() {
            const selectElement = document.getElementById('receptorUID');
            if (!selectElement) return;
            
            const container = selectElement.parentNode;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'receptorUID';
            input.name = 'receptorUID';
            input.required = true;
            input.placeholder = 'ej: 67a93f71cdddb';
            input.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 14px; box-sizing: border-box;';
            
            container.replaceChild(input, selectElement);
            input.focus();
            
            const infoDiv = document.getElementById('clienteInfo');
            if (infoDiv) {
                infoDiv.style.display = 'none';
            }
        }
        
        function recargarClientes() {
            console.log('🔄 Recargando lista de clientes...');
            cargarClientes();
        }
        
        function formatearDatosParaAPI(datos) {
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
            
            if (datos.TipoCambio) datosFormateados.TipoCambio = parseFloat(datos.TipoCambio);
            if (datos.NumOrder) datosFormateados.NumOrder = String(datos.NumOrder);
            if (datos.LugarExpedicion) datosFormateados.LugarExpedicion = String(datos.LugarExpedicion);
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
            
            return datosFormateados;
        }

        function calcularTotales() {
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
            
            document.getElementById('subtotal').textContent = '
         + subtotal.toFixed(2);
            document.getElementById('totalDescuentos').textContent = '
         + totalDescuentos.toFixed(2);
            document.getElementById('iva').textContent = '
         + iva.toFixed(2);
            document.getElementById('total').textContent = '
         + total.toFixed(2);
        }
        
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
        
        function agregarConcepto() {
            const container = document.getElementById('conceptos');
            const btnAgregar = document.getElementById('agregarConcepto');
            
            const nuevoConcepto = document.createElement('div');
            nuevoConcepto.className = 'producto-row';
            nuevoConcepto.innerHTML = 
                '<div class="form-group">' +
                    '<label>Descripción <span class="required">*</span></label>' +
                    '<input type="text" class="descripcion" placeholder="Descripción del producto/servicio" required>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Clave Prod/Serv <span class="required">*</span></label>' +
                    '<input type="text" class="claveProdServ" placeholder="ej: 43232408" required>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Cantidad <span class="required">*</span></label>' +
                    '<input type="number" class="cantidad" value="1" min="0.000001" step="0.000001" required>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Precio Unitario <span class="required">*</span></label>' +
                    '<input type="number" class="precioUnitario" step="0.01" required>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>Total</label>' +
                    '<input type="number" class="totalConcepto" readonly class="readonly-field">' +
                '</div>' +
                '<button type="button" onclick="eliminarConcepto(this)" class="btn-remove">✕</button>';
            
            const nuevoSecundario = document.createElement('div');
            nuevoSecundario.className = 'producto-row-secondary';
            nuevoSecundario.innerHTML = 
                '<div class="form-row">' +
                    '<div class="form-group">' +
                        '<label>Clave Unidad <span class="required">*</span></label>' +
                        '<select class="claveUnidad" required>' +
                            '<option value="">Seleccionar...</option>' +
                            '<option value="E48" selected>E48 - Unidad de servicio</option>' +
                            '<option value="H87">H87 - Pieza</option>' +
                            '<option value="KGM">KGM - Kilogramo</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>Unidad <span class="required">*</span></label>' +
                        '<input type="text" class="unidad" value="Unidad de servicio" required>' +
                    '</div>' +
                '</div>' +
                '<div class="form-row">' +
                    '<div class="form-group">' +
                        '<label>Descuento</label>' +
                        '<input type="number" class="descuento" value="0" step="0.01">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>Objeto Impuesto <span class="required">*</span></label>' +
                        '<select class="objetoImp" required>' +
                            '<option value="02" selected>02 - Sí objeto de impuesto</option>' +
                            '<option value="01">01 - No objeto de impuesto</option>' +
                        '</select>' +
                    '</div>' +
                '</div>';
            
            container.insertBefore(nuevoConcepto, btnAgregar);
            container.insertBefore(nuevoSecundario, btnAgregar);
            
            agregarEventListeners(nuevoConcepto);
            agregarEventListeners(nuevoSecundario);
        }
        
        function eliminarConcepto(boton) {
            const fila = boton.closest('.producto-row');
            const filaSecundaria = fila.nextElementSibling;
            fila.remove();
            if (filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary')) {
                filaSecundaria.remove();
            }
            calcularTotales();
        }
        
        function recopilarDatos() {
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
            
            return formatearDatosParaAPI(datosBasicos);
        }
        
        function validarDatos(datos) {
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
            
            return true;
        }
        
        function enviarCFDI(datos) {
            if (isProcessing) return;
            isProcessing = true;
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('submitBtn').disabled = true;
            
            let ajaxUrl = '/wp-admin/admin-ajax.php';
            let nonce = '';
            
            if (window.parent && window.parent.pos_billing_ajax) {
                ajaxUrl = window.parent.pos_billing_ajax.ajax_url || ajaxUrl;
                nonce = window.parent.pos_billing_ajax.nonce || '';
            } else if (window.opener && window.opener.pos_billing_ajax) {
                ajaxUrl = window.opener.pos_billing_ajax.ajax_url || ajaxUrl;
                nonce = window.opener.pos_billing_ajax.nonce || '';
            }
            
            if (!nonce) {
                fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'action=pos_billing_get_nonce'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data.nonce) {
                        nonce = data.data.nonce;
                        enviarCFDIConNonce(datos, ajaxUrl, nonce);
                    } else {
                        enviarCFDIConNonce(datos, ajaxUrl, '');
                    }
                })
                .catch(error => {
                    enviarCFDIConNonce(datos, ajaxUrl, '');
                });
                return;
            }
            
            enviarCFDIConNonce(datos, ajaxUrl, nonce);
        }
        
        function enviarCFDIConNonce(datos, ajaxUrl, nonce) {
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
                document.getElementById('loading').style.display = 'none';
                document.getElementById('submitBtn').disabled = false;
                
                if (data.success) {
                    document.getElementById('result-container').className = 'result-container result-success';
                    document.getElementById('result-content').innerHTML = 
                        '<div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #28a745;">' +
                            '✅ CFDI Generado Exitosamente' +
                        '</div>' +
                        '<div style="background: white; padding: 15px; border-radius: 5px;">' +
                            '<p><strong>UUID:</strong> ' + (data.data.uuid || 'N/A') + '</p>' +
                            '<p><strong>Folio:</strong> ' + (data.data.folio || 'N/A') + '</p>' +
                            '<p><strong>Total:</strong> 
         + (data.data.total || '0.00') + '</p>' +
                        '</div>' +
                        '<div style="margin-top: 20px; text-align: center;">' +
                            '<button onclick="window.location.reload()" class="btn">🔄 Nueva Factura</button>' +
                            '<button onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>' +
                        '</div>';
                    document.getElementById('result-container').style.display = 'block';
                } else {
                    let errorMsg = data.data || 'Error desconocido';
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
                document.getElementById('loading').style.display = 'none';
                document.getElementById('submitBtn').disabled = false;
                alert('❌ Error de conexión: ' + error.message);
            })
            .finally(() => {
                isProcessing = false;
            });
        }
        
        function llenarDatosPrueba() {
            const wpSettings = window.parent.pos_billing_ajax && window.parent.pos_billing_ajax.settings && window.parent.pos_billing_ajax.settings.defaults ? 
                              window.parent.pos_billing_ajax.settings.defaults : 
                              (window.opener && window.opener.pos_billing_ajax && window.opener.pos_billing_ajax.settings && window.opener.pos_billing_ajax.settings.defaults ? 
                               window.opener.pos_billing_ajax.settings.defaults : {});
            
            const receptorSelect = document.getElementById('receptorUID');
            if (receptorSelect && receptorSelect.options.length > 1) {
                receptorSelect.selectedIndex = 1;
                const event = new Event('change');
                receptorSelect.dispatchEvent(event);
            } else {
                if (receptorSelect && receptorSelect.tagName === 'INPUT') {
                    receptorSelect.value = wpSettings.test_receptor_uid || '67a93f71cdddb';
                }
            }
            
            document.getElementById('serie').value = wpSettings.serie || '5483035';
            document.getElementById('usoCFDI').value = wpSettings.uso_cfdi || 'G01';
            document.getElementById('formaPago').value = wpSettings.forma_pago || '01';
            document.getElementById('metodoPago').value = wpSettings.metodo_pago || 'PUE';
            
            document.querySelector('.descripcion').value = 'DISCO DURO SSD';
            document.querySelector('.claveProdServ').value = '43201830';
            document.querySelector('.cantidad').value = '1';
            document.querySelector('.precioUnitario').value = '100';
            
            calcularTotales();
            
            const clienteSeleccionado = receptorSelect.options ? receptorSelect.options[receptorSelect.selectedIndex] : null;
            const clienteNombre = clienteSeleccionado ? clienteSeleccionado.textContent : 'Manual';
            
            alert('✅ Datos de prueba cargados\n\nIMPORTANTE: Verifica en Factura.com:\n\n1. Serie ID: ' + (wpSettings.serie || '5483035') + '\n2. Cliente: ' + clienteNombre + '\n3. Certificados SAT configurados\n4. Total: $116.00');
        }
        
        window.addEventListener('load', function() {
            cargarClientes();
            
            const wpSettings = window.parent.pos_billing_ajax && window.parent.pos_billing_ajax.settings && window.parent.pos_billing_ajax.settings.defaults ? 
                              window.parent.pos_billing_ajax.settings.defaults : 
                              (window.opener && window.opener.pos_billing_ajax && window.opener.pos_billing_ajax.settings && window.opener.pos_billing_ajax.settings.defaults ? 
                               window.opener.pos_billing_ajax.settings.defaults : {});
            
            if (wpSettings.serie) document.getElementById('serie').value = wpSettings.serie;
            if (wpSettings.forma_pago) document.getElementById('formaPago').value = wpSettings.forma_pago;
            if (wpSettings.metodo_pago) document.getElementById('metodoPago').value = wpSettings.metodo_pago;
            if (wpSettings.uso_cfdi) document.getElementById('usoCFDI').value = wpSettings.uso_cfdi;
            
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            document.getElementById('numOrder').value = 'ORD-' + timestamp + '-' + random;
            
            const conceptoInicial = document.querySelector('.producto-row');
            const secundarioInicial = document.querySelector('.producto-row-secondary');
            
            if (conceptoInicial) agregarEventListeners(conceptoInicial);
            if (secundarioInicial) agregarEventListeners(secundarioInicial);
            
            document.getElementById('agregarConcepto').addEventListener('click', agregarConcepto);
            
            document.getElementById('cfdiformulario').addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (isProcessing) {
                    alert('⏳ Ya se está procesando una solicitud...');
                    return;
                }
                
                const datos = recopilarDatos();
                
                if (validarDatos(datos)) {
                    enviarCFDI(datos);
                }
            });
            
            setTimeout(calcularTotales, 100);
        });
        
        setTimeout(function() {
            if (window.location.hostname.includes('localhost') || window.location.hostname.includes('dev')) {
                const pruebaBtn = document.createElement('button');
                pruebaBtn.type = 'button';
                pruebaBtn.textContent = '🧪 Datos Prueba';
                pruebaBtn.className = 'btn';
                pruebaBtn.style.background = '#6f42c1';
                pruebaBtn.onclick = llenarDatosPrueba;
                document.querySelector('.form-actions').appendChild(pruebaBtn);
            }
        }, 500);
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