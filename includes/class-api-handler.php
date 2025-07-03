<?php

/**
 * Clase para manejar la integración con la API de Factura.com - PERMISOS CORREGIDOS
 */

if (!defined('ABSPATH')) {
    exit;
}

class POS_Billing_API_Handler
{

    private $api_url_sandbox = 'https://sandbox.factura.com/api';
    private $api_url_production = 'https://api.factura.com';
    private $api_key;
    private $secret_key;
    private $is_sandbox;

    public function __construct()
    {
        add_action('wp_ajax_pos_billing_create_cfdi', array($this, 'create_cfdi_ajax'));
        add_action('wp_ajax_nopriv_pos_billing_create_cfdi', array($this, 'create_cfdi_ajax'));
        add_action('wp_ajax_pos_billing_get_nonce', array($this, 'get_nonce_ajax'));
        add_action('wp_ajax_nopriv_pos_billing_get_nonce', array($this, 'get_nonce_ajax'));
        add_action('wp_ajax_pos_billing_get_account_info', array($this, 'get_account_info_ajax'));
        add_action('wp_ajax_pos_billing_search_products', array($this, 'search_products_ajax'));
        add_action('wp_ajax_pos_billing_get_product_data', array($this, 'get_product_data_ajax'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Cargar configuraciones
        $this->load_settings();
    }

    /**
     * Buscar productos de WooCommerce vía AJAX
     */
    public function search_products_ajax()
    {
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Sin permisos');
            return;
        }

        if (!check_ajax_referer('pos_billing_nonce', 'nonce', false)) {
            wp_send_json_error('Error de seguridad');
            return;
        }

        // Verificar que WooCommerce esté activo
        if (!class_exists('WooCommerce')) {
            wp_send_json_error('WooCommerce no está activo');
            return;
        }

        $search_term = sanitize_text_field($_POST['search'] ?? '');
        if (empty($search_term)) {
            wp_send_json_error('Término de búsqueda requerido');
            return;
        }

        $products = wc_get_products(array(
            'status' => 'publish',
            'limit' => 10,
            'search' => $search_term,
            'meta_query' => array(),
            'orderby' => 'relevance'
        ));

        $results = array();
        foreach ($products as $product) {
            $results[] = array(
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'sku' => $product->get_sku(),
                'price' => $product->get_price(),
                'description' => wp_trim_words($product->get_short_description(), 10)
            );
        }

        wp_send_json_success($results);
    }

    /**
     * Obtener datos completos de un producto específico con atributos de facturación
     */
    public function get_product_data_ajax()
    {
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Sin permisos');
            return;
        }

        if (!check_ajax_referer('pos_billing_nonce', 'nonce', false)) {
            wp_send_json_error('Error de seguridad');
            return;
        }

        if (!class_exists('WooCommerce')) {
            wp_send_json_error('WooCommerce no está activo');
            return;
        }

        $product_id = intval($_POST['product_id'] ?? 0);
        if (!$product_id) {
            wp_send_json_error('ID de producto requerido');
            return;
        }

        $product = wc_get_product($product_id);
        if (!$product) {
            wp_send_json_error('Producto no encontrado');
            return;
        }

        // Obtener atributos de facturación
        $product_data = array(
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'sku' => $product->get_sku(),
            'price' => floatval($product->get_price()),
            'description' => $product->get_short_description() ?: $product->get_name(),
            'stock_quantity' => $product->get_stock_quantity(),
            'manage_stock' => $product->get_manage_stock(),
            'in_stock' => $product->is_in_stock()
        );

        // OBTENER ATRIBUTOS ESPECÍFICOS PARA FACTURACIÓN
        // Según el ejemplo que te dieron, necesitas estos atributos:

        // F_Unidad (Unidad de medida)
        $F_Unidad = $product->get_attribute('F_Unidad');
        $product_data['F_Unidad'] = !empty($F_Unidad) ? $F_Unidad : '';

        // F_ClaveUnidad (Clave de unidad SAT)
        $F_ClaveUnidad = $product->get_attribute('F_ClaveUnidad');
        $product_data['F_ClaveUnidad'] = !empty($F_ClaveUnidad) ? $F_ClaveUnidad : 'H87'; // Default: Pieza

        // F_ClaveProdServ (Clave de producto/servicio SAT)
        $F_ClaveProdServ = $product->get_attribute('F_ClaveProdServ');
        $product_data['F_ClaveProdServ'] = !empty($F_ClaveProdServ) ? $F_ClaveProdServ : '';

        // F_ObjetoImp (Objeto de impuesto)
        $F_ObjetoImp = $product->get_attribute('F_ObjetoImp');
        $product_data['F_ObjetoImp'] = !empty($F_ObjetoImp) ? $F_ObjetoImp : '02'; // Default: Sí objeto de impuesto

        // F_NoIdentificacion (Número de identificación/SKU)
        $F_NoIdentificacion = $product->get_attribute('F_NoIdentificacion');
        $product_data['F_NoIdentificacion'] = !empty($F_NoIdentificacion) ? $F_NoIdentificacion : $product->get_sku();

        // Otros atributos comunes para facturación
        $F_Descuento = $product->get_attribute('F_Descuento');
        $product_data['F_Descuento'] = !empty($F_Descuento) ? floatval($F_Descuento) : 0;

        // Verificar si tiene todos los datos requeridos para facturación
        $required_fields = array('F_ClaveProdServ', 'F_Unidad', 'F_ClaveUnidad');
        $missing_fields = array();

        foreach ($required_fields as $field) {
            if (empty($product_data[$field])) {
                $missing_fields[] = $field;
            }
        }

        $product_data['facturacion_ready'] = empty($missing_fields);
        $product_data['missing_fields'] = $missing_fields;

        if (!empty($missing_fields)) {
            $product_data['warning'] = 'Este producto no tiene todos los atributos de facturación configurados: ' . implode(', ', $missing_fields);
        }

        wp_send_json_success($product_data);
    }

