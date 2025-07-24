/**
 * Módulo de cálculos y totales para POS Facturación
 * assets/js/modules/calculations.js
 */

class POSBillingCalculations {
    constructor(config) {
        this.config = config;
        this.utils = window.POSBilling?.modules?.utils;
        this.totals = {
            subtotal: 0,
            descuentos: 0,
            subtotalNeto: 0,
            iva: 0,
            total: 0
        };
        this.ivaRate = 0.16; // 16%
    }
    
    /**
     * Calcular todos los totales del formulario
     */
    calculateTotals() {
        this.log('Calculando totales...');
        
        this.resetTotals();
        const conceptos = this.getConceptRows();
        
        conceptos.forEach((concepto, index) => {
            const conceptoTotals = this.calculateConceptTotals(concepto, index);
            this.addToGrandTotals(conceptoTotals);
        });
        
        this.updateTotalsDisplay();
        this.log('Totales calculados:', 'success', this.totals);
    }
    
    /**
     * Resetear totales
     */
    resetTotals() {
        this.totals = {
            subtotal: 0,
            descuentos: 0,
            subtotalNeto: 0,
            iva: 0,
            total: 0
        };
    }
    
    /**
     * Obtener todas las filas de conceptos
     */
    getConceptRows() {
        return document.querySelectorAll('.producto-row');
    }
    
    /**
     * Calcular totales de un concepto específico
     */
    calculateConceptTotals(conceptoRow, index) {
        const data = this.extractConceptData(conceptoRow);
        
        if (!this.validateConceptData(data, index)) {
            return this.getEmptyConceptTotals();
        }
        
        const importe = data.cantidad * data.precio;
        const importeConDescuento = importe - data.descuento;
        const ivaImporte = this.calculateIVA(importeConDescuento, data.objetoImp);
        const totalConcepto = importeConDescuento + ivaImporte;
        
        // Actualizar campo total del concepto
        this.updateConceptTotal(conceptoRow, totalConcepto);
        
        return {
            importe: importe,
            descuento: data.descuento,
            importeNeto: importeConDescuento,
            iva: ivaImporte,
            total: totalConcepto
        };
    }
    
    /**
     * Extraer datos de un concepto
     */
    extractConceptData(conceptoRow) {
        const cantidad = this.getFieldValue(conceptoRow, '.cantidad', 0);
        const precio = this.getFieldValue(conceptoRow, '.precioUnitario', 0);
        
        // Buscar descuento en la fila secundaria
        const filaSecundaria = conceptoRow.nextElementSibling;
        const descuento = filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary') ? 
            this.getFieldValue(filaSecundaria, '.descuento', 0) : 0;
        
        const objetoImp = filaSecundaria ? 
            this.getFieldValue(filaSecundaria, '.objetoImp', '02', true) : '02';
        
        return {
            cantidad: cantidad,
            precio: precio,
            descuento: descuento,
            objetoImp: objetoImp
        };
    }
    
    /**
     * Obtener valor de un campo
     */
    getFieldValue(container, selector, defaultValue = 0, isText = false) {
        const field = container.querySelector(selector);
        if (!field) return defaultValue;
        
        if (isText) {
            return field.value || defaultValue;
        }
        
        const value = parseFloat(field.value) || defaultValue;
        return isNaN(value) ? defaultValue : value;
    }
    
    /**
     * Validar datos del concepto
     */
    validateConceptData(data, index) {
        if (data.cantidad < 0 || data.precio < 0 || data.descuento < 0) {
            this.log(`Concepto ${index + 1}: Valores negativos no permitidos`, 'warn');
            return false;
        }
        
        if (data.descuento > (data.cantidad * data.precio)) {
            this.log(`Concepto ${index + 1}: El descuento no puede ser mayor al importe`, 'warn');
            return false;
        }
        
        return true;
    }
    
    /**
     * Obtener totales vacíos para un concepto
     */
    getEmptyConceptTotals() {
        return {
            importe: 0,
            descuento: 0,
            importeNeto: 0,
            iva: 0,
            total: 0
        };
    }
    
    /**
     * Calcular IVA según el objeto de impuesto
     */
    calculateIVA(importeNeto, objetoImp) {
        // Solo calcular IVA si es objeto de impuesto (02)
        if (objetoImp === '02' && importeNeto > 0) {
            return importeNeto * this.ivaRate;
        }
        return 0;
    }
    
    /**
     * Actualizar total del concepto en la interfaz
     */
    updateConceptTotal(conceptoRow, total) {
        const totalField = conceptoRow.querySelector('.totalConcepto');
        if (totalField) {
            totalField.value = total.toFixed(2);
        }
    }
    
    /**
     * Agregar totales del concepto al gran total
     */
    addToGrandTotals(conceptTotals) {
        this.totals.subtotal += conceptTotals.importe;
        this.totals.descuentos += conceptTotals.descuento;
        this.totals.subtotalNeto += conceptTotals.importeNeto;
        this.totals.iva += conceptTotals.iva;
        this.totals.total += conceptTotals.total;
    }
    
