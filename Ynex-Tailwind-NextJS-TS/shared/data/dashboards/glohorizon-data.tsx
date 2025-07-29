// GloHorizon Dashboard Data

import { DashboardCard } from '@/shared/types/glohorizon'

// Dashboard Stats Cards
export const dashboardCards: DashboardCard[] = [
  {
    title: 'Total Bookings',
    value: 145,
    icon: '📊',
    color: 'blue',
    trend: '+12% from last month',
    link: '/glohorizon/bookings'
  },
  {
    title: 'Pending Review',
    value: 23,
    icon: '⏳',
    color: 'orange',
    urgent: true,
    action: 'View Pending',
    link: '/glohorizon/bookings?status=1,2'
  },
  {
    title: 'Completed',
    value: 89,
    icon: '✅',
    color: 'green',
    trend: '+8% from last month'
  },
  {
    title: 'Total Customers',
    value: 67,
    icon: '👥',
    color: 'purple',
    trend: '+15 new this month'
  }
]

// Recent Bookings Mock Data
export const recentBookings = [
  {
    id: 1,
    referenceNumber: "GLOHORIZON-20250128-001",
    serviceType: 1, // Flight
    status: 2, // Under Review
    urgency: 1, // Standard
    createdAt: "2025-01-28T10:30:00Z",
    estimatedPrice: 1200.00,
    finalPrice: null,
    currency: "USD",
    user: {
      fullName: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: 2,
    referenceNumber: "GLOHORIZON-20250128-002",
    serviceType: 2, // Hotel
    status: 3, // Quote Ready
    urgency: 2, // Urgent
    createdAt: "2025-01-28T09:15:00Z",
    estimatedPrice: 800.00,
    finalPrice: 750.00,
    currency: "USD",
    user: {
      fullName: "Sarah Johnson",
      email: "sarah@example.com"
    }
  },
  {
    id: 3,
    referenceNumber: "GLOHORIZON-20250128-003",
    serviceType: 5, // Complete Package
    status: 5, // Payment Pending
    urgency: 3, // Emergency
    createdAt: "2025-01-28T08:45:00Z",
    estimatedPrice: 3500.00,
    finalPrice: 3200.00,
    currency: "USD",
    user: {
      fullName: "Michael Chen",
      email: "michael@example.com"
    }
  },
  {
    id: 4,
    referenceNumber: "GLOHORIZON-20250127-004",
    serviceType: 4, // Visa
    status: 7, // Confirmed
    urgency: 1, // Standard
    createdAt: "2025-01-27T16:20:00Z",
    estimatedPrice: 150.00,
    finalPrice: 150.00,
    currency: "USD",
    user: {
      fullName: "Emma Wilson",
      email: "emma@example.com"
    }
  },
  {
    id: 5,
    referenceNumber: "GLOHORIZON-20250127-005",
    serviceType: 3, // Tour
    status: 8, // Completed
    urgency: 1, // Standard
    createdAt: "2025-01-27T14:10:00Z",
    estimatedPrice: 2200.00,
    finalPrice: 2000.00,
    currency: "USD",
    user: {
      fullName: "David Martinez",
      email: "david@example.com"
    }
  }
]

// Booking Trends Chart Data
export const bookingTrendsData = {
  labels: ['Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25', 'Jan 26', 'Jan 27', 'Jan 28'],
  datasets: [
    {
      label: 'New Bookings',
      data: [3, 5, 2, 8, 4, 6, 7, 5],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Completed',
      data: [2, 3, 4, 2, 6, 3, 4, 5],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}

// Service Distribution Data
export const serviceDistributionData = {
  labels: ['Flights', 'Hotels', 'Tours', 'Visas', 'Packages'],
  datasets: [{
    data: [45, 25, 15, 8, 7],
    backgroundColor: [
      '#3B82F6', // Blue
      '#10B981', // Green  
      '#8B5CF6', // Purple
      '#F59E0B', // Orange
      '#6366F1'  // Indigo
    ],
    borderWidth: 0
  }]
}

// Urgent Bookings Alert Data
export const urgentBookings = [
  {
    id: 3,
    referenceNumber: "GLOHORIZON-20250128-003",
    serviceType: 5,
    urgency: 3,
    status: 5,
    createdAt: "2025-01-28T08:45:00Z",
    user: { fullName: "Michael Chen", email: "michael@example.com" },
    timeAgo: "3 hours ago"
  },
  {
    id: 2,
    referenceNumber: "GLOHORIZON-20250128-002", 
    serviceType: 2,
    urgency: 2,
    status: 3,
    createdAt: "2025-01-28T09:15:00Z",
    user: { fullName: "Sarah Johnson", email: "sarah@example.com" },
    timeAgo: "2 hours ago"
  }
]

// Revenue Stats
export const revenueStats = {
  total: 125400,
  thisMonth: 28900,
  lastMonth: 21200,
  growth: 36.3,
  currency: 'USD'
}

// Status Distribution
export const statusDistribution = {
  pending: 23,
  underReview: 15,
  quoteReady: 12,
  processing: 8,
  completed: 89,
  total: 147
} 