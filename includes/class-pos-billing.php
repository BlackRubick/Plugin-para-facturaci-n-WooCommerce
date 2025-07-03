<?php
/**
 * Clase principal del plugin POS Facturación - CORREGIDA
 */

if (!defined('ABSPATH')) {
    exit;
}

class POS_Billing {
    
    private static $instance = null;
    
    public static function init() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->init_api_handler();
    }
    
    private function load_dependencies() {
        // Las dependencias ya se cargan en el archivo principal
        // Aquí solo inicializamos lo que necesitamos
    }
    
    private function define_admin_hooks() {
        // Hooks del administrador
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    private function define_public_hooks() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('init', array($this, 'load_textdomain'));
    }
    
    private function init_api_handler() {
        // El API Handler se inicializa automáticamente en su propio archivo
    }
    
    public function enqueue_scripts() {
        // Esta función se maneja en el archivo principal
    }
    
    public function load_textdomain() {
        load_plugin_textdomain(
            'pos-facturacion',
            false,
            dirname(POS_BILLING_PLUGIN_BASENAME) . '/languages/'
        );
    }
    
    /**
     * Registrar configuraciones del plugin
     */
    public function register_settings() {
        // Registrar opciones de configuración
        register_setting('pos_billing_settings', 'pos_billing_api_key');
        register_setting('pos_billing_settings', 'pos_billing_secret_key');
        register_setting('pos_billing_settings', 'pos_billing_sandbox_mode');
        register_setting('pos_billing_settings', 'pos_billing_default_serie');
        register_setting('pos_billing_settings', 'pos_billing_default_forma_pago');
        register_setting('pos_billing_settings', 'pos_billing_default_metodo_pago');
        register_setting('pos_billing_settings', 'pos_billing_default_uso_cfdi');
        register_setting('pos_billing_settings', 'pos_billing_lugar_expedicion');
    }
    
    /**
     * Obtener configuraciones públicas (que se pueden enviar al frontend)
     */
    public function get_public_settings() {
        return array(
            'sandbox_mode' => get_option('pos_billing_sandbox_mode', true),
            'api_configured' => !empty(get_option('pos_billing_api_key')) && !empty(get_option('pos_billing_secret_key')),
            'defaults' => array(
                'serie' => get_option('pos_billing_default_serie', ''),
                'forma_pago' => get_option('pos_billing_default_forma_pago', '01'),
                'metodo_pago' => get_option('pos_billing_default_metodo_pago', 'PUE'),
                'uso_cfdi' => get_option('pos_billing_default_uso_cfdi', 'G01'),
                'lugar_expedicion' => get_option('pos_billing_lugar_expedicion', '')
            )
        );
    }
    
    public static function activate() {
        // La activación se maneja en el archivo principal
    }
    
    public static function deactivate() {
        // La desactivación se maneja en el archivo principal
    }
}