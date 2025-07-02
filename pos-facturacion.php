<?php
/**
 * Plugin Name: POS Facturación
 * Description: Plugin de facturación que se integra con sistemas POS existentes y la API de Factura.com para generar CFDIs válidos
 * Version: 2.0.0
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
define('POS_BILLING_VERSION', '2.0.0');
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
        'includes/class-pos-billing.php',
        'includes/class-database.php',
        'includes/class-invoice.php',
        'includes/class-api-handler.php',
        'includes/functions.php',
        'includes/shortcodes.php'
    );
    
    foreach ($required_files as $file) {
        $file_path = POS_BILLING_PLUGIN_PATH . $file;
        if (file_exists($file_path)) {
            require_once $file_path;
        } else {
            add_action('admin_notices', function() use ($file) {
                echo '<div class="notice notice-error"><p><strong>POS Facturación:</strong> Archivo requerido no encontrado: ' . $file . '</p></div>';
            });
        }
    }
    
    // Cargar archivos del admin solo si estamos en el admin
    if (is_admin()) {
        $admin_files = array(
            'admin/admin-page.php',
            'admin/settings-page.php'
        );
        
        foreach ($admin_files as $file) {
            $file_path = POS_BILLING_PLUGIN_PATH . $file;
            if (file_exists($file_path)) {
                require_once $file_path;
            }
        }
    }
}

// Cargar archivos
pos_billing_load_files();

// Hooks de activación y desactivación
register_activation_hook(__FILE__, 'pos_billing_activate');
register_deactivation_hook(__FILE__, 'pos_billing_deactivate');

function pos_billing_activate() {
    // Verificar versión de WordPress
    if (version_compare(get_bloginfo('version'), '5.0', '<')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die('Este plugin requiere WordPress 5.0 o superior.');
    }
    
    // Crear tablas de base de datos
    if (class_exists('POS_Billing_Database')) {
        POS_Billing_Database::create_tables();
    }
    
    // Configuraciones por defecto
    add_option('pos_billing_sandbox_mode', true);
    add_option('pos_billing_default_forma_pago', '01');
    add_option('pos_billing_default_metodo_pago', 'PUE');
    add_option('pos_billing_default_uso_cfdi', 'G01');
    
    // Limpiar rewrite rules
    flush_rewrite_rules();
    
    // Programar notificación de bienvenida
    set_transient('pos_billing_activation_notice', true, 30);
}

function pos_billing_deactivate() {
    flush_rewrite_rules();
    
    // Limpiar transients
    delete_transient('pos_billing_activation_notice');
}

// Cargar estilos y scripts
add_action('wp_enqueue_scripts', 'pos_billing_enqueue_scripts');

function pos_billing_enqueue_scripts() {
    // Solo cargar en páginas que contengan los shortcodes o donde sea necesario
    if (is_admin() || !is_singular()) {
        return;
    }
    
    global $post;
    if (!$post || (!has_shortcode($post->post_content, 'pos_billing_button') && !has_shortcode($post->post_content, 'pos_billing_module'))) {
        return;
    }
    
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
        'settings' => pos_billing_get_public_settings()
    ));
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

// Inicializar el plugin
add_action('plugins_loaded', function() {
    if (class_exists('POS_Billing')) {
        POS_Billing::init();
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

// Agregar enlace de configuración en la lista de plugins
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function($links) {
    $settings_link = '<a href="' . admin_url('admin.php?page=pos-billing-settings') . '">⚙️ Configuración</a>';
    array_unshift($links, $settings_link);
    return $links;
});

// Hook para actualizar la base de datos si es necesario
add_action('plugins_loaded', function() {
    $db_version = get_option('pos_billing_db_version', '1.0');
    if (version_compare($db_version, POS_BILLING_VERSION, '<')) {
        // Aquí puedes agregar actualizaciones de base de datos si es necesario
        update_option('pos_billing_db_version', POS_BILLING_VERSION);
    }
});

// Agregar información al footer del admin
add_filter('admin_footer_text', function($text) {
    $screen = get_current_screen();
    if ($screen && strpos($screen->id, 'pos-billing') !== false) {
        return 'POS Facturación v' . POS_BILLING_VERSION . ' | Desarrollado por <strong>BlackRubick</strong> 🚀';
    }
    return $text;
});