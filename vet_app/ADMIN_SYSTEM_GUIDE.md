# Veterinary Clinic Admin System

## 🎯 Overview

This is a Progressive Web App (PWA) built with React and Vite for managing a veterinary clinic. It includes admin authentication, dashboard features, and integrates with a Laravel backend API.

## 🚀 Features

### Frontend Features
- ✅ **PWA Support** - Installable, offline-capable
- ✅ **Admin Authentication** - Secure login with JWT tokens
- ✅ **Responsive Dashboard** - Modern UI with shadcn/ui components
- ✅ **API Integration** - Axios-based API communication
- ✅ **Real-time Updates** - PWA update notifications
- ✅ **Install Prompts** - Native app-like installation

### Backend Features (Laravel)
- ✅ **Admin API** - Login, logout, profile endpoints
- ✅ **JWT Authentication** - Laravel Sanctum tokens
- ✅ **Database Seeder** - Pre-configured admin users

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.3** - Build tool
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons
- **PWA Plugin** - Progressive Web App features

### Backend
- **Laravel** - PHP framework
- **Laravel Sanctum** - API authentication
- **MySQL** - Database (via MAMP)

## 📁 Project Structure

```
vet_app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Label.jsx
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Login.jsx        # Login form
│   │   ├── ProtectedRoute.jsx
│   │   ├── PWAInstallPrompt.jsx
│   │   └── PWAUpdatePrompt.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── lib/
│   │   ├── api.js          # Axios configuration
│   │   └── utils.js        # Utility functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css           # Tailwind CSS + custom styles
├── public/
├── dist/                   # Build output
├── .env                    # Environment variables
├── vite.config.js          # Vite + PWA configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## 🔧 Environment Configuration

### Frontend (.env)
```
VITE_APP_URL=http://vet.clinic
```

### Laravel Backend
- API Base URL: `http://vet.clinic/api`
- Admin endpoints: `/api/admin/*`

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd vet_app
npm install
```

### 2. Development Mode
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 🔐 Authentication

### Demo Admin Credentials
- **Username:** `admin`
- **Email:** `admin@vetclinic.com`
- **Password:** `admin123`

### Additional Test Users
- **Dr. John Smith:**
  - Username: `drsmith`
  - Email: `drsmith@vetclinic.com`
  - Password: `password123`

## 📱 PWA Features

### Installation
1. Open the app in a modern browser (Chrome, Edge, Safari)
2. Look for the "Install" button in the address bar
3. Or click the install prompt that appears on the app

### Offline Support
- The app caches resources for offline use
- Service worker handles background updates
- Users get notified when updates are available

### App Manifest
- **Name:** Veterinary Clinic App
- **Short Name:** VetApp
- **Theme Color:** #ffffff
- **Background Color:** #ffffff
- **Display Mode:** standalone

## 🔌 API Integration

### Base Configuration
```javascript
// src/lib/api.js
const api = axios.create({
  baseURL: 'http://vet.clinic',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})
```

### Authentication Flow
1. User submits login credentials
2. Frontend sends POST to `/api/admin/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token included in all subsequent requests
6. Auto-logout on token expiration

### Available Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout  
- `GET /api/admin/profile` - Get admin profile

## 🎨 UI Components

### shadcn/ui Components Used
- **Button** - Various button styles and sizes
- **Card** - Dashboard cards and containers
- **Input** - Form input fields
- **Label** - Form labels

### Color Scheme
- Primary: Blue (#3b82f6)
- Secondary: Gray (#6b7280)
- Success: Green (#10b981)
- Destructive: Red (#ef4444)

## 📊 Dashboard Features

### Admin Profile Section
- Display admin name, email, username
- User ID for identification
- Real-time profile data from API

### Statistics Cards
- Total Patients: 1,234 (mock data)
- Appointments Today: 23 (mock data)
- Active Staff: 12 (mock data)
- Recent Records: 89 (mock data)

### Quick Actions
- View Appointments button
- Patient Records button
- Manage Staff button

### PWA Status
- Shows PWA features are enabled
- Installation encouragement

## 🔄 State Management

### Authentication State
- Managed via React Context (`AuthContext`)
- Persistent login via localStorage
- Automatic token validation on app start
- Graceful logout handling

### Loading States
- Loading spinner during authentication check
- Button loading states during form submission
- Error handling with user-friendly messages

## 🛡️ Security Features

- JWT token authentication
- Automatic token refresh handling
- Secure token storage in localStorage
- API request/response interceptors
- Protected routes with authentication checks
- CORS headers for cross-origin requests

## 🚀 Deployment

### Production Build
1. Ensure environment variables are set
2. Run `npm run build`
3. Deploy `dist/` folder to web server
4. Ensure HTTPS for PWA features
5. Configure service worker caching

### PWA Requirements for Production
- HTTPS connection
- Valid SSL certificate
- Service worker registration
- Web app manifest
- Responsive design
- Offline functionality

## 🔧 Development Tips

### Adding New API Endpoints
1. Add function to `src/lib/api.js`
2. Use in components via async/await
3. Handle errors appropriately
4. Update loading states

### Adding New Components
1. Create component in `src/components/`
2. Use shadcn/ui base components
3. Apply Tailwind CSS classes
4. Follow naming conventions

### Styling Guidelines
- Use Tailwind CSS classes
- Follow shadcn/ui design system
- Maintain consistent spacing (4px grid)
- Use CSS variables for theme colors

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors with Tailwind**
   - Ensure PostCSS config is correct
   - Check Tailwind version compatibility
   - Verify content paths in config

2. **API Connection Issues**
   - Check VITE_APP_URL in .env
   - Verify CORS settings in Laravel
   - Ensure backend is running

3. **PWA Not Installing**
   - Requires HTTPS in production
   - Check browser console for manifest errors
   - Verify service worker registration

### Debug Commands
```bash
# Check build output
npm run build

# Start dev server with network access
npm run dev -- --host

# Check for ESLint issues
npm run lint
```

## 📝 TODO / Future Enhancements

- [ ] Add patient management features
- [ ] Implement appointment scheduling
- [ ] Add staff management
- [ ] Create reporting dashboard
- [ ] Add push notifications
- [ ] Implement data export features
- [ ] Add role-based permissions
- [ ] Create mobile-responsive improvements

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check network tab for API issues
4. Verify environment configuration

---

**Built with ❤️ for veterinary clinics**
