import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { BreadcrumbProvider } from './contexts/BreadcrumbContext'
import { NavigationProvider, useNavigation } from './contexts/NavigationContext'
import { usePWALaunch, PWAActions } from './hooks/usePWALaunch'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ClientManagement from './components/ClientManagement'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import './App.css'

// Component to render based on current page
const PageRenderer = () => {
  const { currentPage } = useNavigation()

  switch (currentPage) {
    case 'Dashboard':
      return <Dashboard />
    case 'Clients':
      return <ClientManagement />
    case 'Patients':
      return <div className="p-6">Patients page - Coming soon</div>
    case 'Appointments':
      return <div className="p-6">Appointments page - Coming soon</div>
    case 'Medical Records':
      return <div className="p-6">Medical Records page - Coming soon</div>
    case 'Staff':
      return <div className="p-6">Staff page - Coming soon</div>
    case 'Reports':
      return <div className="p-6">Reports page - Coming soon</div>
    case 'Activity Log':
      return <div className="p-6">Activity Log page - Coming soon</div>
    default:
      return <Dashboard />
  }
}

// Layout component for authenticated pages
const AuthenticatedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <NavigationProvider>
      <BreadcrumbProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />
            
            {/* Page content */}
            <main className="flex-1 bg-gray-100 dark:bg-gray-900 h-full overflow-hidden">
              <PageRenderer />
            </main>
          </div>
        </div>
      </BreadcrumbProvider>
    </NavigationProvider>
  )
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const launchInfo = usePWALaunch()

  // Handle launch actions
  React.useEffect(() => {
    if (launchInfo.source) {
      PWAActions.handleLaunchSource(launchInfo.source)
    }
    
    if (launchInfo.isFirstLaunch) {
      console.log('🎉 First PWA launch detected!')
      // You can show a welcome tour or special onboarding here
    }

    // Register protocol handler for custom URLs
    PWAActions.registerProtocolHandler()
  }, [launchInfo])

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
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
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
