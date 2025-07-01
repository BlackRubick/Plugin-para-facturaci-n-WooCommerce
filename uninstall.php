<?php
/**
 * Script de desinstalación del plugin POS Facturación
 */

// Si no se está desinstalando, salir
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Eliminar tablas de la base de datos
global $wpdb;

$table_name = $wpdb->prefix . 'pos_billing_invoices';
$wpdb->query("DROP TABLE IF EXISTS $table_name");

// Eliminar opciones del plugin
delete_option('pos_billing_options');
delete_option('pos_billing_version');

// Limpiar caché
wp_cache_flush();
