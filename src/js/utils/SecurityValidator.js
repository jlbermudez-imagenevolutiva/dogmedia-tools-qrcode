export const SecurityValidator = {
  // HTML encode to prevent XSS
  htmlEncode: function(str) {
    return str.replace(/[&<>"'\/]/g, function(s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
      }[s]
    })
  },

  // Sanitize input to remove potential XSS vectors
  sanitizeInput: function(input) {
    if (typeof input !== 'string') return ''
    
    // Remove script tags and javascript: protocols
    let sanitized = input.replace(/<script[^>]*>.*?<\/script>/gi, '')
    sanitized = sanitized.replace(/javascript:/gi, '')
    sanitized = sanitized.replace(/on\w+\s*=/gi, '') // Remove event handlers
    sanitized = sanitized.replace(/data:/gi, '') // Remove data URIs
    
    return sanitized.trim()
  },

  // Validate URL format
  isValidUrl: function(string) {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  },

  // Validate email format
  isValidEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate phone number (basic international format)
  isValidPhone: function(phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{7,15}$/
    return phoneRegex.test(phone)
  },

  // Limit text length to prevent QR code complexity issues
  limitTextLength: function(text, maxLength = 2953) {
    return text.substring(0, maxLength)
  }
}