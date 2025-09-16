# QR Code Generator

A modern, secure QR code generator built with Vite, vanilla JavaScript, and Tailwind CSS. Create QR codes for URLs, WiFi networks, phone numbers, vCard contacts, emails, and plain text with real-time generation and multiple download formats.

## Features

- **Multiple QR Code Types**: URL, WiFi, Phone, vCard, Email, and Text
- **Real-time Generation**: Auto-generates QR codes as you type (after minimum content threshold)
- **Security First**: Built with OWASP security principles including XSS prevention and input sanitization
- **Multiple Export Formats**: Download as PNG or SVG
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful interface with smooth animations and hover effects
- **Modular Architecture**: Clean, maintainable code structure
- **Fast Performance**: Optimized builds with Vite and tree-shaking

## Tech Stack

- **Build Tool**: Vite 5.0
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS 3.4
- **QR Generation**: qrcode-generator library
- **Icons**: Lucide
- **Code Quality**: ESLint
- **CSS Processing**: PostCSS with Autoprefixer

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

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

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
qr-code-generator/
├── public/
│   └── favicon.svg         # App icon
├── src/
│   ├── js/
│   │   ├── managers/       # Feature managers
│   │   │   ├── FormManager.js
│   │   │   ├── QRManager.js
│   │   │   └── DownloadManager.js
│   │   ├── utils/          # Utility functions
│   │   │   └── SecurityValidator.js
│   │   └── QRCodeGenerator.js  # Main app class
│   ├── styles/
│   │   └── main.css        # Tailwind CSS and custom styles
│   └── main.js             # App entry point
├── index.html              # Main HTML file
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── .eslintrc.json          # ESLint configuration
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

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

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## Customization

### Styling
Modify Tailwind classes in the HTML or add custom styles in `src/styles/main.css`.

### QR Code Settings
Adjust parameters in `src/js/managers/QRManager.js`:
- Cell size and margin
- Error correction level
- Output formats

### Security Settings
Modify validation rules in `src/js/utils/SecurityValidator.js`:
- Text length limits
- URL validation patterns
- Input sanitization rules

## Deployment Options

### Static Hosting (Recommended)

The built application is a static site that can be deployed anywhere:

**Netlify:**
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

**GitHub Pages:**
1. Build the project: `npm run build`
2. Deploy the `dist` folder contents

### Traditional Web Servers

Upload the built files from the `dist` directory to any web server:
- Apache
- Nginx
- IIS
- Any static file server

### Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code style
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Performance Features

- **Tree Shaking**: Unused code is automatically removed
- **Code Splitting**: Optimized bundle sizes
- **Fast Refresh**: Instant updates during development
- **Optimized Assets**: Minified CSS and JavaScript
- **Modern Build**: ES6+ with fallbacks for older browsers

---

**Built with modern web technologies and best practices**