import './styles/main.css'
import { QRCodeGenerator } from './js/QRCodeGenerator.js'

// Wait for all scripts to load
function initApp() {
  // Check if qrcode library is available
  if (typeof window.qrcode === 'undefined') {
    console.error('QR code library not loaded')
    return
  }
  
  // Initialize app
  new QRCodeGenerator()
  
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons()
  }
}

// Initialize when DOM is loaded and scripts are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure external scripts are loaded
    setTimeout(initApp, 100)
  })
} else {
  setTimeout(initApp, 100)
}