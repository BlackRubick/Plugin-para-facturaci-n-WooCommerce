<?php
/**
 * Página de configuración del plugin en el admin - PERMISOS CORREGIDOS
 */

if (!defined('ABSPATH')) {
    exit;
}

// Agregar subpágina de configuración
add_action('admin_menu', 'pos_billing_settings_menu');

function pos_billing_settings_menu() {
    add_submenu_page(
        'pos-billing',
        'Configuración API',
        'Configuración',
        'edit_posts', // Cambiado de 'manage_options' a 'edit_posts'
        'pos-billing-settings',
        'pos_billing_settings_page'
    );
}

function pos_billing_settings_page() {
    // Verificar permisos - solo admin puede cambiar configuración API
    $can_edit_settings = current_user_can('manage_options');
    
    // Mostrar información para todos los usuarios, pero solo permitir edición a admins
    if (!current_user_can('edit_posts')) {
        wp_die(__('No tienes permisos suficientes para acceder a esta página.'));
    }
    
    // Guardar configuraciones si se envió el formulario Y tiene permisos
    if ($can_edit_settings && isset($_POST['submit']) && check_admin_referer('pos_billing_settings_nonce')) {
        update_option('pos_billing_api_key', sanitize_text_field($_POST['api_key']));
        update_option('pos_billing_secret_key', sanitize_text_field($_POST['secret_key']));
        update_option('pos_billing_sandbox_mode', isset($_POST['sandbox_mode']) ? 1 : 0);
        update_option('pos_billing_default_serie', sanitize_text_field($_POST['default_serie']));
        update_option('pos_billing_default_forma_pago', sanitize_text_field($_POST['default_forma_pago']));
        update_option('pos_billing_default_metodo_pago', sanitize_text_field($_POST['default_metodo_pago']));
        update_option('pos_billing_default_uso_cfdi', sanitize_text_field($_POST['default_uso_cfdi']));
        update_option('pos_billing_lugar_expedicion', sanitize_text_field($_POST['lugar_expedicion']));
        
        echo '<div class="notice notice-success"><p>✅ Configuración guardada correctamente</p></div>';
    }
    
    // Obtener configuraciones actuales
    $api_key = get_option('pos_billing_api_key', '');
    $secret_key = get_option('pos_billing_secret_key', '');
    $sandbox_mode = get_option('pos_billing_sandbox_mode', true);
    $default_serie = get_option('pos_billing_default_serie', '');
    $default_forma_pago = get_option('pos_billing_default_forma_pago', '01');
    $default_metodo_pago = get_option('pos_billing_default_metodo_pago', 'PUE');
    $default_uso_cfdi = get_option('pos_billing_default_uso_cfdi', 'G01');
    $lugar_expedicion = get_option('pos_billing_lugar_expedicion', '');
    
    // Verificar estado de la configuración
    $api_configured = !empty($api_key) && !empty($secret_key);
    ?>
    
    <div class="wrap">
        <h1>⚙️ Configuración POS Facturación</h1>
        
        <div class="notice notice-info">
            <p><strong>ℹ️ Estado del Usuario:</strong></p>
            <ul>
                <li>Usuario: <strong><?php echo wp_get_current_user()->display_name; ?></strong></li>
                <li>Rol: <strong><?php echo implode(', ', wp_get_current_user()->roles); ?></strong></li>
                <li>Puede ver configuración: <?php echo current_user_can('edit_posts') ? '✅ Sí' : '❌ No'; ?></li>
                <li>Puede editar configuración: <?php echo $can_edit_settings ? '✅ Sí' : '❌ No'; ?></li>
            </ul>
        </div>
        
        <?php if (!$can_edit_settings): ?>
        <div class="notice notice-warning">
            <p><strong>⚠️ Solo lectura:</strong> Solo los administradores pueden modificar la configuración de la API. Contacta al administrador del sitio para cambiar estos valores.</p>
        </div>
        <?php endif; ?>
        
        <div class="card" style="max-width: none;">
            <h2>Estado de la Configuración</h2>
            <table class="form-table">
                <tr>
                    <th>Estado de la API:</th>
                    <td>
                        <?php if ($api_configured): ?>
                            <span style="color: #46b450; font-weight: bold;">✅ Configurada</span>
                        <?php else: ?>
                            <span style="color: #dc3232; font-weight: bold;">❌ Sin configurar</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <tr>
                    <th>Modo:</th>
                    <td>
                        <span style="color: <?php echo $sandbox_mode ? '#ff8c00' : '#46b450'; ?>; font-weight: bold;">
                            <?php echo $sandbox_mode ? '🧪 Sandbox (Pruebas)' : '🚀 Producción'; ?>
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>URL de la API:</th>
                    <td>
                        <code><?php echo $sandbox_mode ? 'https://sandbox.factura.com/api' : 'https://api.factura.com'; ?></code>
                    </td>
                </tr>
            </table>
        </div>
        
        <?php if (!$api_configured): ?>
        <div class="notice notice-warning">
            <p><strong>⚠️ Configuración requerida:</strong> Para usar el plugin, debes configurar tus credenciales de la API de Factura.com.</p>
            <p>📋 <strong>Cómo obtener las credenciales:</strong></p>
            <ol>
                <li>Regístrate en <a href="https://sandbox.factura.com" target="_blank">Factura.com</a></li>
                <li>Ve a tu panel de control</li>
                <li>Busca la sección "API" o "Desarrolladores"</li>
                <li>Copia tu API Key y Secret Key</li>
            </ol>
        </div>
        <?php endif; ?>
        
        <form method="post" action="">
            <?php wp_nonce_field('pos_billing_settings_nonce'); ?>
            
            <div class="card">
                <h2>🔑 Credenciales de la API</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="api_key">API Key</label>
                        </th>
                        <td>
                            <input type="text" id="api_key" name="api_key" 
                                   value="<?php echo esc_attr($api_key); ?>" 
                                   class="regular-text" 
                                   <?php echo $can_edit_settings ? 'required' : 'readonly'; ?>
                                   placeholder="<?php echo $can_edit_settings ? 'Tu API Key de Factura.com' : 'Solo administradores pueden ver/editar'; ?>">
                            <p class="description">Tu API Key de Factura.com</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="secret_key">Secret Key</label>
                        </th>
                        <td>
                            <input type="<?php echo $can_edit_settings ? 'password' : 'text'; ?>" 
                                   id="secret_key" name="secret_key" 
                                   value="<?php echo esc_attr($can_edit_settings ? $secret_key : ($secret_key ? str_repeat('*', 20) : 'No configurado')); ?>" 
                                   class="regular-text" 
                                   <?php echo $can_edit_settings ? 'required' : 'readonly'; ?>
                                   placeholder="<?php echo $can_edit_settings ? 'Tu Secret Key de Factura.com' : 'Solo administradores pueden ver/editar'; ?>">
                            <p class="description">Tu Secret Key de Factura.com</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Modo de operación</th>
                        <td>
                            <label for="sandbox_mode">
                                <input type="checkbox" id="sandbox_mode" name="sandbox_mode" 
                                       value="1" <?php checked($sandbox_mode, 1); ?>
                                       <?php echo $can_edit_settings ? '' : 'disabled'; ?>>
                                Modo Sandbox (Pruebas)
                            </label>
                            <p class="description">Desactiva esta opción solo cuando estés listo para producción</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="card">
                <h2>⚙️ Configuraciones por Defecto</h2>
                <p>Estos valores se pre-cargarán en el formulario de facturación:</p>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="default_serie">Serie por Defecto</label>
                        </th>
                        <td>
                            <input type="number" id="default_serie" name="default_serie" 
                                   value="<?php echo esc_attr($default_serie); ?>" 
                                   class="small-text"
                                   <?php echo $can_edit_settings ? '' : 'readonly'; ?>>
                            <p class="description">ID de la serie configurada en Factura.com</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="default_forma_pago">Forma de Pago por Defecto</label>
                        </th>
                        <td>
                            <select id="default_forma_pago" name="default_forma_pago" <?php echo $can_edit_settings ? '' : 'disabled'; ?>>
                                <option value="01" <?php selected($default_forma_pago, '01'); ?>>01 - Efectivo</option>
                                <option value="02" <?php selected($default_forma_pago, '02'); ?>>02 - Cheque nominativo</option>
                                <option value="03" <?php selected($default_forma_pago, '03'); ?>>03 - Transferencia electrónica</option>
                                <option value="04" <?php selected($default_forma_pago, '04'); ?>>04 - Tarjeta de crédito</option>
                                <option value="28" <?php selected($default_forma_pago, '28'); ?>>28 - Tarjeta de débito</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="default_metodo_pago">Método de Pago por Defecto</label>
                        </th>
                        <td>
                            <select id="default_metodo_pago" name="default_metodo_pago" <?php echo $can_edit_settings ? '' : 'disabled'; ?>>
                                <option value="PUE" <?php selected($default_metodo_pago, 'PUE'); ?>>PUE - Pago en una exhibición</option>
                                <option value="PPD" <?php selected($default_metodo_pago, 'PPD'); ?>>PPD - Pago en parcialidades</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="default_uso_cfdi">Uso de CFDI por Defecto</label>
                        </th>
                        <td>
                            <select id="default_uso_cfdi" name="default_uso_cfdi" <?php echo $can_edit_settings ? '' : 'disabled'; ?>>
                                <option value="G01" <?php selected($default_uso_cfdi, 'G01'); ?>>G01 - Adquisición de mercancías</option>
                                <option value="G02" <?php selected($default_uso_cfdi, 'G02'); ?>>G02 - Devoluciones, descuentos</option>
                                <option value="G03" <?php selected($default_uso_cfdi, 'G03'); ?>>G03 - Gastos en general</option>
                                <option value="P01" <?php selected($default_uso_cfdi, 'P01'); ?>>P01 - Por definir</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="lugar_expedicion">Lugar de Expedición</label>
                        </th>
                        <td>
                            <input type="text" id="lugar_expedicion" name="lugar_expedicion" 
                                   value="<?php echo esc_attr($lugar_expedicion); ?>" 
                                   class="small-text" maxlength="5"
                                   <?php echo $can_edit_settings ? '' : 'readonly'; ?>>
                            <p class="description">Código postal donde se expiden las facturas (5 dígitos)</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <?php if ($can_edit_settings): ?>
                <?php submit_button('💾 Guardar Configuración'); ?>
            <?php else: ?>
                <p class="description">
                    <em>🔒 Solo los administradores pueden modificar esta configuración. Contacta al administrador del sitio para realizar cambios.</em>
                </p>
            <?php endif; ?>
        </form>
        
        <div class="card">
            <h2>🧪 Probar Conexión</h2>
            <p>Una vez configuradas las credenciales, puedes probar la conexión:</p>
            <button type="button" id="test-connection" class="button button-secondary" 
                    <?php echo $api_configured ? '' : 'disabled'; ?>>
                🔍 Probar Conexión con la API
            </button>
            <div id="test-result" style="margin-top: 10px;"></div>
        </div>
        
        <div class="card">
            <h2>📚 Shortcodes Disponibles</h2>
            <table class="wp-list-table widefat striped">
                <thead>
                    <tr>
                        <th>Shortcode</th>
                        <th>Descripción</th>
                        <th>Uso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>[pos_billing_button]</code></td>
                        <td>Botón para abrir el módulo de facturación</td>
                        <td>Coloca este shortcode donde quieras que aparezca el botón</td>
                    </tr>
                    <tr>
                        <td><code>[pos_billing_button text="Mi Botón"]</code></td>
                        <td>Botón personalizado</td>
                        <td>Cambia el texto del botón</td>
                    </tr>
                    <tr>
                        <td><code>[pos_billing_module]</code></td>
                        <td>Módulo completo embebido</td>
                        <td>Muestra información del plugin</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
    document.getElementById('test-connection').addEventListener('click', function() {
        const button = this;
        const result = document.getElementById('test-result');
        
        button.disabled = true;
        button.textContent = '⏳ Probando...';
        result.innerHTML = '';
        
        fetch(ajaxurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=pos_billing_test_connection&nonce=' + '<?php echo wp_create_nonce('pos_billing_test'); ?>'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                result.innerHTML = '<div class="notice notice-success inline"><p>✅ ' + data.data.message + '</p></div>';
            } else {
                result.innerHTML = '<div class="notice notice-error inline"><p>❌ ' + data.data + '</p></div>';
            }
        })
        .catch(error => {
            result.innerHTML = '<div class="notice notice-error inline"><p>❌ Error de conexión: ' + error.message + '</p></div>';
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = '🔍 Probar Conexión con la API';
        });
    });
    </script>
    
    <?php
}

// Agregar acción AJAX para probar conexión - con permisos más flexibles
add_action('wp_ajax_pos_billing_test_connection', 'pos_billing_test_connection_ajax');

function pos_billing_test_connection_ajax() {
    if (!check_ajax_referer('pos_billing_test', 'nonce', false)) {
        wp_send_json_error('Error de seguridad');
        return;
    }
    
    // Permitir a usuarios con capacidad de editar posts
    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Sin permisos');
        return;
    }
    
    // Aquí podrías hacer una petición de prueba a la API
    // Por ahora solo verificamos que las credenciales estén configuradas
    $api_key = get_option('pos_billing_api_key', '');
    $secret_key = get_option('pos_billing_secret_key', '');
    
    if (empty($api_key) || empty($secret_key)) {
        wp_send_json_error('API Key o Secret Key no configurados');
        return;
    }
    
    wp_send_json_success(array(
        'message' => 'Credenciales configuradas correctamente. La conexión con la API será probada cuando generes tu primer CFDI.'
    ));
}