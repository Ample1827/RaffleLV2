# RafflePro - Premium Raffle Landing Page

A modern, responsive raffle website built with Next.js 14, TypeScript, and Tailwind CSS featuring dark/light mode support and premium gold accents.

## Features

- 🎨 **Premium Design**: Dark theme with elegant gold accents and luxury styling
- 🌓 **Theme Toggle**: Seamless dark/light mode switching
- 📱 **Fully Responsive**: Optimized for all device sizes
- ⚡ **Performance**: Built with Next.js 14 and optimized components
- 🎯 **Complete Sections**: Hero, prizes, ticket purchasing, validation, and more
- 🔧 **TypeScript**: Full type safety throughout the application
- 🎭 **Animations**: Smooth transitions and engaging micro-interactions

## Quick Start

1. **Clone or download** this project
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Run development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles with theme variables
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main landing page
├── components/
│   ├── sections/            # Page sections (hero, prizes, etc.)
│   ├── ui/                  # Reusable UI components
│   ├── navbar.tsx           # Navigation with theme toggle
│   ├── theme-provider.tsx   # Theme context provider
│   └── theme-toggle.tsx     # Dark/light mode toggle
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── public/                  # Static assets and images
\`\`\`

## Customization

### Colors & Theming
- Edit `app/globals.css` to modify the color scheme
- Adjust theme variables for both dark and light modes
- Gold accent colors can be customized in the CSS custom properties

### Content
- Update prize information in `components/sections/prizes-*.tsx`
- Modify hero content in `components/sections/hero.tsx`
- Customize testimonials and stats in their respective section files

### Styling
- All components use Tailwind CSS classes
- Premium effects are defined in `globals.css`
- Responsive breakpoints follow Tailwind's standard system

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Other Platforms
\`\`\`bash
npm run build
npm start
\`\`\`

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **next-themes** - Theme switching functionality

## License

This project is ready for commercial use. Customize and deploy as needed for your raffle business.
