// Example checkout function using Stripe (replace with your own keys)
function checkout(productName, price) {
  alert(`Redirecting to payment for ${productName} - $${price}`);

  // Example Stripe Checkout integration
  // Replace with your own Stripe publishable key
  const stripe = Stripe("YOUR_STRIPE_PUBLIC_KEY");

  stripe.redirectToCheckout({
    lineItems: [{ price: "YOUR_PRICE_ID", quantity: 1 }],
    mode: "payment",
    successUrl: window.location.origin + "/success.html",
    cancelUrl: window.location.origin + "/cancel.html",
  });
}

// Example order notification (WhatsApp or Email)
function sendNotification(productName) {
  // WhatsApp API (Twilio or WhatsApp Business API)
  const whatsappNumber = "+2347025305441"; // Replace with your WhatsApp number
  const message = `New order placed: ₦{productName}`;
  console.log(`Send WhatsApp message to ₦{whatsappNumber}: ${message}`);

  // Email notification (via backend service like Node.js + Nodemailer)
  console.log(`Send email notification: ₦{message}`);
}
