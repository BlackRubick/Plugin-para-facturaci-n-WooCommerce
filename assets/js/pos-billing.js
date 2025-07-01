// Funcionalidad del botón de facturación
document.addEventListener('DOMContentLoaded', function() {
    // Buscar el botón de facturación
    const billingBtn = document.getElementById('pos-billing-btn');
    
    if (billingBtn) {
        billingBtn.addEventListener('click', function() {
            abrirModuloFacturacion();
        });
        
        // Efecto hover
        billingBtn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        });
        
        billingBtn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        });
    }
});

function abrirModuloFacturacion() {
    const popup = window.open('', 'facturacion', 'width=1000,height=700,scrollbars=yes,resizable=yes');
    
    if (popup) {
        popup.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Sistema de Facturación</title>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            max-width: 900px; 
            margin: 0 auto; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #eee; 
            padding-bottom: 20px; 
        }
        .form-group { 
            margin-bottom: 15px; 
        }
        .form-group label { 
            display: block; 
            margin-bottom: 5px; 
            font-weight: bold; 
            color: #333; 
        }
        .form-group input, .form-group textarea { 
            width: 100%; 
            padding: 10px; 
            border: 1px solid #ddd; 
            border-radius: 5px; 
            box-sizing: border-box; 
            font-size: 14px; 
        }
        .form-row { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
        }
        .btn { 
            padding: 12px 24px; 
            background: #28a745; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 5px; 
            font-size: 16px; 
        }
        .btn:hover { 
            background: #218838; 
        }
        .btn-cancel { 
            background: #6c757d; 
        }
        .btn-cancel:hover { 
            background: #545b62; 
        }
        .btn-add { 
            background: #007bff; 
        }
        .btn-add:hover { 
            background: #0056b3; 
        }
        .btn-remove { 
            background: #dc3545; 
            color: white; 
            border: none; 
            border-radius: 50%; 
            width: 25px; 
            height: 25px; 
            cursor: pointer; 
            position: absolute; 
            top: 10px; 
            right: 10px; 
        }
        .totals { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 5px; 
            margin: 20px 0; 
        }
        .total-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 10px; 
            font-size: 16px; 
        }
        .total-final { 
            font-weight: bold; 
            font-size: 18px; 
            border-top: 2px solid #333; 
            padding-top: 10px; 
            color: #28a745; 
        }
        .producto-row { 
            display: grid; 
            grid-template-columns: 2fr 1fr 1fr 1fr; 
            gap: 10px; 
            margin-bottom: 15px; 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 5px; 
            position: relative; 
        }
        .section { 
            margin-bottom: 30px; 
            padding-bottom: 20px; 
            border-bottom: 1px solid #eee; 
        }
        .section:last-child { 
            border-bottom: none; 
        }
        .section h3 { 
            color: #333; 
            margin-bottom: 20px; 
        }
        .form-actions { 
            text-align: center; 
            margin-top: 30px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📄 Sistema de Facturación</h1>
            <p>Generar nueva factura</p>
        </div>
        
        <form id="facturaForm">
            <div class="section">
                <h3>👤 Datos del Cliente</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre/Razón Social *</label>
                        <input type="text" id="cliente" required>
                    </div>
                    <div class="form-group">
                        <label>RFC</label>
                        <input type="text" id="rfc" placeholder="XAXX010101000">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="email">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" id="telefono">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Dirección</label>
                    <textarea id="direccion" rows="3"></textarea>
                </div>
            </div>
            
            <div class="section">
                <h3>🛍️ Productos/Servicios</h3>
                <div id="productos">
                    <div class="producto-row">
                        <div class="form-group">
                            <label>Descripción</label>
                            <input type="text" placeholder="Producto o servicio" required>
                        </div>
                        <div class="form-group">
                            <label>Cantidad</label>
                            <input type="number" value="1" min="1" onchange="calcularTotales()">
                        </div>
                        <div class="form-group">
                            <label>Precio</label>
                            <input type="number" step="0.01" onchange="calcularTotales()">
                        </div>
                        <div class="form-group">
                            <label>Total</label>
                            <input type="number" step="0.01" readonly>
                        </div>
                    </div>
                </div>
                
                <button type="button" onclick="agregarProducto()" class="btn btn-add">➕ Agregar Producto</button>
            </div>
            
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span id="subtotal">$0.00</span>
                </div>
                <div class="total-row">
                    <span>IVA (16%):</span>
                    <span id="iva">$0.00</span>
                </div>
                <div class="total-row total-final">
                    <span>Total:</span>
                    <span id="total">$0.00</span>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn">💾 Generar Factura</button>
                <button type="button" onclick="window.close()" class="btn btn-cancel">❌ Cancelar</button>
            </div>
        </form>
    </div>
    
    <script>
    function agregarProducto() {
        const container = document.getElementById('productos');
        const div = document.createElement('div');
        div.className = 'producto-row';
        div.innerHTML = \`
            <div class="form-group">
                <label>Descripción</label>
                <input type="text" placeholder="Producto o servicio" required>
            </div>
            <div class="form-group">
                <label>Cantidad</label>
                <input type="number" value="1" min="1" onchange="calcularTotales()">
            </div>
            <div class="form-group">
                <label>Precio</label>
                <input type="number" step="0.01" onchange="calcularTotales()">
            </div>
            <div class="form-group">
                <label>Total</label>
                <input type="number" step="0.01" readonly>
            </div>
            <button type="button" onclick="this.parentElement.remove(); calcularTotales();" class="btn-remove">✕</button>
        \`;
        container.appendChild(div);
    }
    
    function calcularTotales() {
        let subtotal = 0;
        const productos = document.querySelectorAll('.producto-row');
        
        productos.forEach(function(producto) {
            const cantidad = parseFloat(producto.querySelector('input[type="number"]:nth-of-type(1)').value) || 0;
            const precio = parseFloat(producto.querySelector('input[type="number"]:nth-of-type(2)').value) || 0;
            const total = cantidad * precio;
            producto.querySelector('input[readonly]').value = total.toFixed(2);
            subtotal += total;
        });
        
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        
        document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
        document.getElementById('iva').textContent = '$' + iva.toFixed(2);
        document.getElementById('total').textContent = '$' + total.toFixed(2);
    }
    
    document.getElementById('facturaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const numero = 'FAC-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        const cliente = document.getElementById('cliente').value;
        const totalFinal = document.getElementById('total').textContent;
        
        if (!cliente) {
            alert('❌ El nombre del cliente es obligatorio');
            return;
        }
        
        alert('✅ Factura generada exitosamente!\\n\\nNúmero: ' + numero + '\\nCliente: ' + cliente + '\\nTotal: ' + totalFinal);
        
        // Aquí podrías enviar los datos al servidor WordPress
        // fetch(ajaxurl, { method: 'POST', ... })
        
        window.close();
    });
    
    // Calcular totales iniciales
    calcularTotales();
    </script>
</body>
</html>
        `);
        popup.focus();
    } else {
        alert('Por favor, permita ventanas emergentes para usar el módulo de facturación');
    }
}