    /**
     * Actualizar display de totales en la interfaz
     */
    updateTotalsDisplay() {
        const elements = {
            'subtotal': this.totals.subtotal,
            'totalDescuentos': this.totals.descuentos,
            'iva': this.totals.iva,
            'total': this.totals.total
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const formattedValue = this.utils ? 
                    this.utils.formatCurrency(elements[id]) : 
                    '$' + elements[id].toFixed(2);
                element.textContent = formattedValue;
            }
        });
    }
    
    /**
     * Configurar eventos de cálculo para un concepto
     */
    setupCalculationEvents(conceptoRow) {
        if (!conceptoRow) return;
        
        const fieldsToWatch = ['.cantidad', '.precioUnitario'];
        const filaSecundaria = conceptoRow.nextElementSibling;
        
        // Eventos en la fila principal
        fieldsToWatch.forEach(selector => {
            const field = conceptoRow.querySelector(selector);
            if (field && !field.hasAttribute('data-calc-events')) {
                this.attachCalculationEvent(field);
            }
        });
        
        // Eventos en la fila secundaria
        if (filaSecundaria && filaSecundaria.classList.contains('producto-row-secondary')) {
            const descuentoField = filaSecundaria.querySelector('.descuento');
            const objetoImpField = filaSecundaria.querySelector('.objetoImp');
            
            if (descuentoField && !descuentoField.hasAttribute('data-calc-events')) {
                this.attachCalculationEvent(descuentoField);
            }
            
            if (objetoImpField && !objetoImpField.hasAttribute('data-calc-events')) {
                this.attachCalculationEvent(objetoImpField);
            }
            
            // Evento especial para cambio de clave de unidad
            this.setupUnitEvents(filaSecundaria);
        }
    }
    
    /**
     * Adjuntar evento de cálculo a un campo
     */
    attachCalculationEvent(field) {
        const self = this; // Guardar referencia a 'this'
        const eventHandler = this.debounce(() => self.calculateTotals(), 300);
        
        field.addEventListener('input', eventHandler);
        field.addEventListener('change', eventHandler);
        field.setAttribute('data-calc-events', 'true');
    }
    
    /**
     * Configurar eventos de unidades
     */
    setupUnitEvents(filaSecundaria) {
        const claveUnidadField = filaSecundaria.querySelector('.claveUnidad');
        const unidadField = filaSecundaria.querySelector('.unidad');
        
        if (claveUnidadField && unidadField && !claveUnidadField.hasAttribute('data-unit-events')) {
            claveUnidadField.addEventListener('change', () => {
                this.updateUnitText(claveUnidadField.value, unidadField);
            });
            claveUnidadField.setAttribute('data-unit-events', 'true');
        }
    }
    
    /**
     * Actualizar texto de unidad según la clave
     */
    updateUnitText(claveUnidad, unidadField) {
        const unidades = {
            'E48': 'Unidad de servicio',
            'H87': 'Pieza',
            'KGM': 'Kilogramo',
            'MTR': 'Metro',
            'LTR': 'Litro',
            'HUR': 'Hora'
        };
        
        if (unidades[claveUnidad]) {
            unidadField.value = unidades[claveUnidad];
        }
    }
    
    /**
     * Configurar eventos para todos los conceptos existentes
     */
    setupAllCalculationEvents() {
        const conceptos = this.getConceptRows();
        conceptos.forEach(concepto => {
            this.setupCalculationEvents(concepto);
        });
        
        this.log(`Eventos de cálculo configurados para ${conceptos.length} conceptos`);
    }
    
    /**
     * Validar que todos los totales sean válidos
     */
    validateTotals() {
        const errors = [];
        
        if (this.totals.total < 0) {
            errors.push('El total no puede ser negativo');
        }
        
        if (this.totals.subtotal < this.totals.descuentos) {
            errors.push('Los descuentos no pueden ser mayores al subtotal');
        }
        
        // Verificar que al menos hay un concepto con valor
        if (this.totals.subtotal === 0) {
            errors.push('Debe agregar al menos un concepto con valor');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * Obtener resumen de totales para envío
     */
    getTotalsSummary() {
        return {
            subtotal: parseFloat(this.totals.subtotal.toFixed(2)),
            descuentos: parseFloat(this.totals.descuentos.toFixed(2)),
            subtotal_neto: parseFloat(this.totals.subtotalNeto.toFixed(2)),
            iva: parseFloat(this.totals.iva.toFixed(2)),
            total: parseFloat(this.totals.total.toFixed(2)),
            iva_rate: this.ivaRate
        };
    }
    
    /**
     * Recalcular totales con validación
     */
    recalculateAndValidate() {
        this.calculateTotals();
        return this.validateTotals();
    }
    
    /**
     * Función debounce para evitar cálculos excesivos
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Log con prefijo del módulo
     */
    log(message, type = 'info', data = null) {
        if (this.utils) {
            this.utils.log(`[Cálculos] ${message}`, type, data);
        } else {
            console.log(`[POS Billing - Cálculos] ${message}`, data);
        }
    }
    
    /**
     * Obtener información detallada de un concepto para debug
     */
    getConceptDebugInfo(index) {
        const conceptos = this.getConceptRows();
        if (index >= conceptos.length) return null;
        
        const concepto = conceptos[index];
        const data = this.extractConceptData(concepto);
        const totals = this.calculateConceptTotals(concepto, index);
        
        return {
            index: index,
            data: data,
            totals: totals,
            element: concepto
        };
    }
    
    /**
     * Forzar recálculo completo
     */
    forceRecalculate() {
        this.log('Forzando recálculo completo...');
        this.setupAllCalculationEvents();
        this.calculateTotals();
    }
}

// Hacer disponible globalmente
window.POSBillingCalculations = POSBillingCalculations;