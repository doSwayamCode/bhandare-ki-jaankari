import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Trash2, Eye, Shield, ArrowLeft, RefreshCw } from 'lucide-react'
import type { Bhandara } from '../types/bhandara'

export const AdminPage: React.FC = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Your secret admin password - change this to something secure
  const ADMIN_PASSWORD = 'swayam2025' // Change this password!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword('')
      fetchBhandaras()
    } else {
      alert('Incorrect password!')
      setPassword('')
    }
  }

  const fetchBhandaras = async () => {
    setLoading(true)
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
      alert('Error fetching bhandaras')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bhandara?')) return
    
    setDeleting(id)
    try {
      const { error } = await supabase
        .from('bhandaras')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Bhandara deleted successfully!')
      fetchBhandaras()
    } catch (error) {
      console.error('Error deleting bhandara:', error)
      alert('Error deleting bhandara')
    } finally {
      setDeleting(null)
    }
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? 's' : ''} left`
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`
    }
    
    return `${minutes}m left`
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <Shield size={48} style={{ color: '#ff6b35', marginBottom: '20px' }} />
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>Admin Access</h1>
          <p style={{ color: '#ccc', marginBottom: '30px' }}>
            Enter the admin password to manage bhandaras
          </p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                background: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
              required
            />
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(255, 107, 53, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </button>
          </form>
          
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ccc',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '20px auto 0'
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          background: 'rgba(20, 20, 20, 0.8)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={24} style={{ color: '#ff6b35' }} />
            <h1 style={{ color: '#fff', margin: 0 }}>Admin Panel</h1>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={fetchBhandaras}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.6 : 1,
                boxShadow: '0 2px 4px rgba(255, 107, 53, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <RefreshCw size={16} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#ccc',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(20, 20, 20, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ff6b35', margin: '0 0 8px 0' }}>{bhandaras.length}</h3>
            <p style={{ color: '#ccc', margin: 0 }}>Active Bhandaras</p>
          </div>
        </div>

        {/* Bhandaras List */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.8)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>All Bhandaras</h2>
          
          {loading ? (
            <p style={{ color: '#ccc', textAlign: 'center' }}>Loading...</p>
          ) : bhandaras.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center' }}>No bhandaras found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bhandaras.map((bhandara) => (
                <div
                  key={bhandara.id}
                  style={{
                    background: 'rgba(40, 40, 40, 0.5)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '16px' }}>
                      {bhandara.location_description}
                    </h3>
                    <p style={{ color: '#ccc', margin: '0 0 4px 0', fontSize: '14px' }}>
                      By: {bhandara.user_name || 'Anonymous'}
                    </p>
                    <p style={{ color: '#999', margin: 0, fontSize: '12px' }}>
                      Expires: {formatTimeRemaining(bhandara.expires_at)}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={bhandara.location_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textDecoration: 'none',
                        boxShadow: '0 2px 4px rgba(255, 107, 53, 0.3)',
                        transition: 'all 0.3s ease',
                        fontSize: '12px'
                      }}
                    >
                      <Eye size={14} />
                      View
                    </a>
                    
                    <button
                      onClick={() => handleDelete(bhandara.id)}
                      disabled={deleting === bhandara.id}
                      style={{
                        background: '#dc3545',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        padding: '6px 12px',
                        cursor: deleting === bhandara.id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        opacity: deleting === bhandara.id ? 0.6 : 1
                      }}
                    >
                      <Trash2 size={14} />
                      {deleting === bhandara.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
