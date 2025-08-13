<?php
if (!defined('ABSPATH')) {
    exit;
}

// Shortcode que abre directamente el formulario embebido a pantalla completa
function pos_billing_button_shortcode($atts) {
    $atts = shortcode_atts(array(
        'text' => 'Facturación',
        'width' => '100%',
        'height' => '100vh' 
    ), $atts);
    
    $form_id = 'pos-billing-form-' . wp_rand(1000, 9999);
    
    return '
    <div id="' . $form_id . '" style="
        width: ' . esc_attr($atts['width']) . ';
        height: ' . esc_attr($atts['height']) . ';
        min-height: 800px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        margin: 20px 0;
        position: relative;
    ">
        <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
        ">
            <div style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            "></div>
            <p>Cargando formulario de facturación...</p>
        </div>
    </div>
    
    <style>
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    </style>
    
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        function iniciarFormularioEmbebido() {
            if (typeof abrirModuloFacturacionEmbebido === "function") {
                console.log("✅ Función encontrada, iniciando formulario embebido...");
                abrirModuloFacturacionEmbebido("' . $form_id . '");
            } else {
                console.log("⏳ Esperando a que se cargue la función...");
                setTimeout(iniciarFormularioEmbebido, 500);
            }
        }
        
        setTimeout(iniciarFormularioEmbebido, 100);
    });
    </script>';
}
add_shortcode('pos_billing_button', 'pos_billing_button_shortcode');

// Shortcode del módulo completo (sin cambios)
function pos_billing_module_shortcode($atts) {
    return '<div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
        <h2> Módulo de Facturación</h2>
        <p>Plugin funcionando correctamente</p>
    </div>';
}
add_shortcode('pos_billing_module', 'pos_billing_module_shortcode');