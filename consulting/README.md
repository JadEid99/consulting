# Topology VC Website Clone

This is a React-based clone of the [Topology VC website](https://www.topology.vc/) with smooth parallax scrolling animations and modern design.

## Features

- **Parallax Scrolling**: Smooth scroll animations with Framer Motion
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Clean, minimalist design with glassmorphism effects
- **Interactive Elements**: Hover animations and smooth transitions
- **TypeScript**: Full TypeScript support for better development experience

## Sections

1. **Header**: Fixed navigation with smooth scroll links
2. **Hero**: Main landing section with "Meet us at the edge" headline
3. **About**: "You jump... We jump..." animation and company description
4. **Principles**: Three core principles with inspirational quotes
5. **Team**: Team member profiles and "Supported by" section
6. **Public Goods**: Contact information and footer

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd consulting
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Customization Guide

### Changing Text Content

#### 1. Hero Section (`src/components/Hero.tsx`)
```typescript
// Change the main headline
<MainTitle>
  Meet us<br />
  at the edge.
</MainTitle>

// Change the subtitle
<Subtitle>
  We're a frontier tech venture firm with an engineering-first approach.
</Subtitle>
```

#### 2. About Section (`src/components/About.tsx`)
```typescript
// Change the jumping animation text
<JumpText>You jump...</JumpText>
<JumpText>We jump...</JumpText>

// Change the name origin description
<NameDescription>
  Inspired by topological dimension reduction...
</NameDescription>

// Change "What we do" and "How we do it" content
<SectionContent>
  We partner with brilliant technologists...
</SectionContent>
```

#### 3. Principles Section (`src/components/Principles.tsx`)
```typescript
const principles = [
  {
    title: "Execute with Vision.",
    description: "The greatest impact emerges...",
    quote: "Vision without action is a daydream...",
    author: "Japanese Proverb"
  },
  // Add or modify principles here
];
```

#### 4. Team Section (`src/components/Team.tsx`)
```typescript
const teamMembers = [
  {
    name: "Casey Caruso",
    role: "Investing",
    background: "[x‑Google, x‑Bessemer, x‑Paradigm]",
    initial: "C"
  },
  // Add or modify team members here
];

const supportedBy = [
  "Co-founder of OpenAI",
  "Marc Andreessen",
  // Add or modify supporters here
];
```

#### 5. Contact Information (`src/components/PublicGoods.tsx`)
```typescript
// Change the email address
<ContactEmail href="mailto:hello@topology.vc">
  hello@topology.vc
</ContactEmail>

// Change the copyright year
<Copyright>Topology ©2025</Copyright>
```

### Changing Colors and Styling

#### 1. Color Scheme
The website uses a dark theme with these main colors:
- Background: `#000` (black)
- Secondary Background: `#111` (dark gray)
- Text: `white`
- Accent: `#888` (light gray)

To change colors, update the styled-components in each component file.

#### 2. Typography
The website uses system fonts with light weights (300). To change fonts:
1. Update the `font-family` in `src/App.tsx` and `src/index.css`
2. Modify font weights in styled components

### Adding Images

To add profile images for team members:

1. Place images in `src/assets/` directory
2. Import and use in `Team.tsx`:
```typescript
import profileImage from '../assets/casey-caruso.jpg';

// Replace the ProfileImage div with:
<ProfileImage src={profileImage} alt={member.name} />
```

### Adding New Sections

1. Create a new component in `src/components/`
2. Follow the existing pattern with styled-components and Framer Motion
3. Add the section to `src/App.tsx`
4. Add navigation link in `src/components/Header.tsx`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animation library
- **React Intersection Observer** - Scroll-based animations

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. The original design belongs to Topology VC.

## Support

For questions or issues, please open an issue in the repository.
