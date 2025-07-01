<?php
if (!defined('ABSPATH')) {
    exit;
}

// Shortcode simple sin JavaScript embebido
function pos_billing_button_shortcode($atts) {
    $atts = shortcode_atts(array(
        'text' => 'Facturación'
    ), $atts);
    
    $button_html = '<button id="pos-billing-btn" class="pos-billing-btn" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        margin: 10px 0;
    ">📄 ' . esc_html($atts['text']) . '</button>';
    
    return $button_html;
}
add_shortcode('pos_billing_button', 'pos_billing_button_shortcode');

// Shortcode del módulo completo
function pos_billing_module_shortcode($atts) {
    return '<div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h2>📄 Módulo de Facturación</h2>
        <p>Plugin funcionando correctamente</p>
    </div>';
}
add_shortcode('pos_billing_module', 'pos_billing_module_shortcode');
?>