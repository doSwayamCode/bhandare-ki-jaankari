import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

export const useAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    // Track page views when route changes
    const pageName = location.pathname === '/' ? 'home' : location.pathname.replace('/', '')
    trackPageView(pageName)
  }, [location])
}
