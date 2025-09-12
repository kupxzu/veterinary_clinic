import { useState, useEffect } from 'react'

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null)
    setShowInstallButton(false)

    console.log(`User response to the install prompt: ${outcome}`)
  }

  if (!showInstallButton) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <img 
        src="/logo2.png" 
        alt="Sniffs & Licks" 
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '4px'
        }}
      />
      <span>Install Sniffs & Licks for better experience!</span>
      <button
        onClick={handleInstallClick}
        style={{
          padding: '6px 12px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: 'white',
          color: '#007bff',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Install
      </button>
      <button
        onClick={() => setShowInstallButton(false)}
        style={{
          padding: '6px 8px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: 'transparent',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default PWAInstallPrompt
