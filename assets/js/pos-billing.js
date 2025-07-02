// Funcionalidad del botón de facturación - VERSIÓN FINAL CON INTEGRACIÓN REAL
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
    popup.document.open();
    popup.document.write('<!DOCTYPE html>');
    popup.document.write('<html>');
    popup.document.write('<head>');
    popup.document.write('<title>Sistema de Facturación CFDI 4.0</title>');
    popup.document.write('<meta charset="UTF-8">');
    
    // CSS (mantenemos el mismo)
    popup.document.write('<style>');
    popup.document.write('body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; line-height: 1.6; }');
    popup.document.write('.container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 1100px; margin: 0 auto; }');
    popup.document.write('.header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }');
    popup.document.write('.header h1 { color: #333; margin: 0; font-size: 28px; }');
    popup.document.write('.header p { color: #666; margin: 10px 0 0 0; font-size: 16px; }');
    popup.document.write('.form-group { margin-bottom: 20px; }');
    popup.document.write('.form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px; }');
    popup.document.write('.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 8px; box-sizing: border-box; font-size: 14px; transition: border-color 0.3s ease; }');
    popup.document.write('.form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }');
    popup.document.write('.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }');
    popup.document.write('.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }');
    popup.document.write('.btn { padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 16px; font-weight: 600; transition: all 0.3s ease; }');
    popup.document.write('.btn:hover { background: #218838; transform: translateY(-1px); }');
    popup.document.write('.btn:disabled { background: #6c757d; cursor: not-allowed; transform: none; }');
    popup.document.write('.btn-cancel { background: #6c757d; }');
    popup.document.write('.btn-cancel:hover { background: #545b62; }');
    popup.document.write('.btn-add { background: #007bff; }');
    popup.document.write('.btn-add:hover { background: #0056b3; }');
    popup.document.write('.btn-remove { background: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; position: absolute; top: 15px; right: 15px; font-size: 18px; display: flex; align-items: center; justify-content: center; }');
    popup.document.write('.totals { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #dee2e6; }');
    popup.document.write('.total-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; }');
    popup.document.write('.total-final { font-weight: bold; font-size: 20px; border-top: 2px solid #333; padding-top: 15px; color: #28a745; }');
    popup.document.write('.producto-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 40px; gap: 15px; margin-bottom: 20px; padding: 20px; background: #f8f9fa; border-radius: 10px; position: relative; border: 2px solid #e9ecef; }');
    popup.document.write('.producto-row-secondary { margin-bottom: 20px; padding: 20px; background: #f1f3f4; border-radius: 10px; border: 1px solid #dee2e6; }');
    popup.document.write('.section { margin-bottom: 35px; padding-bottom: 25px; border-bottom: 2px solid #eee; }');
    popup.document.write('.section:last-child { border-bottom: none; }');
    popup.document.write('.section h3 { color: #333; margin-bottom: 20px; font-size: 20px; display: flex; align-items: center; gap: 10px; }');
    popup.document.write('.form-actions { text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #eee; }');
    popup.document.write('.required { color: #dc3545; }');
    popup.document.write('.help-text { font-size: 12px; color: #6c757d; margin-top: 5px; }');
    popup.document.write('.alert { padding: 15px; margin-bottom: 20px; border: 1px solid transparent; border-radius: 8px; }');
    popup.document.write('.alert-info { color: #0c5460; background-color: #d1ecf1; border-color: #bee5eb; }');
    popup.document.write('.alert-success { color: #155724; background-color: #d4edda; border-color: #c3e6cb; }');
    popup.document.write('.alert-danger { color: #721c24; background-color: #f8d7da; border-color: #f5c6cb; }');
    popup.document.write('.alert-warning { color: #856404; background-color: #fff3cd; border-color: #ffeaa7; }');
    popup.document.write('.loading { display: none; text-align: center; padding: 20px; }');
    popup.document.write('.loading-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px; }');
    popup.document.write('@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }');
    popup.document.write('.result-container { display: none; background: #f8f9fa; border-radius: 10px; padding: 25px; margin-top: 20px; }');
    popup.document.write('.result-success { border-left: 5px solid #28a745; }');
    popup.document.write('.result-error { border-left: 5px solid #dc3545; }');
    popup.document.write('.result-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; }');
    popup.document.write('.result-data { background: white; padding: 15px; border-radius: 5px; margin-top: 15px; }');
    popup.document.write('.result-data dt { font-weight: bold; color: #333; margin-top: 10px; }');
    popup.document.write('.result-data dd { margin-left: 20px; color: #666; }');
    popup.document.write('</style>');
    
    popup.document.write('</head>');
    popup.document.write('<body>');
    
    // HTML del formulario (mantenemos el mismo)
    popup.document.write('<div class="container">');
    popup.document.write('<div class="header">');
    popup.document.write('<h1>📄 Sistema de Facturación CFDI 4.0</h1>');
    popup.document.write('<p>Integración con Factura.com - Generar nueva factura</p>');
    popup.document.write('</div>');
    
    popup.document.write('<div class="alert alert-info">');
    popup.document.write('<strong>ℹ️ Información:</strong> Este formulario está integrado con la API de Factura.com para generar CFDIs válidos ante el SAT.');
    popup.document.write('</div>');
    
    popup.document.write('<form id="cfdiformulario">');
    
    // DATOS DEL RECEPTOR
    popup.document.write('<div class="section">');
    popup.document.write('<h3>👤 Datos del Receptor</h3>');
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>UID del Receptor <span class="required">*</span></label>');
    popup.document.write('<input type="text" id="receptorUID" required placeholder="ej: 55c0fdc67593d">');
    popup.document.write('<div class="help-text">UID del cliente previamente registrado en Factura.com</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Residencia Fiscal</label>');
    popup.document.write('<input type="text" id="residenciaFiscal" placeholder="Solo para extranjeros">');
    popup.document.write('<div class="help-text">Solo requerido para residentes en el extranjero</div>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    // CONFIGURACIÓN GENERAL DEL CFDI
    popup.document.write('<div class="section">');
    popup.document.write('<h3>⚙️ Configuración del CFDI</h3>');
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Tipo de Documento <span class="required">*</span></label>');
    popup.document.write('<select id="tipoDocumento" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="factura">Factura</option>');
    popup.document.write('<option value="nota_credito">Nota de Crédito</option>');
    popup.document.write('<option value="recibo_honorarios">Recibo de Honorarios</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Uso de CFDI <span class="required">*</span></label>');
    popup.document.write('<select id="usoCFDI" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="G01">Adquisición de mercancías</option>');
    popup.document.write('<option value="G02">Devoluciones, descuentos o bonificaciones</option>');
    popup.document.write('<option value="G03">Gastos en general</option>');
    popup.document.write('<option value="I01">Construcciones</option>');
    popup.document.write('<option value="I02">Mobiliario y equipo de oficina por inversiones</option>');
    popup.document.write('<option value="I03">Equipo de transporte</option>');
    popup.document.write('<option value="I04">Equipo de computo y accesorios</option>');
    popup.document.write('<option value="I05">Dados, troqueles, moldes, matrices y herramental</option>');
    popup.document.write('<option value="I06">Comunicaciones telefónicas</option>');
    popup.document.write('<option value="I07">Comunicaciones satelitales</option>');
    popup.document.write('<option value="I08">Otra maquinaria y equipo</option>');
    popup.document.write('<option value="P01">Por definir</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    popup.document.write('<div class="form-row-3">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Serie <span class="required">*</span></label>');
    popup.document.write('<input type="number" id="serie" required placeholder="ej: 1247">');
    popup.document.write('<div class="help-text">ID de serie configurada en Factura.com</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Forma de Pago <span class="required">*</span></label>');
    popup.document.write('<select id="formaPago" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="01">Efectivo</option>');
    popup.document.write('<option value="02">Cheque nominativo</option>');
    popup.document.write('<option value="03">Transferencia electrónica de fondos</option>');
    popup.document.write('<option value="04">Tarjeta de crédito</option>');
    popup.document.write('<option value="05">Monedero electrónico</option>');
    popup.document.write('<option value="06">Dinero electrónico</option>');
    popup.document.write('<option value="08">Vales de despensa</option>');
    popup.document.write('<option value="12">Dación en pago</option>');
    popup.document.write('<option value="13">Pago por subrogación</option>');
    popup.document.write('<option value="14">Pago por consignación</option>');
    popup.document.write('<option value="15">Condonación</option>');
    popup.document.write('<option value="17">Compensación</option>');
    popup.document.write('<option value="23">Novación</option>');
    popup.document.write('<option value="24">Confusión</option>');
    popup.document.write('<option value="25">Remisión de deuda</option>');
    popup.document.write('<option value="26">Prescripción o caducidad</option>');
    popup.document.write('<option value="27">A satisfacción del acreedor</option>');
    popup.document.write('<option value="28">Tarjeta de débito</option>');
    popup.document.write('<option value="29">Tarjeta de servicios</option>');
    popup.document.write('<option value="30">Aplicación de anticipos</option>');
    popup.document.write('<option value="99">Por definir</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Método de Pago <span class="required">*</span></label>');
    popup.document.write('<select id="metodoPago" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="PUE">Pago en una sola exhibición</option>');
    popup.document.write('<option value="PPD">Pago en parcialidades o diferido</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Moneda <span class="required">*</span></label>');
    popup.document.write('<select id="moneda" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="MXN">Peso Mexicano</option>');
    popup.document.write('<option value="USD">Dólar Americano</option>');
    popup.document.write('<option value="EUR">Euro</option>');
    popup.document.write('<option value="XXX">Los códigos asignados para transacciones en que intervenga ninguna moneda</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Tipo de Cambio</label>');
    popup.document.write('<input type="number" step="0.000001" id="tipoCambio" placeholder="Solo si moneda != MXN">');
    popup.document.write('<div class="help-text">Requerido solo si la moneda no es MXN</div>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Número de Orden</label>');
    popup.document.write('<input type="text" id="numOrder" placeholder="Número de orden interno">');
    popup.document.write('<div class="help-text">Control interno - debe ser único</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Lugar de Expedición</label>');
    popup.document.write('<input type="text" id="lugarExpedicion" placeholder="Código postal (5 dígitos)">');
    popup.document.write('<div class="help-text">Código postal donde se expide la factura</div>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Condiciones de Pago</label>');
    popup.document.write('<textarea id="condicionesPago" rows="2" placeholder="Ejemplo: Pago a 30 días"></textarea>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    // CONCEPTOS/PRODUCTOS
    popup.document.write('<div class="section">');
    popup.document.write('<h3>🛍️ Conceptos/Productos</h3>');
    popup.document.write('<div id="conceptos">');
    
    // Concepto principal inicial
    popup.document.write('<div class="producto-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Descripción <span class="required">*</span></label>');
    popup.document.write('<input type="text" class="descripcion" placeholder="Descripción del producto/servicio" required>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Clave Prod/Serv <span class="required">*</span></label>');
    popup.document.write('<input type="text" class="claveProdServ" placeholder="ej: 43232408" required>');
    popup.document.write('<div class="help-text">Catálogo SAT</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Cantidad <span class="required">*</span></label>');
    popup.document.write('<input type="number" class="cantidad" value="1" min="0.000001" step="0.000001" required>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Precio Unitario <span class="required">*</span></label>');
    popup.document.write('<input type="number" class="precioUnitario" step="0.000001" required>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Total</label>');
    popup.document.write('<input type="number" class="totalConcepto" step="0.000001">');
    popup.document.write('</div>');
    popup.document.write('<div></div>');
    popup.document.write('</div>');
    
    // Concepto secundario inicial
    popup.document.write('<div class="producto-row-secondary">');
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Clave Unidad <span class="required">*</span></label>');
    popup.document.write('<select class="claveUnidad" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="E48">Unidad de servicio</option>');
    popup.document.write('<option value="H87">Pieza</option>');
    popup.document.write('<option value="KGM">Kilogramo</option>');
    popup.document.write('<option value="LTR">Litro</option>');
    popup.document.write('<option value="MTR">Metro</option>');
    popup.document.write('<option value="SET">Conjunto</option>');
    popup.document.write('<option value="XBX">Caja</option>');
    popup.document.write('<option value="XNA">No aplica</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Unidad <span class="required">*</span></label>');
    popup.document.write('<input type="text" class="unidad" placeholder="ej: Unidad de servicio" required>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>No. Identificación</label>');
    popup.document.write('<input type="text" class="noIdentificacion" placeholder="SKU opcional">');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Descuento</label>');
    popup.document.write('<input type="number" class="descuento" step="0.000001" value="0">');
    popup.document.write('</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Objeto Impuesto <span class="required">*</span></label>');
    popup.document.write('<select class="objetoImp" required>');
    popup.document.write('<option value="">Seleccionar...</option>');
    popup.document.write('<option value="01">No objeto de impuesto</option>');
    popup.document.write('<option value="02">Si objeto de impuesto</option>');
    popup.document.write('<option value="03">Si objeto de impuesto y no obligado al desglose</option>');
    popup.document.write('<option value="04">Si objeto de impuesto y no causa impuesto</option>');
    popup.document.write('</select>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    popup.document.write('</div>');
    popup.document.write('<button type="button" id="agregarConcepto" class="btn btn-add">➕ Agregar Concepto</button>');
    popup.document.write('</div>');
    
    // OPCIONES ADICIONALES
    popup.document.write('<div class="section">');
    popup.document.write('<h3>⚡ Opciones Adicionales</h3>');
    popup.document.write('<div class="form-row">');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>');
    popup.document.write('<input type="checkbox" id="enviarCorreo" checked>');
    popup.document.write(' Enviar factura por correo electrónico');
    popup.document.write('</label>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>');
    popup.document.write('<input type="checkbox" id="borradorSiFalla">');
    popup.document.write(' Crear borrador si falla el timbrado');
    popup.document.write('</label>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    popup.document.write('<div class="form-group">');
    popup.document.write('<label>Comentarios</label>');
    popup.document.write('<textarea id="comentarios" rows="3" placeholder="Comentarios adicionales para el PDF"></textarea>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    // TOTALES
    popup.document.write('<div class="totals">');
    popup.document.write('<div class="total-row">');
    popup.document.write('<span>Subtotal:</span>');
    popup.document.write('<span id="subtotal">$0.00</span>');
    popup.document.write('</div>');
    popup.document.write('<div class="total-row">');
    popup.document.write('<span>Descuentos:</span>');
    popup.document.write('<span id="totalDescuentos">$0.00</span>');
    popup.document.write('</div>');
    popup.document.write('<div class="total-row">');
    popup.document.write('<span>IVA (16%):</span>');
    popup.document.write('<span id="iva">$0.00</span>');
    popup.document.write('</div>');
    popup.document.write('<div class="total-row total-final">');
    popup.document.write('<span>Total:</span>');
    popup.document.write('<span id="total">$0.00</span>');
    popup.document.write('</div>');
    popup.document.write('</div>');
    
    // LOADING
    popup.document.write('<div id="loading" class="loading">');
    popup.document.write('<div class="loading-spinner"></div>');
    popup.document.write('<p>Generando CFDI, por favor espere...</p>');
    popup.document.write('</div>');
    
    // RESULTADO
    popup.document.write('<div id="result-container" class="result-container">');
    popup.document.write('<div id="result-content"></div>');
    popup.document.write('</div>');
    
    // BOTONES
    popup.document.write('<div class="form-actions">');
    popup.document.write('<button type="submit" class="btn" id="submitBtn">💾 Generar CFDI</button>');
    popup.document.write('<button type="button" onclick="window.close()" class="btn btn-cancel">❌ Cancelar</button>');
    popup.document.write('</div>');
    
    popup.document.write('</form>');
    popup.document.write('</div>');
    
    // JAVASCRIPT - AQUÍ ESTÁ LA MEJORA PRINCIPAL
    popup.document.write('<script>');
    popup.document.write('let isProcessing = false;');
    
    // Función calcular totales
    popup.document.write('function calcularTotales() {');
    popup.document.write('  let subtotal = 0;');
    popup.document.write('  let totalDescuentos = 0;');
    popup.document.write('  const conceptos = document.querySelectorAll(".producto-row");');
    popup.document.write('  conceptos.forEach(function(concepto) {');
    popup.document.write('    const cantidad = parseFloat(concepto.querySelector(".cantidad").value) || 0;');
    popup.document.write('    const precio = parseFloat(concepto.querySelector(".precioUnitario").value) || 0;');
    popup.document.write('    const filaSecundaria = concepto.nextElementSibling;');
    popup.document.write('    const descuento = filaSecundaria ? parseFloat(filaSecundaria.querySelector(".descuento").value) || 0 : 0;');
    popup.document.write('    const importeConcepto = cantidad * precio;');
    popup.document.write('    const totalConcepto = importeConcepto - descuento;');
    popup.document.write('    const campoTotal = concepto.querySelector(".totalConcepto");');
    popup.document.write('    if (campoTotal) { campoTotal.value = totalConcepto.toFixed(6); }');
    popup.document.write('    subtotal += importeConcepto;');
    popup.document.write('    totalDescuentos += descuento;');
    popup.document.write('  });');
    popup.document.write('  const subtotalFinal = subtotal - totalDescuentos;');
    popup.document.write('  const iva = subtotalFinal * 0.16;');
    popup.document.write('  const total = subtotalFinal + iva;');
    popup.document.write('  document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);');
    popup.document.write('  document.getElementById("totalDescuentos").textContent = "$" + totalDescuentos.toFixed(2);');
    popup.document.write('  document.getElementById("iva").textContent = "$" + iva.toFixed(2);');
    popup.document.write('  document.getElementById("total").textContent = "$" + total.toFixed(2);');
    popup.document.write('}');
    
    // Función agregar concepto
    popup.document.write('function agregarConcepto() {');
    popup.document.write('  const container = document.getElementById("conceptos");');
    popup.document.write('  const nuevoConcepto = document.createElement("div");');
    popup.document.write('  nuevoConcepto.className = "producto-row";');
    popup.document.write('  nuevoConcepto.innerHTML = ');
    popup.document.write('    "<div class=\\"form-group\\"><label>Descripción <span class=\\"required\\">*</span></label><input type=\\"text\\" class=\\"descripcion\\" placeholder=\\"Descripción del producto/servicio\\" required></div>" +');
    popup.document.write('    "<div class=\\"form-group\\"><label>Clave Prod/Serv <span class=\\"required\\">*</span></label><input type=\\"text\\" class=\\"claveProdServ\\" placeholder=\\"ej: 43232408\\" required><div class=\\"help-text\\">Catálogo SAT</div></div>" +');
    popup.document.write('    "<div class=\\"form-group\\"><label>Cantidad <span class=\\"required\\">*</span></label><input type=\\"number\\" class=\\"cantidad\\" value=\\"1\\" min=\\"0.000001\\" step=\\"0.000001\\" required></div>" +');
    popup.document.write('    "<div class=\\"form-group\\"><label>Precio Unitario <span class=\\"required\\">*</span></label><input type=\\"number\\" class=\\"precioUnitario\\" step=\\"0.000001\\" required></div>" +');
    popup.document.write('    "<div class=\\"form-group\\"><label>Total</label><input type=\\"number\\" class=\\"totalConcepto\\" step=\\"0.000001\\"></div>" +');
    popup.document.write('    "<button type=\\"button\\" onclick=\\"eliminarConcepto(this)\\" class=\\"btn-remove\\">✕</button>";');
    popup.document.write('  const nuevoSecundario = document.createElement("div");');
    popup.document.write('  nuevoSecundario.className = "producto-row-secondary";');
    popup.document.write('  nuevoSecundario.innerHTML = ');
    popup.document.write('    "<div class=\\"form-row\\"><div class=\\"form-group\\"><label>Clave Unidad <span class=\\"required\\">*</span></label><select class=\\"claveUnidad\\" required><option value=\\"\\">Seleccionar...</option><option value=\\"E48\\">Unidad de servicio</option><option value=\\"H87\\">Pieza</option><option value=\\"KGM\\">Kilogramo</option><option value=\\"LTR\\">Litro</option><option value=\\"MTR\\">Metro</option><option value=\\"SET\\">Conjunto</option><option value=\\"XBX\\">Caja</option><option value=\\"XNA\\">No aplica</option></select></div><div class=\\"form-group\\"><label>Unidad <span class=\\"required\\">*</span></label><input type=\\"text\\" class=\\"unidad\\" placeholder=\\"ej: Unidad de servicio\\" required></div></div>" +');
    popup.document.write('    "<div class=\\"form-row\\"><div class=\\"form-group\\"><label>No. Identificación</label><input type=\\"text\\" class=\\"noIdentificacion\\" placeholder=\\"SKU opcional\\"></div><div class=\\"form-group\\"><label>Descuento</label><input type=\\"number\\" class=\\"descuento\\" step=\\"0.000001\\" value=\\"0\\"></div></div>" +');
    popup.document.write('    "<div class=\\"form-group\\"><label>Objeto Impuesto <span class=\\"required\\">*</span></label><select class=\\"objetoImp\\" required><option value=\\"\\">Seleccionar...</option><option value=\\"01\\">No objeto de impuesto</option><option value=\\"02\\">Si objeto de impuesto</option><option value=\\"03\\">Si objeto de impuesto y no obligado al desglose</option><option value=\\"04\\">Si objeto de impuesto y no causa impuesto</option></select></div>";');
    popup.document.write('  const btnAgregar = document.getElementById("agregarConcepto");');
    popup.document.write('  container.insertBefore(nuevoConcepto, btnAgregar);');
    popup.document.write('  container.insertBefore(nuevoSecundario, btnAgregar);');
    popup.document.write('  agregarEventListeners(nuevoConcepto);');
    popup.document.write('  agregarEventListeners(nuevoSecundario);');
    popup.document.write('}');
    
    // Función eliminar concepto
    popup.document.write('function eliminarConcepto(boton) {');
    popup.document.write('  const fila = boton.closest(".producto-row");');
    popup.document.write('  const filaSecundaria = fila.nextElementSibling;');
    popup.document.write('  fila.remove();');
    popup.document.write('  if (filaSecundaria && filaSecundaria.classList.contains("producto-row-secondary")) {');
    popup.document.write('    filaSecundaria.remove();');
    popup.document.write('  }');
    popup.document.write('  calcularTotales();');
    popup.document.write('}');
    
    // Función agregar event listeners
    popup.document.write('function agregarEventListeners(elemento) {');
    popup.document.write('  const inputs = elemento.querySelectorAll(".cantidad, .precioUnitario, .descuento");');
    popup.document.write('  inputs.forEach(function(input) {');
    popup.document.write('    input.addEventListener("input", calcularTotales);');
    popup.document.write('    input.addEventListener("change", calcularTotales);');
    popup.document.write('  });');
    popup.document.write('  const claveUnidad = elemento.querySelector(".claveUnidad");');
    popup.document.write('  if (claveUnidad) {');
    popup.document.write('    claveUnidad.addEventListener("change", function() {');
    popup.document.write('      const unidadInput = elemento.querySelector(".unidad");');
    popup.document.write('      const claveUnidadMap = {');
    popup.document.write('        "E48": "Unidad de servicio",');
    popup.document.write('        "H87": "Pieza",');
    popup.document.write('        "KGM": "Kilogramo",');
    popup.document.write('        "LTR": "Litro",');
    popup.document.write('        "MTR": "Metro",');
    popup.document.write('        "SET": "Conjunto",');
    popup.document.write('        "XBX": "Caja",');
    popup.document.write('        "XNA": "No aplica"');
    popup.document.write('      };');
    popup.document.write('      if (claveUnidadMap[this.value]) {');
    popup.document.write('        unidadInput.value = claveUnidadMap[this.value];');
    popup.document.write('      }');
    popup.document.write('    });');
    popup.document.write('  }');
    popup.document.write('}');
    
    // FUNCIÓN PRINCIPAL PARA ENVIAR CFDI - AQUÍ ESTÁ LA INTEGRACIÓN REAL
    popup.document.write('function enviarCFDI(datos) {');
    popup.document.write('  if (isProcessing) return;');
    popup.document.write('  isProcessing = true;');
    popup.document.write('  ');
    popup.document.write('  console.log("📤 Enviando CFDI a WordPress:", datos);');
    popup.document.write('  ');
    popup.document.write('  // Mostrar loading');
    popup.document.write('  document.getElementById("loading").style.display = "block";');
    popup.document.write('  document.getElementById("submitBtn").disabled = true;');
    popup.document.write('  document.getElementById("result-container").style.display = "none";');
    popup.document.write('  ');
    popup.document.write('  // Obtener configuración de WordPress desde la ventana padre');
    popup.document.write('  const ajaxUrl = window.parent.pos_billing_ajax?.ajax_url || "/wp-admin/admin-ajax.php";');
    popup.document.write('  const nonce = window.parent.pos_billing_ajax?.nonce || "";');
    popup.document.write('  ');
    popup.document.write('  // Preparar datos para WordPress');
    popup.document.write('  const formData = new FormData();');
    popup.document.write('  formData.append("action", "pos_billing_create_cfdi");');
    popup.document.write('  formData.append("nonce", nonce);');
    popup.document.write('  formData.append("cfdi_data", JSON.stringify(datos));');
    popup.document.write('  ');
    popup.document.write('  // Enviar petición a WordPress');
    popup.document.write('  fetch(ajaxUrl, {');
    popup.document.write('    method: "POST",');
    popup.document.write('    body: formData');
    popup.document.write('  })');
    popup.document.write('  .then(response => {');
    popup.document.write('    console.log("📡 Respuesta recibida:", response);');
    popup.document.write('    return response.json();');
    popup.document.write('  })');
    popup.document.write('  .then(data => {');
    popup.document.write('    console.log("📋 Datos procesados:", data);');
    popup.document.write('    ');
    popup.document.write('    // Ocultar loading');
    popup.document.write('    document.getElementById("loading").style.display = "none";');
    popup.document.write('    document.getElementById("submitBtn").disabled = false;');
    popup.document.write('    ');
    popup.document.write('    if (data.success) {');
    popup.document.write('      mostrarResultadoExitoso(data.data);');
    popup.document.write('    } else {');
    popup.document.write('      mostrarResultadoError(data.data || data.message || "Error desconocido");');
    popup.document.write('    }');
    popup.document.write('  })');
    popup.document.write('  .catch(error => {');
    popup.document.write('    console.error("❌ Error en la petición:", error);');
    popup.document.write('    ');
    popup.document.write('    // Ocultar loading');
    popup.document.write('    document.getElementById("loading").style.display = "none";');
    popup.document.write('    document.getElementById("submitBtn").disabled = false;');
    popup.document.write('    ');
    popup.document.write('    mostrarResultadoError("Error de conexión: " + error.message);');
    popup.document.write('  })');
    popup.document.write('  .finally(() => {');
    popup.document.write('    isProcessing = false;');
    popup.document.write('  });');
    popup.document.write('}');
    
    // Función para mostrar resultado exitoso
    popup.document.write('function mostrarResultadoExitoso(data) {');
    popup.document.write('  const container = document.getElementById("result-container");');
    popup.document.write('  const content = document.getElementById("result-content");');
    popup.document.write('  ');
    popup.document.write('  container.className = "result-container result-success";');
    popup.document.write('  content.innerHTML = ');
    popup.document.write('    "<div class=\\"result-title\\">✅ CFDI Generado Exitosamente</div>" +');
    popup.document.write('    "<div class=\\"result-data\\">" +');
    popup.document.write('    "<dl>" +');
    popup.document.write('    "<dt>🆔 UUID:</dt><dd>" + (data.uuid || "N/A") + "</dd>" +');
    popup.document.write('    "<dt>📄 Folio:</dt><dd>" + (data.folio || "N/A") + "</dd>" +');
    popup.document.write('    "<dt>📅 Fecha de Timbrado:</dt><dd>" + (data.fecha_timbrado || "N/A") + "</dd>" +');
    popup.document.write('    "<dt>💰 Total:</dt><dd>$" + (data.total || "0.00") + "</dd>" +');
    popup.document.write('    "</dl>" +');
    popup.document.write('    "</div>" +');
    popup.document.write('    "<div style=\\"margin-top: 20px; text-align: center;\\">" +');
    popup.document.write('    "<button onclick=\\"generarOtroComprobante()\\" class=\\"btn\\">📄 Generar Otro Comprobante</button>" +');
    popup.document.write('    "<button onclick=\\"window.close()\\" class=\\"btn btn-cancel\\">❌ Cerrar</button>" +');
    popup.document.write('    "</div>";');
    popup.document.write('  ');
    popup.document.write('  container.style.display = "block";');
    popup.document.write('  container.scrollIntoView({ behavior: "smooth" });');
    popup.document.write('}');
    
    // Función para mostrar resultado de error
    popup.document.write('function mostrarResultadoError(errorData) {');
    popup.document.write('  const container = document.getElementById("result-container");');
    popup.document.write('  const content = document.getElementById("result-content");');
    popup.document.write('  ');
    popup.document.write('  let errorMessage = "Error desconocido";');
    popup.document.write('  let errorDetail = "";');
    popup.document.write('  ');
    popup.document.write('  if (typeof errorData === "string") {');
    popup.document.write('    errorMessage = errorData;');
    popup.document.write('  } else if (errorData && typeof errorData === "object") {');
    popup.document.write('    errorMessage = errorData.message || errorData.error || "Error en la API";');
    popup.document.write('    errorDetail = errorData.detail || errorData.messageDetail || "";');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  container.className = "result-container result-error";');
    popup.document.write('  content.innerHTML = ');
    popup.document.write('    "<div class=\\"result-title\\">❌ Error al Generar CFDI</div>" +');
    popup.document.write('    "<div class=\\"alert alert-danger\\">" +');
    popup.document.write('    "<strong>Error:</strong> " + errorMessage +');
    popup.document.write('    (errorDetail ? "<br><small>" + errorDetail + "</small>" : "") +');
    popup.document.write('    "</div>" +');
    popup.document.write('    "<div style=\\"margin-top: 20px; text-align: center;\\">" +');
    popup.document.write('    "<button onclick=\\"document.getElementById(\\\\"result-container\\\\").style.display=\\\\"none\\\\"\\" class=\\"btn\\">🔄 Intentar de Nuevo</button>" +');
    popup.document.write('    "<button onclick=\\"window.close()\\" class=\\"btn btn-cancel\\">❌ Cerrar</button>" +');
    popup.document.write('    "</div>";');
    popup.document.write('  ');
    popup.document.write('  container.style.display = "block";');
    popup.document.write('  container.scrollIntoView({ behavior: "smooth" });');
    popup.document.write('}');
    
    // Función para generar otro comprobante
    popup.document.write('function generarOtroComprobante() {');
    popup.document.write('  document.getElementById("result-container").style.display = "none";');
    popup.document.write('  document.getElementById("cfdiformulario").reset();');
    popup.document.write('  // Generar nuevo número de orden');
    popup.document.write('  const timestamp = Date.now();');
    popup.document.write('  const random = Math.floor(Math.random() * 1000);');
    popup.document.write('  document.getElementById("numOrder").value = "ORD-" + timestamp + "-" + random;');
    popup.document.write('  calcularTotales();');
    popup.document.write('  document.querySelector(".container").scrollIntoView({ behavior: "smooth" });');
    popup.document.write('}');
    
    // Función para validar datos
    popup.document.write('function validarDatos(datos) {');
    popup.document.write('  if (!datos.Receptor.UID) {');
    popup.document.write('    alert("❌ El UID del receptor es obligatorio");');
    popup.document.write('    return false;');
    popup.document.write('  }');
    popup.document.write('  if (datos.Conceptos.length === 0) {');
    popup.document.write('    alert("❌ Debe agregar al menos un concepto");');
    popup.document.write('    return false;');
    popup.document.write('  }');
    popup.document.write('  if (!datos.Serie) {');
    popup.document.write('    alert("❌ La serie es obligatoria");');
    popup.document.write('    return false;');
    popup.document.write('  }');
    popup.document.write('  // Validar que todos los conceptos tengan los campos requeridos');
    popup.document.write('  for (let i = 0; i < datos.Conceptos.length; i++) {');
    popup.document.write('    const concepto = datos.Conceptos[i];');
    popup.document.write('    if (!concepto.ClaveProdServ || !concepto.Descripcion || !concepto.ClaveUnidad) {');
    popup.document.write('      alert("❌ Todos los conceptos deben tener Clave de Producto/Servicio, Descripción y Clave de Unidad");');
    popup.document.write('      return false;');
    popup.document.write('    }');
    popup.document.write('  }');
    popup.document.write('  return true;');
    popup.document.write('}');
    
    // Función para recopilar datos del formulario
    popup.document.write('function recopilarDatosFormulario() {');
    popup.document.write('  const receptor = {');
    popup.document.write('    UID: document.getElementById("receptorUID").value,');
    popup.document.write('    ResidenciaFiscal: document.getElementById("residenciaFiscal").value || ""');
    popup.document.write('  };');
    popup.document.write('  ');
    popup.document.write('  const conceptos = [];');
    popup.document.write('  const filasConceptos = document.querySelectorAll(".producto-row");');
    popup.document.write('  ');
    popup.document.write('  filasConceptos.forEach(function(fila) {');
    popup.document.write('    const filaSecundaria = fila.nextElementSibling;');
    popup.document.write('    const cantidad = parseFloat(fila.querySelector(".cantidad").value);');
    popup.document.write('    const precioUnitario = parseFloat(fila.querySelector(".precioUnitario").value);');
    popup.document.write('    const descuento = filaSecundaria ? parseFloat(filaSecundaria.querySelector(".descuento").value) || 0 : 0;');
    popup.document.write('    const objetoImp = filaSecundaria ? filaSecundaria.querySelector(".objetoImp").value : "02";');
    popup.document.write('    ');
    popup.document.write('    const importe = cantidad * precioUnitario;');
    popup.document.write('    ');
    popup.document.write('    const concepto = {');
    popup.document.write('      ClaveProdServ: fila.querySelector(".claveProdServ").value,');
    popup.document.write('      NoIdentificacion: filaSecundaria ? filaSecundaria.querySelector(".noIdentificacion").value || "" : "",');
    popup.document.write('      Cantidad: cantidad.toFixed(6),');
    popup.document.write('      ClaveUnidad: filaSecundaria ? filaSecundaria.querySelector(".claveUnidad").value : "E48",');
    popup.document.write('      Unidad: filaSecundaria ? filaSecundaria.querySelector(".unidad").value : "Unidad de servicio",');
    popup.document.write('      Descripcion: fila.querySelector(".descripcion").value,');
    popup.document.write('      ValorUnitario: precioUnitario.toFixed(6),');
    popup.document.write('      Importe: importe.toFixed(6),');
    popup.document.write('      Descuento: descuento.toFixed(6),');
    popup.document.write('      ObjetoImp: objetoImp');
    popup.document.write('    };');
    popup.document.write('    ');
    popup.document.write('    // Agregar impuestos si el objeto es gravado');
    popup.document.write('    if (objetoImp === "02") {');
    popup.document.write('      const baseGravable = importe - descuento;');
    popup.document.write('      const ivaImporte = baseGravable * 0.16;');
    popup.document.write('      ');
    popup.document.write('      concepto.Impuestos = {');
    popup.document.write('        Traslados: [{');
    popup.document.write('          Base: baseGravable.toFixed(6),');
    popup.document.write('          Impuesto: "002",');
    popup.document.write('          TipoFactor: "Tasa",');
    popup.document.write('          TasaOCuota: "0.16",');
    popup.document.write('          Importe: ivaImporte.toFixed(6)');
    popup.document.write('        }],');
    popup.document.write('        Retenidos: [],');
    popup.document.write('        Locales: []');
    popup.document.write('      };');
    popup.document.write('    }');
    popup.document.write('    ');
    popup.document.write('    conceptos.push(concepto);');
    popup.document.write('  });');
    popup.document.write('  ');
    popup.document.write('  const datos = {');
    popup.document.write('    Receptor: receptor,');
    popup.document.write('    TipoDocumento: document.getElementById("tipoDocumento").value,');
    popup.document.write('    Conceptos: conceptos,');
    popup.document.write('    UsoCFDI: document.getElementById("usoCFDI").value,');
    popup.document.write('    Serie: parseInt(document.getElementById("serie").value),');
    popup.document.write('    FormaPago: document.getElementById("formaPago").value,');
    popup.document.write('    MetodoPago: document.getElementById("metodoPago").value,');
    popup.document.write('    Moneda: document.getElementById("moneda").value,');
    popup.document.write('    EnviarCorreo: document.getElementById("enviarCorreo").checked');
    popup.document.write('  };');
    popup.document.write('  ');
    popup.document.write('  // Campos opcionales');
    popup.document.write('  const tipoCambio = document.getElementById("tipoCambio").value;');
    popup.document.write('  if (tipoCambio && datos.Moneda !== "MXN") {');
    popup.document.write('    datos.TipoCambio = tipoCambio;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  const numOrder = document.getElementById("numOrder").value;');
    popup.document.write('  if (numOrder) {');
    popup.document.write('    datos.NumOrder = numOrder;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  const lugarExpedicion = document.getElementById("lugarExpedicion").value;');
    popup.document.write('  if (lugarExpedicion) {');
    popup.document.write('    datos.LugarExpedicion = lugarExpedicion;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  const condicionesPago = document.getElementById("condicionesPago").value;');
    popup.document.write('  if (condicionesPago) {');
    popup.document.write('    datos.CondicionesDePago = condicionesPago;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  const comentarios = document.getElementById("comentarios").value;');
    popup.document.write('  if (comentarios) {');
    popup.document.write('    datos.Comentarios = comentarios;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  const borradorSiFalla = document.getElementById("borradorSiFalla").checked;');
    popup.document.write('  if (borradorSiFalla) {');
    popup.document.write('    datos.BorradorSiFalla = "1";');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  return datos;');
    popup.document.write('}');
    
    // Manejo del formulario
    popup.document.write('document.getElementById("cfdiformulario").addEventListener("submit", function(e) {');
    popup.document.write('  e.preventDefault();');
    popup.document.write('  ');
    popup.document.write('  if (isProcessing) {');
    popup.document.write('    alert("⏳ Ya se está procesando una solicitud, por favor espere...");');
    popup.document.write('    return;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  const datos = recopilarDatosFormulario();');
    popup.document.write('  console.log("📋 Datos recopilados:", datos);');
    popup.document.write('  ');
    popup.document.write('  if (validarDatos(datos)) {');
    popup.document.write('    enviarCFDI(datos);');
    popup.document.write('  }');
    popup.document.write('});');
    
    // Control de tipo de cambio según moneda
    popup.document.write('document.getElementById("moneda").addEventListener("change", function(e) {');
    popup.document.write('  const tipoCambioGroup = document.getElementById("tipoCambio").closest(".form-group");');
    popup.document.write('  if (e.target.value === "MXN") {');
    popup.document.write('    tipoCambioGroup.style.opacity = "0.5";');
    popup.document.write('    document.getElementById("tipoCambio").disabled = true;');
    popup.document.write('    document.getElementById("tipoCambio").value = "";');
    popup.document.write('  } else {');
    popup.document.write('    tipoCambioGroup.style.opacity = "1";');
    popup.document.write('    document.getElementById("tipoCambio").disabled = false;');
    popup.document.write('  }');
    popup.document.write('});');
    
    // Inicialización
    popup.document.write('window.addEventListener("load", function() {');
    popup.document.write('  console.log("🚀 Popup cargado, iniciando...");');
    popup.document.write('  ');
    popup.document.write('  // Cargar configuraciones por defecto desde WordPress');
    popup.document.write('  const wpSettings = window.parent.pos_billing_ajax?.settings?.defaults || {};');
    popup.document.write('  if (wpSettings.serie) document.getElementById("serie").value = wpSettings.serie;');
    popup.document.write('  if (wpSettings.forma_pago) document.getElementById("formaPago").value = wpSettings.forma_pago;');
    popup.document.write('  if (wpSettings.metodo_pago) document.getElementById("metodoPago").value = wpSettings.metodo_pago;');
    popup.document.write('  if (wpSettings.uso_cfdi) document.getElementById("usoCFDI").value = wpSettings.uso_cfdi;');
    popup.document.write('  if (wpSettings.lugar_expedicion) document.getElementById("lugarExpedicion").value = wpSettings.lugar_expedicion;');
    popup.document.write('  ');
    popup.document.write('  // Generar número de orden único si no existe');
    popup.document.write('  if (!document.getElementById("numOrder").value) {');
    popup.document.write('    const timestamp = Date.now();');
    popup.document.write('    const random = Math.floor(Math.random() * 1000);');
    popup.document.write('    document.getElementById("numOrder").value = "ORD-" + timestamp + "-" + random;');
    popup.document.write('  }');
    popup.document.write('  ');
    popup.document.write('  // Configurar valores por defecto');
    popup.document.write('  document.getElementById("tipoDocumento").value = "factura";');
    popup.document.write('  document.getElementById("moneda").value = "MXN";');
    popup.document.write('  ');
    popup.document.write('  // Agregar event listeners a los elementos iniciales');
    popup.document.write('  const conceptoInicial = document.querySelector(".producto-row");');
    popup.document.write('  const conceptoSecundario = document.querySelector(".producto-row-secondary");');
    popup.document.write('  if (conceptoInicial) agregarEventListeners(conceptoInicial);');
    popup.document.write('  if (conceptoSecundario) agregarEventListeners(conceptoSecundario);');
    popup.document.write('  ');
    popup.document.write('  // Event listener para agregar conceptos');
    popup.document.write('  document.getElementById("agregarConcepto").addEventListener("click", agregarConcepto);');
    popup.document.write('  ');
    popup.document.write('  // Calcular totales inicial');
    popup.document.write('  setTimeout(function() {');
    popup.document.write('    calcularTotales();');
    popup.document.write('  }, 500);');
    popup.document.write('  ');
    popup.document.write('  console.log("✅ Inicialización completada");');
    popup.document.write('});');
    
    popup.document.write('</script>');
    popup.document.write('</body>');
    popup.document.write('</html>');
    
    popup.document.close();
    popup.focus();
  } else {
    alert("Por favor, permita ventanas emergentes para usar el módulo de facturación");
  }
}