    /**
     * Obtener información detallada de la cuenta (series, receptores, etc.)
     */
    public function get_account_info_ajax()
    {
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Sin permisos');
            return;
        }

        if (!check_ajax_referer('pos_billing_test', 'nonce', false)) {
            wp_send_json_error('Error de seguridad');
            return;
        }

        $account_info = $this->get_detailed_account_info();

        if ($account_info['success']) {
            wp_send_json_success($account_info['data']);
        } else {
            wp_send_json_error($account_info['message']);
        }
    }

    /**
     * Obtener información detallada de series y receptores
     */
    private function get_detailed_account_info()
    {
        if (empty($this->api_key) || empty($this->secret_key)) {
            return array(
                'success' => false,
                'message' => 'Credenciales no configuradas'
            );
        }

        $base_url = $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production;
        $headers = array(
            'Content-Type' => 'application/json',
            'F-PLUGIN' => '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
            'F-Api-Key' => $this->api_key,
            'F-Secret-Key' => $this->secret_key
        );

        $info = array(
            'series' => array(),
            'receptors' => array(),
            'account' => array()
        );

        // Obtener series
        $series_response = wp_remote_get($base_url . '/v4/cfdi40/series', array(
            'headers' => $headers,
            'timeout' => 30
        ));

        if (!is_wp_error($series_response) && wp_remote_retrieve_response_code($series_response) === 200) {
            $series_data = json_decode(wp_remote_retrieve_body($series_response), true);
            if (isset($series_data['Data']) && is_array($series_data['Data'])) {
                $info['series'] = $series_data['Data'];
            }
        }

        // Obtener algunos receptores (primeros 10)
        $receptors_response = wp_remote_get($base_url . '/v4/cfdi40/clients?limit=10', array(
            'headers' => $headers,
            'timeout' => 30
        ));

        if (!is_wp_error($receptors_response) && wp_remote_retrieve_response_code($receptors_response) === 200) {
            $receptors_data = json_decode(wp_remote_retrieve_body($receptors_response), true);
            if (isset($receptors_data['Data']) && is_array($receptors_data['Data'])) {
                $info['receptors'] = $receptors_data['Data'];
            }
        }

        return array(
            'success' => true,
            'data' => $info
        );
    }

    private function load_settings()
    {
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
    public function register_rest_routes()
    {
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
     * Verificar permisos - CORREGIDO para ser más flexible
     */
    public function check_permissions($request)
    {
        // Verificar nonce
        $nonce = $request->get_header('X-WP-Nonce');
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return false;
        }

        // Verificar capacidades del usuario - más flexible
        return current_user_can('edit_posts') || current_user_can('manage_options');
    }

    /**
     * Generar nonce para el popup - NUEVO MÉTODO
     */
    public function get_nonce_ajax()
    {
        // Verificar que el usuario esté logueado
        if (!is_user_logged_in()) {
            wp_send_json_error('Usuario no logueado');
            return;
        }

        // Verificar permisos básicos
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Sin permisos suficientes');
            return;
        }

        // Generar nuevo nonce
        $nonce = wp_create_nonce('pos_billing_nonce');

        wp_send_json_success(array(
            'nonce' => $nonce,
            'user' => wp_get_current_user()->display_name,
            'timestamp' => current_time('timestamp')
        ));
    }

    /**
     * Handler AJAX para crear CFDI - PERMISOS CORREGIDOS Y MÁS FLEXIBLE CON NONCE
     */
    public function create_cfdi_ajax()
    {
        // Log para debug
        if (WP_DEBUG) {
            error_log('POS Billing - Iniciando creación de CFDI via AJAX');
            error_log('POS Billing - Usuario actual: ' . (is_user_logged_in() ? wp_get_current_user()->display_name : 'No logueado'));
            error_log('POS Billing - POST data: ' . print_r($_POST, true));
        }

        // Verificar que el usuario esté logueado
        if (!is_user_logged_in()) {
            if (WP_DEBUG) {
                error_log('POS Billing - Usuario no logueado');
            }
            wp_send_json_error('Debes estar logueado para usar esta función');
            return;
        }

        // Verificar nonce solo si está presente
        if (isset($_POST['nonce'])) {
            if (!wp_verify_nonce($_POST['nonce'], 'pos_billing_nonce')) {
                if (WP_DEBUG) {
                    error_log('POS Billing - Error de nonce: ' . $_POST['nonce']);
                }
                wp_send_json_error('Error de seguridad - Nonce inválido');
                return;
            }
        } else {
            if (WP_DEBUG) {
                error_log('POS Billing - Advertencia: No se recibió nonce, continuando sin verificación');
            }
        }

        // Verificar capacidades - más flexible
        if (!current_user_can('edit_posts') && !current_user_can('manage_options')) {
            if (WP_DEBUG) {
                error_log('POS Billing - Usuario sin permisos. Roles: ' . implode(', ', wp_get_current_user()->roles));
            }
            wp_send_json_error('Sin permisos suficientes. Necesitas al menos permisos de editor.');
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
            // Agregar información del usuario que creó la factura
            $result['data']['created_by'] = wp_get_current_user()->display_name;
            wp_send_json_success($result['data']);
        } else {
            wp_send_json_error($result['message'], $result['data']);
        }
    }

    /**
     * Validar datos del CFDI antes de enviar
     */
    private function validate_cfdi_data($data)
    {
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
    public function create_cfdi_rest($request)
    {
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
     * Crear CFDI usando la API de Factura.com - MEJORADO CON DEBUG ESPECÍFICO
     */
    public function create_cfdi($cfdi_data)
    {
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
        $body = json_encode($formatted_data, JSON_NUMERIC_CHECK);

        // Log específico para debug del error "No puedes facturar 2"
        if (WP_DEBUG) {
            error_log('=== POS BILLING DEBUG ESPECÍFICO ===');
            error_log('URL: ' . $url);
            error_log('Headers: ' . print_r($headers, true));
            error_log('Datos enviados: ' . $body);
            error_log('Is Sandbox: ' . ($this->is_sandbox ? 'SÍ' : 'NO'));
            error_log('API Key (primeros 10 chars): ' . substr($this->api_key, 0, 10) . '...');
            error_log('Serie enviada: ' . $formatted_data['Serie']);
            error_log('UID Receptor: ' . $formatted_data['Receptor']['UID']);
            error_log('Conceptos count: ' . count($formatted_data['Conceptos']));
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

        // Log detallado de la respuesta
        if (WP_DEBUG) {
            error_log('=== RESPUESTA DE FACTURA.COM ===');
            error_log('Código HTTP: ' . $response_code);
            error_log('Respuesta completa: ' . $response_body);
            error_log('Headers de respuesta: ' . print_r(wp_remote_retrieve_headers($response), true));
        }

        // Verificar código de estado HTTP
        if ($response_code !== 200) {
            return array(
                'success' => false,
                'message' => "Error HTTP {$response_code} de la API de Factura.com",
                'data' => array(
                    'response_code' => $response_code,
                    'raw_response' => $response_body,
                    'debug_info' => array(
                        'url' => $url,
                        'sandbox_mode' => $this->is_sandbox,
                        'api_key_prefix' => substr($this->api_key, 0, 10) . '...',
                        'serie_used' => $formatted_data['Serie'],
                        'receptor_uid' => $formatted_data['Receptor']['UID']
                    )
                )
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

        // Log de la respuesta parseada
        if (WP_DEBUG) {
            error_log('=== RESPUESTA PARSEADA ===');
            error_log(print_r($api_response, true));
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
            // Error en la creación - ANÁLISIS ESPECÍFICO DEL ERROR
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

            // ANÁLISIS ESPECÍFICO PARA "No puedes facturar 2"
            if (strpos($error_message, 'No puedes facturar') !== false) {
                $error_data['specific_analysis'] = array(
                    'error_type' => 'facturacion_blocked',
                    'likely_causes' => array(
                        'Certificados SAT no válidos o vencidos',
                        'Serie de facturación no configurada correctamente',
                        'Cuenta no activada completamente',
                        'Problemas con el RFC configurado',
                        'Límites de la cuenta alcanzados'
                    ),
                    'recommended_actions' => array(
                        '1. Verifica en Factura.com que tus certificados SAT estén válidos',
                        '2. Confirma que la serie ID=' . $formatted_data['Serie'] . ' exista y esté activa',
                        '3. Verifica que tu RFC esté correctamente configurado',
                        '4. Contacta al soporte de Factura.com con esta información específica'
                    ),
                    'sent_data' => array(
                        'serie' => $formatted_data['Serie'],
                        'receptor_uid' => $formatted_data['Receptor']['UID'],
                        'tipo_documento' => $formatted_data['TipoDocumento'],
                        'uso_cfdi' => $formatted_data['UsoCFDI'],
                        'forma_pago' => $formatted_data['FormaPago'],
                        'metodo_pago' => $formatted_data['MetodoPago']
                    )
                );
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

            // Incluir respuesta completa para debug
            $error_data['full_response'] = $api_response;

            return array(
                'success' => false,
                'message' => $error_message,
                'data' => $error_data
            );
        }
    }

    /**
     * Formatear datos del CFDI según el formato esperado por Factura.com - COMPLETAMENTE CORREGIDO
     */
    private function format_cfdi_data($data)
    {
        $formatted = array(
            'Receptor' => $data['Receptor'],
            'TipoDocumento' => $data['TipoDocumento'],
            'Conceptos' => $data['Conceptos'],
            'UsoCFDI' => $data['UsoCFDI'],
            'Serie' => 5483035, // ← Tu ID real de la serie
            'FormaPago' => $data['FormaPago'],
            'MetodoPago' => $data['MetodoPago'],
            'Moneda' => $data['Moneda'],
            'EnviarCorreo' => $data['EnviarCorreo'] ?? true
        );

        // Campos opcionales
        if (!empty($data['TipoCambio'])) {
            $formatted['TipoCambio'] = $data['TipoCambio'];
        }

        // NUEVO: Usar número de pedido como NumOrder si está disponible
        if (!empty($data['NumeroPedido'])) {
            $formatted['NumOrder'] = $data['NumeroPedido'];
        } elseif (!empty($data['NumOrder'])) {
            $formatted['NumOrder'] = $data['NumOrder'];
        }

        if (!empty($data['LugarExpedicion'])) {
            $formatted['LugarExpedicion'] = $data['LugarExpedicion'];
        }

        if (!empty($data['CondicionesDePago'])) {
            $formatted['CondicionesDePago'] = $data['CondicionesDePago'];
        }

        // NUEVO: Agregar referencia adicional a los comentarios
        $comentarios = '';
        if (!empty($data['ReferenciaAdicional'])) {
            $comentarios .= 'Ref: ' . $data['ReferenciaAdicional'];
        }
        if (!empty($data['Comentarios'])) {
            if (!empty($comentarios)) $comentarios .= ' | ';
            $comentarios .= $data['Comentarios'];
        }
        if (!empty($comentarios)) {
            $formatted['Comentarios'] = $comentarios;
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

        // ✅ FORZAR TIPOS CORRECTOS Y FORMATOS SAT
        
        // Forzar Serie como entero
        $formatted['Serie'] = (int)$formatted['Serie'];
        
        // Forzar boolean para EnviarCorreo
        if (isset($formatted['EnviarCorreo'])) {
            $formatted['EnviarCorreo'] = $formatted['EnviarCorreo'] === true || 
                                         $formatted['EnviarCorreo'] === 'true' || 
                                         $formatted['EnviarCorreo'] === '1' || 
                                         $formatted['EnviarCorreo'] === 1;
        }
        
        // Formatear FormaPago con padding correcto
        $formatted['FormaPago'] = str_pad(strval($formatted['FormaPago']), 2, '0', STR_PAD_LEFT);
        
        // Forzar números y formatear claves SAT en conceptos
        foreach ($formatted['Conceptos'] as &$concepto) {
            // Convertir números
            $concepto['Cantidad'] = (float)$concepto['Cantidad'];
            $concepto['ValorUnitario'] = (float)$concepto['ValorUnitario'];
            $concepto['Importe'] = (float)$concepto['Importe'];
            $concepto['Descuento'] = (float)($concepto['Descuento'] ?? 0);
            
            // Formatear claves SAT correctamente
            $concepto['ClaveProdServ'] = str_pad(strval($concepto['ClaveProdServ']), 8, '0', STR_PAD_LEFT);
            $concepto['ObjetoImp'] = str_pad(strval($concepto['ObjetoImp']), 2, '0', STR_PAD_LEFT);
            
            // Procesar impuestos
            if (isset($concepto['Impuestos']['Traslados'])) {
                foreach ($concepto['Impuestos']['Traslados'] as &$traslado) {
                    $traslado['Base'] = (float)$traslado['Base'];
                    $traslado['TasaOCuota'] = (float)$traslado['TasaOCuota'];
                    $traslado['Importe'] = (float)$traslado['Importe'];
                    // Formatear código de impuesto
                    $traslado['Impuesto'] = str_pad(strval($traslado['Impuesto']), 3, '0', STR_PAD_LEFT);
                }
            }
        }
        
        // Debug para ver qué se va a enviar
        if (WP_DEBUG) {
            error_log('=== DATOS FINALES PARA FACTURA.COM ===');
            error_log('Serie tipo: ' . gettype($formatted['Serie']) . ' valor: ' . $formatted['Serie']);
            error_log('FormaPago: ' . $formatted['FormaPago']);
            error_log('EnviarCorreo tipo: ' . gettype($formatted['EnviarCorreo']) . ' valor: ' . ($formatted['EnviarCorreo'] ? 'true' : 'false'));
            error_log('Primer concepto ClaveProdServ: ' . $formatted['Conceptos'][0]['ClaveProdServ']);
            error_log('Primer concepto ObjetoImp: ' . $formatted['Conceptos'][0]['ObjetoImp']);
            if (isset($formatted['Conceptos'][0]['Impuestos']['Traslados'][0])) {
                error_log('Primer traslado Impuesto: ' . $formatted['Conceptos'][0]['Impuestos']['Traslados'][0]['Impuesto']);
            }
        }

        return $formatted;
    }

    /**
     * Procesar CFDI exitoso y guardar en base de datos - MEJORADO
     */
    private function process_successful_cfdi($api_response, $original_data)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'pos_billing_invoices';

        // Calcular totales
        $totals = $this->calculate_totals($original_data['Conceptos']);

        // Obtener información del cliente si está disponible
        $customer_name = 'Cliente';
        $customer_email = '';
        $customer_rfc = '';

        if (isset($original_data['Receptor']['UID'])) {
            $customer_name = 'Cliente (UID: ' . $original_data['Receptor']['UID'] . ')';
        }

        // Preparar datos para guardar
        $invoice_data = array(
            'invoice_number' => $api_response['INV']['Serie'] . '-' . $api_response['INV']['Folio'],
            'uuid' => $api_response['UUID'],
            'customer_name' => $customer_name,
            'customer_email' => $customer_email,
            'customer_rfc' => $customer_rfc,
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
            'totals' => $totals,
            'user_info' => array(
                'user_id' => get_current_user_id(),
                'user_name' => wp_get_current_user()->display_name,
                'user_roles' => wp_get_current_user()->roles
            )
        );
    }

    /**
     * Calcular totales de conceptos - MEJORADO
     */
    private function calculate_totals($conceptos)
    {
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
    public function get_settings()
    {
        return array(
            'is_sandbox' => $this->is_sandbox,
            'api_configured' => !empty($this->api_key) && !empty($this->secret_key),
            'api_url' => $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production,
            'api_key_configured' => !empty($this->api_key),
            'secret_key_configured' => !empty($this->secret_key),
            'user_permissions' => array(
                'can_edit_posts' => current_user_can('edit_posts'),
                'can_manage_options' => current_user_can('manage_options'),
                'current_user' => is_user_logged_in() ? wp_get_current_user()->display_name : 'No logueado'
            )
        );
    }

    /**
     * Método para probar la conexión con la API - MEJORADO CON DIAGNÓSTICO
     */
    public function test_connection()
    {
        if (empty($this->api_key) || empty($this->secret_key)) {
            return array(
                'success' => false,
                'message' => 'API Key o Secret Key no configurados'
            );
        }

        // Verificar permisos del usuario actual
        if (!current_user_can('edit_posts')) {
            return array(
                'success' => false,
                'message' => 'Sin permisos suficientes para probar la conexión'
            );
        }

        // Realizar prueba real de la API
        $base_url = $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production;
        $test_url = $base_url . '/v4/cfdi40/account';

        $headers = array(
            'Content-Type' => 'application/json',
            'F-PLUGIN' => '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
            'F-Api-Key' => $this->api_key,
            'F-Secret-Key' => $this->secret_key
        );

        if (WP_DEBUG) {
            error_log('POS Billing - Probando conexión con: ' . $test_url);
        }

        $response = wp_remote_get($test_url, array(
            'headers' => $headers,
            'timeout' => 30,
            'sslverify' => !$this->is_sandbox
        ));

        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => 'Error de conexión: ' . $response->get_error_message(),
                'details' => array(
                    'error_type' => 'connection_error',
                    'wp_error' => $response->get_error_message()
                )
            );
        }

        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);

        if (WP_DEBUG) {
            error_log('POS Billing - Respuesta de prueba: ' . $response_code . ' - ' . $response_body);
        }

        if ($response_code !== 200) {
            return array(
                'success' => false,
                'message' => "Error HTTP {$response_code} - Credenciales inválidas o cuenta con problemas",
                'details' => array(
                    'http_code' => $response_code,
                    'response' => $response_body
                )
            );
        }

        $api_data = json_decode($response_body, true);

        if (!$api_data || json_last_error() !== JSON_ERROR_NONE) {
            return array(
                'success' => false,
                'message' => 'Respuesta inválida de la API',
                'details' => array(
                    'json_error' => json_last_error_msg(),
                    'raw_response' => substr($response_body, 0, 500)
                )
            );
        }

        // Analizar respuesta de la cuenta
        $account_status = $this->analyze_account_status($api_data);

        return array(
            'success' => true,
            'message' => 'Conexión exitosa con la API de Factura.com',
            'mode' => $this->is_sandbox ? 'Sandbox' : 'Producción',
            'user_info' => array(
                'name' => wp_get_current_user()->display_name,
                'roles' => wp_get_current_user()->roles,
                'can_create_invoices' => current_user_can('edit_posts')
            ),
            'account_info' => $account_status
        );
    }

    /**
     * Analizar estado de la cuenta de Factura.com
     */
    private function analyze_account_status($api_data)
    {
        $status = array(
            'configured' => false,
            'certificates_valid' => false,
            'series_available' => false,
            'issues' => array(),
            'recommendations' => array(),
            'raw_data' => $api_data
        );

        // Verificar estructura de respuesta
        if (isset($api_data['response']) && $api_data['response'] === 'success') {
            $status['configured'] = true;

            // Verificar datos de la cuenta
            if (isset($api_data['Data'])) {
                $data = $api_data['Data'];

                // Verificar certificados
                if (isset($data['certificates']) || isset($data['Certificates'])) {
                    $status['certificates_valid'] = true;
                } else {
                    $status['issues'][] = 'No se encontraron certificados SAT';
                    $status['recommendations'][] = 'Sube tus certificados .cer y .key en el panel de Factura.com';
                }

                // Verificar series
                if (isset($data['series']) || isset($data['Series'])) {
                    $status['series_available'] = true;
                } else {
                    $status['issues'][] = 'No se encontraron series de facturación';
                    $status['recommendations'][] = 'Crea al menos una serie de facturación en tu panel';
                }

                // Verificar RFC
                if (isset($data['rfc']) || isset($data['RFC'])) {
                    $status['rfc'] = $data['rfc'] ?? $data['RFC'];
                } else {
                    $status['issues'][] = 'RFC no configurado correctamente';
                }

                // Verificar razón social
                if (isset($data['razon_social']) || isset($data['RazonSocial'])) {
                    $status['company_name'] = $data['razon_social'] ?? $data['RazonSocial'];
                }
            }
        } else {
            $status['issues'][] = 'Respuesta inesperada de la API';
            if (isset($api_data['message'])) {
                $status['issues'][] = 'Error de API: ' . $api_data['message'];
            }
        }

        return $status;
    }
}

// Inicializar la clase
new POS_Billing_API_Handler();