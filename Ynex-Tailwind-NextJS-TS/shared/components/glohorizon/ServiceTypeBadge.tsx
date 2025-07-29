// Service Type Badge Component for GloHorizon

import React from 'react'
import { SERVICE_TYPES } from '@/shared/types/glohorizon'

interface ServiceTypeBadgeProps {
  serviceType: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
}

export const ServiceTypeBadge: React.FC<ServiceTypeBadgeProps> = ({ 
  serviceType, 
  size = 'md',
  variant = 'default'
}) => {
  const serviceInfo = SERVICE_TYPES[serviceType as keyof typeof SERVICE_TYPES]
  
  if (!serviceInfo) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Unknown Service
      </span>
    )
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs', 
    lg: 'px-3 py-1 text-sm'
  }

  const baseClasses = `inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`
  
  const variantClasses = variant === 'outline' 
    ? `border border-${serviceInfo.color}-200 ${serviceInfo.textColor} bg-white`
    : `${serviceInfo.bgColor} ${serviceInfo.textColor}`

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      <span className="mr-1.5">{serviceInfo.icon}</span>
      {serviceInfo.name}
    </span>
  )
} 