import React, { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import ProfileEditDialog from './ProfileEditDialog'
import { 
  GearIcon,
  Cross1Icon,
  MoonIcon,
  SunIcon,
  ReloadIcon,
  CheckIcon,
  PersonIcon
} from '@radix-ui/react-icons'

const SettingsModal = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Refresh page
  const handleRefreshPage = () => {
    setIsRefreshing(true)
    // Add a small delay to show the loading state
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <GearIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Cross1Icon className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings Options */}
          <div className="space-y-6">
            {/* Profile Setting */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Account</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Manage your profile and security settings</p>
              </div>
              
              <ProfileEditDialog>
                <Button
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PersonIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </ProfileEditDialog>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600"></div>

            {/* Theme Setting */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Appearance</h3>
                </div>
                <Badge 
                  variant={isDarkMode ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isDarkMode ? 'Dark' : 'Light'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Light Mode Button */}
                <button
                  onClick={() => !isDarkMode ? null : toggleDarkMode()}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    !isDarkMode 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="relative">
                    <SunIcon className="h-6 w-6" />
                    {!isDarkMode && (
                      <CheckIcon className="absolute -top-1 -right-1 h-3 w-3 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Light</span>
                </button>

                {/* Dark Mode Button */}
                <button
                  onClick={() => isDarkMode ? null : toggleDarkMode()}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    isDarkMode 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="relative">
                    <MoonIcon className="h-6 w-6" />
                    {isDarkMode && (
                      <CheckIcon className="absolute -top-1 -right-1 h-3 w-3 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600"></div>

            {/* System Actions */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">System</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">System maintenance actions</p>
              </div>
              
              <Button
                onClick={handleRefreshPage}
                disabled={isRefreshing}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {isRefreshing ? (
                  <>
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <ReloadIcon className="h-4 w-4" />
                    <span>Refresh Page</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Version 1.0 (BETA)</span>
              <span>SNIFFS & LICKS</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsModal
