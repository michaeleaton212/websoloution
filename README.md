# Websoloutions Beta - Project Structure

Modern hotel booking website with clean, modular architecture.

## 📁 Project Structure

```
websoloutions_Beta/
│
├── index.html                 # Root entry point (redirects to home)
│
├── partials/                  # Shared components (reusable navbar)
│   ├── navbar.html           # Navbar HTML template
│   ├── navbar.css            # Navbar styles
│   ├── navbar.js             # Navbar interactive logic
│   ├── navbar.ts             # Angular TypeScript component (if using Angular)
│   └── navbar-loader.js      # Utility to load navbar into pages
│
├── home/                      # Home page
│   ├── index.html            # Home page HTML
│   ├── styles.css            # Home page styles
│   └── script.js             # Home page JavaScript
│
├── rooms/                     # Available rooms page
│   ├── index.html            # Rooms listing HTML
│   ├── styles.css            # Rooms page styles
│   └── script.js             # Rooms page JavaScript (booking logic)
│
└── manage-booking/            # Booking management page
    ├── index.html            # Booking form HTML
    ├── styles.css            # Booking page styles
    └── script.js             # Booking form logic
```

## 🚀 How It Works

### Navbar Integration
The navbar is automatically loaded on every page using the **navbar-loader.js** utility:

1. Each page includes: `<div id="navbar-placeholder"></div>`
2. Each page loads: `<script src="../partials/navbar-loader.js"></script>`
3. The loader fetches `partials/navbar.html` and injects it into the placeholder
4. The navbar appears consistently across all pages without code duplication

### Navigation Flow
- **Home** (`/home/index.html`) - Landing page with features
- **Available Rooms** (`/rooms/index.html`) - Room listings with "Book Now" buttons
- **Manage Booking** (`/manage-booking/index.html`) - Booking form and lookup

### Page-to-Page Communication
- When clicking "Book Now" on a room, the room details are stored in `sessionStorage`
- The manage-booking page reads from `sessionStorage` and pre-fills the booking form
- Booking references are also stored in `sessionStorage` for lookup

## 🎨 Features

### Responsive Design
- Desktop and mobile layouts
- Bottom navigation bar on mobile devices
- Glassmorphism UI design with backdrop blur effects

### Language Support
- English / Deutsch language switcher in navbar
- Path-based locale switching (`/de/` prefix for German)
- Angular i18n compatible

### Booking System
- Room selection from catalog
- Date picker with price calculation
- Booking confirmation with reference number
- Booking lookup by reference

## 🔧 Usage

### Opening in Browser
Simply open any page directly:
```
file:///C:/Users/micha/Desktop/websoloutions_Beta/home/index.html
```

Or start from the root:
```
file:///C:/Users/micha/Desktop/websoloutions_Beta/index.html
```

### Local Development Server
For better testing (avoids CORS issues with fetch), use a local server:

```powershell
# Using Python
cd C:\Users\micha\Desktop\websoloutions_Beta
python -m http.server 8000

# Using Node.js (if installed)
npx serve .

# Then open: http://localhost:8000
```

### Angular Integration
The navbar includes Angular directives (`[routerLink]`, `*ngIf`, etc.) for seamless integration:
- Use `navbar.ts` as the component
- Import into your Angular module
- The HTML template supports both standalone and Angular usage

## 📝 Customization

### Adding a New Page
1. Create a new folder: `your-page/`
2. Add `index.html`, `styles.css`, `script.js`
3. Include navbar loader in HTML:
   ```html
   <div id="navbar-placeholder"></div>
   <script src="../partials/navbar-loader.js"></script>
   ```
4. Update `partials/navbar.html` to add the link

### Styling
- Each page has its own `styles.css` for page-specific styles
- `navbar.css` contains shared navigation styles
- Global background and font settings in individual page styles

## 🌐 Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- CSS Grid and Flexbox
- ES6 JavaScript features
- Backdrop-filter effects (with fallbacks)

## 📄 License
Private project - All rights reserved

---
**Created:** January 2026
**Version:** Beta
