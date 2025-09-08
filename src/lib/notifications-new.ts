// Browser notification utility for bhandara alerts with cross-device support
import { supabase } from './supabase'

export class NotificationManager {
  private static instance: NotificationManager
  private permission: NotificationPermission = 'default'
  private subscriptionId: string | null = null

  private constructor() {
    this.permission = Notification.permission
    this.subscriptionId = localStorage.getItem('notification_subscription_id')
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
        
        // Store subscription in database for cross-device notifications
        await this.saveSubscriptionToDatabase()
        
        // Store user preference locally
        localStorage.setItem('notifications_enabled', 'true')
        localStorage.setItem('notification_permission_asked', 'true')
        
        // Set up real-time listener
        this.setupRealtimeListener()
        
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

  // Save subscription to database for cross-device notifications
  private async saveSubscriptionToDatabase(): Promise<void> {
    try {
      // Generate a unique subscription ID for this browser/device
      const subscriptionId = this.subscriptionId || this.generateSubscriptionId()
      
      const { error } = await supabase
        .from('notification_subscriptions')
        .upsert({
          id: subscriptionId,
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
          is_active: true
        })
      
      if (error) {
        console.error('Error saving subscription:', error)
      } else {
        this.subscriptionId = subscriptionId
        localStorage.setItem('notification_subscription_id', subscriptionId)
        console.log('✅ Subscription saved to database')
      }
    } catch (error) {
      console.error('Error in saveSubscriptionToDatabase:', error)
    }
  }

  // Generate unique subscription ID
  private generateSubscriptionId(): string {
    return 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
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

  // Send notification for new bhandara (LOCAL)
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

  // Trigger notifications for ALL subscribers (cross-device)
  async sendNotificationToAllSubscribers(bhandara: {
    location_description: string
    nearby_landmark?: string
    menu?: string
  }): Promise<void> {
    try {
      // Store notification in database - this will trigger real-time notifications
      const { error } = await supabase
        .from('notification_broadcasts')
        .insert({
          title: '🔥 Wake up babe! New bhandara just dropped!',
          message: `📍 ${bhandara.location_description}${
            bhandara.nearby_landmark ? ` - ${bhandara.nearby_landmark}` : ''
          }${bhandara.menu ? `\n🍽️ Menu: ${bhandara.menu}` : ''}`,
          bhandara_data: bhandara,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error broadcasting notification:', error)
      } else {
        console.log('🚀 Notification broadcast sent to all subscribers!')
      }
    } catch (error) {
      console.error('Error in sendNotificationToAllSubscribers:', error)
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
      silent: false
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
    if (!enabled && this.subscriptionId) {
      // Deactivate subscription in database
      this.deactivateSubscription()
    }
  }

  // Deactivate subscription in database
  private async deactivateSubscription(): Promise<void> {
    if (!this.subscriptionId) return
    
    try {
      await supabase
        .from('notification_subscriptions')
        .update({ is_active: false })
        .eq('id', this.subscriptionId)
      
      console.log('🔕 Subscription deactivated')
    } catch (error) {
      console.error('Error deactivating subscription:', error)
    }
  }

  // Set up real-time listener for notification broadcasts
  setupRealtimeListener(): void {
    if (!this.isPermissionGranted()) {
      return
    }

    // Listen for new notification broadcasts
    supabase
      .channel('notification_broadcasts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_broadcasts'
        },
        (payload) => {
          console.log('📡 Received broadcast notification:', payload)
          
          // Show notification on this device
          if (payload.new) {
            const { title, message } = payload.new
            this.showNotification(title, message)
          }
        }
      )
      .subscribe()
    
    console.log('👂 Real-time notification listener started')
  }

  // Show notification (helper method)
  private showNotification(title: string, message: string): void {
    if (!this.isPermissionGranted()) {
      return
    }

    const options: NotificationOptions = {
      body: message,
      icon: '/logo-removebg-preview.png',
      badge: '/logo-removebg-preview.png',
      tag: 'bhandara-broadcast',
      requireInteraction: false,
      silent: false
    }

    try {
      new Notification(title, options)
      console.log('📱 Cross-device notification displayed')
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }
}

export const notificationManager = NotificationManager.getInstance()
