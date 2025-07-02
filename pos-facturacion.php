<?php
/**
 * Plugin Name: POS Facturación
 * Description: Plugin de facturación que se integra con sistemas POS existentes y la API de Factura.com para generar CFDIs válidos
 * Version: 2.1.0
 * Author: BlackRubick
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Constantes del plugin
define('POS_BILLING_VERSION', '2.1.0');
define('POS_BILLING_PLUGIN_URL', plugin_dir_url(__FILE__));
define('POS_BILLING_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('POS_BILLING_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Verificar versión de PHP
if (version_compare(PHP_VERSION, '7.4', '<')) {
    add_action('admin_notices', function() {
        echo '<div class="notice notice-error"><p><strong>POS Facturación:</strong> Este plugin requiere PHP 7.4 o superior. Tu versión actual es ' . PHP_VERSION . '</p></div>';
    });
    return;
}

// Verificar que los archivos existan antes de cargarlos
function pos_billing_load_files() {
    $required_files = array(
        'includes/class-database.php',
        'includes/functions.php',
        'includes/shortcodes.php'
    );
    
    // Cargar archivos básicos primero
    foreach ($required_files as $file) {
        $file_path = POS_BILLING_PLUGIN_PATH . $file;
        if (file_exists($file_path)) {
            require_once $file_path;
        }
    }
    
    // Cargar archivos opcionales
    $optional_files = array(
        'includes/class-pos-billing.php',
        'includes/class-invoice.php',
        'includes/class-api-handler.php'
    );
    
    foreach ($optional_files as $file) {
        $file_path = POS_BILLING_PLUGIN_PATH . $file;
        if (file_exists($file_path)) {
            require_once $file_path;
        }
    }
    
    // Cargar archivos del admin solo si estamos en el admin
    if (is_admin()) {
        $admin_files = array(
            'admin/admin-page.php',
            'admin/settings-page.php'
        );
        
        // Cargar admin/invoices-page.php solo si existe
        if (file_exists(POS_BILLING_PLUGIN_PATH . 'admin/invoices-page.php')) {
            $admin_files[] = 'admin/invoices-page.php';
        }
        
        foreach ($admin_files as $file) {
            $file_path = POS_BILLING_PLUGIN_PATH . $file;
            if (file_exists($file_path)) {
                require_once $file_path;
            }
        }
    }
}

// Hooks de activación y desactivación
register_activation_hook(__FILE__, 'pos_billing_activate');
register_deactivation_hook(__FILE__, 'pos_billing_deactivate');

function pos_billing_activate() {
    // Verificar versión de WordPress
    if (version_compare(get_bloginfo('version'), '5.0', '<')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die('Este plugin requiere WordPress 5.0 o superior.');
    }
    
    // Cargar archivos antes de usar las clases
    pos_billing_load_files();
    
    // Crear tablas de base de datos
    if (class_exists('POS_Billing_Database')) {
        try {
            $table_created = POS_Billing_Database::create_tables();
            if (!$table_created && WP_DEBUG) {
                error_log('POS Billing - Warning: Error al crear tablas de base de datos');
            }
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error en create_tables: ' . $e->getMessage());
            }
        }
    }
    
    // Configuraciones por defecto
    add_option('pos_billing_sandbox_mode', true);
    add_option('pos_billing_default_forma_pago', '01');
    add_option('pos_billing_default_metodo_pago', 'PUE');
    add_option('pos_billing_default_uso_cfdi', 'G01');
    add_option('pos_billing_db_version', POS_BILLING_VERSION);
    
    // Limpiar rewrite rules
    flush_rewrite_rules();
    
    // Programar notificación de bienvenida
    set_transient('pos_billing_activation_notice', true, 60);
}

function pos_billing_deactivate() {
    flush_rewrite_rules();
    
    // Limpiar transients
    delete_transient('pos_billing_activation_notice');
}

// Cargar archivos después de WordPress
add_action('init', 'pos_billing_load_files');

// Cargar estilos y scripts
add_action('wp_enqueue_scripts', 'pos_billing_enqueue_scripts');

function pos_billing_enqueue_scripts() {
    // Solo cargar en páginas que contengan los shortcodes
    if (is_admin() || !is_singular()) {
        return;
    }
    
    global $post;
    if (!$post || (!has_shortcode($post->post_content, 'pos_billing_button') && !has_shortcode($post->post_content, 'pos_billing_module'))) {
        return;
    }
    
    // Verificar que los archivos CSS y JS existan
    $css_file = POS_BILLING_PLUGIN_PATH . 'assets/css/pos-billing.css';
    $js_file = POS_BILLING_PLUGIN_PATH . 'assets/js/pos-billing.js';
    
    if (file_exists($css_file)) {
        wp_enqueue_style(
            'pos-billing-css',
            POS_BILLING_PLUGIN_URL . 'assets/css/pos-billing.css',
            array(),
            POS_BILLING_VERSION
        );
    }
    
    if (file_exists($js_file)) {
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
            'settings' => pos_billing_get_public_settings()
        ));
    }
}

// Función para obtener configuraciones públicas
function pos_billing_get_public_settings() {
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

// Inicializar el plugin de forma segura
add_action('plugins_loaded', function() {
    if (class_exists('POS_Billing')) {
        try {
            POS_Billing::init();
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error inicializando: ' . $e->getMessage());
            }
        }
    }
    
    // Actualizar base de datos si es necesario
    if (class_exists('POS_Billing_Database')) {
        try {
            POS_Billing_Database::update_database();
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error actualizando BD: ' . $e->getMessage());
            }
        }
    }
});

// Notificación de bienvenida
add_action('admin_notices', function() {
    if (get_transient('pos_billing_activation_notice')) {
        delete_transient('pos_billing_activation_notice');
        
        $settings_url = admin_url('admin.php?page=pos-billing-settings');
        
        echo '<div class="notice notice-success is-dismissible">';
        echo '<h3>🎉 ¡POS Facturación activado correctamente!</h3>';
        echo '<p>Para comenzar a generar CFDIs:</p>';
        echo '<ol>';
        echo '<li>📝 <a href="' . $settings_url . '">Configura tus credenciales de la API</a> de Factura.com</li>';
        echo '<li>📄 Usa el shortcode <code>[pos_billing_button]</code> en cualquier página o entrada</li>';
        echo '<li>🚀 ¡Comienza a facturar!</li>';
        echo '</ol>';
        echo '<p><a href="' . $settings_url . '" class="button button-primary">⚙️ Ir a Configuración</a></p>';
        echo '</div>';
    }
});

// Notificación si no está configurado
add_action('admin_notices', function() {
    $screen = get_current_screen();
    if (!$screen || strpos($screen->id, 'pos-billing') === false) {
        return;
    }
    
    $api_key = get_option('pos_billing_api_key', '');
    $secret_key = get_option('pos_billing_secret_key', '');
    
    if (empty($api_key) || empty($secret_key)) {
        $settings_url = admin_url('admin.php?page=pos-billing-settings');
        echo '<div class="notice notice-warning">';
        echo '<p><strong>⚠️ Configuración pendiente:</strong> Para usar el plugin de facturación, necesitas <a href="' . $settings_url . '">configurar tus credenciales de la API</a> de Factura.com.</p>';
        echo '</div>';
    }
});

// Agregar enlace de configuración en la lista de plugins
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function($links) {
    $settings_link = '<a href="' . admin_url('admin.php?page=pos-billing-settings') . '">⚙️ Configuración</a>';
    
    // Solo agregar enlace de facturas si el archivo existe
    if (file_exists(POS_BILLING_PLUGIN_PATH . 'admin/invoices-page.php')) {
        $invoices_link = '<a href="' . admin_url('admin.php?page=pos-billing-invoices') . '">📄 Facturas</a>';
        array_unshift($links, $settings_link, $invoices_link);
    } else {
        array_unshift($links, $settings_link);
    }
    
    return $links;
});

// Hook para actualizar la base de datos si es necesario
add_action('plugins_loaded', function() {
    $db_version = get_option('pos_billing_db_version', '1.0');
    if (version_compare($db_version, POS_BILLING_VERSION, '<')) {
        if (class_exists('POS_Billing_Database')) {
            try {
                POS_Billing_Database::update_database();
                update_option('pos_billing_db_version', POS_BILLING_VERSION);
            } catch (Exception $e) {
                if (WP_DEBUG) {
                    error_log('POS Billing - Error actualizando versión BD: ' . $e->getMessage());
                }
            }
        }
    }
});

// Agregar información al footer del admin
add_filter('admin_footer_text', function($text) {
    $screen = get_current_screen();
    if ($screen && strpos($screen->id, 'pos-billing') !== false) {
        return 'POS Facturación v' . POS_BILLING_VERSION . ' | Desarrollado por <strong>BlackRubick</strong> 🚀 | <a href="https://factura.com" target="_blank">Powered by Factura.com</a>';
    }
    return $text;
});

// Agregar widget de dashboard solo si las clases existen
add_action('wp_dashboard_setup', function() {
    if (current_user_can('manage_options') && class_exists('POS_Billing_Database')) {
        wp_add_dashboard_widget(
            'pos_billing_dashboard_widget',
            '📄 POS Facturación - Resumen',
            'pos_billing_dashboard_widget_content'
        );
    }
});

function pos_billing_dashboard_widget_content() {
    try {
        $stats = POS_Billing_Database::get_invoice_stats();
        $api_configured = !empty(get_option('pos_billing_api_key')) && !empty(get_option('pos_billing_secret_key'));
        
        echo '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">';
        echo '<div style="text-align: center;"><strong>' . number_format($stats['total_invoices']) . '</strong><br><small>Total Facturas</small></div>';
        echo '<div style="text-align: center;"><strong>$' . number_format($stats['total_amount'], 2) . '</strong><br><small>Total Facturado</small></div>';
        echo '</div>';
        
        if (!$api_configured) {
            echo '<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-bottom: 15px;">';
            echo '<strong>⚠️ Configuración pendiente:</strong> <a href="' . admin_url('admin.php?page=pos-billing-settings') . '">Configura tu API</a>';
            echo '</div>';
        }
        
        echo '<div style="text-align: center;">';
        if (file_exists(POS_BILLING_PLUGIN_PATH . 'admin/invoices-page.php')) {
            echo '<a href="' . admin_url('admin.php?page=pos-billing-invoices') . '" class="button">📄 Ver Facturas</a> ';
        }
        echo '<a href="' . admin_url('admin.php?page=pos-billing-settings') . '" class="button">⚙️ Configuración</a>';
        echo '</div>';
    } catch (Exception $e) {
        echo '<p>Error cargando estadísticas: ' . esc_html($e->getMessage()) . '</p>';
    }
}

// Funciones auxiliares globales
if (!function_exists('pos_billing_is_configured')) {
    function pos_billing_is_configured() {
        $api_key = get_option('pos_billing_api_key', '');
        $secret_key = get_option('pos_billing_secret_key', '');
        return !empty($api_key) && !empty($secret_key);
    }
}

if (!function_exists('pos_billing_get_mode')) {
    function pos_billing_get_mode() {
        return get_option('pos_billing_sandbox_mode', true) ? 'sandbox' : 'production';
    }
}

if (!function_exists('pos_billing_format_currency')) {
    function pos_billing_format_currency($amount) {
        return '$' . number_format(floatval($amount), 2);
    }
}

if (!function_exists('pos_billing_generate_order_number')) {
    function pos_billing_generate_order_number() {
        return 'ORD-' . time() . '-' . wp_rand(100, 999);
    }
}