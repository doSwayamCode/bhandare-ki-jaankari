import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Trash2, Eye, Shield, X } from 'lucide-react'
import type { Bhandara } from '../types/bhandara'

interface AdminPanelProps {
  bhandaras: Bhandara[]
  onRefresh: () => void
  onClose: () => void
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ bhandaras, onRefresh, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  
  // Your secret admin password - change this to something secure
  const ADMIN_PASSWORD = 'swayam2025' // Change this password!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      alert('Incorrect password!')
      setPassword('')
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
      onRefresh()
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}>
        <div className="card" style={{ 
          maxWidth: '400px', 
          width: '90%',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
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
          >
            <X size={16} />
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      zIndex: 2000,
      overflow: 'auto'
    }}>
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="card" style={{ position: 'relative' }}>
          <button
            onClick={onClose}
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
          >
            <X size={16} />
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '24px',
            paddingRight: '40px'
          }}>
            <Shield size={24} color="#646cff" />
            <h2 style={{ margin: 0, fontSize: '24px' }}>Admin Panel</h2>
            <span style={{ 
              background: 'rgba(100, 108, 255, 0.2)', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '12px',
              color: '#646cff'
            }}>
              {bhandaras.length} Bhandaras
            </span>
          </div>

          {bhandaras.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
              No bhandaras to manage
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bhandaras.map((bhandara) => (
                <div 
                  key={bhandara.id} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                      {bhandara.location_description}
                    </h4>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#888' }}>
                      📍 {bhandara.nearby_landmark || 'No landmark specified'}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                      Created: {formatDate(bhandara.created_at)}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      Expires: {formatDate(bhandara.expires_at)}
                    </p>
                    {bhandara.photo_urls && bhandara.photo_urls.length > 0 && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#646cff' }}>
                        📷 {bhandara.photo_urls.length} photo(s)
                      </p>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => window.open(bhandara.location_link, '_blank')}
                      style={{
                        background: 'rgba(100, 108, 255, 0.2)',
                        border: '1px solid rgba(100, 108, 255, 0.3)',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#646cff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="View Location"
                    >
                      <Eye size={14} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(bhandara.id)}
                      disabled={deleting === bhandara.id}
                      style={{
                        background: 'rgba(255, 69, 58, 0.2)',
                        border: '1px solid rgba(255, 69, 58, 0.3)',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: deleting === bhandara.id ? 'not-allowed' : 'pointer',
                        color: '#ff453a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        opacity: deleting === bhandara.id ? 0.5 : 1
                      }}
                      title="Delete Bhandara"
                    >
                      <Trash2 size={14} />
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
