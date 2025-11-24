# Les Délices du Verger - E-Commerce Web Application

A full-featured Next.js e-commerce web application for Les Délices du Verger, providing a customer-facing shopping experience for fresh fruits, vegetables, and specialty products.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## ✅ Implemented Features

### Foundation & Setup
- ✅ Next.js 15 with App Router and TypeScript
- ShadCN UI components integrated
- ✅ Tailwind CSS configured
- ✅ Zustand state management with persistence
- ✅ React Query for data fetching
- ✅ Axios API client with auto-refresh
- ✅ Environment variables configured

### Backend Integration
- ✅ API client with authentication interceptors
- ✅ TypeScript types matching backend models
- ✅ Auth API (register, login, profile, password recovery)
- ✅ Products API (list, filters, single product)
- ✅ Orders API (list, create, details)
- ✅ Payments API (Stripe, PayPal)
- ✅ Discounts API (validate codes)

### Core Infrastructure
- ✅ Global state store (auth, cart, favorites, UI)
- ✅ Constants (categories, delivery zones, pickup locations)
- ✅ Utility functions (formatting, variant display)
- ✅ Protected route wrapper
- ✅ Providers setup (React Query)

### Pages & Components
- ✅ Homepage with hero and features
- ✅ Root layout with metadata
- ⏳ Products listing page
- ⏳ Product detail page
- ⏳ Shopping cart page
- ⏳ Checkout flow
- ⏳ Login/Register pages
- ⏳ Order history
- ⏳ User profile

## 📋 Next Steps to Complete

### Priority 1: Authentication Pages
Create the following files:
1. `app/(auth)/login/page.tsx` - Login form with email/password
2. `app/(auth)/register/page.tsx` - Registration form
3. `app/(auth)/forgot-password/page.tsx` - Password recovery

### Priority 2: Product Pages
Create:
1. `app/products/page.tsx` - Products listing with filters
2. `app/products/[id]/page.tsx` - Product detail with variant selector
3. `components/product-card.tsx` - Reusable product card component

### Priority 3: Cart & Checkout
Create:
1. `app/cart/page.tsx` - Shopping cart management
2. `app/checkout/page.tsx` - Multi-step checkout
3. `components/checkout/*` - Checkout form components

### Priority 4: Order Management
Create:
1. `app/orders/page.tsx` - Order history (protected)
2. `app/orders/[id]/page.tsx` - Order details

### Priority 5: Components
Create shared components:
1. `components/header.tsx` - Main navigation header
2. `components/footer.tsx` - Site footer
3. `components/product-grid.tsx` - Product display grid
4. `components/category-filter.tsx` - Category chips

## 🔧 Environment Variables

The `.env.local` file has been configured with:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal client ID

## 📁 Project Structure

```
ecommerce-web/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # ✅ Root layout
│   ├── page.tsx           # ✅ Homepage
│   ├── (auth)/            # Authentication pages
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout flow
│   └── orders/            # Order pages
├── components/            # React components
│   ├── ui/                # ✅ ShadCN UI components
│   ├── providers.tsx      # ✅ React Query provider
│   └── protected-route.tsx # ✅ Auth wrapper
├── lib/                   # Utilities & services
│   ├── api/              # ✅ API services
│   ├── store.ts          # ✅ Zustand store
│   ├── constants.ts      # ✅ App constants
│   └── utils.ts          # ✅ Utility functions
├── types/                # ✅ TypeScript definitions
└── public/               # Static assets
    └── logo.png          # ✅ App logo
```

## 🎨 Design Guidelines

- **Primary Color**: Green (#16a34a) - matching mobile app
- **Typography**: Inter font family
- **Components**: ShadCN UI for consistency
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions

## 🔗 Backend API Endpoints

Base URL: `https://backend-silk-kappa-59.vercel.app`

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/profile` - Update profile
- `POST /api/auth/forgot` - Password recovery

### Products
- `GET /api/products` - List products (supports category, search, pagination)
- `GET /api/products/:id` - Get product details

### Orders
- `GET /api/orders/my` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order (for cash payment)

### Payments
- `POST /api/payments/stripe/create-intent` - Create Stripe payment
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/paypal/capture` - Capture PayPal payment

### Discounts
- `POST /api/discounts/validate` - Validate discount code

## 💳 Payment Integration

### Stripe
- Configured with live publishable key
- Supports card payments
- Automatic order creation on success

### PayPal
- Configured with client ID
- Redirect flow for payment approval
- Server-side capture

### Cash on Delivery
- Available for delivery orders only
- Order created immediately
- Payment on delivery

## 📦 Key Features

- **Product Variants**: Support for weight-based (kg/g) and piece-based products
- **Smart Cart**: Persistent shopping cart with Zustand + localStorage
- **Multi-step Checkout**: Personal info → Delivery → Payment
- **Delivery Options**: Store pickup or home delivery with time slots
- **Discount Codes**: Percentage or fixed amount discounts
- **Order Tracking**: View order history and status
- **Favorites**: Wishlist functionality
- **Dark Mode**: Toggle between light/dark themes (if implemented)

## 🧪 Testing

To test the application:
1. Start the development server
2. Navigate to http://localhost:3000
3. Register a new account or login
4. Browse products and add to cart
5. Complete checkout flow
6. View orders in profile

## 📝 Notes

- Admin dashboard is separate (already exists in "project")
- This is customer-facing only
- All data persists to the backend
- Cart data syncs with localStorage
- Authentication uses JWT with auto-refresh

## 🚧 Development Status

**Current Phase**: Core infrastructure complete, building pages and components

**Next Steps**:
1. Complete authentication pages
2. Build product listing and detail pages 
3. Implement cart and checkout
4. Add order management
5. Polish responsive design
6. Add comprehensive error handling
7. Optimize performance
8. Add loading states

## 📄 License

Private project for Les Délices du Verger
