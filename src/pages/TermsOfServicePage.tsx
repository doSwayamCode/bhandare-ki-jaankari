import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export const TermsOfServicePage: React.FC = () => {
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
            Terms of Service
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
          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Using Our Service</h2>
          <p style={{ marginBottom: '24px' }}>
            Bhandare ki Jaankari helps you find and share free community meals. By using our platform, you agree to these simple rules.
          </p>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Your Account</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            <li>Sign in with Google to post bhandara information</li>
            <li>Provide accurate information only</li>
            <li>Keep your account secure</li>
          </ul>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>What You Can Post</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            <li>Only legitimate, free community meals</li>
            <li>Accurate location and timing details</li>
            <li>Appropriate photos only</li>
            <li>Truthful information that helps the community</li>
          </ul>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>What's Not Allowed</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            <li>False or misleading information</li>
            <li>Spam or commercial advertisements</li>
            <li>Inappropriate or offensive content</li>
            <li>Anything illegal or harmful</li>
          </ul>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Important Notes</h2>
          <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
            <li>Posts are automatically deleted after 24 hours</li>
            <li>We don't verify the accuracy of posted information</li>
            <li>Attend bhandaras at your own discretion</li>
            <li>We may remove content or accounts that violate these terms</li>
          </ul>

          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>Contact</h2>
          <p style={{ marginBottom: '24px' }}>
            Questions? Contact us at: swayamgupta999@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}
