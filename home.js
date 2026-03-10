// Simple homepage interactions

// Animate hero text on load
window.addEventListener("DOMContentLoaded", () => {
  const heroText = document.querySelector(".hero h1");
  heroText.style.opacity = 0;
  heroText.style.transform = "translateY(20px)";
  
  setTimeout(() => {
    heroText.style.transition = "all 1s ease";
    heroText.style.opacity = 1;
    heroText.style.transform = "translateY(0)";
  }, 300);
});

// CTA button click effect
const ctaBtn = document.querySelector(".cta-btn");
ctaBtn.addEventListener("click", () => {
  alert("Redirecting to Products page...");
});
