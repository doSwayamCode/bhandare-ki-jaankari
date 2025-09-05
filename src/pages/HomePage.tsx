import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Navbar } from '../components/Navbar'
import { BhandaraForm } from '../components/BhandaraForm'
import { BhandaraCard } from '../components/BhandaraCard'
import type { Bhandara } from '../types/bhandara'
import { RefreshCw } from 'lucide-react'

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
          textAlign: 'center', 
          marginTop: '48px',
          padding: '24px 0',
          color: '#fff',
          fontSize: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          margin: '48px 0 24px 0'
        }}>
          <p style={{ 
            marginBottom: '12px',
            color: '#fff',
            fontWeight: '500'
          }}>
            Community-led platform to share bhandara information.
            All listings are automatically removed after 24 hours.
          </p>
          <p style={{ 
            fontSize: '13px', 
            color: '#ccc',
            margin: 0
          }}>
            Developed by{' '}
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
              Swayam
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
