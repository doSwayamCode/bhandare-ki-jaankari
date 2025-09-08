import React, { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { notificationManager } from '../lib/notifications'

export const NotificationBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if we should show the notification banner
    const hasAsked = notificationManager.hasAskedPermission()
    const isSupported = notificationManager.isNotificationSupported()
    
    if (isSupported && !hasAsked) {
      // Show banner after 3 seconds to not be intrusive
      setTimeout(() => {
        setShowBanner(true)
      }, 3000)
    }

    setIsEnabled(notificationManager.isEnabled())
  }, [])

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    try {
      const granted = await notificationManager.requestPermission()
      setIsEnabled(granted)
      
      if (granted) {
        notificationManager.sendNotification(
          '🎉 Notifications Enabled!',
          "You'll now get alerts for new bhandaras in your area"
        )
      }
      
      setShowBanner(false)
    } catch (error) {
      console.error('Error enabling notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('notification_permission_asked', 'true')
    localStorage.setItem('notifications_enabled', 'false')
  }

  if (!showBanner) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      maxWidth: '350px',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white'
        }}
      >
        <X size={14} />
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Bell size={24} color="#fbbf24" />
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '16px', 
            fontWeight: '600' 
          }}>
            🔔 Stay Updated!
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '14px', 
            lineHeight: '1.4',
            opacity: 0.9
          }}>
            Get instant notifications when new bhandaras are posted in your area
          </p>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              style={{
                background: '#fbbf24',
                color: '#1a1a1a',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isLoading ? 'Enabling...' : 'Enable Notifications'}
            </button>
            
            <button
              onClick={handleDismiss}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// NotificationToggle component removed as per user request
// Only popup-based notification permission system is used
