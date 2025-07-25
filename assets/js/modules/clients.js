
class POSBillingClients {
    constructor(config) {
        this.config = config;
        this.clients = [];
        this.isLoading = false;
        this.loadAttempts = 0;
        this.maxAttempts = 3;
        this.utils = window.POSBilling?.modules?.utils;
    }
    
    /**
     * Cargar lista de clientes desde la API
     */
    async loadClients() {
        if (this.isLoading) {
            this.log('Ya se está cargando la lista de clientes', 'warn');
            return false;
        }
        
        this.log('Iniciando carga de clientes...');
        this.isLoading = true;
        this.loadAttempts++;
        
        const selectElement = document.getElementById('receptorUID');
        if (!selectElement) {
            this.log('Elemento receptorUID no encontrado', 'error');
            this.isLoading = false;
            return false;
        }
        
        try {
            // Mostrar estado de carga
            this.setLoadingState(selectElement, true);
            
            // Detectar URL correcta
            const workingUrl = await this.detectWorkingUrl();
            
            if (!workingUrl) {
                throw new Error('No se pudo encontrar una URL de WordPress funcional');
            }
            
            // Cargar clientes desde la URL funcional
            const clients = await this.fetchClientsFromUrl(workingUrl);
            
            if (clients && clients.length > 0) {
                this.clients = clients;
                this.populateClientSelect(selectElement, clients);
                this.setupClientEvents(selectElement);
                this.log(`Clientes cargados exitosamente: ${clients.length}`, 'success');
                return true;
            } else {
                throw new Error('No se obtuvieron clientes válidos');
            }
            
        } catch (error) {
            this.log(`Error cargando clientes (intento ${this.loadAttempts}): ${error.message}`, 'error');
            this.handleLoadError(selectElement, error);
            return false;
        } finally {
            this.isLoading = false;
            this.setLoadingState(selectElement, false);
        }
    }
    
