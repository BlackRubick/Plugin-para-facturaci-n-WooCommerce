<?php
/**
 * Clase para manejar la integración con la API de Factura.com - VERSIÓN ACTUALIZADA
 */

if (!defined('ABSPATH')) {
    exit;
}

class POS_Billing_API_Handler {
    
    private $api_url_sandbox = 'https://sandbox.factura.com/api';
    private $api_url_production = 'https://api.factura.com';
    private $api_key;
    private $secret_key;
    private $is_sandbox;
    
    public function __construct() {
        add_action('wp_ajax_pos_billing_create_cfdi', array($this, 'create_cfdi_ajax'));
        add_action('wp_ajax_nopriv_pos_billing_create_cfdi', array($this, 'create_cfdi_ajax'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Cargar configuraciones
        $this->load_settings();
    }
    
    private function load_settings() {
        $this->is_sandbox = get_option('pos_billing_sandbox_mode', true);
        $this->api_key = get_option('pos_billing_api_key', '');
        $this->secret_key = get_option('pos_billing_secret_key', '');
        
        // Fallback a constantes si no están configuradas
        if (empty($this->api_key)) {
            $this->api_key = defined('POS_BILLING_API_KEY') ? POS_BILLING_API_KEY : '';
        }
        
        if (empty($this->secret_key)) {
            $this->secret_key = defined('POS_BILLING_SECRET_KEY') ? POS_BILLING_SECRET_KEY : '';
        }
    }
    
    /**
     * Registrar rutas REST API
     */
    public function register_rest_routes() {
        register_rest_route('pos-billing/v1', '/create-cfdi', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_cfdi_rest'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'cfdi_data' => array(
                    'required' => true,
                    'type' => 'object',
                    'description' => 'Datos del CFDI a crear'
                )
            )
        ));
    }
    
    /**
     * Verificar permisos
     */
    public function check_permissions($request) {
        // Verificar nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return false;
        }
        
        // Verificar capacidades del usuario
        return current_user_can('manage_options') || current_user_can('edit_posts');
    }
    
    /**
     * Handler AJAX para crear CFDI - MEJORADO
     */
    public function create_cfdi_ajax() {
        // Log para debug
        if (WP_DEBUG) {
            error_log('POS Billing - Iniciando creación de CFDI via AJAX');
            error_log('POS Billing - POST data: ' . print_r($_POST, true));
        }
        
        // Verificar nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'pos_billing_nonce')) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error de nonce');
            }
            wp_send_json_error('Error de seguridad - Nonce inválido');
            return;
        }
        
        // Verificar capacidades
        if (!current_user_can('edit_posts')) {
            if (WP_DEBUG) {
                error_log('POS Billing - Usuario sin permisos');
            }
            wp_send_json_error('Sin permisos suficientes');
            return;
        }
        
        // Verificar que los datos del CFDI estén presentes
        if (!isset($_POST['cfdi_data'])) {
            if (WP_DEBUG) {
                error_log('POS Billing - No se recibieron datos del CFDI');
            }
            wp_send_json_error('No se recibieron datos del CFDI');
            return;
        }
        
        // Decodificar datos del CFDI
        $cfdi_data = json_decode(stripslashes($_POST['cfdi_data']), true);
        
        if (!$cfdi_data || json_last_error() !== JSON_ERROR_NONE) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error decodificando JSON: ' . json_last_error_msg());
            }
            wp_send_json_error('Datos del CFDI inválidos o malformados');
            return;
        }
        
        if (WP_DEBUG) {
            error_log('POS Billing - Datos decodificados: ' . print_r($cfdi_data, true));
        }
        
        // Validar datos básicos
        $validation_result = $this->validate_cfdi_data($cfdi_data);
        if (!$validation_result['valid']) {
            wp_send_json_error($validation_result['message']);
            return;
        }
        
        // Crear CFDI
        $result = $this->create_cfdi($cfdi_data);
        
        if ($result['success']) {
            wp_send_json_success($result['data']);
        } else {
            wp_send_json_error($result['message'], $result['data']);
        }
    }
    
    /**
     * Validar datos del CFDI antes de enviar
     */
    private function validate_cfdi_data($data) {
        $errors = array();
        
        // Validar receptor
        if (empty($data['Receptor']['UID'])) {
            $errors[] = 'UID del receptor es requerido';
        }
        
        // Validar campos básicos
        $required_fields = array('TipoDocumento', 'UsoCFDI', 'Serie', 'FormaPago', 'MetodoPago', 'Moneda');
        foreach ($required_fields as $field) {
            if (empty($data[$field])) {
                $errors[] = "El campo {$field} es requerido";
            }
        }
        
        // Validar conceptos
        if (empty($data['Conceptos']) || !is_array($data['Conceptos'])) {
            $errors[] = 'Debe incluir al menos un concepto';
        } else {
            foreach ($data['Conceptos'] as $index => $concepto) {
                $required_concepto_fields = array('ClaveProdServ', 'Cantidad', 'ClaveUnidad', 'Unidad', 'Descripcion', 'ValorUnitario');
                foreach ($required_concepto_fields as $field) {
                    if (empty($concepto[$field])) {
                        $errors[] = "El concepto " . ($index + 1) . " requiere el campo {$field}";
                    }
                }
            }
        }
        
        // Validar tipo de cambio si es necesario
        if (!empty($data['Moneda']) && $data['Moneda'] !== 'MXN' && empty($data['TipoCambio'])) {
            $errors[] = 'El tipo de cambio es requerido para monedas diferentes a MXN';
        }
        
        if (!empty($errors)) {
            return array(
                'valid' => false,
                'message' => 'Errores de validación: ' . implode(', ', $errors)
            );
        }
        
        return array('valid' => true);
    }
    
    /**
     * Handler REST API para crear CFDI
     */
    public function create_cfdi_rest($request) {
        $cfdi_data = $request->get_param('cfdi_data');
        
        $validation_result = $this->validate_cfdi_data($cfdi_data);
        if (!$validation_result['valid']) {
            return new WP_Error('validation_failed', $validation_result['message'], array('status' => 400));
        }
        
        $result = $this->create_cfdi($cfdi_data);
        
        if ($result['success']) {
            return new WP_REST_Response($result['data'], 200);
        } else {
            return new WP_Error('cfdi_creation_failed', $result['message'], array('status' => 400, 'data' => $result['data']));
        }
    }
    
    /**
     * Crear CFDI usando la API de Factura.com - MEJORADO
     */
    public function create_cfdi($cfdi_data) {
        // Validar configuración
        if (empty($this->api_key) || empty($this->secret_key)) {
            return array(
                'success' => false,
                'message' => 'API Key o Secret Key no configurados. Por favor configúrelos en Configuración > POS Facturación.',
                'data' => null
            );
        }
        
        // Preparar URL
        $base_url = $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production;
        $url = $base_url . '/v4/cfdi40/create';
        
        // Preparar headers
        $headers = array(
            'Content-Type' => 'application/json',
            'F-PLUGIN' => '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
            'F-Api-Key' => $this->api_key,
            'F-Secret-Key' => $this->secret_key
        );
        
        // Preparar datos según el formato de Factura.com
        $formatted_data = $this->format_cfdi_data($cfdi_data);
        $body = json_encode($formatted_data);
        
        // Log para debug
        if (WP_DEBUG) {
            error_log('POS Billing - URL: ' . $url);
            error_log('POS Billing - Headers: ' . print_r($headers, true));
            error_log('POS Billing - Body: ' . $body);
        }
        
        // Realizar petición
        $response = wp_remote_post($url, array(
            'headers' => $headers,
            'body' => $body,
            'timeout' => 45,
            'sslverify' => !$this->is_sandbox,
            'user-agent' => 'WordPress POS Billing Plugin v2.0'
        ));
        
        // Verificar errores de WordPress
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            if (WP_DEBUG) {
                error_log('POS Billing - Error de conexión: ' . $error_message);
            }
            return array(
                'success' => false,
                'message' => 'Error de conexión con la API: ' . $error_message,
                'data' => null
            );
        }
        
        // Obtener código de respuesta
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        
        // Log de respuesta
        if (WP_DEBUG) {
            error_log('POS Billing - Código respuesta: ' . $response_code);
            error_log('POS Billing - Respuesta: ' . $response_body);
        }
        
        // Verificar código de estado HTTP
        if ($response_code !== 200) {
            return array(
                'success' => false,
                'message' => "Error HTTP {$response_code} de la API",
                'data' => array('response_code' => $response_code, 'raw_response' => $response_body)
            );
        }
        
        // Decodificar respuesta
        $api_response = json_decode($response_body, true);
        
        if (!$api_response || json_last_error() !== JSON_ERROR_NONE) {
            return array(
                'success' => false,
                'message' => 'Respuesta inválida de la API: ' . json_last_error_msg(),
                'data' => array('raw_response' => $response_body)
            );
        }
        
        // Procesar respuesta según el formato de Factura.com
        if (isset($api_response['response']) && $api_response['response'] === 'success') {
            // CFDI creado exitosamente
            $cfdi_result = $this->process_successful_cfdi($api_response, $cfdi_data);
            return array(
                'success' => true,
                'message' => 'CFDI creado exitosamente',
                'data' => $cfdi_result
            );
        } else {
            // Error en la creación
            $error_message = 'Error desconocido';
            $error_data = array();
            
            if (isset($api_response['message'])) {
                if (is_array($api_response['message'])) {
                    $error_message = $api_response['message']['message'] ?? 'Error en la API';
                    $error_data['detail'] = $api_response['message']['messageDetail'] ?? '';
                    $error_data['status'] = $api_response['message']['status'] ?? '';
                } else {
                    $error_message = $api_response['message'];
                }
            }
            
            // Si hay borrador creado por error
            if (isset($api_response['draft'])) {
                $error_data['draft'] = $api_response['draft'];
                $error_message .= ' (Se creó un borrador para corrección)';
            }
            
            // Incluir XML de error si está disponible
            if (isset($api_response['xmlerror'])) {
                $error_data['xml_error'] = $api_response['xmlerror'];
            }
            
            return array(
                'success' => false,
                'message' => $error_message,
                'data' => $error_data
            );
        }
    }
    
    /**
     * Formatear datos del CFDI según el formato esperado por Factura.com
     */
    private function format_cfdi_data($data) {
        $formatted = array(
            'Receptor' => $data['Receptor'],
            'TipoDocumento' => $data['TipoDocumento'],
            'Conceptos' => $data['Conceptos'],
            'UsoCFDI' => $data['UsoCFDI'],
            'Serie' => intval($data['Serie']),
            'FormaPago' => $data['FormaPago'],
            'MetodoPago' => $data['MetodoPago'],
            'Moneda' => $data['Moneda'],
            'EnviarCorreo' => $data['EnviarCorreo'] ?? true
        );
        
        // Campos opcionales
        if (!empty($data['TipoCambio'])) {
            $formatted['TipoCambio'] = $data['TipoCambio'];
        }
        
        if (!empty($data['NumOrder'])) {
            $formatted['NumOrder'] = $data['NumOrder'];
        }
        
        if (!empty($data['LugarExpedicion'])) {
            $formatted['LugarExpedicion'] = $data['LugarExpedicion'];
        }
        
        if (!empty($data['CondicionesDePago'])) {
            $formatted['CondicionesDePago'] = $data['CondicionesDePago'];
        }
        
        if (!empty($data['Comentarios'])) {
            $formatted['Comentarios'] = $data['Comentarios'];
        }
        
        if (!empty($data['BorradorSiFalla'])) {
            $formatted['BorradorSiFalla'] = $data['BorradorSiFalla'];
        }
        
        if (!empty($data['Draft'])) {
            $formatted['Draft'] = $data['Draft'];
        }
        
        // Asegurar que los conceptos tengan el campo Importe calculado
        foreach ($formatted['Conceptos'] as &$concepto) {
            if (!isset($concepto['Importe'])) {
                $cantidad = floatval($concepto['Cantidad']);
                $valorUnitario = floatval($concepto['ValorUnitario']);
                $concepto['Importe'] = number_format($cantidad * $valorUnitario, 6, '.', '');
            }
        }
        
        return $formatted;
    }
    
    /**
     * Procesar CFDI exitoso y guardar en base de datos - MEJORADO
     */
    private function process_successful_cfdi($api_response, $original_data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        // Calcular totales
        $totals = $this->calculate_totals($original_data['Conceptos']);
        
        // Preparar datos para guardar
        $invoice_data = array(
            'invoice_number' => $api_response['INV']['Serie'] . '-' . $api_response['INV']['Folio'],
            'uuid' => $api_response['UUID'],
            'customer_name' => 'Cliente', // Mejorar obteniendo datos del receptor
            'customer_email' => '',
            'customer_rfc' => '',
            'subtotal' => $totals['subtotal'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
            'items' => json_encode($original_data['Conceptos']),
            'status' => 'completed',
            'api_response' => json_encode($api_response),
            'created_at' => current_time('mysql')
        );
        
        // Insertar en base de datos
        $inserted = $wpdb->insert($table_name, $invoice_data);
        
        if ($inserted === false) {
            // Log error pero no fallar la operación
            if (WP_DEBUG) {
                error_log('POS Billing - Error guardando en BD: ' . $wpdb->last_error);
            }
        }
        
        return array(
            'uuid' => $api_response['UUID'],
            'folio' => $api_response['INV']['Serie'] . '-' . $api_response['INV']['Folio'],
            'fecha_timbrado' => $api_response['SAT']['FechaTimbrado'],
            'total' => $totals['total'],
            'invoice_id' => $wpdb->insert_id,
            'sat_data' => $api_response['SAT'],
            'invoice_data' => $api_response['INV'],
            'totals' => $totals
        );
    }
    
    /**
     * Calcular totales de conceptos - MEJORADO
     */
    private function calculate_totals($conceptos) {
        $subtotal = 0;
        $tax = 0;
        $descuentos = 0;
        
        foreach ($conceptos as $concepto) {
            $cantidad = floatval($concepto['Cantidad']);
            $valorUnitario = floatval($concepto['ValorUnitario']);
            $descuento = floatval($concepto['Descuento'] ?? 0);
            
            $importe = $cantidad * $valorUnitario;
            $subtotal += $importe;
            $descuentos += $descuento;
            
            // Calcular impuestos si existen
            if (isset($concepto['Impuestos']['Traslados'])) {
                foreach ($concepto['Impuestos']['Traslados'] as $traslado) {
                    $tax += floatval($traslado['Importe']);
                }
            }
        }
        
        $subtotal_neto = $subtotal - $descuentos;
        
        return array(
            'subtotal' => round($subtotal, 2),
            'descuentos' => round($descuentos, 2),
            'subtotal_neto' => round($subtotal_neto, 2),
            'tax' => round($tax, 2),
            'total' => round($subtotal_neto + $tax, 2)
        );
    }
    
    /**
     * Obtener configuración actual
     */
    public function get_settings() {
        return array(
            'is_sandbox' => $this->is_sandbox,
            'api_configured' => !empty($this->api_key) && !empty($this->secret_key),
            'api_url' => $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production,
            'api_key_configured' => !empty($this->api_key),
            'secret_key_configured' => !empty($this->secret_key)
        );
    }
    
    /**
     * Método para probar la conexión con la API
     */
    public function test_connection() {
        if (empty($this->api_key) || empty($this->secret_key)) {
            return array(
                'success' => false,
                'message' => 'API Key o Secret Key no configurados'
            );
        }
        
        // Aquí podrías hacer una petición de prueba a un endpoint de la API
        // Por ahora solo validamos que las credenciales estén configuradas
        return array(
            'success' => true,
            'message' => 'Credenciales configuradas correctamente',
            'mode' => $this->is_sandbox ? 'Sandbox' : 'Producción'
        );
    }
}

// Inicializar la clase
new POS_Billing_API_Handler();