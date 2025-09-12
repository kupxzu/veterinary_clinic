import React from 'react'

const MainLogo = ({ className = "h-12 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Main Logo Image */}
      <img 
        src="/logo2.png"
        alt="Sniffs & Licks Veterinary Clinic"
        className="h-12 w-auto flex-shrink-0"
      />
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-cyan-600 text-2xl leading-tight" style={{ fontFamily: 'Showcard Gothic, sans-serif' }}>
            SNIFFS & LICKS
          </span>
          <span className="text-sm text-gray-600 font-medium">
            Veterinary Clinic
          </span>
        </div>
      )}
    </div>
  )
}

export default MainLogo
