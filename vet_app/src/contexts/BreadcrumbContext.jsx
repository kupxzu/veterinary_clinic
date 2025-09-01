import React, { createContext, useContext, useState } from 'react'

const BreadcrumbContext = createContext()

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const updateBreadcrumbs = (newBreadcrumbs) => {
    setBreadcrumbs(newBreadcrumbs)
  }

  const addBreadcrumb = (item) => {
    setBreadcrumbs(prev => [...prev, item])
  }

  const removeBreadcrumb = (index) => {
    setBreadcrumbs(prev => prev.slice(0, index))
  }

  const clearBreadcrumbs = () => {
    setBreadcrumbs([])
  }

  return (
    <BreadcrumbContext.Provider 
      value={{ 
        breadcrumbs, 
        updateBreadcrumbs, 
        addBreadcrumb, 
        removeBreadcrumb, 
        clearBreadcrumbs 
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}
