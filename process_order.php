<?php
// =====================================================
// ORDER NOTIFICATION SYSTEM
// Configure your settings below
// =====================================================

// Your WhatsApp number (with country code, no + sign)
// Example: for +2347012345678, use 2347012345678
$shop_whatsapp = "2347025305441";

// Your email address to receive order notifications
$shop_email = "abisolaemmanuel962@gmail.com";

// Shop name
$shop_name = "My Business Brand";

// =====================================================
// DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING
// =====================================================

header('Content-Type: text/html; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Get Data
    $name = $_POST['customer_name'] ?? '';
    $phone = $_POST['customer_phone'] ?? '';
    $email = $_POST['customer_email'] ?? '';
    $address = $_POST['customer_address'] ?? '';
    $cart_data = json_decode($_POST['cart_data'] ?? '[]', true);
    $total = $_POST['total_amount'] ?? 0;
    $order_date = $_POST['order_date'] ?? date('Y-m-d H:i:s');

    // Format order details for messages
    $order_details = "🛒 NEW ORDER RECEIVED\n\n";
    $order_details .= "━━━━━━━━━━━━━━━━━━━━\n";
    $order_details .= "📅 Date: " . $order_date . "\n";
    $order_details .= "👤 Customer: " . $name . "\n";
    $order_details .= "📞 Phone: " . $phone . "\n";
    if (!empty($email)) {
        $order_details .= "📧 Email: " . $email . "\n";
    }
    $order_details .= "📍 Address: " . $address . "\n";
    $order_details .= "━━━━━━━━━━━━━━━━━━━━\n";
    $order_details .= "📦 ORDER ITEMS:\n";
    
    $items_list = "";
    foreach($cart_data as $item) {
        $item_name = $item['name'] ?? 'Unknown Item';
        $item_price = $item['price'] ?? 0;
        $item_qty = $item['quantity'] ?? 1;
        $item_total = $item_price * $item_qty;
        $order_details .= "• " . $item_name . " x" . $item_qty . " = ₦" . number_format($item_total) . "\n";
        $items_list .= $item_name . " x" . $item_qty . " = ₦" . number_format($item_total) . ", ";
    }
    
    $order_details .= "━━━━━━━━━━━━━━━━━━━━\n";
    $order_details .= "💰 TOTAL: ₦" . number_format($total) . "\n";
    $order_details .= "━━━━━━━━━━━━━━━━━━━━\n";
    $order_details .= "\nThank you for your order!";
    
    // Trim trailing comma
    $items_list = rtrim($items_list, ", ");

    // =====================================================
    // A. SEND EMAIL NOTIFICATION
    // =====================================================
    $email_sent = false;
    $email_error = "";
    
    if (!empty($shop_email) && $shop_email != "abisolaemmanuel962@gmail.com") {
        $to = $shop_email;
        $subject = "🛒 New Order from $name - ₦" . number_format($total);
        
        $email_body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .order-container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(90deg, #f48fb1, #d81b60); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #fce4ec; }
                .customer-info { background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
                .items-table { width: 100%; border-collapse: collapse; }
                .items-table th { background: #d81b60; color: white; padding: 10px; text-align: left; }
                .items-table td { padding: 10px; border-bottom: 1px solid #ddd; }
                .total { font-size: 18px; font-weight: bold; color: #d81b60; }
            </style>
        </head>
        <body>
            <div class='order-container'>
                <div class='header'>
                    <h1>🛒 New Order Received!</h1>
                </div>
                <div class='content'>
                    <div class='customer-info'>
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> $name</p>
                        <p><strong>Phone:</strong> $phone</p>
                        <p><strong>Email:</strong> " . (empty($email) ? 'Not provided' : $email) . "</p>
                        <p><strong>Delivery Address:</strong> $address</p>
                        <p><strong>Order Date:</strong> $order_date</p>
                    </div>
                    <h3>Order Items</h3>
                    <table class='items-table'>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
        ";
        
        foreach($cart_data as $item) {
            $item_name = $item['name'] ?? 'Unknown';
            $item_price = $item['price'] ?? 0;
            $item_qty = $item['quantity'] ?? 1;
            $item_total = $item_price * $item_qty;
            
            $email_body .= "
                        <tr>
                            <td>$item_name</td>
                            <td>$item_qty</td>
                            <td>₦" . number_format($item_price) . "</td>
                            <td>₦" . number_format($item_total) . "</td>
                        </tr>
            ";
        }
        
        $email_body .= "
                        <tr>
                            <td colspan='3' style='text-align:right;'><strong>Total:</strong></td>
                            <td class='total'>₦" . number_format($total) . "</td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type:text/html;charset=UTF-8\r\n";
        $headers .= "From: Orders <orders@" . $_SERVER['HTTP_HOST'] . ">\r\n";
        
        if(mail($to, $subject, $email_body, $headers)) {
            $email_sent = true;
        } else {
            $email_error = "Mail sending failed";
        }
    }

    // =====================================================
    // B. SEND WHATSAPP NOTIFICATION (Using CallMeBot API - Free alternative)
    // =====================================================
    $whatsapp_sent = false;
    $whatsapp_error = "";
    
    if (!empty($shop_whatsapp) && $shop_whatsapp != "2347012345678") {
        // Using CallMeBot API (free, no server needed)
        // Get your API key from: https://www.callmebot.com/
        $callmebot_api = ""; // Add your CallMeBot API key here
        
        if (!empty($callmebot_api)) {
            $whatsapp_message = urlencode($order_details);
            $whatsapp_url = "https://api.callmebot.com/whatsapp.php?phone=$shop_whatsapp&text=$whatsapp_message&apikey=$callmebot_api";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $whatsapp_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $whatsapp_response = curl_exec($ch);
            curl_close($ch);
            
            if (strpos($whatsapp_response, 'OK') !== false) {
                $whatsapp_sent = true;
            } else {
                $whatsapp_error = $whatsapp_response;
            }
        }
    }

    // =====================================================
    // C. ALTERNATIVE: SIMPLE SMS NOTIFICATION (Using 2Factor API)
    // =====================================================
    $sms_sent = false;
    $sms_error = "";
    
    // Add your 2Factor.in API key here (free credits available)
    $sms_api_key = ""; 
    
    if (!empty($sms_api_key) && !empty($phone)) {
        $sms_message = "New Order: $name, ₦" . number_format($total) . ". Items: " . substr($items_list, 0, 100);
        $sms_url = "https://2factor.in/API/V1/" . $sms_api_key . "/SMS/" . $phone . "/" . urlencode($sms_message);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $sms_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        $sms_response = curl_exec($ch);
        curl_close($ch);
        
        $sms_result = json_decode($sms_response, true);
        if ($sms_result && $sms_result['Status'] == 'Success') {
            $sms_sent = true;
        }
    }

    // =====================================================
    // D. ALSO SAVE ORDER TO FILE (Local backup)
    // =====================================================
    $order_filename = "orders/order_" . time() . ".json";
    if (!is_dir("orders")) {
        mkdir("orders", 0777, true);
    }
    
    $order_array = [
        'order_id' => time(),
        'customer_name' => $name,
        'customer_phone' => $phone,
        'customer_email' => $email,
        'customer_address' => $address,
        'items' => $cart_data,
        'total' => $total,
        'order_date' => $order_date,
        'notifications' => [
            'email_sent' => $email_sent,
            'whatsapp_sent' => $whatsapp_sent,
            'sms_sent' => $sms_sent
        ]
    ];
    
    file_put_contents($order_filename, json_encode($order_array, JSON_PRETTY_PRINT));

    // =====================================================
    // RESPONSE TO CLIENT
    // =====================================================
    $response = "✅ Order processed successfully!\n\n";
    $response .= "Notifications sent:\n";
    $response .= "- Email: " . ($email_sent ? "✅" : "❌") . "\n";
    $response .= "- WhatsApp: " . ($whatsapp_sent ? "✅" : "❌") . "\n";
    $response .= "- SMS: " . ($sms_sent ? "✅" : "❌") . "\n";
    $response .= "\nOrder saved locally: ✅";
    
    echo $response;
    
} else {
    echo "Invalid request method";
}
?>

