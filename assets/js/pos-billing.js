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
                '<h1>🆘 Solución para "No puedes facturar 2"</h1>' +
                '<div class="warning">' +
                '<strong>⚠️ Este error indica que tu cuenta de Factura.com no está completamente configurada.</strong>' +
                '</div>' +
                '<div class="step">' +
                '<h3>1️⃣ Verificar Certificados SAT</h3>' +
                '<p>Ve a <a href="https://sandbox.factura.com" target="_blank">Factura.com</a> → Configuración → Certificados</p>' +
                '<ul><li>Debe aparecer tu certificado .cer</li><li>Debe aparecer tu llave .key</li><li>Estado: "Válido"</li></ul>' +
                '</div>' +
                '<div class="step">' +
                '<h3>2️⃣ Verificar Series</h3>' +
                '<p>Ve a Configuración → Series</p>' +
                '<ul><li>Debe existir la serie ID: 1212</li><li>Estado: "Activa"</li><li>Tipo: "Factura"</li></ul>' +
                '</div>' +
                '<div class="step">' +
                '<h3>3️⃣ Verificar Receptor</h3>' +
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
                                // Funcionalidad del botón de facturación - VERSIÓN SIMPLIFICADA QUE FUNCIONA
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
    const htmlContent = `
<!DOCTYPE html>
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📄 Sistema de Facturación CFDI 4.0</h1>
            <p>Integración con Factura.com - Generar nueva factura</p>
        </div>
        
        <div class="alert alert-info">
            <strong>ℹ️ Información:</strong> Los totales se calculan automáticamente cuando ingresas cantidad y precio.
        </div>
        
        <form id="cfdiformulario">
            <!-- DATOS DEL RECEPTOR -->
            <div class="section">
                <h3>👤 Datos del Receptor</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>UID del Receptor <span class="required">*</span></label>
                        <input type="text" id="receptorUID" required placeholder="ej: 55c0fdc67593d">
                        <div class="help-text">UID del cliente previamente registrado en Factura.com</div>
                    </div>
                    <div class="form-group">
                        <label>Residencia Fiscal</label>
                        <input type="text" id="residenciaFiscal" placeholder="Solo para extranjeros">
                    </div>
                </div>
            </div>
            
            <!-- CONFIGURACIÓN DEL CFDI -->
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
                            <option value="P01">P01 - Por definir</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row-3">
                    <div class="form-group">
                        <label>Serie <span class="required">*</span></label>
                        <input type="number" id="serie" required placeholder="ej: 1247">
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
            
            <!-- CONCEPTOS -->
            <div class="section">
                <h3>🛍️ Conceptos/Productos</h3>
                <div id="conceptos">
                    <!-- Concepto inicial -->
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
                    
                    <!-- Datos adicionales del concepto -->
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
            
            <!-- TOTALES -->
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
            
            <!-- OPCIONES ADICIONALES -->
            <div class="section">
                <h3>⚡ Opciones Adicionales</h3>
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
            
            <!-- LOADING -->
            <div id="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>Generando CFDI, por favor espere...</p>
            </div>
            
            <!-- RESULTADO -->
            <div id="result-container" class="result-container">
                <div id="result-content"></div>
            </div>
            
            <!-- BOTONES -->
            <div class="form-actions">
                <button type="submit" class="btn" id="submitBtn">💾 Generar CFDI</button>
                <button type="button" onclick="window.close()" class="btn btn-cancel">❌ Cancelar</button>
            </div>
        </form>
    </div>
    
    <script>
        let isProcessing = false;
        
        // ✅ FUNCIÓN PRINCIPAL DE CÁLCULO
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
                
                // Actualizar total del concepto
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
            
            // Actualizar totales en pantalla
            document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
            document.getElementById('totalDescuentos').textContent = '$' + totalDescuentos.toFixed(2);
            document.getElementById('iva').textContent = '$' + iva.toFixed(2);
            document.getElementById('total').textContent = '$' + total.toFixed(2);
        }
        
        // ✅ AGREGAR EVENT LISTENERS
        function agregarEventListeners(elemento) {
            const campos = elemento.querySelectorAll('.cantidad, .precioUnitario, .descuento');
            campos.forEach(function(campo) {
                campo.addEventListener('input', calcularTotales);
                campo.addEventListener('change', calcularTotales);
            });
            
            // Auto-rellenar unidad según clave
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
        
        // ✅ AGREGAR CONCEPTO
        function agregarConcepto() {
            const container = document.getElementById('conceptos');
            const btnAgregar = document.getElementById('agregarConcepto');
            
            const nuevoConcepto = document.createElement('div');
            nuevoConcepto.className = 'producto-row';
            nuevoConcepto.innerHTML = \`
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
                <button type="button" onclick="eliminarConcepto(this)" class="btn-remove">✕</button>
            \`;
            
            const nuevoSecundario = document.createElement('div');
            nuevoSecundario.className = 'producto-row-secondary';
            nuevoSecundario.innerHTML = \`
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
            \`;
            
            container.insertBefore(nuevoConcepto, btnAgregar);
            container.insertBefore(nuevoSecundario, btnAgregar);
            
            agregarEventListeners(nuevoConcepto);
            agregarEventListeners(nuevoSecundario);
        }
        
        // ✅ ELIMINAR CONCEPTO
        function eliminarConcepto(boton) {
            const fila = boton.closest('.producto-row');
            const filaSecundaria = fila.nextElementSibling;
            fila.remove();
            if (filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary')) {
                filaSecundaria.remove();
            }
            calcularTotales();
        }
        
        // ✅ RECOPILAR DATOS
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
                    ClaveProdServ: fila.querySelector('.claveProdServ').value,
                    Cantidad: cantidad.toFixed(6),
                    ClaveUnidad: filaSecundaria ? filaSecundaria.querySelector('.claveUnidad').value : 'E48',
                    Unidad: filaSecundaria ? filaSecundaria.querySelector('.unidad').value : 'Unidad de servicio',
                    Descripcion: fila.querySelector('.descripcion').value,
                    ValorUnitario: precioUnitario.toFixed(6),
                    Importe: importe.toFixed(6),
                    Descuento: descuento.toFixed(6),
                    ObjetoImp: filaSecundaria ? filaSecundaria.querySelector('.objetoImp').value : '02'
                };
                
                // Agregar impuestos si corresponde
                if (concepto.ObjetoImp === '02') {
                    const baseGravable = importe - descuento;
                    const ivaImporte = baseGravable * 0.16;
                    
                    concepto.Impuestos = {
                        Traslados: [{
                            Base: baseGravable.toFixed(6),
                            Impuesto: '002',
                            TipoFactor: 'Tasa',
                            TasaOCuota: '0.16',
                            Importe: ivaImporte.toFixed(6)
                        }]
                    };
                }
                
                conceptos.push(concepto);
            });
            
            return {
                Receptor: {
                    UID: document.getElementById('receptorUID').value,
                    ResidenciaFiscal: document.getElementById('residenciaFiscal').value || ''
                },
                TipoDocumento: document.getElementById('tipoDocumento').value,
                Conceptos: conceptos,
                UsoCFDI: document.getElementById('usoCFDI').value,
                Serie: parseInt(document.getElementById('serie').value),
                FormaPago: document.getElementById('formaPago').value,
                MetodoPago: document.getElementById('metodoPago').value,
                Moneda: document.getElementById('moneda').value,
                NumOrder: document.getElementById('numOrder').value,
                EnviarCorreo: document.getElementById('enviarCorreo').checked,
                Comentarios: document.getElementById('comentarios').value
            };
        }
        
        // ✅ ENVIAR CFDI
        function enviarCFDI(datos) {
            if (isProcessing) return;
            isProcessing = true;
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('submitBtn').disabled = true;
            
            // Intentar obtener configuración de múltiples formas
            let ajaxUrl = '/wp-admin/admin-ajax.php';
            let nonce = '';
            
            // Método 1: Desde window.parent
            if (window.parent && window.parent.pos_billing_ajax) {
                ajaxUrl = window.parent.pos_billing_ajax.ajax_url || ajaxUrl;
                nonce = window.parent.pos_billing_ajax.nonce || '';
                console.log('📡 Usando configuración del parent:', { ajaxUrl, nonce: nonce.substring(0, 10) + '...' });
            }
            
            // Método 2: Desde window.opener (si el popup fue abierto con window.open)
            if (!nonce && window.opener && window.opener.pos_billing_ajax) {
                ajaxUrl = window.opener.pos_billing_ajax.ajax_url || ajaxUrl;
                nonce = window.opener.pos_billing_ajax.nonce || '';
                console.log('📡 Usando configuración del opener:', { ajaxUrl, nonce: nonce.substring(0, 10) + '...' });
            }
            
            // Método 3: Generar nonce usando WordPress REST API
            if (!nonce) {
                console.log('⚠️ No se encontró nonce, intentando generar uno nuevo...');
                
                // Primero intentamos obtener un nonce del REST API
                fetch('/wp-admin/admin-ajax.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'action=pos_billing_get_nonce'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data.nonce) {
                        nonce = data.data.nonce;
                        console.log('✅ Nonce obtenido del servidor');
                        enviarCFDIConNonce(datos, ajaxUrl, nonce);
                    } else {
                        // Si falla, intentamos sin nonce (para debug)
                        console.log('⚠️ No se pudo obtener nonce, intentando sin él...');
                        enviarCFDIConNonce(datos, ajaxUrl, '');
                    }
                })
                .catch(error => {
                    console.log('❌ Error obteniendo nonce:', error);
                    enviarCFDIConNonce(datos, ajaxUrl, '');
                });
                return;
            }
            
            enviarCFDIConNonce(datos, ajaxUrl, nonce);
        }
        
        function enviarCFDIConNonce(datos, ajaxUrl, nonce) {
            console.log('📤 Enviando CFDI con nonce:', nonce ? '✅ Presente' : '❌ Ausente');
            
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
                    document.getElementById('result-content').innerHTML = \`
                        <div style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #28a745;">
                            ✅ CFDI Generado Exitosamente
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 5px;">
                            <p><strong>UUID:</strong> \${data.data.uuid || 'N/A'}</p>
                            <p><strong>Folio:</strong> \${data.data.folio || 'N/A'}</p>
                            <p><strong>Total:</strong> $\${data.data.total || '0.00'}</p>
                        </div>
                        <div style="margin-top: 20px; text-align: center;">
                            <button onclick="window.location.reload()" class="btn">📄 Nueva Factura</button>
                            <button onclick="window.close()" class="btn btn-cancel">❌ Cerrar</button>
                        </div>
                    \`;
                    document.getElementById('result-container').style.display = 'block';
                } else {
                    alert('Error: ' + (data.data || 'Error desconocido'));
                }
            })
            .catch(error => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('submitBtn').disabled = false;
                alert('Error de conexión: ' + error.message);
            })
            .finally(() => {
                isProcessing = false;
            });
        }
        
        // ✅ VALIDAR DATOS
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
            
            for (let concepto of datos.Conceptos) {
                if (!concepto.ClaveProdServ || !concepto.Descripcion) {
                    alert('❌ Todos los conceptos deben tener descripción y clave de producto/servicio');
                    return false;
                }
            }
            
            return true;
        }


// ✅ FUNCIÓN PARA FORMATEAR CLAVES SAT - AGREGAR DESPUÉS DE validarDatos
function formatearClavesSAT(datos) {
    console.log('🔄 FORMATEANDO CLAVES SAT...');
    console.log('Datos ANTES del formateo:', datos);
    
    // Formatear FormaPago
    if (datos.FormaPago) {
        const originalFormaPago = datos.FormaPago;
        datos.FormaPago = String(datos.FormaPago).padStart(2, '0');
        console.log('✅ FormaPago: "' + originalFormaPago + '" → "' + datos.FormaPago + '"');
    }
    
    // Formatear conceptos
    if (datos.Conceptos && Array.isArray(datos.Conceptos)) {
        datos.Conceptos.forEach(function(concepto, index) {
            // ClaveProdServ - 8 dígitos
            if (concepto.ClaveProdServ) {
                const originalClave = concepto.ClaveProdServ;
                concepto.ClaveProdServ = String(concepto.ClaveProdServ).padStart(8, '0');
                console.log('  ✅ ClaveProdServ: "' + originalClave + '" → "' + concepto.ClaveProdServ + '"');
            }
            
            // ObjetoImp - 2 dígitos
            if (concepto.ObjetoImp) {
                const originalObjeto = concepto.ObjetoImp;
                concepto.ObjetoImp = String(concepto.ObjetoImp).padStart(2, '0');
                console.log('  ✅ ObjetoImp: "' + originalObjeto + '" → "' + concepto.ObjetoImp + '"');
            }
            
            // Formatear impuestos
            if (concepto.Impuestos && concepto.Impuestos.Traslados) {
                concepto.Impuestos.Traslados.forEach(function(traslado) {
                    if (traslado.Impuesto) {
                        const originalImpuesto = traslado.Impuesto;
                        traslado.Impuesto = String(traslado.Impuesto).padStart(3, '0');
                        console.log('  ✅ Impuesto: "' + originalImpuesto + '" → "' + traslado.Impuesto + '"');
                    }
                });
            }
        });
    }
    
    return datos;
}


        
        // ✅ INICIALIZACIÓN
        window.addEventListener('load', function() {
            console.log('🚀 Formulario cargado');
            
            // Debug de la configuración disponible
            console.log('🔍 Configuración disponible:', {
                parent_ajax: window.parent.pos_billing_ajax ? '✅ Disponible' : '❌ No disponible',
                opener_ajax: window.opener && window.opener.pos_billing_ajax ? '✅ Disponible' : '❌ No disponible',
                parent_nonce: window.parent.pos_billing_ajax?.nonce ? '✅ Presente' : '❌ Ausente',
                opener_nonce: window.opener?.pos_billing_ajax?.nonce ? '✅ Presente' : '❌ Ausente'
            });
            
            // Cargar configuraciones de WordPress
            const wpSettings = window.parent.pos_billing_ajax?.settings?.defaults || 
                              window.opener?.pos_billing_ajax?.settings?.defaults || {};
            console.log('⚙️ Configuraciones cargadas:', wpSettings);
            
            if (wpSettings.serie) document.getElementById('serie').value = wpSettings.serie;
            if (wpSettings.forma_pago) document.getElementById('formaPago').value = wpSettings.forma_pago;
            if (wpSettings.metodo_pago) document.getElementById('metodoPago').value = wpSettings.metodo_pago;
            if (wpSettings.uso_cfdi) document.getElementById('usoCFDI').value = wpSettings.uso_cfdi;
            
            // Generar número de orden único
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            document.getElementById('numOrder').value = 'ORD-' + timestamp + '-' + random;
            
            // Configurar eventos iniciales
            const conceptoInicial = document.querySelector('.producto-row');
            const secundarioInicial = document.querySelector('.producto-row-secondary');
            
            if (conceptoInicial) agregarEventListeners(conceptoInicial);
            if (secundarioInicial) agregarEventListeners(secundarioInicial);
            
            // Botón agregar concepto
            document.getElementById('agregarConcepto').addEventListener('click', agregarConcepto);
            
            // Submit del formulario
            document.getElementById('cfdiformulario').addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (isProcessing) {
                    alert('⏳ Ya se está procesando una solicitud...');
                    return;
                }
                
                const datos = recopilarDatos();
                console.log('📋 Datos a enviar:', datos);
                
                if (validarDatos(datos)) {
                    enviarCFDI(datos);
                }
            });
            
            // Calcular totales inicial
            setTimeout(calcularTotales, 100);
            
            console.log('✅ Formulario configurado correctamente');
        });
        
        // ✅ FUNCIÓN PARA ABRIR PANEL DE FACTURA.COM
        function abrirPanelFacturaCom() {
            const esSandbox = window.parent.pos_billing_ajax?.settings?.sandbox_mode || 
                             window.opener?.pos_billing_ajax?.settings?.sandbox_mode || true;
            
            const url = esSandbox ? 'https://sandbox.factura.com' : 'https://factura.com';
            window.open(url, '_blank');
        }
        
        // ✅ FUNCIÓN DE PRUEBA CON DATOS VÁLIDOS
        function llenarDatosPrueba() {
            // Usar configuraciones reales si están disponibles
            const wpSettings = window.parent.pos_billing_ajax?.settings?.defaults || 
                              window.opener?.pos_billing_ajax?.settings?.defaults || {};
            
            // Datos del receptor (debes cambiar este UID por uno real de tu cuenta)
            document.getElementById('receptorUID').value = wpSettings.test_receptor_uid || '55c0fdc67593d';
            
            // Configuración del CFDI
            document.getElementById('serie').value = wpSettings.serie || '1247';
            document.getElementById('usoCFDI').value = wpSettings.uso_cfdi || 'G01';
            document.getElementById('formaPago').value = wpSettings.forma_pago || '01';
            document.getElementById('metodoPago').value = wpSettings.metodo_pago || 'PUE';
            
            // Concepto de prueba
            document.querySelector('.descripcion').value = 'Servicio de consultoría en TI';
            document.querySelector('.claveProdServ').value = '84111506'; // Código SAT para servicios de consultoría
            document.querySelector('.cantidad').value = '1';
            document.querySelector('.precioUnitario').value = '1000';
            
            calcularTotales();
            
            // Mostrar alerta con información importante
            alert('✅ Datos de prueba cargados\\n\\n' +
                  '⚠️ IMPORTANTE: Antes de generar el CFDI, verifica en tu panel de Factura.com:\\n\\n' +
                  '1. 📋 Que tengas una serie creada (ID: ' + (wpSettings.serie || '1247') + ')\\n' +
                  '2. 👤 Que el receptor con UID: ' + (wpSettings.test_receptor_uid || '55c0fdc67593d') + ' exista\\n' +
                  '3. 🔐 Que tengas los certificados SAT configurados\\n' +
                  '4. 💰 Total calculado: $1,160.00\\n\\n' +
                  'Si no tienes estos datos configurados, el CFDI fallará.');
        }
        
        // Agregar botón de prueba en desarrollo
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
</html>
    `;
    
    popup.document.write(htmlContent);
    popup.document.close();
    popup.focus();
  } else {
    alert("Por favor, permita ventanas emergentes para usar el módulo de facturación");
  }
}