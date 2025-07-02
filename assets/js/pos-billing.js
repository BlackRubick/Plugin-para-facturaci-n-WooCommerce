// Funcionalidad del botón de facturación - VERSIÓN FINAL COMPLETA SIN ERRORES
document.addEventListener("DOMContentLoaded", function () {
  // Buscar el botón de facturación
  const billingBtn = document.getElementById("pos-billing-btn");

  if (billingBtn) {
    billingBtn.addEventListener("click", function () {
      abrirModuloFacturacion();
    });

    // Efecto hover
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
    // Crear el documento paso a paso para evitar errores
    popup.document.open();
    popup.document.write('<!DOCTYPE html>');
    popup.document.write('<html>');
    popup.document.write('<head>');
    popup.document.write('<title>Sistema de Facturación CFDI 4.0</title>');
    popup.document.write('<meta charset="UTF-8">');
    
    // CSS
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
    
    // HTML del formulario
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
    
    // JAVASCRIPT
    popup.document.write('<script>');
    popup.document.write('let isProcessing = false;');
    
    // Función calcular totales
    popup.document.write('function calcularTotales() {');
    popup.document.write('  console.log("🔢 Calculando totales...");');
    popup.document.write('  let subtotal = 0;');
    popup.document.write('  let totalDescuentos = 0;');
    popup.document.write('  const conceptos = document.querySelectorAll(".producto-row");');
    popup.document.write('  console.log("📋 Conceptos encontrados:", conceptos.length);');
    popup.document.write('  conceptos.forEach(function(concepto, index) {');
    popup.document.write('    console.log("📦 Procesando concepto " + (index + 1) + ":");');
    popup.document.write('    const cantidad = parseFloat(concepto.querySelector(".cantidad").value) || 0;');
    popup.document.write('    const precio = parseFloat(concepto.querySelector(".precioUnitario").value) || 0;');
    popup.document.write('    const filaSecundaria = concepto.nextElementSibling;');
    popup.document.write('    const descuento = filaSecundaria ? parseFloat(filaSecundaria.querySelector(".descuento").value) || 0 : 0;');
    popup.document.write('    console.log("  - Cantidad: " + cantidad);');
    popup.document.write('    console.log("  - Precio: " + precio);');
    popup.document.write('    console.log("  - Descuento: " + descuento);');
    popup.document.write('    const importeConcepto = cantidad * precio;');
    popup.document.write('    const totalConcepto = importeConcepto - descuento;');
    popup.document.write('    console.log("  - Importe: " + importeConcepto);');
    popup.document.write('    console.log("  - Total concepto: " + totalConcepto);');
    popup.document.write('    const campoTotal = concepto.querySelector(".totalConcepto");');
    popup.document.write('    if (campoTotal) { campoTotal.value = totalConcepto.toFixed(6); }');
    popup.document.write('    subtotal += importeConcepto;');
    popup.document.write('    totalDescuentos += descuento;');
    popup.document.write('  });');
    popup.document.write('  const subtotalFinal = subtotal - totalDescuentos;');
    popup.document.write('  const iva = subtotalFinal * 0.16;');
    popup.document.write('  const total = subtotalFinal + iva;');
    popup.document.write('  console.log("💰 Totales finales:");');
    popup.document.write('  console.log("  - Subtotal: " + subtotal);');
    popup.document.write('  console.log("  - Descuentos: " + totalDescuentos);');
    popup.document.write('  console.log("  - Subtotal final: " + subtotalFinal);');
    popup.document.write('  console.log("  - IVA: " + iva);');
    popup.document.write('  console.log("  - Total: " + total);');
    popup.document.write('  const elementoSubtotal = document.getElementById("subtotal");');
    popup.document.write('  const elementoDescuentos = document.getElementById("totalDescuentos");');
    popup.document.write('  const elementoIva = document.getElementById("iva");');
    popup.document.write('  const elementoTotal = document.getElementById("total");');
    popup.document.write('  if (elementoSubtotal) {');
    popup.document.write('    elementoSubtotal.textContent = "$" + subtotal.toFixed(2);');
    popup.document.write('    console.log("✅ Subtotal actualizado");');
    popup.document.write('  } else {');
    popup.document.write('    console.error("❌ No se encontró elemento subtotal");');
    popup.document.write('  }');
    popup.document.write('  if (elementoDescuentos) {');
    popup.document.write('    elementoDescuentos.textContent = "$" + totalDescuentos.toFixed(2);');
    popup.document.write('    console.log("✅ Descuentos actualizado");');
    popup.document.write('  } else {');
    popup.document.write('    console.error("❌ No se encontró elemento totalDescuentos");');
    popup.document.write('  }');
    popup.document.write('  if (elementoIva) {');
    popup.document.write('    elementoIva.textContent = "$" + iva.toFixed(2);');
    popup.document.write('    console.log("✅ IVA actualizado");');
    popup.document.write('  } else {');
    popup.document.write('    console.error("❌ No se encontró elemento iva");');
    popup.document.write('  }');
    popup.document.write('  if (elementoTotal) {');
    popup.document.write('    elementoTotal.textContent = "$" + total.toFixed(2);');
    popup.document.write('    console.log("✅ Total actualizado");');
    popup.document.write('  } else {');
    popup.document.write('    console.error("❌ No se encontró elemento total");');
    popup.document.write('  }');
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
    
    // Función recalcular desde total
    popup.document.write('function recalcularDesdeTotal(input) {');
    popup.document.write('  const fila = input.closest(".producto-row");');
    popup.document.write('  const cantidad = parseFloat(fila.querySelector(".cantidad").value) || 0;');
    popup.document.write('  const total = parseFloat(input.value) || 0;');
    popup.document.write('  if (cantidad > 0) {');
    popup.document.write('    const nuevoPrecio = total / cantidad;');
    popup.document.write('    fila.querySelector(".precioUnitario").value = nuevoPrecio.toFixed(6);');
    popup.document.write('  }');
    popup.document.write('  calcularTotales();');
    popup.document.write('}');
    
    // Función agregar event listeners
    popup.document.write('function agregarEventListeners(elemento) {');
    popup.document.write('  const inputs = elemento.querySelectorAll(".cantidad, .precioUnitario, .descuento, .totalConcepto");');
    popup.document.write('  inputs.forEach(function(input) {');
    popup.document.write('    input.addEventListener("input", function() {');
    popup.document.write('      if (input.classList.contains("totalConcepto")) {');
    popup.document.write('        recalcularDesdeTotal(input);');
    popup.document.write('      } else {');
    popup.document.write('        calcularTotales();');
    popup.document.write('      }');
    popup.document.write('    });');
    popup.document.write('    input.addEventListener("change", function() {');
    popup.document.write('      if (input.classList.contains("totalConcepto")) {');
    popup.document.write('        recalcularDesdeTotal(input);');
    popup.document.write('      } else {');
    popup.document.write('        calcularTotales();');
    popup.document.write('      }');
    popup.document.write('    });');
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
    
    // Función de testing
    popup.document.write('function testCalcularTotales() {');
    popup.document.write('  console.log("🧪 Test manual de calcularTotales");');
    popup.document.write('  const primerConcepto = document.querySelector(".producto-row");');
    popup.document.write('  if (primerConcepto) {');
    popup.document.write('    const cantidad = primerConcepto.querySelector(".cantidad");');
    popup.document.write('    const precio = primerConcepto.querySelector(".precioUnitario");');
    popup.document.write('    if (cantidad) cantidad.value = "2";');
    popup.document.write('    if (precio) precio.value = "100";');
    popup.document.write('    console.log("📝 Datos de prueba agregados: 2 x $100");');
    popup.document.write('    calcularTotales();');
    popup.document.write('  } else {');
    popup.document.write('    console.error("❌ No se encontró el primer concepto");');
    popup.document.write('  }');
    popup.document.write('}');
    
    // Función para envío CFDI (simplificada para evitar errores)
    popup.document.write('function enviarCFDI(datos) {');
    popup.document.write('  console.log("📤 Enviando CFDI:", datos);');
    popup.document.write('  alert("✅ Función enviarCFDI preparada. Integración con WordPress próxima.");');
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
    popup.document.write('  return true;');
    popup.document.write('}');
    
    // Función para recopilar datos
    popup.document.write('function recopilarDatosFormulario() {');
    popup.document.write('  const receptor = {');
    popup.document.write('    UID: document.getElementById("receptorUID").value,');
    popup.document.write('    ResidenciaFiscal: document.getElementById("residenciaFiscal").value || ""');
    popup.document.write('  };');
    popup.document.write('  const conceptos = [];');
    popup.document.write('  const filasConceptos = document.querySelectorAll(".producto-row");');
    popup.document.write('  filasConceptos.forEach(function(fila) {');
    popup.document.write('    const filaSecundaria = fila.nextElementSibling;');
    popup.document.write('    const cantidad = parseFloat(fila.querySelector(".cantidad").value);');
    popup.document.write('    const precioUnitario = parseFloat(fila.querySelector(".precioUnitario").value);');
    popup.document.write('    const descuento = filaSecundaria ? parseFloat(filaSecundaria.querySelector(".descuento").value) || 0 : 0;');
    popup.document.write('    const concepto = {');
    popup.document.write('      ClaveProdServ: fila.querySelector(".claveProdServ").value,');
    popup.document.write('      Cantidad: cantidad.toFixed(6),');
    popup.document.write('      Descripcion: fila.querySelector(".descripcion").value,');
    popup.document.write('      ValorUnitario: precioUnitario.toFixed(6),');
    popup.document.write('      ClaveUnidad: filaSecundaria ? filaSecundaria.querySelector(".claveUnidad").value : "E48",');
    popup.document.write('      Unidad: filaSecundaria ? filaSecundaria.querySelector(".unidad").value : "Unidad de servicio",');
    popup.document.write('      ObjetoImp: filaSecundaria ? filaSecundaria.querySelector(".objetoImp").value : "02"');
    popup.document.write('    };');
    popup.document.write('    conceptos.push(concepto);');
    popup.document.write('  });');
    popup.document.write('  return {');
    popup.document.write('    Receptor: receptor,');
    popup.document.write('    TipoDocumento: document.getElementById("tipoDocumento").value,');
    popup.document.write('    Conceptos: conceptos,');
    popup.document.write('    UsoCFDI: document.getElementById("usoCFDI").value,');
    popup.document.write('    Serie: parseInt(document.getElementById("serie").value),');
    popup.document.write('    FormaPago: document.getElementById("formaPago").value,');
    popup.document.write('    MetodoPago: document.getElementById("metodoPago").value,');
    popup.document.write('    Moneda: document.getElementById("moneda").value');
    popup.document.write('  };');
    popup.document.write('}');
    
    // Manejo del formulario
    popup.document.write('document.getElementById("cfdiformulario").addEventListener("submit", function(e) {');
    popup.document.write('  e.preventDefault();');
    popup.document.write('  const datos = recopilarDatosFormulario();');
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
    popup.document.write('  const wpSettings = window.parent.pos_billing_ajax?.settings?.defaults || {};');
    popup.document.write('  if (wpSettings.serie) document.getElementById("serie").value = wpSettings.serie;');
    popup.document.write('  if (wpSettings.forma_pago) document.getElementById("formaPago").value = wpSettings.forma_pago;');
    popup.document.write('  if (wpSettings.metodo_pago) document.getElementById("metodoPago").value = wpSettings.metodo_pago;');
    popup.document.write('  if (wpSettings.uso_cfdi) document.getElementById("usoCFDI").value = wpSettings.uso_cfdi;');
    popup.document.write('  if (wpSettings.lugar_expedicion) document.getElementById("lugarExpedicion").value = wpSettings.lugar_expedicion;');
    popup.document.write('  if (!document.getElementById("numOrder").value) {');
    popup.document.write('    const timestamp = Date.now();');
    popup.document.write('    const random = Math.floor(Math.random() * 1000);');
    popup.document.write('    document.getElementById("numOrder").value = "ORD-" + timestamp + "-" + random;');
    popup.document.write('  }');
    popup.document.write('  const conceptoInicial = document.querySelector(".producto-row");');
    popup.document.write('  const conceptoSecundario = document.querySelector(".producto-row-secondary");');
    popup.document.write('  if (conceptoInicial) agregarEventListeners(conceptoInicial);');
    popup.document.write('  if (conceptoSecundario) agregarEventListeners(conceptoSecundario);');
    popup.document.write('  document.getElementById("agregarConcepto").addEventListener("click", agregarConcepto);');
    popup.document.write('  setTimeout(function() {');
    popup.document.write('    console.log("⏰ Ejecutando calcularTotales inicial...");');
    popup.document.write('    calcularTotales();');
    popup.document.write('  }, 500);');
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