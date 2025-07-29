# 🌍 Global Horizon Travel and Tour Admin Dashboard

A comprehensive travel booking management system built with Next.js, TypeScript, Tailwind CSS using the Ynex admin template.

## 🚀 Features

### ✨ Core Functionality

- **🏠 Dashboard Overview** - Real-time booking statistics, revenue analytics, urgent alerts
- **📋 Booking Management** - Complete booking lifecycle management with status tracking
- **👥 Customer Management** - Customer profiles and communication history
- **💰 Payment Processing** - PayStack integration with automated workflows
- **📊 Reports & Analytics** - Revenue reports, booking trends, performance metrics
- **🔐 Authentication** - Secure admin login with JWT token management

### 🎯 Booking Management Features

- **Status Tracking** - 10 booking statuses from Pending to Completed
- **Priority Levels** - Standard, Urgent, Emergency with response time tracking
- **Service Types** - Flights, Hotels, Tours, Visas, Complete Packages
- **Advanced Filtering** - Search by reference, customer, status, service type, urgency
- **Bulk Operations** - Multi-select for batch status updates
- **Export Functionality** - CSV export with filtered data

### 🛠️ Technical Features

- **TypeScript** - Full type safety with comprehensive interfaces
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Live data refreshing and notifications
- **Error Handling** - Comprehensive error management and user feedback
- **Performance Optimized** - Lazy loading, pagination, and caching

## 📁 Project Structure

```
Ynex-Tailwind-NextJS-TS/
├── pages/
│   ├── glohorizon/
│   │   ├── dashboard.tsx           # Main dashboard
│   │   └── bookings/
│   │       └── index.tsx           # Bookings management
│   ├── authentication/
│   │   └── admin-login.tsx         # Admin login page
│   └── index.tsx                   # Entry point with auth redirect
├── shared/
│   ├── api/
│   │   ├── client.ts               # HTTP client with auth
│   │   ├── config.ts               # API configuration & types
│   │   ├── index.ts                # Main API exports
│   │   └── services/
│   │       ├── auth.ts             # Authentication service
│   │       ├── bookings.ts         # Booking management API
│   │       └── dashboard.ts        # Dashboard data service
│   ├── components/glohorizon/
│   │   ├── StatusBadge.tsx         # Booking status indicators
│   │   ├── UrgencyBadge.tsx        # Priority level indicators
│   │   └── ServiceTypeBadge.tsx    # Service type indicators
│   ├── types/
│   │   └── glohorizon.ts           # TypeScript definitions
│   ├── data/dashboards/
│   │   └── glohorizon-data.tsx     # Mock data & sample responses
│   └── layout-components/
│       └── sidebar/nav.tsx         # Updated navigation menu
```

## 🔧 API Integration

### Authentication

```typescript
// Login
const response = await AuthService.login({
  email: 'admin@globalhorizonstravel.com',
  password: 'admin-password'
})

// Check authentication
const isAuth = AuthService.isAuthenticated()

// Get current user
const user = AuthService.getCurrentUser()
```

### Booking Management

```typescript
// Get all bookings with filters
const bookings = await BookingService.getBookings({
  status: [1, 2],           // Pending, Under Review
  urgency: [2, 3],          // Urgent, Emergency
  serviceType: [1],         // Flights only
  search: 'GLOHORIZON-123'
})

// Update booking status
await BookingService.updateBookingStatus(bookingId, {
  newStatus: 3,
  notes: 'Quote prepared for customer',
  estimatedPrice: 1200.00
})

// Generate payment link
const paymentLink = await BookingService.generatePaymentLink(bookingId)
```

### Dashboard Data

```typescript
// Get dashboard statistics
const stats = await DashboardService.getDashboardStats()

// Get booking trends
const trends = await DashboardService.getBookingTrends('month')

// Get revenue statistics
const revenue = await DashboardService.getRevenueStats()
```

## 🎨 Component System

### Status Management

```jsx
// Status Badge - Shows current booking status
<StatusBadge status={2} size="md" showDescription={true} />

// Urgency Badge - Shows priority level
<UrgencyBadge urgency={3} showResponseTime={true} />

// Service Type Badge - Shows service category
<ServiceTypeBadge serviceType={1} variant="default" />
```

### Data Models

```typescript
// Booking statuses (1-10)
BOOKING_STATUSES = {
  1: 'Pending',           6: 'Processing',
  2: 'Under Review',      7: 'Confirmed',
  3: 'Quote Ready',       8: 'Completed',
  4: 'Quote Accepted',    9: 'Cancelled',
  5: 'Payment Pending',   10: 'Rejected'
}

// Service types (1-5)
SERVICE_TYPES = {
  1: 'Flight',            4: 'Visa',
  2: 'Hotel',             5: 'Complete Package'
  3: 'Tour',
}

// Urgency levels (1-3)
URGENCY_LEVELS = {
  1: 'Standard (4-8 hours)',
  2: 'Urgent (2-4 hours)',
  3: 'Emergency (1 hour)'
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- GloHorizon API backend running

### Installation

```bash
# Navigate to the Ynex template directory
cd Ynex-Tailwind-NextJS-TS

# Install dependencies
npm install

# Configure API endpoint
# Update API_CONFIG.BASE_URL in shared/api/config.ts

# Start development server
npm run dev
```

### Environment Setup

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5080/api
NEXT_PUBLIC_APP_NAME=GloHorizon Travel Admin
```

## 🔐 Authentication Flow

1. **Entry Point** (`/`) - Checks auth status and redirects
2. **Login Page** (`/authentication/admin-login`) - Admin authentication
3. **Dashboard** (`/glohorizon/dashboard`) - Main admin interface
4. **Protected Routes** - All GloHorizon pages require authentication

