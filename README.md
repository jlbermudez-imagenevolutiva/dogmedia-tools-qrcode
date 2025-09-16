# QR Code Generator

A modern, secure QR code generator built with vanilla HTML, CSS (Tailwind), and JavaScript. Create QR codes for URLs, WiFi networks, phone numbers, vCard contacts, emails, and plain text with real-time generation and multiple download formats.

## Features

- **Multiple QR Code Types**: URL, WiFi, Phone, vCard, Email, and Text
- **Real-time Generation**: Auto-generates QR codes as you type (after 8 characters)
- **Security First**: Built with OWASP security principles including XSS prevention and input sanitization
- **Multiple Export Formats**: Download as PNG or SVG
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Beautiful UI**: Modern interface with smooth hover effects and animations
- **No Framework Dependencies**: Pure vanilla JavaScript for fast loading

## Quick Start

### Prerequisites

- Node.js (version 12 or higher)
- npm

### Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **QR Generation**: qrcode-generator library (via Cloudflare CDN)
- **Icons**: Lucide React
- **Server**: http-server (for development)

## Supported QR Code Types

### 1. URL
- Generate QR codes for websites and web links
- Automatic URL validation with http/https protocol checking

### 2. WiFi Network
- Share WiFi credentials easily
- Supports WPA/WPA2, WEP, and open networks
- Hidden network support
- Auto-generates WiFi configuration strings

### 3. Phone Number
- Create QR codes for phone numbers
- International format support with country codes
- Opens default dialer when scanned

### 4. vCard (Contact)
- Digital business cards
- Fields: First/Last name, Organization, Phone, Email
- Compatible with most contact apps

### 5. Email
- Pre-filled email composition
- Optional subject and message fields
- Opens default email client when scanned

### 6. Plain Text
- Any text content up to 2953 characters
- Perfect for notes, messages, or data sharing

## Security Features

- **XSS Prevention**: All user inputs are sanitized and HTML-encoded
- **Input Validation**: Comprehensive validation for URLs, emails, and phone numbers
- **Safe Rendering**: No direct HTML injection, all content is safely processed
- **Data Limits**: Text length limits to prevent QR code complexity issues

## Download Options

- **PNG Format**: High-resolution raster image (400x400px)
- **SVG Format**: Scalable vector graphics for perfect quality at any size
- **Timestamped Filenames**: Automatic filename generation with date/time

## UI/UX Features

- **Auto-Generation**: QR codes generate automatically as you type
- **Real-time Validation**: Instant feedback on input errors
- **Smooth Animations**: Polished hover effects and transitions
- **Responsive Grid**: Adapts to different screen sizes
- **Visual Feedback**: Clear active states and loading indicators

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Options

### Option 1: Static Hosting (Recommended)

Deploy to any static hosting service:

**Netlify:**
1. Drag and drop the project folder to Netlify
2. Your app will be live instantly

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

**GitHub Pages:**
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch

### Option 2: Traditional Web Server

Upload all files to your web server's public directory:
- Apache
- Nginx  
- IIS
- Any static file server

### Option 3: Docker

Create a `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t qr-generator .
docker run -p 80:80 qr-generator
```

## Configuration

### Customization Options

**Colors**: Modify the Tailwind CSS classes in `index.html` and custom styles in `script.js`

**QR Code Settings**: Adjust parameters in the `generateQRCode()` method:
- `cellSize`: Module size (default: 4)
- `margin`: Border size (default: 4) 
- Error correction level (default: 'M' - Medium)

**Security Settings**: Modify validation rules in `SecurityValidator` object:
- Text length limits
- URL validation patterns
- Input sanitization rules

## Project Structure

```
qr-code-generator/
├── index.html          # Main HTML file
├── script.js           # JavaScript application logic
├── package.json        # Dependencies and scripts
└── README.md          # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Bug Reports

If you find any bugs or have feature requests, please create an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information

## Tips for Best Results

- Use high contrast colors for better scanning
- Test QR codes with multiple scanner apps
- Keep text content under 2953 characters
- Include country codes for phone numbers
- Use HTTPS URLs when possible

---

**Made with care using vanilla JavaScript and modern web standards**
