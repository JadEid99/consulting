# Consulting Pro - Professional Consulting Website

A modern, responsive single-page website built with React + Vite, designed for professional consulting services. The website features a beautiful design that works seamlessly on both desktop and mobile devices.

## Features

- 🎨 **Modern Design**: Clean, professional design with smooth animations
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- 🎯 **SEO Optimized**: Proper meta tags and semantic HTML structure
- ♿ **Accessible**: WCAG compliant with proper focus states and keyboard navigation
- 🚀 **GitHub Pages Ready**: Configured for easy deployment

## Sections

1. **Hero Section**: Eye-catching introduction with call-to-action
2. **Services**: Showcase of consulting services with icons
3. **About**: Company information with statistics
4. **Contact**: Contact form and business information
5. **Footer**: Additional links and company details

## Technologies Used

- **React 19**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **CSS3**: Modern CSS with Grid, Flexbox, and custom properties
- **GitHub Pages**: Hosting and deployment

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/consulting.git
cd consulting
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

### Initial Setup

1. **Update the homepage URL** in `package.json`:
   Replace `yourusername` with your actual GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/consulting"
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select the `gh-pages` branch
   - Save the settings

### Custom Domain Setup

To use a custom domain:

1. **Add your custom domain** to the repository:
   - Go to Settings > Pages
   - Enter your custom domain in the "Custom domain" field
   - Save the settings

2. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://yourdomain.com"
   ```

3. **Update the base path** in `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/',
   })
   ```

4. **Redeploy**:
   ```bash
   npm run deploy
   ```

5. **Configure DNS**:
   - Add a CNAME record pointing to `yourusername.github.io`
   - Or add A records pointing to GitHub Pages IP addresses

## Customization

### Colors and Branding

The website uses a modern color scheme that can be easily customized in `src/App.css`:

- Primary Blue: `#2563eb`
- Secondary Purple: `#667eea` to `#764ba2` (gradient)
- Text Colors: `#1e293b`, `#64748b`
- Background: `#f8fafc`, `#ffffff`

### Content

Update the content in `src/App.jsx` to match your business:

- Company name and tagline
- Services offered
- About section content
- Contact information
- Statistics and achievements

### Images

Replace the placeholder emojis with actual images:

1. Add your images to the `public` folder
2. Import them in `src/App.jsx`
3. Replace the placeholder divs with `<img>` tags

## Project Structure

```
consulting/
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── App.css         # Styles for the application
│   └── main.jsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue on GitHub or contact us at hello@consultingpro.com.

---

Built with ❤️ using React + Vite