    /**
     * Detectar URL de WordPress que funciona
     */
    async detectWorkingUrl() {
        const urls = [
            '/wp-admin/admin-ajax.php',
            '/pos-dashboard/wp-admin/admin-ajax.php',
            window.location.origin + '/wp-admin/admin-ajax.php',
            window.location.origin + '/pos-dashboard/wp-admin/admin-ajax.php'
        ];
        
        this.log('Detectando URL correcta de WordPress...');
        
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            this.log(`Probando URL ${i + 1}: ${url}`);
            
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'action=pos_billing_get_clients'
                });
                
                if (response.status === 200) {
                    const data = await response.json();
                    if (data.success && Array.isArray(data.data)) {
                        this.log(`URL funcional encontrada: ${url}`, 'success');
                        window.urlAjaxFuncional = url; // Guardar para uso posterior
                        return url;
                    }
                }
            } catch (error) {
                this.log(`Error probando URL ${url}: ${error.message}`, 'warn');
            }
        }
        
        return null;
    }
    
    /**
     * Obtener clientes desde una URL específica
     */
    async fetchClientsFromUrl(url) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=pos_billing_get_clients'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.data || 'Error desconocido de la API');
        }
        
        if (!Array.isArray(data.data)) {
            throw new Error('Formato de respuesta inválido');
        }
        
        return data.data;
    }
    
    /**
     * Poblar el select de clientes
     */
    populateClientSelect(selectElement, clients) {
        selectElement.innerHTML = '<option value="">Seleccionar cliente...</option>';
        
        clients.forEach((client, index) => {
            const option = document.createElement('option');
            option.value = client.uid;
            option.textContent = client.display_name;
            
            // Establecer atributos de datos
            option.setAttribute('data-rfc', client.rfc || '');
            option.setAttribute('data-email', client.email || '');
            option.setAttribute('data-uso-cfdi', client.uso_cfdi || 'G01');
            option.setAttribute('data-ciudad', client.ciudad || '');
            option.setAttribute('data-razon-social', client.razon_social || '');
            
            selectElement.appendChild(option);
            
            if (index === 0) {
                this.log('Primer cliente cargado:', 'info', {
                    uid: client.uid,
                    display_name: client.display_name,
                    rfc: client.rfc
                });
            }
        });
        
        selectElement.disabled = false;
    }
    
    /**
     * Configurar eventos del selector de clientes
     */
    setupClientEvents(selectElement) {
        if (selectElement.hasAttribute('data-events-configured')) {
            return; // Ya configurado
        }
        
        selectElement.addEventListener('change', (event) => {
            const selectedOption = event.target.options[event.target.selectedIndex];
            
            if (selectedOption.value) {
                this.handleClientSelection(selectedOption);
            } else {
                this.clearClientInfo();
            }
        });
        
        selectElement.setAttribute('data-events-configured', 'true');
        this.log('Eventos de cliente configurados');
    }
    
    /**
     * Manejar selección de cliente
     */
    handleClientSelection(option) {
        // Auto-completar uso CFDI
        const usoCfdi = option.getAttribute('data-uso-cfdi');
        if (usoCfdi) {
            const usoCfdiSelect = document.getElementById('usoCFDI');
            if (usoCfdiSelect) {
                usoCfdiSelect.value = usoCfdi;
            }
        }
        
        // Mostrar información del cliente
        this.showClientInfo(option);
        
        this.log('Cliente seleccionado:', 'success', {
            uid: option.value,
            rfc: option.getAttribute('data-rfc'),
            razon_social: option.getAttribute('data-razon-social')
        });
    }
    
    /**
     * Mostrar información del cliente seleccionado
     */
    showClientInfo(option) {
        const infoDiv = document.getElementById('clienteInfo');
        if (!infoDiv) return;
        
        const clientData = {
            'clienteRFC': option.getAttribute('data-rfc') || '-',
            'clienteEmail': option.getAttribute('data-email') || '-',
            'clienteUsoCFDI': option.getAttribute('data-uso-cfdi') || '-',
            'clienteCiudad': option.getAttribute('data-ciudad') || '-'
        };
        
        Object.keys(clientData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = clientData[id];
            }
        });
        
        infoDiv.style.display = 'block';
    }
    
    /**
     * Limpiar información del cliente
     */
    clearClientInfo() {
        const infoDiv = document.getElementById('clienteInfo');
        if (infoDiv) {
            infoDiv.style.display = 'none';
        }
    }
    
    /**
     * Recargar lista de clientes
     */
    async reloadClients() {
        this.log('Recargando lista de clientes...');
        
        // Limpiar configuración de eventos
        const selectElement = document.getElementById('receptorUID');
        if (selectElement) {
            selectElement.removeAttribute('data-events-configured');
        }
        
        // Reset contadores
        this.loadAttempts = 0;
        this.clients = [];
        
        return await this.loadClients();
    }
    
    /**
     * Buscar clientes por término
     */
    searchClients(searchTerm) {
        if (!searchTerm || !this.clients.length) {
            return this.clients;
        }
        
        const term = searchTerm.toLowerCase();
        return this.clients.filter(client => 
            client.razon_social.toLowerCase().includes(term) ||
            client.rfc.toLowerCase().includes(term) ||
            client.email.toLowerCase().includes(term) ||
            client.display_name.toLowerCase().includes(term)
        );
    }
    
    /**
     * Establecer estado de carga en el select
     */
    setLoadingState(selectElement, isLoading) {
        if (isLoading) {
            selectElement.innerHTML = '<option value="" disabled>⏳ Cargando clientes...</option>';
            selectElement.disabled = true;
        } else {
            selectElement.disabled = false;
        }
    }
    
    /**
     * Manejar errores de carga
     */
    handleLoadError(selectElement, error) {
        if (this.loadAttempts < this.maxAttempts) {
            selectElement.innerHTML = '<option value="" disabled>🔄 Reintentando...</option>';
            setTimeout(() => this.loadClients(), 2000); // Reintentar en 2 segundos
        } else {
            selectElement.innerHTML = '<option value="" disabled>❌ Error al cargar clientes</option>';
            
            if (this.utils) {
                this.utils.showNotification(
                    `Error cargando clientes: ${error.message}`, 
                    'error', 
                    10000
                );
            }
        }
    }
    
    /**
     * Obtener cliente por UID
     */
    getClientByUid(uid) {
        return this.clients.find(client => client.uid === uid);
    }
    
    /**
     * Validar datos del cliente seleccionado
     */
    validateSelectedClient() {
        const selectElement = document.getElementById('receptorUID');
        if (!selectElement || !selectElement.value) {
            return { valid: false, message: 'Debe seleccionar un cliente' };
        }
        
        const client = this.getClientByUid(selectElement.value);
        if (!client) {
            return { valid: false, message: 'Cliente seleccionado no válido' };
        }
        
        return { valid: true, client: client };
    }
    
    /**
     * Log con prefijo del módulo
     */
    log(message, type = 'info', data = null) {
        if (this.utils) {
            this.utils.log(`[Clientes] ${message}`, type, data);
        } else {
            console.log(`[POS Billing - Clientes] ${message}`, data);
        }
    }
}

// Hacer disponible globalmente
window.POSBillingClients = POSBillingClients;