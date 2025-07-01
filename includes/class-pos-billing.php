<?php
/**
 * Clase principal del plugin POS Facturación
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
    }
    
    private function load_dependencies() {
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-database.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-invoice.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/functions.php';
        require_once POS_BILLING_PLUGIN_PATH . 'includes/shortcodes.php';
        
        if (is_admin()) {
            require_once POS_BILLING_PLUGIN_PATH . 'admin/admin-page.php';
        }
    }
    
    private function define_admin_hooks() {
        // Hooks del administrador
    }
    
    private function define_public_hooks() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('init', array($this, 'load_textdomain'));
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
        
        wp_localize_script('pos-billing-js', 'pos_billing_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('pos_billing_nonce'),
            'api_url' => rest_url('pos-billing/v1/')
        ));
    }
    
    public function load_textdomain() {
        load_plugin_textdomain(
            'pos-facturacion',
            false,
            dirname(POS_BILLING_PLUGIN_BASENAME) . '/languages/'
        );
    }
    
    public static function activate() {
        require_once POS_BILLING_PLUGIN_PATH . 'includes/class-database.php';
        POS_Billing_Database::create_tables();
        flush_rewrite_rules();
    }
    
    public static function deactivate() {
        flush_rewrite_rules();
    }
}
