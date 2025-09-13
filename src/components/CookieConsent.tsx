import React, { useEffect, useState } from 'react'

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent-accepted')
    if (!accepted) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      left: 16,
      right: 16,
      zIndex: 1000,
      background: '#1f1f1f',
      color: '#fff',
      border: '1px solid #333',
      borderRadius: 8,
      padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, opacity: 0.9 }}>
          We use cookies for analytics and to improve your experience. By using this site, you agree to our <a href="/privacy" style={{ color: '#7aa7ff' }}>Privacy Policy</a> and <a href="/terms" style={{ color: '#7aa7ff' }}>Terms</a>.
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => { localStorage.setItem('cookie-consent-accepted', '1'); setVisible(false) }}
            style={{ background: '#ff6b35', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
          >Accept</button>
          <a href="/privacy" style={{ background: '#2a2a2a', color: '#ddd', padding: '8px 12px', borderRadius: 6, textDecoration: 'none' }}>Learn more</a>
        </div>
      </div>
    </div>
  )
}
