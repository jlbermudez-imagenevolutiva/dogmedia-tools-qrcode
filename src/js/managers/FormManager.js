import { SecurityValidator } from '../utils/SecurityValidator.js'

export class FormManager {
  constructor(qrGenerator) {
    this.qrGenerator = qrGenerator
  }

  init() {
    // Initialize form state
  }

  switchType(type) {
    // Update button states
    document.querySelectorAll('.qr-type-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelector(`[data-type="${type}"]`).classList.add('active')

    // Show corresponding form with animation
    document.querySelectorAll('.form-section').forEach(section => {
      section.classList.add('hidden')
    })
    
    setTimeout(() => {
      document.querySelector(`[data-form="${type}"]`).classList.remove('hidden')
    }, 150)
  }

  hasMinimumContent() {
    const type = this.qrGenerator.currentType
    let hasContent = false
    let contentLength = 0

    switch (type) {
      case 'url':
        const urlInput = document.getElementById('url-input').value.trim()
        contentLength = urlInput.length
        hasContent = contentLength >= 8
        break

      case 'wifi':
        const ssid = document.getElementById('wifi-ssid').value.trim()
        contentLength = ssid.length
        hasContent = contentLength >= 3
        break

      case 'phone':
        const phone = document.getElementById('phone-input').value.trim()
        contentLength = phone.length
        hasContent = contentLength >= 8
        break

      case 'vcard':
        const firstName = document.getElementById('vcard-firstname').value.trim()
        const lastName = document.getElementById('vcard-lastname').value.trim()
        contentLength = firstName.length + lastName.length
        hasContent = contentLength >= 3
        break

      case 'email':
        const emailAddress = document.getElementById('email-address').value.trim()
        contentLength = emailAddress.length
        hasContent = contentLength >= 8
        break

      case 'text':
        const text = document.getElementById('text-input').value.trim()
        contentLength = text.length
        hasContent = contentLength >= 8
        break
    }

    return hasContent
  }

  validateAndSanitizeInput() {
    const type = this.qrGenerator.currentType
    let data = ''
    let isValid = true
    let errorMessage = ''

    switch (type) {
      case 'url':
        const urlInput = document.getElementById('url-input').value
        const sanitizedUrl = SecurityValidator.sanitizeInput(urlInput)
        
        if (!sanitizedUrl) {
          isValid = false
          errorMessage = 'Please enter a URL'
        } else if (!SecurityValidator.isValidUrl(sanitizedUrl)) {
          isValid = false
          errorMessage = 'Please enter a valid URL starting with http:// or https://'
        } else {
          data = sanitizedUrl
        }
        break

      case 'wifi':
        const ssid = SecurityValidator.sanitizeInput(document.getElementById('wifi-ssid').value)
        const password = SecurityValidator.sanitizeInput(document.getElementById('wifi-password').value)
        const security = document.getElementById('wifi-security').value
        const hidden = document.getElementById('wifi-hidden').checked

        if (!ssid) {
          isValid = false
          errorMessage = 'Please enter a WiFi network name (SSID)'
        } else {
          data = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`
        }
        break

      case 'phone':
        const phone = SecurityValidator.sanitizeInput(document.getElementById('phone-input').value)
        
        if (!phone) {
          isValid = false
          errorMessage = 'Please enter a phone number'
        } else if (!SecurityValidator.isValidPhone(phone)) {
          isValid = false
          errorMessage = 'Please enter a valid phone number'
        } else {
          data = `tel:${phone}`
        }
        break

      case 'vcard':
        const firstName = SecurityValidator.sanitizeInput(document.getElementById('vcard-firstname').value)
        const lastName = SecurityValidator.sanitizeInput(document.getElementById('vcard-lastname').value)
        const org = SecurityValidator.sanitizeInput(document.getElementById('vcard-org').value)
        const vcardPhone = SecurityValidator.sanitizeInput(document.getElementById('vcard-phone').value)
        const vcardEmail = SecurityValidator.sanitizeInput(document.getElementById('vcard-email').value)

        if (!firstName && !lastName) {
          isValid = false
          errorMessage = 'Please enter at least a first or last name'
        } else {
          if (vcardEmail && !SecurityValidator.isValidEmail(vcardEmail)) {
            isValid = false
            errorMessage = 'Please enter a valid email address'
          } else {
            data = `BEGIN:VCARD\nVERSION:3.0\nFN:${firstName} ${lastName}\nN:${lastName};${firstName}\n`
            if (org) data += `ORG:${org}\n`
            if (vcardPhone) data += `TEL:${vcardPhone}\n`
            if (vcardEmail) data += `EMAIL:${vcardEmail}\n`
            data += 'END:VCARD'
          }
        }
        break

      case 'email':
        const emailAddress = SecurityValidator.sanitizeInput(document.getElementById('email-address').value)
        const subject = SecurityValidator.sanitizeInput(document.getElementById('email-subject').value)
        const message = SecurityValidator.sanitizeInput(document.getElementById('email-message').value)

        if (!emailAddress) {
          isValid = false
          errorMessage = 'Please enter an email address'
        } else if (!SecurityValidator.isValidEmail(emailAddress)) {
          isValid = false
          errorMessage = 'Please enter a valid email address'
        } else {
          data = `mailto:${emailAddress}`
          if (subject || message) {
            data += '?'
            if (subject) data += `subject=${encodeURIComponent(subject)}`
            if (subject && message) data += '&'
            if (message) data += `body=${encodeURIComponent(message)}`
          }
        }
        break

      case 'text':
        const text = SecurityValidator.sanitizeInput(document.getElementById('text-input').value)
        
        if (!text) {
          isValid = false
          errorMessage = 'Please enter some text content'
        } else {
          data = SecurityValidator.limitTextLength(text)
        }
        break
    }

    return { isValid, data, errorMessage }
  }
}