## 📊 Dashboard Features

### Overview Cards

- **Total Bookings** - Complete booking count with trends
- **Pending Review** - Urgent attention required (clickable)
- **Completed Bookings** - Success metrics
- **Total Customers** - Customer base growth

### Recent Activity

- **Recent Bookings Table** - Last 5 bookings with quick actions
- **Urgent Alerts** - Emergency and urgent bookings sidebar
- **Revenue Stats** - Monthly revenue with growth percentage
- **Status Distribution** - Visual breakdown of booking statuses

## 🛠️ Booking Management

### Advanced Filtering

- **Search** - Reference number, customer name, email
- **Status Filter** - Multi-select from 10 status options
- **Service Type** - Filter by travel service category
- **Priority Level** - Filter by urgency (Standard/Urgent/Emergency)
- **Date Range** - Created date filtering

### Bulk Operations

- **Multi-select** - Select individual or all bookings
- **Bulk Status Update** - Change status for multiple bookings
- **Export Selected** - CSV export for selected bookings

### Table Features

- **Pagination** - Configurable page size with navigation
- **Sorting** - Click column headers to sort
- **Responsive** - Mobile-optimized table layout
- **Real-time Data** - Auto-refresh with live updates

## 🎯 Customization Guide

### Adding New Service Types

```typescript
// Update shared/types/glohorizon.ts
export const SERVICE_TYPES = {
  // ... existing types
  6: {
    name: 'Car Rental',
    icon: '🚗',
    color: 'teal',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800'
  }
}
```

### Adding New Booking Status

```typescript
// Update shared/types/glohorizon.ts
export const BOOKING_STATUSES = {
  // ... existing statuses
  11: {
    name: 'Refund Pending',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    description: 'Refund being processed',
    nextActions: ['Process Refund', 'Contact Customer'],
    canEdit: true
  }
}
```

### Custom Dashboard Cards

```typescript
// Update shared/data/dashboards/glohorizon-data.tsx
export const dashboardCards: DashboardCard[] = [
  // ... existing cards
  {
    title: 'Revenue This Week',
    value: formatCurrency(15230),
    icon: '💰',
    color: 'emerald',
    trend: '+22% vs last week',
    link: '/glohorizon/reports/revenue'
  }
]
```

## 🔧 API Configuration

### Backend Requirements

Your GloHorizon API should provide these endpoints:

```
POST   /api/admin/login
GET    /api/admin/dashboard
GET    /api/admin/bookings
GET    /api/admin/bookings/{id}
PUT    /api/admin/bookings/{id}/status
PUT    /api/admin/bookings/{id}/pricing
POST   /api/admin/bookings/{id}/notes
POST   /api/admin/bookings/{id}/payment-link
POST   /api/payment/verify/{reference}
```

### Sample API Response

```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "referenceNumber": "GLOHORIZON-20250128-001",
      "serviceType": 1,
      "status": 2,
      "urgency": 1,
      "createdAt": "2025-01-28T10:30:00Z",
      "estimatedPrice": 1200.0,
      "finalPrice": null,
      "currency": "USD",
      "user": {
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

## 🎨 UI/UX Features

### Design System

- **Consistent Colors** - Status-based color coding throughout
- **Typography** - Hierarchical text sizing and weights
- **Spacing** - Consistent margins and padding
- **Icons** - Emoji-based icons for quick recognition

### Interactive Elements

- **Hover States** - Visual feedback on interactive elements
- **Loading States** - Spinners and skeleton screens
- **Error States** - Clear error messaging and recovery options
- **Success States** - Confirmation messages and visual feedback

### Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Medium screen optimizations
- **Desktop Enhancement** - Full feature access on large screens

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Issues**

   ```bash
   # Check API configuration
   # Verify API_CONFIG.BASE_URL in shared/api/config.ts
   # Ensure backend is running and accessible
   ```

2. **Authentication Problems**

   ```bash
   # Clear browser storage
   localStorage.clear()

   # Check token expiration
   # Verify backend JWT configuration
   ```

3. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

## 📈 Performance Optimizations

### Implemented Optimizations

- **Code Splitting** - Route-based code splitting with Next.js
- **Image Optimization** - Next.js Image component usage
- **Caching Strategy** - API response caching and localStorage
- **Lazy Loading** - Component and data lazy loading
- **Bundle Analysis** - Webpack bundle optimization

### Monitoring

- **Error Tracking** - Console error logging
- **Performance Metrics** - Loading time tracking
- **User Analytics** - Feature usage tracking

## 🛡️ Security Features

### Authentication Security

- **JWT Tokens** - Secure token-based authentication
- **Token Expiration** - Automatic logout on token expiry
- **Route Protection** - Protected routes with auth guards

### Data Security

- **Input Validation** - Form input sanitization
- **XSS Protection** - Content security headers
- **CSRF Protection** - Request validation

## 🚀 Deployment

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Environment Variables

```bash
# Production environment
NEXT_PUBLIC_API_BASE_URL=https://api.globalhorizonstravel.com
NEXT_PUBLIC_APP_ENV=production
```

---

## 🎯 Next Steps

This GloHorizon Travel Admin Dashboard provides a solid foundation for managing travel bookings. Key areas for enhancement:

1. **Real-time Notifications** - WebSocket integration for live updates
2. **Advanced Analytics** - Charts and graphs for deeper insights
3. **Customer Communication** - Integrated messaging system
4. **Document Management** - File upload and document storage
5. **Automated Workflows** - Business process automation

The system is designed to be easily extensible and customizable for your specific business needs.

---

**Built with ❤️ for GloHorizon Travel**
