

class POSBillingFormHandler {
    constructor(config, modules) {
        this.config = config;
        this.modules = modules;
        this.utils = modules?.utils;
        this.calculations = modules?.calculations;
        this.conceptCount = 0;
    }
    
    /**
     * Inicializar eventos del formulario (para usar en popup)
     */
    initializeForm() {
        this.setupFormEvents();
        this.setupConceptEvents();
        this.generateOrderNumber();
        this.loadDefaultValues();
        this.log('Formulario inicializado');
    }
    
    /**
     * Configurar eventos principales del formulario
     */
    setupFormEvents() {
        const form = document.getElementById('cfdiformulario');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
            
            this.log('Eventos del formulario configurados');
        }
        
        // Configurar botón de agregar concepto
        const addButton = document.getElementById('agregarConcepto');
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.addConceptRow();
            });
        }
    }
    
    /**
     * Configurar eventos de conceptos
     */
    setupConceptEvents() {
        // Configurar eventos para conceptos existentes
        const conceptRows = document.querySelectorAll('.producto-row');
        conceptRows.forEach((row, index) => {
            this.setupConceptRowEvents(row, index);
        });
        
        this.conceptCount = conceptRows.length;
        this.log(`Eventos configurados para ${this.conceptCount} conceptos iniciales`);
    }
    
    /**
     * Configurar eventos para una fila de concepto específica
     */
    setupConceptRowEvents(conceptRow, index) {
        if (!conceptRow) return;
        
        // Configurar eventos de cálculo si hay módulo de cálculos
        if (this.calculations) {
            this.calculations.setupCalculationEvents(conceptRow);
        }
        
        // Configurar botón de eliminar si no es la primera fila
        if (index > 0) {
            this.addRemoveButton(conceptRow, index);
        }
        
        // Configurar validación en tiempo real
        this.setupConceptValidation(conceptRow);
    }
    
    /**
     * Agregar nueva fila de concepto
     */
    addConceptRow() {
        const conceptosContainer = document.getElementById('conceptos');
        if (!conceptosContainer) {
            this.log('Container de conceptos no encontrado', 'error');
            return;
        }
        
        this.conceptCount++;
        const newIndex = this.conceptCount - 1;
        
        // Crear nueva fila principal
        const newConceptRow = this.createConceptRow(newIndex);
        const newSecondaryRow = this.createSecondaryRow(newIndex);
        
        // Insertar antes del botón "Agregar Concepto"
        const addButton = document.getElementById('agregarConcepto');
        conceptosContainer.insertBefore(newSecondaryRow, addButton);
        conceptosContainer.insertBefore(newConceptRow, newSecondaryRow);
        
        // Configurar eventos para la nueva fila
        this.setupConceptRowEvents(newConceptRow, newIndex);
        
        // Enfocar el primer campo
        const firstInput = newConceptRow.querySelector('.descripcion');
        if (firstInput) {
            firstInput.focus();
        }
        
        this.log(`Concepto ${newIndex + 1} agregado`);
        
        // Recalcular totales
        if (this.calculations) {
            setTimeout(() => this.calculations.calculateTotals(), 100);
        }
    }
    
    /**
     * Crear fila principal de concepto
     */
    createConceptRow(index) {
        const row = document.createElement('div');
        row.className = 'producto-row';
        row.innerHTML = `
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
        `;
        return row;
    }
    
    /**
     * Crear fila secundaria de concepto
     */
    createSecondaryRow(index) {
        const row = document.createElement('div');
        row.className = 'producto-row-secondary';
        row.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Clave Unidad <span class="required">*</span></label>
                    <select class="claveUnidad" required>
                        <option value="">Seleccionar...</option>
                        <option value="E48" selected>E48 - Unidad de servicio</option>
                        <option value="H87">H87 - Pieza</option>
                        <option value="KGM">KGM - Kilogramo</option>
                        <option value="MTR">MTR - Metro</option>
                        <option value="LTR">LTR - Litro</option>
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
                    <input type="number" class="descuento" value="0" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label>Objeto Impuesto <span class="required">*</span></label>
                    <select class="objetoImp" required>
                        <option value="02" selected>02 - Sí objeto de impuesto</option>
                        <option value="01">01 - No objeto de impuesto</option>
                    </select>
                </div>
            </div>
        `;
        return row;
    }
    
    /**
     * Agregar botón de eliminar a una fila
     */
    addRemoveButton(conceptRow, index) {
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'btn-remove';
        removeButton.innerHTML = '×';
        removeButton.title = `Eliminar concepto ${index + 1}`;
        removeButton.addEventListener('click', () => {
            this.removeConceptRow(conceptRow);
        });
        
        // Agregar al último div de la fila
        const lastDiv = conceptRow.children[conceptRow.children.length - 1];
        lastDiv.appendChild(removeButton);
    }
    
    /**
     * Eliminar fila de concepto
     */
    removeConceptRow(conceptRow) {
        if (!conceptRow) return;
        
        // Confirmar eliminación
        if (!confirm('¿Estás seguro de eliminar este concepto?')) {
            return;
        }
        
        // Eliminar fila secundaria asociada
        const secondaryRow = conceptRow.nextElementSibling;
        if (secondaryRow && secondaryRow.classList.contains('producto-row-secondary')) {
            secondaryRow.remove();
        }
        
        // Eliminar fila principal
        conceptRow.remove();
        
        this.conceptCount--;
        this.log(`Concepto eliminado. Total restante: ${this.conceptCount}`);
        
        // Recalcular totales
        if (this.calculations) {
            setTimeout(() => this.calculations.calculateTotals(), 100);
        }
    }
    
    /**
     * Configurar validación para un concepto
     */
    setupConceptValidation(conceptRow) {
        const requiredFields = conceptRow.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    }
    
    /**
     * Validar un campo específico
     */
    validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            this.showFieldError(field, 'Este campo es requerido');
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    /**
     * Mostrar error en campo
     */
    showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        
        // Agregar mensaje de error si no existe
        let errorMsg = field.parentNode.querySelector('.field-error');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'field-error';
            errorMsg.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 5px;';
            field.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }
    
    /**
     * Limpiar error de campo
     */
    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorMsg = field.parentNode.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    /**
     * Generar número de orden automático
     */
    generateOrderNumber() {
        const numOrderField = document.getElementById('numOrder');
        if (numOrderField && !numOrderField.value) {
            if (this.utils) {
                numOrderField.value = this.utils.generateOrderNumber();
            } else {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000);
                numOrderField.value = `ORD-${timestamp}-${random}`;
            }
        }
    }
    
    /**
     * Cargar valores por defecto desde configuración
     */
    loadDefaultValues() {
        const defaults = this.config.settings?.defaults || {};
        
        if (defaults.serie) {
            const serieField = document.getElementById('serie');
            if (serieField) serieField.value = defaults.serie;
        }
        
        if (defaults.forma_pago) {
            const formaPagoField = document.getElementById('formaPago');
            if (formaPagoField) formaPagoField.value = defaults.forma_pago;
        }
        
        if (defaults.metodo_pago) {
            const metodoPagoField = document.getElementById('metodoPago');
            if (metodoPagoField) metodoPagoField.value = defaults.metodo_pago;
        }
        
        if (defaults.uso_cfdi) {
            const usoCfdiField = document.getElementById('usoCFDI');
            if (usoCfdiField) usoCfdiField.value = defaults.uso_cfdi;
        }
        
        this.log('Valores por defecto cargados');
    }
    
    /**
     * Manejar envío del formulario
     */
    async handleFormSubmit() {
        this.log('Procesando envío del formulario...');
        
        // Validar formulario
        const validation = this.validateForm();
        if (!validation.valid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        // Recopilar datos
        const formData = this.collectFormData();
        
        // Enviar a módulo de creación de CFDI si está disponible
        if (this.modules.cfdiCreator) {
            await this.modules.cfdiCreator.createCFDI(formData);
        } else {
            this.log('Módulo CFDI Creator no disponible', 'error');
        }
    }
    
    /**
     * Validar todo el formulario
     */
    validateForm() {
        const errors = [];
        
        // Validar receptor
        const receptorUID = document.getElementById('receptorUID');
        if (!receptorUID || !receptorUID.value.trim()) {
            errors.push('Debe seleccionar un cliente');
        }
        
        // Validar campos requeridos
        const requiredFields = [
            { id: 'tipoDocumento', name: 'Tipo de documento' },
            { id: 'usoCFDI', name: 'Uso de CFDI' },
            { id: 'serie', name: 'Serie' },
            { id: 'formaPago', name: 'Forma de pago' },
            { id: 'metodoPago', name: 'Método de pago' },
            { id: 'moneda', name: 'Moneda' }
        ];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                errors.push(`${field.name} es requerido`);
            }
        });
        
        // Validar conceptos
        const conceptRows = document.querySelectorAll('.producto-row');
        if (conceptRows.length === 0) {
            errors.push('Debe agregar al menos un concepto');
        } else {
            conceptRows.forEach((row, index) => {
                const conceptErrors = this.validateConcept(row, index + 1);
                errors.push(...conceptErrors);
            });
        }
        
        // Validar totales si hay módulo de cálculos
        if (this.calculations) {
            const totalsValidation = this.calculations.validateTotals();
            if (!totalsValidation.valid) {
                errors.push(...totalsValidation.errors);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Validar un concepto específico
     */
    validateConcept(conceptRow, conceptNumber) {
        const errors = [];
        
        // Campos requeridos del concepto
        const requiredFields = [
            { selector: '.descripcion', name: 'Descripción' },
            { selector: '.claveProdServ', name: 'Clave producto/servicio' },
            { selector: '.cantidad', name: 'Cantidad' },
            { selector: '.precioUnitario', name: 'Precio unitario' }
        ];
        
        requiredFields.forEach(field => {
            const element = conceptRow.querySelector(field.selector);
            if (!element || !element.value.trim()) {
                errors.push(`Concepto ${conceptNumber}: ${field.name} es requerido`);
            }
        });
        
        // Validar valores numéricos
        const cantidad = parseFloat(conceptRow.querySelector('.cantidad')?.value) || 0;
        const precio = parseFloat(conceptRow.querySelector('.precioUnitario')?.value) || 0;
        
        if (cantidad <= 0) {
            errors.push(`Concepto ${conceptNumber}: La cantidad debe ser mayor a 0`);
        }
        
        if (precio <= 0) {
            errors.push(`Concepto ${conceptNumber}: El precio debe ser mayor a 0`);
        }
        
        // Validar fila secundaria
        const secondaryRow = conceptRow.nextElementSibling;
        if (secondaryRow && secondaryRow.classList.contains('producto-row-secondary')) {
            const claveUnidad = secondaryRow.querySelector('.claveUnidad')?.value;
            const unidad = secondaryRow.querySelector('.unidad')?.value;
            
            if (!claveUnidad) {
                errors.push(`Concepto ${conceptNumber}: Clave de unidad es requerida`);
            }
            
            if (!unidad || !unidad.trim()) {
                errors.push(`Concepto ${conceptNumber}: Unidad es requerida`);
            }
        }
        
        return errors;
    }
    
    /**
     * Mostrar errores de validación
     */
    showValidationErrors(errors) {
        const errorMessage = 'Se encontraron los siguientes errores:\n\n' + errors.join('\n');
        
        if (this.utils) {
            this.utils.showNotification(
                `Errores de validación: ${errors.length} problema(s) encontrado(s)`,
                'error',
                8000
            );
        }
        
        alert(errorMessage);
        this.log('Errores de validación:', 'error', errors);
    }
    
    /**
     * Recopilar datos del formulario
     */
    collectFormData() {
        const conceptos = [];
        
        // Recopilar conceptos
        const conceptRows = document.querySelectorAll('.producto-row');
        conceptRows.forEach(row => {
            const secondaryRow = row.nextElementSibling;
            const conceptData = this.extractConceptData(row, secondaryRow);
            if (conceptData) {
                conceptos.push(conceptData);
            }
        });
        
        // Datos principales
        const formData = {
            Receptor: {
                UID: this.getFieldValue('receptorUID', '').trim()
            },
            TipoDocumento: this.getFieldValue('tipoDocumento', ''),
            Conceptos: conceptos,
            UsoCFDI: this.getFieldValue('usoCFDI', ''),
            Serie: parseInt(this.getFieldValue('serie', '0')),
            FormaPago: this.getFieldValue('formaPago', ''),
            MetodoPago: this.getFieldValue('metodoPago', ''),
            Moneda: this.getFieldValue('moneda', 'MXN'),
            EnviarCorreo: document.getElementById('enviarCorreo')?.checked || false
        };
        
        // Campos opcionales
        const residenciaFiscal = this.getFieldValue('residenciaFiscal', '').trim();
        if (residenciaFiscal) {
            formData.Receptor.ResidenciaFiscal = residenciaFiscal;
        }
        
        const numOrder = this.getFieldValue('numOrder', '').trim();
        if (numOrder) {
            formData.NumOrder = numOrder;
        }
        
        const comentarios = this.getFieldValue('comentarios', '').trim();
        if (comentarios) {
            formData.Comentarios = comentarios;
        }
        
        this.log('Datos del formulario recopilados:', 'success', formData);
        return formData;
    }
    
    /**
     * Extraer datos de un concepto
     */
    extractConceptData(conceptRow, secondaryRow) {
        const cantidad = parseFloat(this.getFieldValueFromElement(conceptRow, '.cantidad', 0));
        const precio = parseFloat(this.getFieldValueFromElement(conceptRow, '.precioUnitario', 0));
        const descuento = secondaryRow ? 
            parseFloat(this.getFieldValueFromElement(secondaryRow, '.descuento', 0)) : 0;
        
        const concepto = {
            ClaveProdServ: this.getFieldValueFromElement(conceptRow, '.claveProdServ', '').trim(),
            ClaveUnidad: secondaryRow ? 
                this.getFieldValueFromElement(secondaryRow, '.claveUnidad', 'E48') : 'E48',
            Unidad: secondaryRow ? 
                this.getFieldValueFromElement(secondaryRow, '.unidad', 'Unidad de servicio') : 'Unidad de servicio',
            Descripcion: this.getFieldValueFromElement(conceptRow, '.descripcion', '').trim(),
            ObjetoImp: secondaryRow ? 
                this.getFieldValueFromElement(secondaryRow, '.objetoImp', '02') : '02',
            Cantidad: cantidad,
            ValorUnitario: precio,
            Importe: cantidad * precio,
            Descuento: descuento
        };
        
        // Agregar impuestos si aplica
        if (concepto.ObjetoImp === '02') {
            const baseGravable = concepto.Importe - concepto.Descuento;
            const ivaImporte = baseGravable * 0.16;
            
            concepto.Impuestos = {
                Traslados: [{
                    Base: baseGravable,
                    Impuesto: '002',
                    TipoFactor: 'Tasa',
                    TasaOCuota: '0.16',
                    Importe: ivaImporte
                }]
            };
        }
        
        return concepto;
    }
    
    /**
     * Obtener valor de campo por ID
     */
    getFieldValue(fieldId, defaultValue = '') {
        const field = document.getElementById(fieldId);
        return field ? field.value : defaultValue;
    }
    
    /**
     * Obtener valor de campo desde un elemento contenedor
     */
    getFieldValueFromElement(container, selector, defaultValue = '') {
        const field = container.querySelector(selector);
        return field ? field.value : defaultValue;
    }
    
    /**
     * Limpiar formulario
     */
    clearForm() {
        const form = document.getElementById('cfdiformulario');
        if (form) {
            form.reset();
            
            // Limpiar conceptos adicionales
            const conceptRows = document.querySelectorAll('.producto-row');
            conceptRows.forEach((row, index) => {
                if (index > 0) { // Mantener el primer concepto
                    this.removeConceptRow(row);
                }
            });
            
            // Regenerar número de orden
            this.generateOrderNumber();
            
            // Recargar valores por defecto
            this.loadDefaultValues();
            
            this.log('Formulario limpiado');
        }
    }
    
    /**
     * Log con prefijo del módulo
     */
    log(message, type = 'info', data = null) {
        if (this.utils) {
            this.utils.log(`[Form] ${message}`, type, data);
        } else {
            console.log(`[POS Billing - Form] ${message}`, data);
        }
    }
}

// Hacer disponible globalmente
window.POSBillingFormHandler = POSBillingFormHandler;