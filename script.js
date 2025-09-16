// OWASP Security Functions
const SecurityValidator = {
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
            }[s];
        });
    },

    // Sanitize input to remove potential XSS vectors
    sanitizeInput: function(input) {
        if (typeof input !== 'string') return '';
        
        // Remove script tags and javascript: protocols
        let sanitized = input.replace(/<script[^>]*>.*?<\/script>/gi, '');
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, ''); // Remove event handlers
        sanitized = sanitized.replace(/data:/gi, ''); // Remove data URIs
        
        return sanitized.trim();
    },

    // Validate URL format
    isValidUrl: function(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    },

    // Validate email format
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number (basic international format)
    isValidPhone: function(phone) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{7,15}$/;
        return phoneRegex.test(phone);
    },

    // Limit text length to prevent QR code complexity issues
    limitTextLength: function(text, maxLength = 2953) {
        return text.substring(0, maxLength);
    }
};

// QR Code Generator Class
class QRCodeGenerator {
    constructor() {
        this.currentType = 'url';
        this.qrCode = null;
        this.debounceTimer = null;
        this.init();
    }

    init() {
        this.bindEvents();
        lucide.createIcons();
    }

    bindEvents() {
        // Type selection buttons
        document.querySelectorAll('.qr-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectType(e.target.closest('.qr-type-btn').dataset.type);
            });
        });

        // Generate button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generateQRCode();
        });

        // Download buttons
        document.getElementById('download-png').addEventListener('click', () => {
            this.downloadQRCode('png');
        });

        document.getElementById('download-svg').addEventListener('click', () => {
            this.downloadQRCode('svg');
        });

        // Auto-generate on input changes with debouncing
        this.bindAutoGenerateEvents();
    }

    bindAutoGenerateEvents() {
        // Get all form inputs
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Listen for input events
            input.addEventListener('input', () => {
                this.debounceAutoGenerate();
            });
            
            // Listen for change events (for selects and checkboxes)
            input.addEventListener('change', () => {
                this.debounceAutoGenerate();
            });
        });
    }

    debounceAutoGenerate() {
        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Set new timer for 300ms delay
        this.debounceTimer = setTimeout(() => {
            this.autoGenerateQRCode();
        }, 300);
    }

    autoGenerateQRCode() {
        // Check if we have enough content to generate
        if (this.hasMinimumContent()) {
            this.generateQRCode(true); // true flag indicates auto-generation
        } else {
            // Hide QR code if content is insufficient
            this.hideQRCode();
        }
    }

    hasMinimumContent() {
        const type = this.currentType;
        let hasContent = false;
        let contentLength = 0;

        switch (type) {
            case 'url':
                const urlInput = document.getElementById('url-input').value.trim();
                contentLength = urlInput.length;
                hasContent = contentLength >= 8;
                break;

            case 'wifi':
                const ssid = document.getElementById('wifi-ssid').value.trim();
                contentLength = ssid.length;
                hasContent = contentLength >= 3; // Minimum for WiFi SSID
                break;

            case 'phone':
                const phone = document.getElementById('phone-input').value.trim();
                contentLength = phone.length;
                hasContent = contentLength >= 8;
                break;

            case 'vcard':
                const firstName = document.getElementById('vcard-firstname').value.trim();
                const lastName = document.getElementById('vcard-lastname').value.trim();
                contentLength = firstName.length + lastName.length;
                hasContent = contentLength >= 3; // Minimum for name
                break;

            case 'email':
                const emailAddress = document.getElementById('email-address').value.trim();
                contentLength = emailAddress.length;
                hasContent = contentLength >= 8;
                break;

            case 'text':
                const text = document.getElementById('text-input').value.trim();
                contentLength = text.length;
                hasContent = contentLength >= 8;
                break;
        }

        return hasContent;
    }

    selectType(type) {
        this.currentType = type;
        
        // Update button states
        document.querySelectorAll('.qr-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');

        // Show corresponding form
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.querySelector(`[data-form="${type}"]`).classList.remove('hidden');

        // Hide error message and QR code
        this.hideError();
        this.hideQRCode();

        // Check if new form has enough content to auto-generate
        setTimeout(() => {
            this.autoGenerateQRCode();
        }, 100);
    }

    hideQRCode() {
        document.getElementById('qr-placeholder').classList.remove('hidden');
        document.getElementById('qr-result').classList.add('hidden');
    }

    validateAndSanitizeInput() {
        const type = this.currentType;
        let data = '';
        let isValid = true;
        let errorMessage = '';

        switch (type) {
            case 'url':
                const urlInput = document.getElementById('url-input').value;
                const sanitizedUrl = SecurityValidator.sanitizeInput(urlInput);
                
                if (!sanitizedUrl) {
                    isValid = false;
                    errorMessage = 'Please enter a URL';
                } else if (!SecurityValidator.isValidUrl(sanitizedUrl)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid URL starting with http:// or https://';
                } else {
                    data = sanitizedUrl;
                }
                break;

            case 'wifi':
                const ssid = SecurityValidator.sanitizeInput(document.getElementById('wifi-ssid').value);
                const password = SecurityValidator.sanitizeInput(document.getElementById('wifi-password').value);
                const security = document.getElementById('wifi-security').value;
                const hidden = document.getElementById('wifi-hidden').checked;

                if (!ssid) {
                    isValid = false;
                    errorMessage = 'Please enter a WiFi network name (SSID)';
                } else {
                    data = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
                }
                break;

            case 'phone':
                const phone = SecurityValidator.sanitizeInput(document.getElementById('phone-input').value);
                
                if (!phone) {
                    isValid = false;
                    errorMessage = 'Please enter a phone number';
                } else if (!SecurityValidator.isValidPhone(phone)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                } else {
                    data = `tel:${phone}`;
                }
                break;

            case 'vcard':
                const firstName = SecurityValidator.sanitizeInput(document.getElementById('vcard-firstname').value);
                const lastName = SecurityValidator.sanitizeInput(document.getElementById('vcard-lastname').value);
                const org = SecurityValidator.sanitizeInput(document.getElementById('vcard-org').value);
                const vcardPhone = SecurityValidator.sanitizeInput(document.getElementById('vcard-phone').value);
                const vcardEmail = SecurityValidator.sanitizeInput(document.getElementById('vcard-email').value);

                if (!firstName && !lastName) {
                    isValid = false;
                    errorMessage = 'Please enter at least a first or last name';
                } else {
                    // Validate email if provided
                    if (vcardEmail && !SecurityValidator.isValidEmail(vcardEmail)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    } else {
                        data = `BEGIN:VCARD\nVERSION:3.0\nFN:${firstName} ${lastName}\nN:${lastName};${firstName}\n`;
                        if (org) data += `ORG:${org}\n`;
                        if (vcardPhone) data += `TEL:${vcardPhone}\n`;
                        if (vcardEmail) data += `EMAIL:${vcardEmail}\n`;
                        data += 'END:VCARD';
                    }
                }
                break;

            case 'email':
                const emailAddress = SecurityValidator.sanitizeInput(document.getElementById('email-address').value);
                const subject = SecurityValidator.sanitizeInput(document.getElementById('email-subject').value);
                const message = SecurityValidator.sanitizeInput(document.getElementById('email-message').value);

                if (!emailAddress) {
                    isValid = false;
                    errorMessage = 'Please enter an email address';
                } else if (!SecurityValidator.isValidEmail(emailAddress)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                } else {
                    data = `mailto:${emailAddress}`;
                    if (subject || message) {
                        data += '?';
                        if (subject) data += `subject=${encodeURIComponent(subject)}`;
                        if (subject && message) data += '&';
                        if (message) data += `body=${encodeURIComponent(message)}`;
                    }
                }
                break;

            case 'text':
                const text = SecurityValidator.sanitizeInput(document.getElementById('text-input').value);
                
                if (!text) {
                    isValid = false;
                    errorMessage = 'Please enter some text content';
                } else {
                    data = SecurityValidator.limitTextLength(text);
                }
                break;
        }

        return { isValid, data, errorMessage };
    }

    generateQRCode(isAutoGenerated = false) {
        // Only hide error for manual generation, keep it for auto-generated
        if (!isAutoGenerated) {
            this.hideError();
        }
        
        const validation = this.validateAndSanitizeInput();
        
        if (!validation.isValid) {
            if (!isAutoGenerated) {
                this.showError(validation.errorMessage);
            }
            return;
        }

        // Hide error if validation passed during auto-generation
        if (isAutoGenerated) {
            this.hideError();
        }

        try {
            // Create QR code using qrcode-generator library
            const qr = qrcode(0, 'M');
            qr.addData(validation.data);
            qr.make();

            // Store for download
            this.qrCode = qr;
            this.qrData = validation.data;

            // Create SVG
            const svg = qr.createSvgTag({
                cellSize: 4,
                margin: 4,
                scalable: true
            });

            // Display QR code
            const qrDisplay = document.getElementById('qr-display');
            qrDisplay.innerHTML = svg;

            // Show result section
            document.getElementById('qr-placeholder').classList.add('hidden');
            document.getElementById('qr-result').classList.remove('hidden');

        } catch (error) {
            if (!isAutoGenerated) {
                this.showError('Failed to generate QR code. Please check your input and try again.');
            }
            console.error('QR Generation Error:', error);
        }
    }

    downloadQRCode(format) {
        if (!this.qrCode) {
            this.showError('Please generate a QR code first');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `qrcode-${timestamp}`;

        if (format === 'svg') {
            const svg = this.qrCode.createSvgTag({
                cellSize: 8,
                margin: 4,
                scalable: true
            });
            
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.svg`;
            a.click();
            
            URL.revokeObjectURL(url);
        } else if (format === 'png') {
            // Create canvas for PNG export
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 400;
            const moduleCount = this.qrCode.getModuleCount();
            const cellSize = size / moduleCount;
            
            canvas.width = size;
            canvas.height = size;
            
            // Fill background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            
            // Draw QR modules
            ctx.fillStyle = '#000000';
            for (let row = 0; row < moduleCount; row++) {
                for (let col = 0; col < moduleCount; col++) {
                    if (this.qrCode.isDark(row, col)) {
                        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                    }
                }
            }
            
            // Download
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}.png`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = SecurityValidator.htmlEncode(message);
        errorDiv.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    }
}

// Custom styles for buttons
const style = document.createElement('style');
style.textContent = `
    .qr-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 8px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-size: 13px;
        font-weight: 500;
        color: #6b7280;
        background-color: #ffffff;
        position: relative;
        overflow: hidden;
        min-height: 80px;
    }
    
    .qr-type-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        transition: left 0.3s ease;
    }
    
    .qr-type-btn:hover::before {
        left: 100%;
    }
    
    .qr-type-btn:hover {
        border-color: #3b82f6;
        color: #3b82f6;
        background-color: #f8fafc;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }
    
    .qr-type-btn.active {
        border-color: #3b82f6;
        color: #3b82f6;
        background-color: #eff6ff;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }
    
    .qr-type-btn.active:hover {
        background-color: #dbeafe;
        border-color: #2563eb;
        color: #2563eb;
    }
    
    .qr-type-btn svg {
        margin-bottom: 6px;
        flex-shrink: 0;
    }
    
    .qr-type-btn span {
        text-align: center;
        line-height: 1.2;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});