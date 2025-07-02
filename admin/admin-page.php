<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'pos_billing_admin_menu');

function pos_billing_admin_menu() {
    add_menu_page(
        'POS Facturación',
        'POS Facturación', 
        'manage_options',
        'pos-billing',
        'pos_billing_admin_page',
        'dashicons-money-alt',
        30
    );
}

function pos_billing_admin_page() {
    ?>
    <div class="wrap">
        <h1>POS Facturación</h1>
        <p>¡Plugin activado correctamente!</p>
        <h2>Shortcodes disponibles:</h2>
        <p><code>[pos_billing_button text="Facturación"]</code></p>
        <p><code>[pos_billing_module]</code></p>
    </div>
    <?php
}
?>