<?php
if (!defined('ABSPATH')) {
    exit;
}

class POS_Billing_Database {
    
    public static function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        // Verificar si la tabla ya existe
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name) {
            return true;
        }
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            invoice_number varchar(50) NOT NULL,
            uuid varchar(100) DEFAULT '',
            customer_name varchar(255) NOT NULL,
            customer_email varchar(255),
            customer_rfc varchar(20),
            customer_address text,
            subtotal decimal(12,6) NOT NULL,
            tax decimal(12,6) NOT NULL,
            total decimal(12,6) NOT NULL,
            items longtext NOT NULL,
            status varchar(20) DEFAULT 'pending',
            api_response longtext,
            error_message text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        
        try {
            dbDelta($sql);
            
            // Verificar si la tabla se creó correctamente
            if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
                if (WP_DEBUG) {
                    error_log('POS Billing - Error: No se pudo crear la tabla ' . $table_name);
                }
                return false;
            }
            
            return true;
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error creando tabla: ' . $e->getMessage());
            }
            return false;
        }
    }
    
    /**
     * Actualizar esquema de base de datos si es necesario
     */
    public static function update_database() {
        $current_version = get_option('pos_billing_db_version', '1.0');
        
        if (version_compare($current_version, '2.0', '<')) {
            // Forzar recreación de tabla con nuevo esquema
            self::create_tables();
            update_option('pos_billing_db_version', '2.0');
        }
    }
    
    /**
     * Obtener facturas con paginación
     */
    public static function get_invoices($limit = 20, $offset = 0, $status = null) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        // Verificar que la tabla existe
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            return array();
        }
        
        try {
            $where_clause = '';
            if (!empty($status)) {
                $where_clause = $wpdb->prepare(" WHERE status = %s", $status);
            }
            
            $sql = $wpdb->prepare(
                "SELECT * FROM $table_name $where_clause ORDER BY created_at DESC LIMIT %d OFFSET %d",
                $limit,
                $offset
            );
            
            return $wpdb->get_results($sql);
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error obteniendo facturas: ' . $e->getMessage());
            }
            return array();
        }
    }
    
    /**
     * Obtener una factura por UUID
     */
    public static function get_invoice_by_uuid($uuid) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        try {
            return $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM $table_name WHERE uuid = %s",
                $uuid
            ));
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error obteniendo factura por UUID: ' . $e->getMessage());
            }
            return null;
        }
    }
    
    /**
     * Obtener estadísticas de facturas
     */
    public static function get_invoice_stats() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        // Verificar que la tabla existe
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
            return array(
                'total_invoices' => 0,
                'total_amount' => 0,
                'this_month' => 0,
                'by_status' => array()
            );
        }
        
        try {
            $stats = array();
            
            // Total de facturas
            $stats['total_invoices'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
            
            // Total facturado
            $total_amount = $wpdb->get_var("SELECT SUM(total) FROM $table_name WHERE status = 'completed'");
            $stats['total_amount'] = floatval($total_amount);
            
            // Facturas por estatus
            $status_counts = $wpdb->get_results("SELECT status, COUNT(*) as count FROM $table_name GROUP BY status");
            $stats['by_status'] = array();
            foreach ($status_counts as $row) {
                $stats['by_status'][$row->status] = (int) $row->count;
            }
            
            // Facturas del mes actual
            $this_month = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM $table_name WHERE MONTH(created_at) = %d AND YEAR(created_at) = %d",
                date('n'),
                date('Y')
            ));
            $stats['this_month'] = (int) $this_month;
            
            return $stats;
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error obteniendo estadísticas: ' . $e->getMessage());
            }
            return array(
                'total_invoices' => 0,
                'total_amount' => 0,
                'this_month' => 0,
                'by_status' => array()
            );
        }
    }
    
    /**
     * Actualizar estado de una factura
     */
    public static function update_invoice_status($id, $status, $error_message = null) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        try {
            $data = array('status' => $status);
            
            if (!empty($error_message)) {
                $data['error_message'] = $error_message;
            }
            
            return $wpdb->update(
                $table_name,
                $data,
                array('id' => $id),
                array('%s', '%s'),
                array('%d')
            );
        } catch (Exception $e) {
            if (WP_DEBUG) {
                error_log('POS Billing - Error actualizando estado: ' . $e->getMessage());
            }
            return false;
        }
    }
}
?>