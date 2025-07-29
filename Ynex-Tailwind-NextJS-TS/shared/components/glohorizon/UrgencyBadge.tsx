// Urgency Badge Component for GloHorizon

import React from 'react'
import { URGENCY_LEVELS } from '@/shared/types/glohorizon'

interface UrgencyBadgeProps {
  urgency: number
  showResponseTime?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ 
  urgency, 
  showResponseTime = false,
  size = 'md'
}) => {
  const urgencyInfo = URGENCY_LEVELS[urgency as keyof typeof URGENCY_LEVELS]
  
  if (!urgencyInfo) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Standard
      </span>
    )
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs', 
    lg: 'px-3 py-1 text-sm'
  }

  const animationClass = urgencyInfo.alert ? 'animate-pulse' : ''

  return (
    <div className="flex flex-col">
      <span className={`inline-flex items-center rounded-full font-medium ${urgencyInfo.bgColor} ${urgencyInfo.textColor} ${sizeClasses[size]} ${animationClass}`}>
        <span className="mr-1">{urgencyInfo.icon}</span>
        {urgencyInfo.name}
      </span>
      {showResponseTime && (
        <span className="text-xs text-gray-500 mt-1">
          Response: {urgencyInfo.responseTime}
        </span>
      )}
    </div>
  )
} 