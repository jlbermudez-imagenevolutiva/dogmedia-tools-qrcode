export class DownloadManager {
  constructor(qrGenerator) {
    this.qrGenerator = qrGenerator
  }

  download(format) {
    if (!this.qrGenerator.qrCode) {
      this.qrGenerator.showError('Please generate a QR code first')
      return
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `qrcode-${timestamp}`

    if (format === 'svg') {
      this.downloadSVG(filename)
    } else if (format === 'png') {
      this.downloadPNG(filename)
    }
  }

  downloadSVG(filename) {
    const svg = this.qrGenerator.qrCode.createSvgTag({
      cellSize: 8,
      margin: 4,
      scalable: true
    })
    
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  }

  downloadPNG(filename) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const size = 400
    const moduleCount = this.qrGenerator.qrCode.getModuleCount()
    const cellSize = size / moduleCount
    
    canvas.width = size
    canvas.height = size
    
    // Fill background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    
    // Draw QR modules
    ctx.fillStyle = '#000000'
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (this.qrGenerator.qrCode.isDark(row, col)) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
        }
      }
    }
    
    // Download
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }
}