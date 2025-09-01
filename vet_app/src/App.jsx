import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { BreadcrumbProvider } from './contexts/BreadcrumbContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import './App.css'

// Layout component for authenticated pages
const AuthenticatedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BreadcrumbProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Dashboard content */}
          <main className="flex-1 bg-gray-100 h-full overflow-hidden">
            <Dashboard />
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  )
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-muted"></div>
            <div className="absolute top-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm text-muted-foreground">Loading VetClinic Pro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <ProtectedRoute>
          <AuthenticatedLayout />
        </ProtectedRoute>
      )}
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
