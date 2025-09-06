import { logEvent } from 'firebase/analytics'
import { analytics } from './firebase'

// Analytics event types
export interface BhandaraAnalyticsEvents {
  bhandara_form_started: {}
  bhandara_submitted: {
    location: string
    has_photos: boolean
  }
  bhandara_viewed: {
    bhandara_id: string
    location: string
  }
  bhandara_liked: {
    bhandara_id: string
    location: string
  }
  bhandara_shared: {
    bhandara_id: string
    location: string
  }
  search_performed: {
    search_term: string
  }
  page_view: {
    page_name: string
  }
}

// Type-safe analytics tracking function
export const trackEvent = <T extends keyof BhandaraAnalyticsEvents>(
  eventName: T,
  parameters: BhandaraAnalyticsEvents[T]
) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters)
  }
}

// Common tracking functions
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_name: pageName })
}

export const trackBhandaraSubmitted = (location: string, hasPhotos: boolean) => {
  trackEvent('bhandara_submitted', {
    location,
    has_photos: hasPhotos
  })
}

export const trackBhandaraViewed = (bhandaraId: string, location: string) => {
  trackEvent('bhandara_viewed', {
    bhandara_id: bhandaraId,
    location
  })
}

export const trackBhandaraLiked = (bhandaraId: string, location: string) => {
  trackEvent('bhandara_liked', {
    bhandara_id: bhandaraId,
    location
  })
}

export const trackBhandaraShared = (bhandaraId: string, location: string) => {
  trackEvent('bhandara_shared', {
    bhandara_id: bhandaraId,
    location
  })
}

export const trackSearchPerformed = (searchTerm: string) => {
  trackEvent('search_performed', {
    search_term: searchTerm
  })
}

export const trackFormStarted = () => {
  trackEvent('bhandara_form_started', {})
}
