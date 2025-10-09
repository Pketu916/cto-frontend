# CTO India - Complete Technology Solutions Platform

## 🚀 Project Overview

CTO India एक comprehensive technology solutions platform है जो businesses को digital transformation में मदद करता है। यह platform customers, service providers, और administrators के लिए complete ecosystem provide करता है।

## ✨ Features

### 🏠 **Home Page**

- Modern hero section with company introduction
- Business sections highlighting services
- Interactive service showcase
- Call-to-action sections
- Professional footer with links

### 🛠️ **Services Page**

- Comprehensive service listings
- Advanced search and filtering
- Category-based organization
- Service booking functionality
- Responsive grid layout

### 📖 **About Page**

- Company mission and vision
- Team member profiles
- Company statistics and achievements
- Values and principles
- Professional testimonials

### 📞 **Contact Page**

- Multiple contact methods (phone, email, address)
- Interactive contact form
- Office location with map
- Quick contact options
- FAQ section

### 💰 **Pricing Page**

- Flexible pricing plans
- Monthly/Yearly billing options
- Feature comparisons
- Add-on services
- FAQ section

### 📝 **Blog Page**

- Technology articles and insights
- Category-based filtering
- Featured posts section
- Author profiles
- Newsletter subscription

### 👤 **Profile Page**

- User profile management
- Professional information
- Social links
- Statistics dashboard
- Quick actions

### ⚙️ **Settings Page**

- Account settings
- Notification preferences
- Privacy controls
- Security settings
- Business settings (for providers)

### 🔐 **Authentication**

- Login/Register functionality
- User type selection (Customer/Provider/Admin)
- Demo credentials for testing
- Protected routes
- Session management

### 📱 **Responsive Design**

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Cross-browser compatibility

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **Vite** - Fast build tool

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── cards/          # Card components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   ├── navigation/     # Navigation components
│   │   ├── sections/       # Page sections
│   │   ├── services/       # Service-related components
│   │   └── ui/             # UI components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   └── ...             # Other pages
│   ├── services/           # API services
│   ├── data/               # Static data
│   └── hooks/              # Custom hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ctoIndia
   ```

2. **Install dependencies**

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Create .env files
   cp .env.example .env
   ```

4. **Start Development Servers**

   ```bash
   # Frontend (Terminal 1)
   cd frontend
   npm run dev

   # Backend (Terminal 2)
   cd backend
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 User Types & Demo Credentials

### Customer

- **Email:** user@example.com
- **Password:** user123
- **Access:** Service booking, profile management

### Service Provider

- **Email:** provider@example.com
- **Password:** provider123
- **Access:** Service management, booking requests

### Administrator

- **Email:** admin@ctoindia.com
- **Password:** admin123
- **Access:** User management, system administration

## 📱 Pages & Features

### Public Pages

- **Home** (`/`) - Landing page with company overview
- **Services** (`/services`) - Service listings with search/filter
- **About** (`/about`) - Company information and team
- **Contact** (`/contact`) - Contact form and information
- **Pricing** (`/pricing`) - Pricing plans and features
- **Blog** (`/blog`) - Technology articles and insights
- **Login** (`/login`) - User authentication
- **Register** (`/register/*`) - User registration

### Protected Pages

- **Profile** (`/profile`) - User profile management
- **Settings** (`/settings`) - Account and app settings
- **User Dashboard** (`/user/dashboard`) - Customer dashboard
- **Provider Dashboard** (`/provider/dashboard`) - Service provider dashboard
- **Admin Dashboard** (`/admin/dashboard`) - Administrator dashboard

### Error Pages

- **404 Not Found** (`/*`) - Custom error page

## 🎨 Design System

### Colors

- **Primary:** Blue (#2563eb)
- **Secondary:** Indigo (#4f46e5)
- **Success:** Green (#10b981)
- **Warning:** Yellow (#f59e0b)
- **Error:** Red (#ef4444)
- **Gray:** Various shades for text and backgrounds

### Typography

- **Headings:** Inter, system fonts
- **Body:** System fonts with fallbacks
- **Font Sizes:** Responsive scale from 12px to 48px

### Components

- **Cards:** Consistent shadow and border radius
- **Buttons:** Multiple variants (primary, secondary, outline)
- **Forms:** Clean input styling with validation
- **Navigation:** Responsive header with mobile menu

## 🔧 Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database with sample data
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)

### Bookings

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status

## 📊 Database Schema

### Users

```javascript
{
  name: String,
  email: String,
  password: String,
  userType: String, // 'user', 'provider', 'admin'
  phone: String,
  address: Object,
  profile: Object
}
```

### Services

```javascript
{
  title: String,
  description: String,
  category: String,
  price: Number,
  duration: String,
  features: Array,
  provider: ObjectId
}
```

### Bookings

```javascript
{
  user: ObjectId,
  service: ObjectId,
  provider: ObjectId,
  status: String,
  scheduledDate: Date,
  notes: String
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **Input Validation** - Yup schema validation
- **Protected Routes** - Role-based access control
- **CORS Configuration** - Cross-origin request handling
- **Environment Variables** - Sensitive data protection

## 📈 Performance Optimizations

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Responsive images
- **Caching** - API response caching
- **Bundle Optimization** - Vite build optimization
- **Lazy Loading** - Route-based code splitting

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Service browsing and filtering
- [ ] Booking functionality
- [ ] Profile management
- [ ] Settings configuration
- [ ] Responsive design on all devices
- [ ] Error handling and validation

### Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)

```bash
# Set environment variables
# Deploy with MongoDB Atlas connection
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:

- **Email:** support@ctoindia.com
- **Phone:** +91-9876543210
- **Website:** https://ctoindia.com

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Video calling integration
- [ ] Document management system
- [ ] Advanced reporting tools

---

**Made with ❤️ by CTO India Team**
