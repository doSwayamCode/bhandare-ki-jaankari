// Browser notification utility for bhandara alerts
export class NotificationManager {
  private static instance: NotificationManager
  private permission: NotificationPermission = 'default'

  private constructor() {
    this.permission = Notification.permission
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  // Request notification permission from user
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted')
        // Store user preference
        localStorage.setItem('notifications_enabled', 'true')
        localStorage.setItem('notification_permission_asked', 'true')
        return true
      } else {
        console.log('❌ Notification permission denied')
        localStorage.setItem('notifications_enabled', 'false')
        localStorage.setItem('notification_permission_asked', 'true')
        return false
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  isNotificationSupported(): boolean {
    return 'Notification' in window
  }

  isPermissionGranted(): boolean {
    return this.permission === 'granted'
  }

  hasAskedPermission(): boolean {
    return localStorage.getItem('notification_permission_asked') === 'true'
  }

  // Send notification for new bhandara
  sendBhandaraNotification(bhandara: {
    location_description: string
    nearby_landmark?: string
    menu?: string
  }) {
    if (!this.isPermissionGranted()) {
      return
    }

    const title = '🔥 Wake up babe! New bhandara just dropped!'
    const body = `📍 ${bhandara.location_description}${
      bhandara.nearby_landmark ? ` - ${bhandara.nearby_landmark}` : ''
    }${bhandara.menu ? `\n🍽️ Menu: ${bhandara.menu}` : ''}`
    
    const options: NotificationOptions = {
      body,
      icon: '/logo-removebg-preview.png',
      badge: '/logo-removebg-preview.png',
      tag: 'new-bhandara',
      requireInteraction: false,
      silent: false,
      data: {
        type: 'new-bhandara',
        bhandara
      }
    }

    try {
      new Notification(title, options)
      console.log('📱 Local notification sent')
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  // Send general notification
  sendNotification(title: string, message: string) {
    if (!this.isPermissionGranted()) {
      return
    }

    const options: NotificationOptions = {
      body: message,
      icon: '/logo-removebg-preview.png',
      badge: '/logo-removebg-preview.png',
      tag: 'general',
      requireInteraction: false,
      silent: false,
      data: {
        type: 'general',
        timestamp: Date.now()
      }
    }

    try {
      const notification = new Notification(title, options)
      
      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      // Handle notification click
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      console.log('📨 General notification sent')
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  isEnabled(): boolean {
    return localStorage.getItem('notifications_enabled') === 'true'
  }

  setEnabled(enabled: boolean) {
    localStorage.setItem('notifications_enabled', enabled.toString())
  }
}

export const notificationManager = NotificationManager.getInstance()
