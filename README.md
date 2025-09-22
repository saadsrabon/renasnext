# Renas PRESS - News Website

A modern, pixel-perfect news website with dark/light theme support, Arabic/English translation, forum functionality, and video upload features.

## Features

- 🌙 **Dark/Light Theme** - Toggle between themes with smooth transitions
- 🌍 **Internationalization** - Arabic (default) and English support with RTL layout
- 📱 **Mobile Responsive** - Fully responsive design for all screen sizes
- 🎨 **Pixel Perfect Design** - Based on provided mockups with exact color matching
- 💬 **Forum System** - Interactive discussion forums with categories
- 📹 **Video Upload** - Drag & drop video upload with progress tracking
- 🎯 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- ⚡ **Fast Performance** - Built with Next.js 14 and optimized for speed

## Design System

### Color Palette
- **Primary Gold**: `#C29B4A` (renas-gold-600)
- **Brown Accent**: `#8B6F3E` (renas-brown-600)
- **Beige Background**: `#F8F5EC` (renas-beige-50)
- **Dark Theme**: Custom dark colors for professional appearance

### Typography
- **Headings**: Tiro Bangla (for Arabic text)
- **Body**: Inter (modern sans-serif)
- **RTL Support**: Full right-to-left layout support for Arabic

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd renaspress
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Routes

- `/ar` - Arabic homepage (default)
- `/en` - English homepage
- `/ar/login` - Login page (Arabic)
- `/en/login` - Login page (English)
- `/ar/signup` - Signup page (Arabic)
- `/en/signup` - Signup page (English)
- `/ar/forums` - Forum page (Arabic)
- `/en/forums` - Forum page (English)
- `/ar/upload` - Video upload page (Arabic)
- `/en/upload` - Video upload page (English)

## Project Structure

```
renaspress/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── forums/         # Forum page
│   │   ├── upload/         # Video upload page
│   │   └── page.tsx        # Homepage
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── header.tsx          # Main header component
│   ├── news-card.tsx       # News card components
│   ├── forum-section.tsx   # Forum functionality
│   ├── video-upload.tsx    # Video upload component
│   ├── theme-provider.tsx  # Theme context
│   ├── theme-toggle.tsx    # Theme toggle button
│   └── language-toggle.tsx # Language toggle button
├── lib/
│   └── utils.ts            # Utility functions
├── messages/               # Translation files
│   ├── ar.json            # Arabic translations
│   └── en.json            # English translations
└── middleware.ts           # Next.js middleware for i18n
```

## Customization

### Adding New Languages
1. Add new locale to `middleware.ts`
2. Create translation file in `messages/`
3. Update `i18n.ts` configuration

### Theme Customization
- Modify colors in `tailwind.config.js`
- Update CSS variables in `app/globals.css`
- Customize component variants in UI components

### Adding New Pages
1. Create new route in `app/[locale]/`
2. Add translations to message files
3. Update navigation in `components/header.tsx`

## WordPress Integration

This frontend is designed to work with WordPress as the backend. The design includes:

- **REST API Integration** - Ready for WordPress REST API
- **Headless Architecture** - Clean separation of frontend and backend
- **SEO Optimized** - Meta tags and structured data ready
- **Performance Focused** - Optimized for fast loading

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
