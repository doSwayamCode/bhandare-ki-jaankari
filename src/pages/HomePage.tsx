import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Navbar } from '../components/Navbar'
import { BhandaraForm } from '../components/BhandaraForm'
import { BhandaraCard } from '../components/BhandaraCard'
import type { Bhandara } from '../types/bhandara'
import { RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchBhandaras = async () => {
    try {
      const now = new Date().toISOString()
      
      // First, delete expired bhandaras
      await supabase
        .from('bhandaras')
        .delete()
        .lt('expires_at', now)
      
      // Then fetch active bhandaras
      const { data, error } = await supabase
        .from('bhandaras')
        .select('*')
        .gte('expires_at', now)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBhandaras(data || [])
    } catch (error) {
      console.error('Error fetching bhandaras:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBhandaras()
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const handleFormSubmit = () => {
    setShowForm(false)
    fetchBhandaras()
  }

  useEffect(() => {
    fetchBhandaras()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('bhandaras')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'bhandaras' 
        }, 
        () => {
          fetchBhandaras()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="app-background" style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar showForm={showForm} onToggleForm={toggleForm} />

      {/* Form Modal/Overlay */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <BhandaraForm onSubmit={handleFormSubmit} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container">
        {/* Hero Section - Subtitle */}
        <header style={{ 
          textAlign: 'center', 
          marginBottom: '48px', 
          marginTop: '24px' 
        }}>
          <p style={{ 
            color: '#fff', 
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '16px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
           Bhookh lagi hai? Kya aapke aas-paas koi bhandara hai? Agar haan, toh humein zaroor batayein!
          </p>
        </header>

        {/* Refresh Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#fff'
          }}>
            Recent Bhandaras
          </h2>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              fontSize: '14px'
            }}
          >
            <RefreshCw 
              size={16} 
              style={{ 
                animation: refreshing ? 'spin 1s linear infinite' : 'none' 
              }} 
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Bhandaras Grid */}
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px',
            color: '#888'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="loading" style={{ marginBottom: '16px' }}></div>
              <p>Loading bhandaras...</p>
            </div>
          </div>
        ) : bhandaras.length === 0 ? (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            color: '#888'
          }}>
            <h3 style={{ marginBottom: '12px', color: '#ccc' }}>No Bhandaras Available</h3>
            <p style={{ marginBottom: '24px' }}>Be the first to share a bhandara in your area!</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add First Bhandara
            </button>
          </div>
        ) : (
          <div className="grid">
            {bhandaras.map((bhandara) => (
              <BhandaraCard key={bhandara.id} bhandara={bhandara} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer style={{ 
          marginTop: '48px',
          padding: '0',
          color: '#fff',
          fontSize: '14px',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          margin: '48px 0 24px 0',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Main Footer Content */}
          <div style={{
            padding: '32px 24px 24px 24px'
          }}>
            {/* Header Section */}
            <div style={{
              textAlign: 'center',
              marginBottom: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '24px'
            }}>
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#fff'
              }}>
                Bhandare ki Jaankari
              </h3>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#aaa',
                fontStyle: 'italic'
              }}>
                Community-led platform to share bhandara information
              </p>
            </div>

            {/* Navigation Links Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <Link 
                to="/about" 
                style={{ 
                  color: '#60a5fa', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(96, 165, 250, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                About Us
              </Link>
              <Link 
                to="/privacy" 
                style={{ 
                  color: '#60a5fa', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(96, 165, 250, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                style={{ 
                  color: '#60a5fa', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(96, 165, 250, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Terms of Service
              </Link>
              <Link 
                to="/faq" 
                style={{ 
                  color: '#60a5fa', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(96, 165, 250, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                style={{ 
                  color: '#60a5fa', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(96, 165, 250, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Contact
              </Link>
            </div>

            {/* Info Section */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '20px'
            }}>
              <p style={{ 
                margin: '0 0 8px 0',
                color: '#e0e0e0',
                fontWeight: '500',
                fontSize: '13px'
              }}>
                ⏰ All listings are automatically removed after 24 hours
              </p>
              <p style={{ 
                margin: '0',
                color: '#bbb',
                fontSize: '12px'
              }}>
                Helping communities find and share free meals across India
              </p>
            </div>
          </div>

          {/* Bottom Credit Section */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '16px 24px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ 
              fontSize: '12px', 
              color: '#999',
              margin: 0
            }}>
              Developed with ❤️ by{' '}
              <a 
                href="https://www.linkedin.com/in/swayam-gupta0708/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#93c5fd'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#60a5fa'
                }}
              >
                Swayam Gupta
              </a>
              {' '}• © 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
