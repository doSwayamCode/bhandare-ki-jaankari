import React from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { Navbar } from '../components/Navbar'

export const ContactPage: React.FC = () => {

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
            Contact Us
          </h1>
          <p style={{ 
            color: '#ccc', 
            margin: '8px 0 0 0',
            fontSize: '16px'
          }}>
            We'd love to hear from you
          </p>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '32px', textAlign: 'center' }}>Get in Touch</h2>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Mail size={24} style={{ color: '#ff6b35' }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>Email</h3>
            </div>
            <p style={{ color: '#ccc', marginLeft: '40px', fontSize: '16px', marginBottom: '8px' }}>
              <a href="mailto:swayamgupta999@gmail.com" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '18px' }}>
                swayamgupta999@gmail.com
              </a>
            </p>
            <p style={{ color: '#ccc', marginLeft: '40px', fontSize: '14px' }}>
              We typically respond within 24-48 hours
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <MessageCircle size={24} style={{ color: '#ff6b35' }} />
              <h3 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>LinkedIn</h3>
            </div>
            <p style={{ color: '#ccc', marginLeft: '40px', fontSize: '16px', marginBottom: '8px' }}>
              <a 
                href="https://www.linkedin.com/in/swayam-gupta0708/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '18px' }}
              >
                Connect with Developer
              </a>
            </p>
            <p style={{ color: '#ccc', marginLeft: '40px', fontSize: '14px' }}>
              For business inquiries, partnerships and faster communication
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid rgba(255, 107, 53, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#ff6b35', margin: '0 0 12px 0' }}>Response Time</h4>
            <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>
              We aim to respond to all inquiries within 24-48 hours. For urgent matters, please use LinkedIn for faster communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
