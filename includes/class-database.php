<?php
if (!defined('ABSPATH')) {
    exit;
}

class POS_Billing_Database {
    
    public static function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'pos_billing_invoices';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            invoice_number varchar(50) NOT NULL,
            customer_name varchar(255) NOT NULL,
            customer_email varchar(255),
            customer_rfc varchar(20),
            customer_address text,
            subtotal decimal(10,2) NOT NULL,
            tax decimal(10,2) NOT NULL,
            total decimal(10,2) NOT NULL,
            items text NOT NULL,
            status varchar(20) DEFAULT 'pending',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
?>