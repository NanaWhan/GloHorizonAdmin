// Status Badge Component for GloHorizon

import React from 'react'
import { BOOKING_STATUSES } from '@/shared/types/glohorizon'

interface StatusBadgeProps {
  status: number
  showDescription?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showDescription = false,
  size = 'md'
}) => {
  const statusInfo = BOOKING_STATUSES[status as keyof typeof BOOKING_STATUSES]
  
  if (!statusInfo) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Unknown Status
      </span>
    )
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs', 
    lg: 'px-3 py-1 text-sm'
  }

  return (
    <div className="flex flex-col">
      <span className={`inline-flex items-center rounded-full font-medium ${statusInfo.bgColor} ${statusInfo.textColor} ${sizeClasses[size]}`}>
        <span className="mr-1">{getStatusIcon(status)}</span>
        {statusInfo.name}
      </span>
      {showDescription && (
        <span className="text-xs text-gray-500 mt-1">
          {statusInfo.description}
        </span>
      )}
    </div>
  )
}

// Helper function to get status icon
function getStatusIcon(status: number): string {
  const icons: { [key: number]: string } = {
    1: '⏳', // Pending
    2: '👀', // Under Review  
    3: '📋', // Quote Ready
    4: '✅', // Quote Accepted
    5: '💳', // Payment Pending
    6: '⚙️', // Processing
    7: '🛡️', // Confirmed
    8: '🎉', // Completed
    9: '❌', // Cancelled
    10: '⛔' // Rejected
  }
  
  return icons[status] || '❓'
} 