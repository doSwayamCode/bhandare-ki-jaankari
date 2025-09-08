import React from 'react'
import { ArrowLeft, Heart, Users, MapPin, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export const AboutPage: React.FC = () => {
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
            About Bhandare ki Jaankari
          </h1>
          <p style={{ 
            color: '#ccc', 
            margin: '8px 0 0 0',
            fontSize: '18px'
          }}>
            Connecting communities through the spirit of sharing
          </p>
        </div>

        {/* Mission Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          lineHeight: '1.6'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Heart size={48} style={{ color: '#ff6b35', marginBottom: '16px' }} />
            <h2 style={{ color: '#ff6b35', marginBottom: '16px', fontSize: '28px' }}>Our Mission</h2>
            <p style={{ fontSize: '18px', color: '#ccc' }}>
              To help people find and share free community meals (bhandaras) in their area.
            </p>
          </div>
        </div>

        {/* What is Bhandara Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          lineHeight: '1.6'
        }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>What is a Bhandara?</h2>
          <p style={{ marginBottom: '16px' }}>
            A <strong>Bhandara</strong> is a free community meal, often organized by temples, gurudwaras, NGOs, or individuals as an act of service. Anyone can attend and enjoy a wholesome meal, regardless of their background.
          </p>
        </div>

        {/* How It Works Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          lineHeight: '1.6'
        }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '24px' }}>How It Works</h2>
          
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <Users size={24} style={{ color: '#ff6b35', marginTop: '4px' }} />
              <div>
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Share Information</h3>
                <p style={{ color: '#ccc' }}>
                  Community members post details about upcoming bhandaras.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <MapPin size={24} style={{ color: '#ff6b35', marginTop: '4px' }} />
              <div>
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Find Locations</h3>
                <p style={{ color: '#ccc' }}>
                  Get exact location details and directions to bhandaras near you.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <Clock size={24} style={{ color: '#ff6b35', marginTop: '4px' }} />
              <div>
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Stay Updated</h3>
                <p style={{ color: '#ccc' }}>
                  Posts automatically expire after 24 hours to keep information current.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Developer */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          lineHeight: '1.6'
        }}>
          <h2 style={{ color: '#ff6b35', marginBottom: '16px' }}>About the Developer</h2>
          <p style={{ marginBottom: '16px' }}>
            Created by <strong>Swayam Gupta</strong> to help connect people with free community meals using modern web technology.
          </p>
          <p>
            Connect: <a 
              href="https://www.linkedin.com/in/swayam-gupta0708/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              LinkedIn
            </a> | Email: swayamgupta999@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}
