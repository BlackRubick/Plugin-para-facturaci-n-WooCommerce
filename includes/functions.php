<?php
if (!defined('ABSPATH')) {
    exit;
}

// Funciones auxiliares del plugin
function pos_billing_format_currency($amount) {
    return '$' . number_format($amount, 2);
}

function pos_billing_generate_invoice_number() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'pos_billing_invoices';
    $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name") + 1;
    return 'FAC-' . date('Y') . '-' . str_pad($count, 6, '0', STR_PAD_LEFT);
}
?>