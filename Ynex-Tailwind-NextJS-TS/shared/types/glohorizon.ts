// GloHorizon Travel System Types

// Service Types
export const SERVICE_TYPES = {
    1: { name: 'Flight', icon: '✈️', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    2: { name: 'Hotel', icon: '🏨', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    3: { name: 'Tour', icon: '🗺️', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    4: { name: 'Visa', icon: '📄', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    5: { name: 'Complete Package', icon: '📦', color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' }
} as const

// Booking Statuses
export const BOOKING_STATUSES = {
    1: {
        name: 'Pending',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        description: 'New booking awaiting review',
        nextActions: ['Review', 'Assign'],
        canEdit: true
    },
    2: {
        name: 'Under Review',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        description: 'Admin is researching options',
        nextActions: ['Set Pricing', 'Request Info'],
        canEdit: true
    },
    3: {
        name: 'Quote Ready',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        description: 'Quote prepared for customer',
        nextActions: ['Contact Customer', 'Modify Quote'],
        canEdit: true
    },
    4: {
        name: 'Quote Accepted',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        description: 'Customer accepted the quote',
        nextActions: ['Generate Payment Link', 'Set Final Price'],
        canEdit: true
    },
    5: {
        name: 'Payment Pending',
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        description: 'Awaiting customer payment',
        nextActions: ['Check Payment', 'Send Reminder'],
        canEdit: false
    },
    6: {
        name: 'Processing',
        color: 'indigo',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-800',
        description: 'Booking services with suppliers',
        nextActions: ['Update Progress', 'Upload Documents'],
        canEdit: true
    },
    7: {
        name: 'Confirmed',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        description: 'All services confirmed',
        nextActions: ['Send Details', 'Mark Complete'],
        canEdit: true
    },
    8: {
        name: 'Completed',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        description: 'Travel completed successfully',
        nextActions: ['Archive', 'Request Feedback'],
        canEdit: false
    },
    9: {
        name: 'Cancelled',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        description: 'Booking cancelled',
        nextActions: ['Process Refund', 'Archive'],
        canEdit: false
    },
    10: {
        name: 'Rejected',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        description: 'Quote rejected by customer',
        nextActions: ['Revise Quote', 'Archive'],
        canEdit: true
    }
} as const

// Urgency Levels
export const URGENCY_LEVELS = {
    1: {
        name: 'Standard',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        responseTime: '4-8 hours',
        icon: '🕐'
    },
    2: {
        name: 'Urgent',
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        responseTime: '2-4 hours',
        icon: '⚡'
    },
    3: {
        name: 'Emergency',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        responseTime: '1 hour',
        icon: '🚨',
        alert: true
    }
} as const

// Filter Options
export interface BookingFilters {
    status?: number[]
    serviceType?: number[]
    urgency?: number[]
    dateFrom?: string
    dateTo?: string
    search?: string
    page?: number
    pageSize?: number
}

// Table Column Definitions
export interface TableColumn {
    key: string
    title: string
    sortable?: boolean
    filterable?: boolean
    render?: (value: any, row: any) => React.ReactNode
}

// Dashboard Card Type
export interface DashboardCard {
    title: string
    value: number | string
    icon: string
    color: string
    trend?: string
    urgent?: boolean
    action?: string
    link?: string
}

// Notification Types
export interface NotificationMessage {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: Date
    read: boolean
}

// Form Validation Types
export interface FormErrors {
    [key: string]: string | undefined
}

export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date'
    required?: boolean
    placeholder?: string
    options?: Array<{ value: string | number; label: string }>
    validation?: (value: any) => string | undefined
}

// Export type utilities
export type ServiceTypeId = keyof typeof SERVICE_TYPES
export type BookingStatusId = keyof typeof BOOKING_STATUSES
export type UrgencyLevelId = keyof typeof URGENCY_LEVELS 