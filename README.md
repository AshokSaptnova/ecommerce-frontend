# 🛒 SAPTNOVA eCommerce – Frontend (React)

React-based single-page application for the Saptnova multi-vendor eCommerce platform. Connects to the FastAPI backend and provides a modern shopping experience with cart, wishlist, checkout, Razorpay payments, and vendor/admin panels.

## ✨ Key Features
- React 18 with functional components & hooks
- React Router v6 (multi-layout: customer, vendor, admin)
- Context API for auth, cart, wishlist, notifications
- Razorpay checkout integration (`razorpay.js` service)
- Responsive UI with Tailwind-like custom SCSS
- Component library for forms, modals, tables, data grids
- Customer dashboard (orders, addresses, wishlist)
- Vendor dashboard (products, orders, analytics)
- Admin back office (catalog, vendors, customers)

## 📁 Project Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   ├── assets/
│   ├── apps/
│   │   ├── customer/
│   │   ├── vendor/
│   │   └── admin/
│   ├── shared/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/      # api.js, razorpay.js, ...
│   │   └── utils/
│   └── styles/
├── package.json
└── vercel.json / netlify.toml
```

## ⚙️ Local Development
```bash
# 1. Clone the repository
git clone https://github.com/AshokSaptnova/ecommerce-frontend.git
cd ecommerce-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.production.example .env.local
# Edit .env.local
# REACT_APP_API_URL=http://127.0.0.1:8000
# REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx

# 4. Start dev server
npm start
# App available at http://localhost:3000
```

## 🔧 Environment Variables
Create `.env.local` (for development) or `.env.production` for deployment.

```
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx
REACT_APP_ENV=development
```

⚠️ Never commit `.env.*` files with secrets.

## 🧪 Testing
```bash
npm test          # Run unit tests (if configured)
npm run lint      # Run ESLint
npm run build     # Verify production build
```

## 🏗️ Build for Production
```bash
npm run build
# Outputs optimized assets to /build
```
Deploy the `build/` directory to any static hosting (Vercel, Netlify, S3, etc.).

## 🌐 Deployment Options

### Vercel (Recommended)
1. Connect GitHub repo in Vercel dashboard.
2. Build command: `npm run build`
3. Output directory: `build`
4. Add environment variables in Vercel → Settings → Environment Variables.
5. Deploy. Custom domain supported.

### Netlify
- Use included `netlify.toml`.
- Drag & drop `build` folder or connect repo.

### Any Static Host
- Upload contents of `build/`.
- Ensure SPA fallback to `/index.html` (configured in `vercel.json` / `netlify.toml`).

## 🔗 Backend Integration
Ensure backend CORS allows the frontend origin:
```
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## 🛡️ Security & UX Enhancements
- Uses centralized API client (`shared/services/api.js`)
- Handles token refresh & auth redirects
- Graceful error handling (`shared/utils/errorHandler.js`)
- Loading states & notifications

## 🗂️ Scripts
`package.json` useful scripts:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## 🤝 Contributing
1. Fork repo → create feature branch.
2. Use descriptive commit messages.
3. Run linters/tests before PR.
4. Submit PR with screenshots (UI changes) or endpoint details.

## 📄 License
MIT License © Saptnova

## 👨‍💻 Maintainer
**Ashok Saptnova**  
GitHub: [@AshokSaptnova](https://github.com/AshokSaptnova)

---
Need help? Open an issue on GitHub or ping the Saptnova engineering team.
