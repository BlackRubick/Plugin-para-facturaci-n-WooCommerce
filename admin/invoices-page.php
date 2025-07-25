<?php

/**
 * Página para mostrar las facturas generadas
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'pos_billing_invoices_menu');

function pos_billing_invoices_menu()
{
    add_submenu_page(
        'pos-billing',
        'Facturas Generadas',
        'Facturas',
        'edit_posts',
        'pos-billing-invoices',
        'pos_billing_invoices_page'
    );
}

function pos_billing_invoices_page()
{
    if (!current_user_can('edit_posts')) {
        wp_die(__('No tienes permisos suficientes para acceder a esta página.'));
    }

    if (isset($_GET['action']) && $_GET['action'] === 'view' && isset($_GET['id'])) {
        pos_billing_show_invoice_detail($_GET['id']);
        return;
    }

    $page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
    $per_page = 20;
    $offset = ($page - 1) * $per_page;

    if (!class_exists('POS_Billing_Database')) {
        echo '<div class="wrap"><h1>📄 Facturas Generadas</h1>';
        echo '<div class="notice notice-error"><p>❌ Error: No se pudo cargar la clase de base de datos. Contacta al administrador.</p></div>';
        echo '</div>';
        return;
    }

    try {
        $invoices = POS_Billing_Database::get_invoices($per_page, $offset);
        $stats = POS_Billing_Database::get_invoice_stats();
    } catch (Exception $e) {
        echo '<div class="wrap"><h1>📄 Facturas Generadas</h1>';
        echo '<div class="notice notice-error"><p>❌ Error al cargar datos: ' . esc_html($e->getMessage()) . '</p></div>';
        echo '</div>';
        return;
    }

?>
    <div class="wrap">
        <h1> Facturas Generadas</h1>

        <div class="notice notice-info">
            <p><strong> Estado del Usuario:</strong></p>
            <ul>
                <li>Usuario: <strong><?php echo wp_get_current_user()->display_name; ?></strong></li>
                <li>Rol: <strong><?php echo implode(', ', wp_get_current_user()->roles); ?></strong></li>
                <li>Puede ver facturas: <?php echo current_user_can('edit_posts') ? '✅ Sí' : '❌ No'; ?></li>
                <li>Puede gestionar opciones: <?php echo current_user_can('manage_options') ? '✅ Sí' : '❌ No'; ?></li>
            </ul>
        </div>

        <!-- Estadísticas -->
        <div class="pos-billing-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="card" style="padding: 20px; text-align: center;">
                <h3 style="margin: 0; color: #667eea;">Total Facturas</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0;"><?php echo number_format($stats['total_invoices']); ?></p>
            </div>
            <div class="card" style="padding: 20px; text-align: center;">
                <h3 style="margin: 0; color: #28a745;">Total Facturado</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">$<?php echo number_format($stats['total_amount'], 2); ?></p>
            </div>
            <div class="card" style="padding: 20px; text-align: center;">
                <h3 style="margin: 0; color: #17a2b8;">Este Mes</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0 0 0;"><?php echo number_format($stats['this_month']); ?></p>
            </div>
        </div>

        <!-- Tabla de facturas -->
        <div class="card">
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>UUID</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($invoices)): ?>
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 40px;">
                                <p> No hay facturas generadas aún.</p>
                                <p><a href="<?php echo admin_url('admin.php?page=pos-billing'); ?>" class="button button-primary">Generar Primera Factura</a></p>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($invoices as $invoice): ?>
                            <tr>
                                <td><strong><?php echo esc_html($invoice->invoice_number); ?></strong></td>
                                <td>
                                    <code style="font-size: 11px;">
                                        <?php echo esc_html(substr($invoice->uuid, 0, 20) . '...'); ?>
                                    </code>
                                </td>
                                <td><?php echo esc_html($invoice->customer_name); ?></td>
                                <td><strong>$<?php echo number_format($invoice->total, 2); ?></strong></td>
                                <td>
                                    <?php
                                    $status_colors = array(
                                        'completed' => '#28a745',
                                        'pending' => '#ffc107',
                                        'error' => '#dc3545'
                                    );
                                    $status_labels = array(
                                        'completed' => '✅ Completado',
                                        'pending' => '⏳ Pendiente',
                                        'error' => '❌ Error'
                                    );
                                    $color = $status_colors[$invoice->status] ?? '#6c757d';
                                    $label = $status_labels[$invoice->status] ?? $invoice->status;
                                    ?>
                                    <span style="color: <?php echo $color; ?>; font-weight: bold;">
                                        <?php echo $label; ?>
                                    </span>
                                </td>
                                <td>
                                    <?php echo date('d/m/Y H:i', strtotime($invoice->created_at)); ?>
                                </td>
                                <td>
                                    <a href="<?php echo admin_url('admin.php?page=pos-billing-invoices&action=view&id=' . $invoice->id); ?>"
                                        class="button button-small">👁️ Ver</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php if (!empty($invoices)): ?>
            <div style="margin-top: 20px; text-align: center;">
                <?php if ($page > 1): ?>
                    <a href="<?php echo admin_url('admin.php?page=pos-billing-invoices&paged=' . ($page - 1)); ?>"
                        class="button">← Anterior</a>
                <?php endif; ?>

                <?php if (count($invoices) == $per_page): ?>
                    <a href="<?php echo admin_url('admin.php?page=pos-billing-invoices&paged=' . ($page + 1)); ?>"
                        class="button">Siguiente →</a>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="card" style="margin-top: 30px;">
            <h2>🚀 Empezar a Facturar</h2>
            <p>¿No tienes facturas aún? ¡Es muy fácil empezar!</p>
            <ol>
                <li><strong>Configura la API:</strong>
                    <?php if (current_user_can('manage_options')): ?>
                        <a href="<?php echo admin_url('admin.php?page=pos-billing-settings'); ?>">Ve a Configuración</a>
                    <?php else: ?>
                        Solicita al administrador configurar las credenciales
                    <?php endif; ?>
                </li>
                <li><strong>Usa el shortcode:</strong> Agrega <code>[pos_billing_button]</code> en cualquier página</li>
                <li><strong>Genera facturas:</strong> Haz clic en el botón y completa el formulario</li>
            </ol>
            <p>
                <a href="<?php echo admin_url('admin.php?page=pos-billing'); ?>" class="button button-primary">📄 Ir al Panel Principal</a>
                <?php if (current_user_can('manage_options')): ?>
                    <a href="<?php echo admin_url('admin.php?page=pos-billing-settings'); ?>" class="button">⚙️ Configuración</a>
                <?php endif; ?>
            </p>
        </div>
    </div>

    <style>
        .card {
            background: white;
            border: 1px solid #ccd0d4;
            border-radius: 4px;
            box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
        }

        .pos-billing-stats .card {
            border-left: 4px solid #667eea;
        }
    </style>
<?php
}

function pos_billing_show_invoice_detail($invoice_id)
{
    global $wpdb;

    // Verificar permisos
    if (!current_user_can('edit_posts')) {
        wp_die(__('No tienes permisos suficientes para acceder a esta página.'));
    }

    $table_name = $wpdb->prefix . 'pos_billing_invoices';
    $invoice = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $invoice_id
    ));

    if (!$invoice) {
        echo '<div class="wrap"><h1>Factura no encontrada</h1><p><a href="' . admin_url('admin.php?page=pos-billing-invoices') . '">← Volver</a></p></div>';
        return;
    }

    $api_response = json_decode($invoice->api_response, true);
    $items = json_decode($invoice->items, true);

?>
    <div class="wrap">
        <h1> Detalle de Factura</h1>
        <p><a href="<?php echo admin_url('admin.php?page=pos-billing-invoices'); ?>">← Volver a Facturas</a></p>

        <div class="notice notice-info">
            <p><strong>Usuario:</strong> <?php echo wp_get_current_user()->display_name; ?> |
                <strong>Permisos:</strong> <?php echo current_user_can('manage_options') ? 'Administrador' : 'Editor'; ?>
            </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <!-- Información básica -->
            <div class="card" style="padding: 20px;">
                <h2>Información General</h2>
                <table class="form-table">
                    <tr>
                        <th>Folio:</th>
                        <td><strong><?php echo esc_html($invoice->invoice_number); ?></strong></td>
                    </tr>
                    <tr>
                        <th>UUID:</th>
                        <td><code><?php echo esc_html($invoice->uuid); ?></code></td>
                    </tr>
                    <tr>
                        <th>Estado:</th>
                        <td>
                            <?php
                            $status_colors = array(
                                'completed' => '#28a745',
                                'pending' => '#ffc107',
                                'error' => '#dc3545'
                            );
                            $status_labels = array(
                                'completed' => '✅ Completado',
                                'pending' => '⏳ Pendiente',
                                'error' => '❌ Error'
                            );
                            $color = $status_colors[$invoice->status] ?? '#6c757d';
                            $label = $status_labels[$invoice->status] ?? $invoice->status;
                            ?>
                            <span style="color: <?php echo $color; ?>; font-weight: bold;">
                                <?php echo $label; ?>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>Cliente:</th>
                        <td><?php echo esc_html($invoice->customer_name); ?></td>
                    </tr>
                    <tr>
                        <th>Subtotal:</th>
                        <td>$<?php echo number_format($invoice->subtotal, 2); ?></td>
                    </tr>
                    <tr>
                        <th>Impuestos:</th>
                        <td>$<?php echo number_format($invoice->tax, 2); ?></td>
                    </tr>
                    <tr>
                        <th>Total:</th>
                        <td><strong>$<?php echo number_format($invoice->total, 2); ?></strong></td>
                    </tr>
                    <tr>
                        <th>Fecha:</th>
                        <td><?php echo date('d/m/Y H:i:s', strtotime($invoice->created_at)); ?></td>
                    </tr>
                </table>
            </div>

            <!-- Datos del SAT -->
            <?php if ($api_response && isset($api_response['SAT'])): ?>
                <div class="card" style="padding: 20px;">
                    <h2>Información del SAT</h2>
                    <table class="form-table">
                        <tr>
                            <th>Fecha Timbrado:</th>
                            <td><?php echo esc_html($api_response['SAT']['FechaTimbrado'] ?? 'N/A'); ?></td>
                        </tr>
                        <tr>
                            <th>No. Certificado SAT:</th>
                            <td><?php echo esc_html($api_response['SAT']['NoCertificadoSAT'] ?? 'N/A'); ?></td>
                        </tr>
                        <tr>
                            <th>Versión:</th>
                            <td><?php echo esc_html($api_response['SAT']['Version'] ?? 'N/A'); ?></td>
                        </tr>
                        <tr>
                            <th>Sello SAT:</th>
                            <td>
                                <textarea readonly rows="3" style="width: 100%; font-family: monospace; font-size: 11px;">
<?php echo esc_textarea(substr($api_response['SAT']['SelloSAT'] ?? '', 0, 200) . '...'); ?>
                            </textarea>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>
        </div>

        <!-- Conceptos/Items -->
        <?php if (!empty($items)): ?>
            <div class="card" style="margin-top: 30px; padding: 20px;">
                <h2>Conceptos Facturados</h2>
                <table class="wp-list-table widefat striped">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Descuento</th>
                            <th>Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($items as $item): ?>
                            <tr>
                                <td>
                                    <strong><?php echo esc_html($item['Descripcion'] ?? 'N/A'); ?></strong>
                                    <?php if (!empty($item['ClaveProdServ'])): ?>
                                        <br><small>Clave: <?php echo esc_html($item['ClaveProdServ']); ?></small>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo esc_html($item['Cantidad'] ?? '0'); ?></td>
                                <td>$<?php echo number_format(floatval($item['ValorUnitario'] ?? 0), 2); ?></td>
                                <td>$<?php echo number_format(floatval($item['Descuento'] ?? 0), 2); ?></td>
                                <td><strong>$<?php echo number_format(floatval($item['Importe'] ?? 0), 2); ?></strong></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

        <?php if (current_user_can('administrator') && WP_DEBUG && $api_response): ?>
            <div class="card" style="margin-top: 30px; padding: 20px;">
                <h2>Respuesta de la API (Debug - Solo Administradores)</h2>
                <textarea readonly rows="10" style="width: 100%; font-family: monospace; font-size: 11px;">
<?php echo esc_textarea(json_encode($api_response, JSON_PRETTY_PRINT)); ?>
            </textarea>
            </div>
        <?php endif; ?>
    </div>
<?php
}
