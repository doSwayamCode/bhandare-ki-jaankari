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
      alert('Error loading bhandaras')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isAuthenticated) {
    return (
      <div className="app-background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ 
          maxWidth: '400px', 
          width: '90%',
          position: 'relative'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
            title="Back to Home"
          >
            <ArrowLeft size={16} />
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '24px',
            paddingRight: '40px'
          }}>
            <Shield size={24} color="#646cff" />
            <h2 style={{ margin: 0, fontSize: '20px' }}>Admin Access</h2>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-background" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="card">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={24} color="#646cff" />
              <h1 style={{ margin: 0, fontSize: '28px' }}>Admin Panel</h1>
              <span style={{ 
                background: 'rgba(100, 108, 255, 0.2)', 
                padding: '4px 12px', 
                borderRadius: '6px', 
                fontSize: '14px',
                color: '#646cff',
                fontWeight: '500'
              }}>
                {bhandaras.length} Bhandaras
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={fetchBhandaras}
                disabled={loading}
                style={{
                  background: 'rgba(100, 108, 255, 0.2)',
                  border: '1px solid rgba(100, 108, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: '#646cff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  opacity: loading ? 0.6 : 1
                }}
                title="Refresh Data"
              >
                <RefreshCw size={16} style={{ 
                  animation: loading ? 'spin 1s linear infinite' : 'none' 
                }} />
                Refresh
              </button>
              
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px'
                }}
              >
                <ArrowLeft size={16} />
                Back to Home
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
              <p>Loading bhandaras...</p>
            </div>
          ) : bhandaras.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '60px 0' }}>
              <Shield size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>No Bhandaras Found</h3>
              <p style={{ margin: 0 }}>All bhandaras have expired or none have been added yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bhandaras.map((bhandara) => (
                <div 
                  key={bhandara.id} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '20px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fff' }}>
                      {bhandara.location_description}
                    </h3>
                    
                    {bhandara.nearby_landmark && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📍</span> {bhandara.nearby_landmark}
                      </p>
                    )}
                    
                    {bhandara.menu && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#aaa' }}>
                        <strong>Menu:</strong> {bhandara.menu.substring(0, 100)}{bhandara.menu.length > 100 ? '...' : ''}
                      </p>
                    )}
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
                      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                        <strong>Created:</strong> {formatDate(bhandara.created_at)}
                      </p>
                      <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                        <strong>Expires:</strong> {formatDate(bhandara.expires_at)}
                      </p>
                      {bhandara.photo_urls && bhandara.photo_urls.length > 0 && (
                        <p style={{ margin: '0', fontSize: '12px', color: '#646cff' }}>
                          📷 {bhandara.photo_urls.length} photo(s)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => window.open(bhandara.location_link, '_blank')}
                      style={{
                        background: 'rgba(100, 108, 255, 0.2)',
                        border: '1px solid rgba(100, 108, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '10px',
                        cursor: 'pointer',
                        color: '#646cff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      title="View Location"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(100, 108, 255, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(100, 108, 255, 0.2)'
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(bhandara.id)}
                      disabled={deleting === bhandara.id}
                      style={{
                        background: 'rgba(255, 69, 58, 0.2)',
                        border: '1px solid rgba(255, 69, 58, 0.3)',
                        borderRadius: '8px',
                        padding: '10px',
                        cursor: deleting === bhandara.id ? 'not-allowed' : 'pointer',
                        color: '#ff453a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: deleting === bhandara.id ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                      title="Delete Bhandara"
                      onMouseEnter={(e) => {
                        if (deleting !== bhandara.id) {
                          e.currentTarget.style.background = 'rgba(255, 69, 58, 0.3)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deleting !== bhandara.id) {
                          e.currentTarget.style.background = 'rgba(255, 69, 58, 0.2)'
                        }
                      }}
                    >
                      <Trash2 size={16} />
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
