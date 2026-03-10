// Cart functionality with localStorage persistence
// Shop owner's WhatsApp number for receiving payments
const SHOP_WHATSAPP = "2347025305441"; // Replace with your WhatsApp number (with country code)
const SHOP_ACCOUNT_NUMBER = "7025305441"; // Replace with your bank account number for payment instructions
const SHOP_BANK_NAME = "OPAY"; // Replace with your bank name for payment instructions
const SHOP_ACCOUNT_NAME = "ABISOLA EMMANUEL MAYOWA"; // Replace with your account name for payment instructions
const SHOP_EMAIL = "abisolaemmanuel962@gmail.com"; // Add your email for order notifications

let cart = [];

// Initialize cart from localStorage on page load
function initCart() {
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
  updateCartCount();
}

// Add product to cart
function addToCart(name, price, image = '') {
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  saveCart();
  renderCart();
  showNotification(`${name} added to cart!`);
}

// Remove product from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}


function updateQuantity(id, quantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = quantity;
      saveCart();
      renderCart();
    }
  }
}


function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart count badge
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const count = getCartCount();
  cartCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(90deg, #f48fb1, #d81b60);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(216, 27, 96, 0.4);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Open cart modal
function openCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderCart();
  }
}

// Close cart modal
function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Generate and download receipt
function downloadReceipt() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }
  
  // Collect customer information
  const customerName = prompt('Please enter your name:');
  if (!customerName) return;
  
  const customerPhone = prompt('Please enter your phone number:');
  if (!customerPhone) return;
  
  const customerAddress = prompt('Please enter your delivery address:');
  
  const total = getCartTotal();
  const orderDate = new Date().toLocaleString();
  const orderId = 'ORD-' + Date.now().toString().slice(-8);
  
  // Create receipt container HTML - Professional Modern Design
  const receiptContainer = `
    <div class="receipt-container" id="receiptElement">
      <!-- Receipt Header -->
      <div class="receipt-header">
        <div class="logo-section">
          <div class="logo-icon">🛒</div>
          <div class="brand-name">My Business Brand</div>
        </div>
        <div class="receipt-type">OFFICIAL RECEIPT</div>
      </div>
      
      <!-- Order Info Bar -->
      <div class="order-bar">
        <div class="order-bar-item">
          <span class="label">Order ID</span>
          <span class="value">${orderId}</span>
        </div>
        <div class="order-bar-item">
          <span class="label">Date</span>
          <span class="value">${orderDate}</span>
        </div>
      </div>
      
      <!-- Customer Details Card -->
      <div class="detail-card customer-card">
        <div class="card-header">
          <span class="card-icon">👤</span>
          <span class="card-title">Customer Information</span>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">Name</span>
            <span class="info-value">${customerName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone</span>
            <span class="info-value">${customerPhone}</span>
          </div>
          ${customerAddress ? `
          <div class="info-row">
            <span class="info-label">Address</span>
            <span class="info-value">${customerAddress}</span>
          </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Order Items -->
      <div class="items-section">
        <div class="section-header">
          <span class="section-icon">📋</span>
          <span class="section-title">Order Details</span>
        </div>
        <div class="items-list">
          ${cart.map(item => `
            <div class="order-item">
              <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">Qty: ${item.quantity}</span>
              </div>
              <span class="item-price">₦${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Total Section -->
      <div class="total-card">
        <div class="total-label">Total Amount</div>
        <div class="total-amount">₦${total.toLocaleString()}</div>
      </div>
      
      <!-- Payment Information -->
      <div class="detail-card payment-card">
        <div class="card-header">
          <span class="card-icon">💳</span>
          <span class="card-title">Payment Details</span>
        </div>
        <div class="card-body">
          <div class="payment-row">
            <span class="payment-label">Account Number</span>
            <span class="payment-value copyable" onclick="navigator.clipboard.writeText('${SHOP_ACCOUNT_NUMBER}')">${SHOP_ACCOUNT_NUMBER} 📋</span>
          </div>
          <div class="payment-row">
            <span class="payment-label">Bank Name</span>
            <span class="payment-value">${SHOP_BANK_NAME}</span>
          </div>
          <div class="payment-row">
            <span class="payment-label">Account Name</span>
            <span class="payment-value">${SHOP_ACCOUNT_NAME}</span>
          </div>
        </div>
      </div>
      
      <!-- WhatsApp Button -->
      <a href="https://wa.me/${SHOP_WHATSAPP}?text=Hi, I just placed order ${orderId} and want to send payment proof" class="whatsapp-button" target="_blank">
        <span class="whatsapp-icon">💬</span>
        <span class="whatsapp-text">Send Payment Proof via WhatsApp</span>
      </a>
      <p class="payment-note">Tap the button above after making payment</p>
      
      <!-- Footer -->
      <div class="receipt-footer">
        <div class="thank-you-message">Thank You for Your Purchase! 🎉</div>
        <div class="footer-note">We appreciate your business and look forward to serving you again.</div>
        <div class="powered-by">Powered by Emmarz Tech</div>
      </div>
    </div>
  `;

  // Build the complete HTML page for the new window
  const fullPageHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${orderId}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 30px 20px;
    }
    
    .receipt-container {
      width: 100%;
      max-width: 420px;
      background: linear-gradient(180deg, #1e1e3f 0%, #16162a 100%);
      border-radius: 24px;
      padding: 28px;
      position: relative;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .receipt-header { text-align: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    
    .logo-section { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    
    .logo-icon {
      width: 64px; height: 64px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      border-radius: 20px; display: flex; align-items: center; justify-content: center;
      font-size: 28px; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
    }
    
    .brand-name { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
    
    .receipt-type {
      display: inline-block; margin-top: 12px; padding: 6px 16px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px;
      color: #a5b4fc; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    }
    
    .order-bar {
      display: flex; justify-content: space-between; background: rgba(255, 255, 255, 0.04);
      border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.06);
    }
    
    .order-bar-item { display: flex; flex-direction: column; gap: 4px; }
    .order-bar-item .label { color: rgba(255, 255, 255, 0.45); font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
    .order-bar-item .value { color: #fff; font-size: 13px; font-weight: 600; }
    
    .detail-card { background: rgba(255, 255, 255, 0.03); border-radius: 16px; padding: 18px; margin-bottom: 16px; border: 1px solid rgba(255, 255, 255, 0.06); }
    .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .card-icon { font-size: 18px; }
    .card-title { color: #fff; font-size: 14px; font-weight: 600; }
    .card-body { display: flex; flex-direction: column; gap: 10px; }
    .info-row { display: flex; justify-content: space-between; align-items: center; }
    .info-label { color: rgba(255, 255, 255, 0.5); font-size: 12px; font-weight: 400; }
    .info-value { color: #fff; font-size: 13px; font-weight: 500; text-align: right; }
    
    .items-section { margin-bottom: 20px; }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
    .section-icon { font-size: 18px; }
    .section-title { color: #fff; font-size: 14px; font-weight: 600; }
    .items-list { display: flex; flex-direction: column; gap: 10px; }
    
    .order-item {
      display: flex; justify-content: space-between; align-items: center;
      background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 14px 16px; border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .item-info { display: flex; flex-direction: column; gap: 4px; flex: 1; margin-right: 12px; }
    .item-name { color: #fff; font-size: 13px; font-weight: 500; }
    .item-qty { color: rgba(255, 255, 255, 0.5); font-size: 11px; }
    .item-price { color: #818cf8; font-size: 14px; font-weight: 600; white-space: nowrap; }
    
    .total-card {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: center;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
    }
    .total-label { color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 500; margin-bottom: 6px; }
    .total-amount { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -1px; }
    
    .payment-card { margin-bottom: 20px; }
    .payment-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .payment-row:last-child { border-bottom: none; padding-bottom: 0; }
    .payment-row:first-child { padding-top: 0; }
    .payment-label { color: rgba(255, 255, 255, 0.5); font-size: 12px; }
    .payment-value { color: #fff; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }
    .payment-value.copyable { cursor: pointer; padding: 4px 10px; background: rgba(99, 102, 241, 0.15); border-radius: 6px; transition: all 0.2s; }
    .payment-value.copyable:hover { background: rgba(99, 102, 241, 0.25); }
    
    .whatsapp-button {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: linear-gradient(135deg, #25D366 0%, #00b359 100%);
      color: white; text-decoration: none; padding: 16px 24px; border-radius: 14px;
      font-weight: 600; font-size: 14px; margin-bottom: 12px;
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.3); transition: all 0.3s ease;
    }
    .whatsapp-button:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37, 211, 102, 0.4); }
    .whatsapp-icon { font-size: 20px; }
    .payment-note { text-align: center; color: rgba(255, 255, 255, 0.45); font-size: 11px; margin-bottom: 24px; }
    
    .receipt-footer { text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .thank-you-message {
      font-size: 18px; font-weight: 700;
      background: linear-gradient(90deg, #818cf8, #c084fc, #818cf8);
      background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 8px;
    }
    .footer-note { color: rgba(255, 255, 255, 0.4); font-size: 11px; margin-bottom: 16px; }
    .powered-by { display: inline-block; padding: 6px 14px; background: rgba(255, 255, 255, 0.05); border-radius: 20px; color: rgba(255, 255, 255, 0.35); font-size: 10px; letter-spacing: 0.5px; }
    
    .download-buttons { display: flex; gap: 12px; margin-bottom: 24px; z-index: 100; }
    .download-btn { flex: 1; padding: 14px 20px; border: none; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .download-btn-png { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3); }
    .download-btn-pdf { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3); }
    .download-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }
    .download-status { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.9); color: white; padding: 14px 24px; border-radius: 10px; font-size: 13px; z-index: 1000; display: none; border: 1px solid rgba(255, 255, 255, 0.1); }
    
    @media print { body { background: #1e1e3f !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .receipt-container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="download-buttons">
    <button class="download-btn download-btn-png" onclick="downloadAsImage()">🖼️ Download as Image (PNG)</button>
    <button class="download-btn download-btn-pdf" onclick="downloadAsPDF()">📄 Download as PDF</button>
  </div>
  <div class="download-status" id="downloadStatus">Preparing download...</div>
  ${receiptContainer}
  <script>
    const orderId = '${orderId}';
    const cartData = ${JSON.stringify(cart)};
    const totalAmount = ${total};
    
    async function downloadAsImage() {
      const statusEl = document.getElementById('downloadStatus');
      statusEl.style.display = 'block';
      statusEl.textContent = '🎨 Generating image...';
      try {
        const element = document.querySelector('.receipt-container');
        const buttons = document.querySelector('.download-buttons');
        buttons.style.display = 'none';
        const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#1a1a2e', useCORS: true, logging: false });
        const link = document.createElement('a');
        link.download = 'Receipt_' + orderId + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        buttons.style.display = 'flex';
        statusEl.textContent = '✅ Image downloaded successfully!';
        setTimeout(() => statusEl.style.display = 'none', 2000);
        alert('Receipt downloaded as PNG image! You can now send it to the shop owner.');
      } catch (error) {
        console.error('Error generating image:', error);
        statusEl.textContent = '❌ Error generating image';
        setTimeout(() => statusEl.style.display = 'none', 2000);
      }
    }
    
    async function downloadAsPDF() {
      const statusEl = document.getElementById('downloadStatus');
      statusEl.style.display = 'block';
      statusEl.textContent = '📄 Generating PDF...';
      try {
        const element = document.querySelector('.receipt-container');
        const buttons = document.querySelector('.download-buttons');
        buttons.style.display = 'none';
        const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#1a1a2e', useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const x = (210 - imgWidth) / 2;
        const y = 15;
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save('Receipt_' + orderId + '.pdf');
        buttons.style.display = 'flex';
        statusEl.textContent = '✅ PDF downloaded successfully!';
        setTimeout(() => statusEl.style.display = 'none', 2000);
        alert('Receipt downloaded as PDF! You can now send it to the shop owner.');
      } catch (error) {
        console.error('Error generating PDF:', error);
        statusEl.textContent = '❌ Error generating PDF';
        setTimeout(() => statusEl.style.display = 'none', 2000);
      }
    }
  <\/script>
</body>
</html>`;

  // Open receipt in new window with download options
  const receiptWindow = window.open('', '_blank');
  if (receiptWindow) {
    receiptWindow.document.write(fullPageHTML);
    receiptWindow.document.close();
  } else {
    showNotification('Please allow popups to download receipt!');
  }
}

// Render cart items in modal
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty!</p>';
    if (cartTotalElement) cartTotalElement.textContent = 'Total: ₦0';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="no-image">📦</div>'}
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="qty-btn">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="qty-btn">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <p class="item-total">₦${itemTotal.toLocaleString()}</p>
        <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
  
  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: ₦${total.toLocaleString()}`;
  }
}

// Checkout - process the order
function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }
  
  const total = getCartTotal();
  const orderSummary = cart.map(item => `${item.name} x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`).join('\n');
  
  const confirmOrder = confirm(`Order Summary:\n\n${orderSummary}\n\nTotal: ₦${total.toLocaleString()}\n\nProceed to checkout?`);
  
  if (confirmOrder) {
    const customerName = prompt('Please enter your name:');
    if (!customerName) return;
    
    const customerPhone = prompt('Please enter your phone number:');
    if (!customerPhone) return;
    
    const customerEmail = prompt('Please enter your email (optional):');
    
    const customerAddress = prompt('Please enter your delivery address:');
    if (!customerAddress) return;
    
    const orderData = {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items: cart,
      total: total,
      date: new Date().toLocaleString()
    };
    
    const downloadReceiptConfirm = confirm('Would you like to download a payment receipt?\n\nAfter downloading, send the receipt to the shop owner on WhatsApp: +' + SHOP_WHATSAPP);
    
    if (downloadReceiptConfirm) {
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      downloadReceipt();
    }
    
    sendOrderToServer(orderData);
  }
}

// Send order alert to shop owner via WhatsApp
function sendOrderAlertToOwner(orderData) {
  const orderItems = orderData.items.map(item => 
    `• ${item.name} x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');

  const message = `🛒 *NEW ORDER RECEIVED*\n\n` +
    `*Order ID:* ${orderData.orderId}\n` +
    `*Date:* ${orderData.date}\n\n` +
    `*CUSTOMER DETAILS*\n` +
    `Name: ${orderData.customerName}\n` +
    `Phone: ${orderData.customerPhone}\n` +
    `Email: ${orderData.customerEmail || 'Not provided'}\n` +
    `Address: ${orderData.customerAddress}\n\n` +
    `*ORDER ITEMS*\n${orderItems}\n\n` +
    `*TOTAL:* ₦${orderData.total.toLocaleString()}\n\n` +
    `💳 Payment: Pending`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
}

// Send order alert to shop owner via Email
function sendOrderEmailToOwner(orderData) {
  const orderItems = orderData.items.map(item => 
    `${item.name} x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`
  ).join('%0A');

  const subject = encodeURIComponent(`New Order ${orderData.orderId} - My Business Brand`);
  const body = `NEW ORDER RECEIVED%0A%0A` +
    `Order ID: ${orderData.orderId}%0A` +
    `Date: ${orderData.date}%0A%0A` +
    `CUSTOMER DETAILS%0A` +
    `Name: ${orderData.customerName}%0A` +
    `Phone: ${orderData.customerPhone}%0A` +
    `Email: ${orderData.customerEmail || 'Not provided'}%0A` +
    `Address: ${orderData.customerAddress}%0A%0A` +
    `ORDER ITEMS%0A${orderItems}%0A%0A` +
    `TOTAL: ₦${orderData.total.toLocaleString()}%0A%0A` +
    `Payment: Pending`;

  const emailUrl = `mailto:${SHOP_EMAIL}?subject=${subject}&body=${body}`;
  
  window.open(emailUrl, '_blank');
}

// Send order data to server
function sendOrderToServer(orderData) {
  showNotification('Processing order...');
  
  orderData.orderId = 'ORD-' + Date.now().toString().slice(-8);
  
  const formData = new FormData();
  formData.append('customer_name', orderData.customerName);
  formData.append('customer_phone', orderData.customerPhone);
  formData.append('customer_email', orderData.customerEmail || '');
  formData.append('customer_address', orderData.customerAddress);
  formData.append('cart_data', JSON.stringify(orderData.items));
  formData.append('total_amount', orderData.total);
  formData.append('order_date', orderData.date);
  formData.append('order_id', orderData.orderId);
  
  fetch('process_order.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    console.log('Server response:', data);
    
    // Send WhatsApp alert to shop owner
    sendOrderAlertToOwner(orderData);
    
    // Ask if owner wants email notification too
    const sendEmail = confirm('Would you also like to send the order details to the shop owner via email?');
    if (sendEmail) {
      sendOrderEmailToOwner(orderData);
    }
    
    cart = [];
    saveCart();
    renderCart();
    closeCart();
    
    alert(`Order placed successfully!\n\nName: ${orderData.customerName}\nPhone: ${orderData.customerPhone}\nTotal: ₦${orderData.total.toLocaleString()}\n\n📱 Please send payment receipt to:\nWhatsApp: +${SHOP_WHATSAPP}\n\n✅ The shop owner has been notified of your order!`);
    showNotification('Order confirmed! Thank you for shopping.');
  })
  .catch(error => {
    console.error('Error:', error);
    
    // Still send WhatsApp notification even if server fails
    sendOrderAlertToOwner(orderData);
    
    alert(`Order placed!\n\nName: ${orderData.customerName}\nTotal: ₦${orderData.total.toLocaleString()}\n\n📱 Please send payment receipt to:\nWhatsApp: +${SHOP_WHATSAPP}\n\n✅ The shop owner has been notified of your order!`);
    
    cart = [];
    saveCart();
    renderCart();
    closeCart();
  });
}

// Clear entire cart
function clearCart() {
  if (confirm('Are you sure you want to clear all items from your cart?')) {
    cart = [];
    saveCart();
    renderCart();
    showNotification('Cart cleared!');
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('cart-modal');
  if (modal && e.target === modal) {
    closeCart();
  }
});

