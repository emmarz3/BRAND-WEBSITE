// Watermark Configuration
const WATERMARK_CONFIG = {
  // Your brand name - change this to your name/business name
  brandName: "Emmarz Tech",
  
  // Position: 'bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left'
  position: 'bottom-right',
  
  // Size: 'small', 'medium', 'large'
  size: 'medium',
  
  // Show animated border
  animated: true,
  
  // Add diagonal watermark on background (subtle)
  diagonalWatermark: true,
  
  // Diagonal watermark text (usually just initials or brand)
  diagonalText: "EMMARZ"
};

// Function to create and add watermark
function addWatermark() {
  // Create watermark container
  const watermarkContainer = document.createElement('div');
  watermarkContainer.className = `watermark-container watermark-${WATERMARK_CONFIG.position}`;
  
  // Add size class
  if (WATERMARK_CONFIG.size === 'small') {
    watermarkContainer.classList.add('watermark-small');
  } else if (WATERMARK_CONFIG.size === 'large') {
    watermarkContainer.classList.add('watermark-large');
  }
  
  // Add animated class if enabled
  if (WATERMARK_CONFIG.animated) {
    watermarkContainer.classList.add('watermark-animated');
  }
  
  // Create watermark element
  const watermark = document.createElement('div');
  watermark.className = 'watermark';
  watermark.innerHTML = `
    <span class="watermark-icon"></span>
    <span class="watermark-text">${WATERMARK_CONFIG.brandName}</span>
  `;
  
  watermarkContainer.appendChild(watermark);
  
  // Add to body
  document.body.appendChild(watermarkContainer);
  
  // Add diagonal watermark if enabled
  if (WATERMARK_CONFIG.diagonalWatermark) {
    addDiagonalWatermark();
  }
}

// Function to add diagonal background watermark
function addDiagonalWatermark() {
  const diagonalWatermark = document.createElement('div');
  diagonalWatermark.className = 'watermark-diagonal';
  diagonalWatermark.innerHTML = `
    <div class="watermark">
      <span class="watermark-text">${WATERMARK_CONFIG.diagonalText}</span>
    </div>
  `;
  document.body.appendChild(diagonalWatermark);
}

// Add watermark when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addWatermark);
} else {
  addWatermark();
}

// Export configuration for easy customization
window.WATERMARK_CONFIG = WATERMARK_CONFIG;

