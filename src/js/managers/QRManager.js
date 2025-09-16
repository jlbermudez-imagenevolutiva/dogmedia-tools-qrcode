export class QRManager {
  constructor(qrGenerator) {
    this.qrGenerator = qrGenerator
  }

  generateQR(data) {
    // Create QR code using qrcode-generator library
    const qr = window.qrcode(0, 'M')
    qr.addData(data)
    qr.make()

    // Store for download
    this.qrGenerator.qrCode = qr

    // Create SVG with enhanced styling
    const svg = qr.createSvgTag({
      cellSize: 4,
      margin: 4,
      scalable: true
    })

    // Display QR code with animation
    const qrDisplay = document.getElementById('qr-display')
    qrDisplay.innerHTML = svg

    // Apply custom styling to the SVG
    const svgElement = qrDisplay.querySelector('svg')
    if (svgElement) {
      svgElement.style.maxWidth = '100%'
      svgElement.style.height = 'auto'
      svgElement.style.borderRadius = '8px'
      svgElement.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }

    // Show result section
    this.showQRCode()
  }

  showQRCode() {
    document.getElementById('qr-placeholder').classList.add('hidden')
    document.getElementById('qr-result').classList.remove('hidden')
  }

  hideQRCode() {
    document.getElementById('qr-placeholder').classList.remove('hidden')
    document.getElementById('qr-result').classList.add('hidden')
  }
}