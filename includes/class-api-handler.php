<?php

/**
 * Clase para manejar la integración con la API de Factura.com 
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

    // ✅ NUEVOS HOOKS PARA CLIENTES
    add_action('wp_ajax_pos_billing_get_clients', array($this, 'get_clients_ajax'));
    add_action('wp_ajax_pos_billing_search_clients', array($this, 'search_clients_ajax'));
    
    // ✅ AGREGAR ESTA LÍNEA para el debug:
    add_action('wp_ajax_pos_billing_debug_clients_detailed', array($this, 'debug_clients_step_by_step'));

    add_action('rest_api_init', array($this, 'register_rest_routes'));

    // Cargar configuraciones
    $this->load_settings();
}

    /**
     *  Método AJAX para obtener lista de clientes*/
    public function get_clients_ajax()
    {
        // Verificar que el usuario esté logueado
        if (!is_user_logged_in()) {
            wp_send_json_error('Usuario no logueado');
            return;
        }

        // Verificar permisos
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Sin permisos suficientes');
            return;
        }

        // Verificar nonce (opcional para mantener compatibilidad)
        if (isset($_POST['nonce']) && !wp_verify_nonce($_POST['nonce'], 'pos_billing_nonce')) {
            if (WP_DEBUG) {
                error_log('POS Billing - Advertencia: Nonce inválido para get_clients, continuando...');
            }
        }

        if (WP_DEBUG) {
            error_log('=== 🚀 INICIANDO CARGA DE CLIENTES ===');
            error_log('Usuario: ' . wp_get_current_user()->display_name);
            error_log('Método: ' . $_SERVER['REQUEST_METHOD']);
        }

        $clients = $this->get_clients_list();

        if ($clients['success']) {
            wp_send_json_success($clients['data']);
        } else {
            wp_send_json_error($clients['message'], $clients);
        }
    }

    /**
     *Obtener lista de clientes desde la API de Factura.com*/
    private function get_clients_list()
    {
        if (empty($this->api_key) || empty($this->secret_key)) {
            return array(
                'success' => false,
                'message' => 'Credenciales no configuradas'
            );
        }

        $base_url = $this->is_sandbox ? $this->api_url_sandbox : $this->api_url_production;

        $url = $base_url . '/v1/clients';

        $headers = array(
            'Content-Type' => 'application/json',
            'F-PLUGIN' => '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
            'F-Api-Key' => $this->api_key,
            'F-Secret-Key' => $this->secret_key
        );

        if (WP_DEBUG) {
            error_log('=== 🔍 DEBUG CLIENTES ===');
            error_log('URL: ' . $url);
            error_log('API Key: ' . substr($this->api_key, 0, 10) . '...');
            error_log('Sandbox mode: ' . ($this->is_sandbox ? 'Sí' : 'No'));
        }

        $response = wp_remote_get($url, array(
            'headers' => $headers,
            'timeout' => 30,
            'sslverify' => !$this->is_sandbox
        ));

        if (is_wp_error($response)) {
            if (WP_DEBUG) {
                error_log('❌ Error WP: ' . $response->get_error_message());
            }
            return array(
                'success' => false,
                'message' => 'Error de conexión: ' . $response->get_error_message()
            );
        }

        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);

        if (WP_DEBUG) {
            error_log('=== 📡 RESPUESTA CLIENTES ===');
            error_log('Código HTTP: ' . $response_code);
            error_log('Respuesta completa: ' . $response_body);
        }

        if ($response_code !== 200) {
            return array(
                'success' => false,
                'message' => "Error HTTP {$response_code} - Verifica tus credenciales"
            );
        }

        $api_response = json_decode($response_body, true);

        if (!$api_response || json_last_error() !== JSON_ERROR_NONE) {
            return array(
                'success' => false,
                'message' => 'Respuesta inválida de la API: ' . json_last_error_msg()
            );
        }

        if (isset($api_response['status']) && $api_response['status'] === 'success' && isset($api_response['data'])) {
            $clients = array();

            foreach ($api_response['data'] as $client) {
                // Mapear campos según la estructura  de la API
                $clients[] = array(
                    'uid' => $client['UID'],
                    'rfc' => $client['RFC'],
                    'razon_social' => $client['RazonSocial'],
                    'regimen' => $client['Regimen'] ?? '',
                    'regimen_id' => $client['RegimenId'] ?? '',
                    'email' => $client['Contacto']['Email'] ?? '',
                    'email2' => $client['Contacto']['Email2'] ?? '',
                    'email3' => $client['Contacto']['Email3'] ?? '',
                    'telefono' => $client['Contacto']['Telefono'] ?? '',
                    'nombre_contacto' => ($client['Contacto']['Nombre'] ?? '') . ' ' . ($client['Contacto']['Apellidos'] ?? ''),
                    'calle' => $client['Calle'] ?? '',
                    'numero' => $client['Numero'] ?? '',
                    'interior' => $client['Interior'] ?? '',
                    'colonia' => $client['Colonia'] ?? '',
                    'codigo_postal' => $client['CodigoPostal'] ?? '',
                    'ciudad' => $client['Ciudad'] ?? '',
                    'delegacion' => $client['Delegacion'] ?? '',
                    'estado' => $client['Estado'] ?? '',
                    'pais' => $client['Pais'] ?? 'MEX',
                    'uso_cfdi' => $client['UsoCFDI'] ?? 'G01',
                    'total_cfdis' => $client['cfdis'] ?? 0,
                    'cuentas_banco' => $client['cuentas_banco'] ?? array(),
                    'display_name' => $client['RazonSocial'] . ' (' . $client['RFC'] . ')'
                );
            }

            if (WP_DEBUG) {
                error_log('Se procesaron ' . count($clients) . ' clientes correctamente');
                if (!empty($clients)) {
                    error_log('Primer cliente: ' . print_r($clients[0], true));
                }
            }

            return array(
                'success' => true,
                'data' => $clients,
                'total' => count($clients)
            );
        } else {
            //  Manejar diferentes tipos de error
            $error_message = 'Error desconocido';

            if (isset($api_response['message'])) {
                $error_message = $api_response['message'];
            } elseif (isset($api_response['error'])) {
                $error_message = $api_response['error'];
            } elseif (isset($api_response['response']) && $api_response['response'] !== 'success') {
                $error_message = 'La API respondió: ' . $api_response['response'];
            }

            if (WP_DEBUG) {
                error_log('❌ Error en respuesta de clientes: ' . $error_message);
                error_log('Respuesta completa: ' . print_r($api_response, true));
            }

            return array(
                'success' => false,
                'message' => 'No se pudieron obtener los clientes: ' . $error_message,
                'debug_info' => array(
                    'response_structure' => array_keys($api_response),
                    'full_response' => $api_response
                )
            );
        }
    }

    /**
     *  Buscar clientes por término de búsqueda
     */
    public function search_clients_ajax()
    {
        if (!current_user_can('edit_posts')) {
            wp_send_json_error('Sin permisos');
            return;
        }

        if (!check_ajax_referer('pos_billing_nonce', 'nonce', false)) {
            wp_send_json_error('Error de seguridad');
            return;
        }

        $search_term = sanitize_text_field($_POST['search'] ?? '');

        $clients = $this->get_clients_list();

        if (!$clients['success']) {
            wp_send_json_error($clients['message']);
            return;
        }

        // Filtrar clientes si hay término de búsqueda
        if (!empty($search_term)) {
            $filtered_clients = array_filter($clients['data'], function ($client) use ($search_term) {
                return (
                    stripos($client['razon_social'], $search_term) !== false ||
                    stripos($client['rfc'], $search_term) !== false ||
                    stripos($client['email'], $search_term) !== false
                );
            });

            wp_send_json_success(array_values($filtered_clients));
        } else {
            wp_send_json_success($clients['data']);
        }
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
        // 🔍 DEBUG 1: VER TIPOS DESPUÉS DEL FORMATO
        if (WP_DEBUG) {
            error_log('=== 🔍 DEBUG PHP - DESPUÉS DE format_cfdi_data ===');
            error_log('Serie tipo: ' . gettype($formatted_data['Serie']) . ' valor: ' . $formatted_data['Serie']);
            error_log('FormaPago tipo: ' . gettype($formatted_data['FormaPago']) . ' valor: "' . $formatted_data['FormaPago'] . '"');
            error_log('Cantidad tipo: ' . gettype($formatted_data['Conceptos'][0]['Cantidad']) . ' valor: ' . $formatted_data['Conceptos'][0]['Cantidad']);
            error_log('ValorUnitario tipo: ' . gettype($formatted_data['Conceptos'][0]['ValorUnitario']) . ' valor: ' . $formatted_data['Conceptos'][0]['ValorUnitario']);
            if (isset($formatted_data['Conceptos'][0]['Impuestos']['Traslados'][0])) {
                error_log('Base tipo: ' . gettype($formatted_data['Conceptos'][0]['Impuestos']['Traslados'][0]['Base']) . ' valor: ' . $formatted_data['Conceptos'][0]['Impuestos']['Traslados'][0]['Base']);
            }
        }
        $body = json_encode($formatted_data);
        if (WP_DEBUG) {
            error_log('=== 🔍 DEBUG PHP - JSON FINAL ===');
            error_log('JSON que se envía: ' . $body);
            error_log('JSON con formato bonito: ' . json_encode($formatted_data, JSON_PRETTY_PRINT));
        }
        if (WP_DEBUG) {
            error_log('=== 🔍 DEBUG EXTREMO ===');
            error_log('$formatted_data antes de json_encode:');
            error_log('- Serie tipo: ' . gettype($formatted_data['Serie']) . ' valor: ' . $formatted_data['Serie']);
            error_log('- Cantidad tipo: ' . gettype($formatted_data['Conceptos'][0]['Cantidad']) . ' valor: ' . $formatted_data['Conceptos'][0]['Cantidad']);
            error_log('JSON antes de enviar: ' . $body);
            error_log('Headers: ' . print_r($headers, true));
        }

        // 🧪 TEST: Probar con datos exactos de la documentación
        if (WP_DEBUG && isset($_GET['test_api'])) {
            error_log('=== 🧪 PROBANDO CON DATOS DE DOCUMENTACIÓN ===');

            $test_data = array(
                "Receptor" => array(
                    "UID" => "67a93f71cdddb" // Tu receptor que SÍ existe
                ),
                "TipoDocumento" => "factura",
                "Conceptos" => array(
                    array(
                        "ClaveProdServ" => "43201830", // Tu producto que SÍ existe
                        "Cantidad" => 1,
                        "ClaveUnidad" => "H87",
                        "Unidad" => "Pieza",
                        "ValorUnitario" => 100.0,
                        "Descripcion" => "DISCO DURO SSD",
                        "ObjetoImp" => "02",
                        "Impuestos" => array(
                            "Traslados" => array(
                                array(
                                    "Base" => 100.0,
                                    "Impuesto" => "002",
                                    "TipoFactor" => "Tasa",
                                    "TasaOCuota" => "0.16",
                                    "Importe" => 16.0
                                )
                            )
                        )
                    )
                ),
                "UsoCFDI" => "G01",
                "Serie" => 5483035, // Tu serie que SÍ existe  
                "FormaPago" => "01",
                "MetodoPago" => "PUE",
                "Moneda" => "MXN",
                "EnviarCorreo" => false
            );

            $test_body = json_encode($test_data);
            error_log('🧪 TEST JSON: ' . $test_body);

            // Hacer petición de prueba
            $test_response = wp_remote_post($url, array(
                'headers' => $headers,
                'body' => $test_body,
                'timeout' => 45,
                'sslverify' => !$this->is_sandbox
            ));

            error_log('🧪 TEST RESPUESTA: ' . wp_remote_retrieve_body($test_response));
        }
        // 🧪 TEST: Probar con datos exactos que funcionan en el portal
        if (WP_DEBUG) {
            error_log('=== 🧪 PROBANDO CON DATOS SIMPLIFICADOS ===');

            $test_data = array(
                "Receptor" => array(
                    "UID" => "67a93f71cdddb"
                ),
                "TipoDocumento" => "factura",
                "Conceptos" => array(
                    array(
                        "ClaveProdServ" => "43201830", // Usa la clave exacta de tu producto
                        "Cantidad" => 1,
                        "ClaveUnidad" => "H87",
                        "Unidad" => "Pieza",
                        "ValorUnitario" => 100,
                        "Descripcion" => "DISCO DURO SSD",
                        "ObjetoImp" => "02",
                        "Impuestos" => array(
                            "Traslados" => array(
                                array(
                                    "Base" => 100,
                                    "Impuesto" => "002",
                                    "TipoFactor" => "Tasa",
                                    "TasaOCuota" => "0.16",
                                    "Importe" => 16
                                )
                            )
                        )
                    )
                ),
                "UsoCFDI" => "G01",
                "Serie" => 5483035,
                "FormaPago" => "01",
                "MetodoPago" => "PUE",
                "Moneda" => "MXN",
                "EnviarCorreo" => false
            );

            $test_body = json_encode($test_data);
            error_log('🧪 TEST JSON: ' . $test_body);

            // Hacer petición de prueba
            $test_response = wp_remote_post($url, array(
                'headers' => $headers,
                'body' => $test_body,
                'timeout' => 45,
                'sslverify' => !$this->is_sandbox
            ));

            $test_response_body = wp_remote_retrieve_body($test_response);
            error_log('🧪 TEST RESPUESTA CODE: ' . wp_remote_retrieve_response_code($test_response));
            error_log('🧪 TEST RESPUESTA BODY: ' . $test_response_body);
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
     * Formatear datos del CFDI - FORZAR TIPOS FINALES
     */
    private function format_cfdi_data($data)
    {
        if (WP_DEBUG) {
            error_log('=== 🚀 FORMAT_CFDI_DATA - DATOS RECIBIDOS ===');
            error_log('JSON RECIBIDO: ' . json_encode($data, JSON_PRETTY_PRINT));
        }

        $formatted = array(
            'Receptor' => $data['Receptor'],
            'TipoDocumento' => (string)$data['TipoDocumento'],
            'UsoCFDI' => (string)$data['UsoCFDI'],
            'Serie' => (int)$data['Serie'], // ← FORZAR A INTEGER
            'FormaPago' => (string)$data['FormaPago'], // ← MANTENER STRING
            'MetodoPago' => (string)$data['MetodoPago'],
            'Moneda' => (string)$data['Moneda'],
            'EnviarCorreo' => (bool)$data['EnviarCorreo'] // ← FORZAR A BOOLEAN
        );

        // Campos opcionales
        if (!empty($data['TipoCambio'])) {
            $formatted['TipoCambio'] = (float)$data['TipoCambio'];
        }
        if (!empty($data['NumOrder'])) {
            $formatted['NumOrder'] = (string)$data['NumOrder'];
        }
        if (!empty($data['LugarExpedicion'])) {
            $formatted['LugarExpedicion'] = (string)$data['LugarExpedicion'];
        }
        if (!empty($data['Comentarios'])) {
            $formatted['Comentarios'] = (string)$data['Comentarios'];
        }

        // ✅ CONCEPTOS - FORZAR TIPOS ESPECÍFICOS
        $formatted['Conceptos'] = array();

        foreach ($data['Conceptos'] as $concepto) {
            $formatted_concepto = array(
                'ClaveProdServ' => (string)$concepto['ClaveProdServ'], // STRING
                'Cantidad' => (float)$concepto['Cantidad'], // ← FORZAR A FLOAT
                'ClaveUnidad' => (string)$concepto['ClaveUnidad'],
                'Unidad' => (string)$concepto['Unidad'],
                'Descripcion' => (string)$concepto['Descripcion'],
                'ValorUnitario' => (float)$concepto['ValorUnitario'], // ← FORZAR A FLOAT
                'Importe' => (float)$concepto['Importe'], // ← FORZAR A FLOAT
                'ObjetoImp' => (string)$concepto['ObjetoImp'] // STRING
            );

            // Descuento opcional
            if (isset($concepto['Descuento']) && $concepto['Descuento'] > 0) {
                $formatted_concepto['Descuento'] = (float)$concepto['Descuento'];
            }

            // ✅ IMPUESTOS - FORZAR TIPOS
            if (isset($concepto['Impuestos']['Traslados'])) {
                $formatted_concepto['Impuestos'] = array();
                $formatted_concepto['Impuestos']['Traslados'] = array();

                foreach ($concepto['Impuestos']['Traslados'] as $traslado) {
                    $formatted_concepto['Impuestos']['Traslados'][] = array(
                        'Base' => (float)$traslado['Base'], // ← FORZAR A FLOAT
                        'Impuesto' => (string)$traslado['Impuesto'], // STRING "002"
                        'TipoFactor' => (string)$traslado['TipoFactor'], // STRING
                        'TasaOCuota' => (string)$traslado['TasaOCuota'], // STRING "0.16"
                        'Importe' => (float)$traslado['Importe'] // ← FORZAR A FLOAT
                    );
                }
            }

            $formatted['Conceptos'][] = $formatted_concepto;
        }

        if (WP_DEBUG) {
            error_log('=== ✅ DATOS FINALES CON TIPOS FORZADOS ===');
            error_log('JSON FINAL: ' . json_encode($formatted, JSON_PRETTY_PRINT));
            error_log('TIPOS VERIFICADOS:');
            error_log('- Serie: ' . gettype($formatted['Serie']) . ' = ' . $formatted['Serie']);
            error_log('- FormaPago: ' . gettype($formatted['FormaPago']) . ' = ' . $formatted['FormaPago']);
            error_log('- Cantidad: ' . gettype($formatted['Conceptos'][0]['Cantidad']) . ' = ' . $formatted['Conceptos'][0]['Cantidad']);
            error_log('- ValorUnitario: ' . gettype($formatted['Conceptos'][0]['ValorUnitario']) . ' = ' . $formatted['Conceptos'][0]['ValorUnitario']);
            error_log('- Base: ' . gettype($formatted['Conceptos'][0]['Impuestos']['Traslados'][0]['Base']) . ' = ' . $formatted['Conceptos'][0]['Impuestos']['Traslados'][0]['Base']);
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
     * Calcular totales de conceptos 
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


  public function debug_clients_step_by_step() {
        if (!current_user_can('manage_options')) {
            wp_die('Sin permisos');
        }
        
        echo '<h1>🔍 Debug Detallado - Clientes POS Facturación</h1>';
        echo '<style>
            .debug-section { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #007cba; }
            .success { background: #d4edda; border-color: #28a745; }
            .error { background: #f8d7da; border-color: #dc3545; }
            .warning { background: #fff3cd; border-color: #ffc107; }
            pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
        </style>';
        
        echo '<div class="debug-section">';
        echo '<h2>📋 PASO 1: Verificación de Configuración</h2>';
        
        $api_key = get_option('pos_billing_api_key', '');
        $secret_key = get_option('pos_billing_secret_key', '');
        $sandbox = get_option('pos_billing_sandbox_mode', true);
        
        echo '<ul>';
        echo '<li><strong>API Key:</strong> ' . (empty($api_key) ? '❌ Vacío' : '✅ Configurado (' . substr($api_key, 0, 10) . '...)') . '</li>';
        echo '<li><strong>Secret Key:</strong> ' . (empty($secret_key) ? '❌ Vacío' : '✅ Configurado') . '</li>';
        echo '<li><strong>Modo:</strong> ' . ($sandbox ? '🧪 Sandbox' : '🚀 Producción') . '</li>';
        echo '</ul>';
        echo '</div>';
        
        if (empty($api_key) || empty($secret_key)) {
            echo '<div class="debug-section error"><h3>❌ ERROR CRÍTICO</h3><p>Las credenciales no están configuradas correctamente.</p></div>';
            wp_die();
        }
        
        echo '<div class="debug-section">';
        echo '<h2>🌐 PASO 2: Construcción de la Petición</h2>';
        
        $base_url = $sandbox ? 'https://sandbox.factura.com/api' : 'https://api.factura.com';
        $url = $base_url . '/v1/clients';
        
        $headers = array(
            'Content-Type' => 'application/json',
            'F-PLUGIN' => '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
            'F-Api-Key' => $api_key,
            'F-Secret-Key' => $secret_key
        );
        
        echo '<p><strong>URL:</strong> <code>' . $url . '</code></p>';
        echo '<p><strong>Headers:</strong></p>';
        echo '<pre>';
        foreach ($headers as $key => $value) {
            if ($key === 'F-Api-Key') {
                echo $key . ': ' . substr($value, 0, 10) . '...' . "\n";
            } elseif ($key === 'F-Secret-Key') {
                echo $key . ': *** OCULTO ***' . "\n";
            } else {
                echo $key . ': ' . $value . "\n";
            }
        }
        echo '</pre>';
        echo '</div>';
        
        echo '<div class="debug-section">';
        echo '<h2>📡 PASO 3: Realizando Petición a la API</h2>';
        
        $start_time = microtime(true);
        
        $response = wp_remote_get($url, array(
            'headers' => $headers,
            'timeout' => 30,
            'sslverify' => !$sandbox
        ));
        
        $end_time = microtime(true);
        $duration = round(($end_time - $start_time) * 1000, 2);
        
        echo '<p><strong>Tiempo de respuesta:</strong> ' . $duration . ' ms</p>';
        
        if (is_wp_error($response)) {
            echo '<div class="error">';
            echo '<h3>❌ ERROR DE CONEXIÓN</h3>';
            echo '<p><strong>Mensaje:</strong> ' . $response->get_error_message() . '</p>';
            echo '<p><strong>Código:</strong> ' . $response->get_error_code() . '</p>';
            echo '</div>';
            wp_die();
        }
        echo '</div>';
        
        echo '<div class="debug-section">';
        echo '<h2>📨 PASO 4: Análisis de Respuesta HTTP</h2>';
        
        $response_code = wp_remote_retrieve_response_code($response);
        $response_headers = wp_remote_retrieve_headers($response);
        $response_body = wp_remote_retrieve_body($response);
        
        echo '<p><strong>Código HTTP:</strong> <span style="color: ' . ($response_code === 200 ? 'green' : 'red') . '; font-weight: bold;">' . $response_code . '</span></p>';
        
        if ($response_code !== 200) {
            echo '<div class="error">';
            echo '<h3>❌ ERROR HTTP</h3>';
            echo '<p>La API respondió con código ' . $response_code . '</p>';
            echo '<h4>Headers de respuesta:</h4>';
            echo '<pre>' . print_r($response_headers, true) . '</pre>';
            echo '<h4>Cuerpo de respuesta:</h4>';
            echo '<pre>' . esc_html($response_body) . '</pre>';
            echo '</div>';
            wp_die();
        }
        
        echo '<p><strong>Content-Type:</strong> ' . $response_headers['content-type'] . '</p>';
        echo '<p><strong>Tamaño:</strong> ' . strlen($response_body) . ' bytes</p>';
        echo '</div>';
        
        echo '<div class="debug-section">';
        echo '<h2>🔧 PASO 5: Parseando Respuesta JSON</h2>';
        
        $api_response = json_decode($response_body, true);
        $json_error = json_last_error();
        
        if ($json_error !== JSON_ERROR_NONE) {
            echo '<div class="error">';
            echo '<h3>❌ ERROR DE JSON</h3>';
            echo '<p><strong>Error:</strong> ' . json_last_error_msg() . '</p>';
            echo '<h4>Respuesta cruda:</h4>';
            echo '<pre>' . esc_html($response_body) . '</pre>';
            echo '</div>';
            wp_die();
        }
        
        echo '<p>✅ JSON parseado correctamente</p>';
        echo '<p><strong>Estructura de respuesta:</strong></p>';
        echo '<pre>' . print_r(array_keys($api_response), true) . '</pre>';
        echo '</div>';
        
        echo '<div class="debug-section">';
        echo '<h2>📊 PASO 6: Análisis de Estructura de Datos</h2>';
        
        echo '<h4>🔍 Estructura completa de la respuesta:</h4>';
        echo '<pre style="max-height: 400px; overflow-y: auto;">' . print_r($api_response, true) . '</pre>';
        
        echo '<h4>✅ Verificación de campos esperados:</h4>';
        echo '<ul>';
        echo '<li><strong>status:</strong> ' . (isset($api_response['status']) ? '✅ ' . $api_response['status'] : '❌ No encontrado') . '</li>';
        echo '<li><strong>response:</strong> ' . (isset($api_response['response']) ? '✅ ' . $api_response['response'] : '❌ No encontrado') . '</li>';
        echo '<li><strong>data:</strong> ' . (isset($api_response['data']) ? '✅ Presente (' . (is_array($api_response['data']) ? count($api_response['data']) . ' elementos)' : 'No es array)') : '❌ No encontrado') . '</li>';
        echo '</ul>';
        
        if (isset($api_response['data']) && is_array($api_response['data']) && !empty($api_response['data'])) {
            echo '<h4>👤 Primer cliente (ejemplo):</h4>';
            echo '<pre>' . print_r($api_response['data'][0], true) . '</pre>';
            
            // Verificar campos del cliente
            $first_client = $api_response['data'][0];
            echo '<h4>🔍 Campos del primer cliente:</h4>';
            echo '<ul>';
            $expected_fields = ['UID', 'RazonSocial', 'RFC', 'UsoCFDI', 'Contacto'];
            foreach ($expected_fields as $field) {
                echo '<li><strong>' . $field . ':</strong> ' . (isset($first_client[$field]) ? '✅ Presente' : '❌ Faltante') . '</li>';
            }
            echo '</ul>';
        }
        echo '</div>';
        
        echo '<div class="debug-section success">';
        echo '<h2>🎯 PASO 7: Simulación del Procesamiento</h2>';
        
        if (isset($api_response['status']) && $api_response['status'] === 'success' && isset($api_response['data'])) {
            $clients = array();
            
            foreach ($api_response['data'] as $client) {
                $processed_client = array(
                    'uid' => $client['UID'] ?? 'N/A',
                    'rfc' => $client['RFC'] ?? 'N/A',
                    'razon_social' => $client['RazonSocial'] ?? 'N/A',
                    'email' => $client['Contacto']['Email'] ?? 'N/A',
                    'uso_cfdi' => $client['UsoCFDI'] ?? 'G01',
                    'ciudad' => $client['Ciudad'] ?? 'N/A',
                    'display_name' => ($client['RazonSocial'] ?? 'Sin nombre') . ' (' . ($client['RFC'] ?? 'Sin RFC') . ')'
                );
                $clients[] = $processed_client;
            }
            
            echo '<p>✅ Se procesaron correctamente <strong>' . count($clients) . '</strong> clientes</p>';
            echo '<h4>📋 Clientes procesados (primeros 3):</h4>';
            echo '<pre>' . print_r(array_slice($clients, 0, 3), true) . '</pre>';
            
            echo '<div style="background: #d4edda; padding: 15px; border-radius: 5px; margin-top: 20px;">';
            echo '<h3>🎉 ¡TODO ESTÁ FUNCIONANDO CORRECTAMENTE!</h3>';
            echo '<p>La API está devolviendo ' . count($clients) . ' clientes. El problema debe estar en el JavaScript del frontend.</p>';
            echo '<p><strong>Siguiente paso:</strong> Revisar la consola del navegador para errores de JavaScript.</p>';
            echo '</div>';
        } else {
            echo '<div class="error">';
            echo '<h3>❌ PROBLEMA EN LA ESTRUCTURA DE RESPUESTA</h3>';
            echo '<p>La API no está devolviendo la estructura esperada.</p>';
            echo '</div>';
        }
        echo '</div>';
        
        wp_die();
    }



}

new POS_Billing_API_Handler();
