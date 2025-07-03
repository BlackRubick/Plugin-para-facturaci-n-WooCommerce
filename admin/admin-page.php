<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'pos_billing_admin_menu');

function pos_billing_admin_menu() {
    add_menu_page(
        'POS Facturación',
        'POS Facturación', 
        'edit_posts', // Cambiado de 'manage_options' a 'edit_posts'
        'pos-billing',
        'pos_billing_admin_page',
        'dashicons-money-alt',
        30
    );
}

function pos_billing_admin_page() {
    // Verificar permisos de manera más flexible
    if (!current_user_can('edit_posts') && !current_user_can('manage_options')) {
        wp_die(__('No tienes permisos suficientes para acceder a esta página.'));
    }
    
    ?>
    <div class="wrap">
        <h1>POS Facturación</h1>
        
        <div class="notice notice-info">
            <p><strong>ℹ️ Estado del Usuario:</strong></p>
            <ul>
                <li>Usuario actual: <strong><?php echo wp_get_current_user()->display_name; ?></strong></li>
                <li>Rol: <strong><?php echo implode(', ', wp_get_current_user()->roles); ?></strong></li>
                <li>Puede editar posts: <?php echo current_user_can('edit_posts') ? '✅ Sí' : '❌ No'; ?></li>
                <li>Puede gestionar opciones: <?php echo current_user_can('manage_options') ? '✅ Sí' : '❌ No'; ?></li>
            </ul>
        </div>
        
        <p>¡Plugin activado correctamente!</p>
        
        <div class="card" style="max-width: none; padding: 20px;">
            <h2>🚀 Empezar a usar el plugin</h2>
            
            <?php if (!current_user_can('manage_options')): ?>
                <div class="notice notice-warning">
                    <p><strong>⚠️ Nota:</strong> Para configurar las credenciales de la API necesitas permisos de administrador. Contacta al administrador del sitio.</p>
                </div>
            <?php endif; ?>
            
            <h3>📋 Shortcodes disponibles:</h3>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Shortcode</th>
                        <th>Descripción</th>
                        <th>Ejemplo de uso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>[pos_billing_button]</code></td>
                        <td>Botón básico de facturación</td>
                        <td>Colócalo en cualquier página o entrada</td>
                    </tr>
                    <tr>
                        <td><code>[pos_billing_button text="Mi Botón"]</code></td>
                        <td>Botón personalizado</td>
                        <td>Cambia el texto del botón</td>
                    </tr>
                    <tr>
                        <td><code>[pos_billing_module]</code></td>
                        <td>Módulo completo embebido</td>
                        <td>Información del plugin</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>🧪 Probar el shortcode</h3>
            <p>Puedes probar el botón aquí mismo:</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                <?php echo do_shortcode('[pos_billing_button text="Probar Facturación"]'); ?>
            </div>
            
            <h3>📚 Cómo usar</h3>
            <ol>
                <li><strong>Configurar API:</strong> <?php if (current_user_can('manage_options')): ?><a href="<?php echo admin_url('admin.php?page=pos-billing-settings'); ?>">Ve a Configuración</a><?php else: ?>Solicita al administrador configurar las credenciales<?php endif; ?></li>
                <li><strong>Insertar shortcode:</strong> Copia <code>[pos_billing_button]</code> en cualquier página</li>
                <li><strong>Ver facturas:</strong> <a href="<?php echo admin_url('admin.php?page=pos-billing-invoices'); ?>">Revisar facturas generadas</a></li>
            </ol>
        </div>
    </div>
    
    <style>
    .card {
        background: white;
        border: 1px solid #ccd0d4;
        border-radius: 4px;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
        padding: 20px;
        margin-top: 20px;
    }
    </style>
    <?php
}
?>