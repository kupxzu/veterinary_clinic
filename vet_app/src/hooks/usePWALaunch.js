import { useState, useEffect } from 'react'

/**
 * Hook to detect PWA launch mode and handle URL parameters
 */
export const usePWALaunch = () => {
  const [launchInfo, setLaunchInfo] = useState({
    isPWA: false,
    source: null,
    action: null,
    isFirstLaunch: false
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const source = urlParams.get('source')
    const action = urlParams.get('action')
    
    // Detect if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.navigator.standalone === true ||
                  source === 'pwa'

    // Check if this is first launch after install
    const isFirstLaunch = sessionStorage.getItem('pwa-launched') === null && isPWA

    if (isPWA) {
      sessionStorage.setItem('pwa-launched', 'true')
      
      // Show welcome message for first launch
      if (isFirstLaunch) {
        console.log('🎉 Welcome to VetClinic Pro PWA!')
        
        // Optional: Show toast notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('VetClinic Pro', {
            body: 'Welcome to the installed app! You can now access it offline.',
            icon: '/logo.png',
            badge: '/logo.png'
          })
        }
      }
    }

    setLaunchInfo({
      isPWA,
      source,
      action,
      isFirstLaunch
    })

    // Clean URL parameters after processing
    if (source || action) {
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
    }
  }, [])

  return launchInfo
}

/**
 * Hook to handle PWA-specific features
 */
export const usePWAFeatures = () => {
  const [isStandalone, setIsStandalone] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone === true
      setIsStandalone(standalone)
    }

    checkStandalone()

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkStandalone)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      mediaQuery.removeEventListener('change', checkStandalone)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const result = await installPrompt.userChoice
      if (result.outcome === 'accepted') {
        console.log('PWA installation accepted')
      }
      setInstallPrompt(null)
    }
  }

  return {
    isStandalone,
    canInstall: !!installPrompt,
    installPWA
  }
}

/**
 * Utility functions for PWA launch actions
 */
export const PWAActions = {
  // Handle different launch sources
  handleLaunchSource: (source) => {
    switch (source) {
      case 'pwa':
        console.log('Launched from PWA icon')
        break
      case 'shortcut':
        console.log('Launched from app shortcut')
        break
      default:
        console.log('Launched from browser')
    }
  },

  // Register custom protocol handler
  registerProtocolHandler: () => {
    if ('registerProtocolHandler' in navigator) {
      try {
        navigator.registerProtocolHandler(
          'web+vetclinic',
          '/?action=%s',
          'VetClinic Pro'
        )
      } catch (error) {
        console.log('Protocol handler registration failed:', error)
      }
    }
  },

  // Create app shortcuts programmatically
  createShortcut: async (name, url) => {
    if ('shortcuts' in navigator) {
      try {
        await navigator.shortcuts.add({
          name,
          short_name: name,
          description: `Quick access to ${name}`,
          url,
          icons: [{ src: '/logo.png', sizes: '192x192' }]
        })
      } catch (error) {
        console.log('Shortcut creation failed:', error)
      }
    }
  }
}
