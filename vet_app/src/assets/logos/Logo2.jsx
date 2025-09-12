import React from 'react'

const Logo2 = ({ className = "h-8 w-auto", variant = "full" }) => {
  if (variant === "icon") {
    return (
      <img 
        src="/logo.png"
        alt="Sniffs & Licks"
        className={className}
      />
    )
  }

  if (variant === "text") {
    return (
      <img 
        src="/logo2.png"
        alt="Sniffs & Licks Veterinary Clinic"
        className={className}
      />
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <img 
        src="/logo.png"
        alt="Sniffs & Licks"
        className="h-8 w-8 flex-shrink-0"
      />
      
      {variant === "full" && (
        <span className="font-bold text-cyan-600 text-lg leading-tight" style={{ fontFamily: 'Showcard Gothic, sans-serif' }}>
          S&L
        </span>
      )}
    </div>
  )
}

export default Logo2
