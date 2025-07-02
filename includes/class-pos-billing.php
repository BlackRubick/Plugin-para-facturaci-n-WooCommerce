<?php
/**
 * Clase principal del plugin POS Facturación - Actualizada
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
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-database.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-invoice.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-api-handler.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/functions.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/shortcodes.php';
        
        if (is_admin()) {
            require_once POS_BILLING_PLUGIN_PATH . 'admin/admin-page.php';
            require_once POS_BILLING_PLUGIN_PATH . 'admin/settings-page.php';
        }
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
        // El API Handler se inicializa automáticamente
        if (class_exists('POS_Billing_API_Handler')) {
            new POS_Billing_API_Handler();
        }
    }
    
    public function enqueue_scripts() {
        wp_enqueue_style(
            'pos-billing-css',
            POS_BILLING_PLUGIN_URL . 'assets/css/pos-billing.css',
            array(),
            POS_BILLING_VERSION
        );
        
        wp_enqueue_script(
            'pos-billing-js',
            POS_BILLING_PLUGIN_URL . 'assets/js/pos-billing.js',
            array('jquery'),
            POS_BILLING_VERSION,
            true
        );
        
        // Localizar script con datos de WordPress
        wp_localize_script('pos-billing-js', 'pos_billing_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('pos_billing_nonce'),
            'api_url' => rest_url('pos-billing/v1/'),
            'settings' => $this->get_public_settings()
        ));
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
    private function get_public_settings() {
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
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-database.php';
        POS_Billing_Database::create_tables();
        
        // Configuraciones por defecto
        add_option('pos_billing_sandbox_mode', true);
        add_option('pos_billing_default_forma_pago', '01');
        add_option('pos_billing_default_metodo_pago', 'PUE');
        add_option('pos_billing_default_uso_cfdi', 'G01');
        
        flush_rewrite_rules();
    }
    
    public static function deactivate() {
        flush_rewrite_rules();
    }
}