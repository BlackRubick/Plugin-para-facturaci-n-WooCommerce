<?php
/**
 * Plugin Name: POS Facturación
 * Description: Plugin de facturación que se integra con sistemas POS existentes
 * Version: 1.0.0
 * Author: BlackRubick
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Constantes del plugin
define('POS_BILLING_VERSION', '1.0.0');
define('POS_BILLING_PLUGIN_URL', plugin_dir_url(__FILE__));
define('POS_BILLING_PLUGIN_PATH', plugin_dir_path(__FILE__));

// Verificar que los archivos existan antes de cargarlos
function pos_billing_load_files() {
    $required_files = array(
        'includes/class-pos-billing.php',
        'includes/class-database.php',
        'includes/class-invoice.php',
        'includes/functions.php',
        'includes/shortcodes.php',
        'admin/admin-page.php'
    );
    
    foreach ($required_files as $file) {
        $file_path = POS_BILLING_PLUGIN_PATH . $file;
        if (file_exists($file_path)) {
            require_once $file_path;
        }
    }
}

// Cargar archivos
pos_billing_load_files();

// Hooks de activación
register_activation_hook(__FILE__, 'pos_billing_activate');
register_deactivation_hook(__FILE__, 'pos_billing_deactivate');

function pos_billing_activate() {
    if (class_exists('POS_Billing_Database')) {
        POS_Billing_Database::create_tables();
    }
    flush_rewrite_rules();
}

function pos_billing_deactivate() {
    flush_rewrite_rules();
}

// Cargar estilos y scripts
add_action('wp_enqueue_scripts', 'pos_billing_enqueue_scripts');

function pos_billing_enqueue_scripts() {
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
}
?>