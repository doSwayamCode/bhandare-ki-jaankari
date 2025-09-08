import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="app-background" style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar showForm={false} onToggleForm={() => {}} />
      
      <div className="container" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px 0'
          }}>
            Privacy Policy
          </h1>
          <p style={{ 
            color: '#ccc', 
            margin: '8px 0 0 0',
            fontSize: '16px'
          }}>
            Last updated: September 8, 2025
          </p>
        </div>

        {/* Content */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          lineHeight: '1.6'
        }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>What Information We Collect</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            <li>Google account information (name, email) when you sign in</li>
            <li>Bhandara information you post (location, photos, descriptions)</li>
            <li>Usage data through Google Analytics</li>
          </ul>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>How We Use Your Information</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            <li>Display your bhandara posts to help the community</li>
            <li>Keep the platform secure and prevent spam</li>
            <li>Improve our service through analytics</li>
            <li>Show ads through Google AdSense to support the platform</li>
          </ul>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Data Sharing</h2>
          <p style={{ marginBottom: '24px' }}>
            We don't sell your information. Your bhandara posts are visible to all users. We use Google services (Analytics, AdSense, Authentication) which have their own privacy policies.
          </p>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Data Retention</h2>
          <p style={{ marginBottom: '24px' }}>
            Bhandara posts are automatically deleted after 24 hours. Your account data remains until you delete your account.
          </p>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Contact</h2>
          <p style={{ marginBottom: '8px' }}>
            Questions about privacy? Contact us at:
          </p>
          <p style={{ marginBottom: '24px' }}>
            Email: swayamgupta999@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}
