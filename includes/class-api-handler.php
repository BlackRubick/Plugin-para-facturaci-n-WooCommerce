<?php
/**
 * Clase para manejar la integración con la API de Factura.com
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
        // Por ahora usaremos configuraciones por defecto
        // En el futuro estas se pueden configurar desde el admin
        $this->is_sandbox = true; // Cambiar a false para producción
        
        // IMPORTANTE: Estas claves deben configurarse en el wp-config.php o en opciones de WordPress
        $this->api_key = get_option('pos_billing_api_key', '');
        $this->secret_key = get_option('pos_billing_secret_key', '');
        
        // Si no están configuradas, usar variables de entorno o constantes
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
     * Handler AJAX para crear CFDI
     */
    public function create_cfdi_ajax() {
        // Verificar nonce
        if (!wp_verify_nonce($_POST['nonce'], 'pos_billing_nonce')) {
            wp_die('Error de seguridad');
        }
        
        // Verificar capacidades
        if (!current_user_can('edit_posts')) {
            wp_die('Sin permisos suficientes');
        }
        
        $cfdi_data = json_decode(stripslashes($_POST['cfdi_data']), true);
        
        if (!$cfdi_data) {
            wp_send_json_error('Datos del CFDI inválidos');
            return;
        }
        
        $result = $this->create_cfdi($cfdi_data);
        
        if ($result['success']) {
            wp_send_json_success($result['data']);
        } else {
            wp_send_json_error($result['message'], $result['data']);
        }
    }
    
    /**
     * Handler REST API para crear CFDI
     */
    public function create_cfdi_rest($request) {
        $cfdi_data = $request->get_param('cfdi_data');
        
        $result = $this->create_cfdi($cfdi_data);
        
        if ($result['success']) {
            return new WP_REST_Response($result['data'], 200);
        } else {
            return new WP_Error('cfdi_creation_failed', $result['message'], array('status' => 400, 'data' => $result['data']));
        }
    }
    
    /**
     * Crear CFDI usando la API de Factura.com
     */
    public function create_cfdi($cfdi_data) {
        // Validar configuración
        if (empty($this->api_key) || empty($this->secret_key)) {
            return array(
                'success' => false,
                'message' => 'API Key o Secret Key no configurados. Por favor configúrelos en el panel de administración.',
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
        
        // Preparar datos
        $body = json_encode($cfdi_data);
        
        // Log para debug (solo en desarrollo)
        if (WP_DEBUG) {
            error_log('POS Billing - Enviando CFDI a: ' . $url);
            error_log('POS Billing - Datos: ' . $body);
        }
        
        // Realizar petición
        $response = wp_remote_post($url, array(
            'headers' => $headers,
            'body' => $body,
            'timeout' => 30,
            'sslverify' => !$this->is_sandbox // En sandbox puede haber problemas de SSL
        ));
        
        // Verificar errores de WordPress
        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => 'Error de conexión: ' . $response->get_error_message(),
                'data' => null
            );
        }
        
        // Obtener código de respuesta
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        
        // Log de respuesta (solo en desarrollo)
        if (WP_DEBUG) {
            error_log('POS Billing - Código respuesta: ' . $response_code);
            error_log('POS Billing - Respuesta: ' . $response_body);
        }
        
        // Decodificar respuesta
        $api_response = json_decode($response_body, true);
        
        if (!$api_response) {
            return array(
                'success' => false,
                'message' => 'Respuesta inválida de la API',
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
                } else {
                    $error_message = $api_response['message'];
                }
            }
            
            // Si hay borrador creado por error
            if (isset($api_response['draft'])) {
                $error_data['draft'] = $api_response['draft'];
                $error_message .= ' (Se creó un borrador para corrección)';
            }
            
            return array(
                'success' => false,
                'message' => $error_message,
                'data' => $error_data
            );
        }
    }
    
    /**
     * Procesar CFDI exitoso y guardar en base de datos
     */
    private function process_successful_cfdi($api_response, $original_data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        // Preparar datos para guardar
        $invoice_data = array(
            'invoice_number' => $api_response['INV']['Serie'] . '-' . $api_response['INV']['Folio'],
            'uuid' => $api_response['UUID'],
            'customer_name' => 'Cliente', // Se puede mejorar obteniendo datos del receptor
            'customer_email' => '',
            'customer_rfc' => '',
            'subtotal' => 0, // Calcular del original_data
            'tax' => 0,
            'total' => 0,
            'items' => json_encode($original_data['Conceptos']),
            'status' => 'completed',
            'api_response' => json_encode($api_response),
            'created_at' => current_time('mysql')
        );
        
        // Calcular totales
        $totals = $this->calculate_totals($original_data['Conceptos']);
        $invoice_data['subtotal'] = $totals['subtotal'];
        $invoice_data['tax'] = $totals['tax'];
        $invoice_data['total'] = $totals['total'];
        
        // Insertar en base de datos
        $wpdb->insert($table_name, $invoice_data);
        
        return array(
            'uuid' => $api_response['UUID'],
            'folio' => $api_response['INV']['Serie'] . '-' . $api_response['INV']['Folio'],
            'fecha_timbrado' => $api_response['SAT']['FechaTimbrado'],
            'total' => $totals['total'],
            'invoice_id' => $wpdb->insert_id,
            'sat_data' => $api_response['SAT'],
            'invoice_data' => $api_response['INV']
        );
    }
    
    /**
     * Calcular totales de conceptos
     */
    private function calculate_totals($conceptos) {
        $subtotal = 0;
        $tax = 0;
        
        foreach ($conceptos as $concepto) {
            $importe = floatval($concepto['Importe']);
            $descuento = floatval($concepto['Descuento'] ?? 0);
            
            $subtotal += $importe;
            
            // Calcular impuestos
            if (isset($concepto['Impuestos']['Traslados'])) {
                foreach ($concepto['Impuestos']['Traslados'] as $traslado) {
                    $tax += floatval($traslado['Importe']);
                }
            }
        }
        
        $subtotal -= array_sum(array_column($conceptos, 'Descuento'));
        
        return array(
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $subtotal + $tax
        );
    }
    
    /**
     * Obtener configuración actual
     */
    public function get_settings() {
        return array(
            'is_sandbox' => $this->is_sandbox,
            'api_configured' => !empty($this->api_key) && !empty($this->secret_key),
            'api_url' => $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production
        );
    }
}

// Inicializar la clase
new POS_Billing_API_Handler();