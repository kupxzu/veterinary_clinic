import React from 'react'
import { Card, CardContent } from './Card'

export const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  )
}

export const LoadingCard = ({ title = 'Loading...', description }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">{title}</p>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const LoadingOverlay = ({ isLoading, children }) => {
  if (!isLoading) return children

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <LoadingSpinner />
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    </div>
  )
}
