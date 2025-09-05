import React from 'react'
import { MapPin, Clock, FileText } from 'lucide-react'
import type { Bhandara } from '../types/bhandara'

interface BhandaraCardProps {
  bhandara: Bhandara
}

export const BhandaraCard: React.FC<BhandaraCardProps> = ({ bhandara }) => {
  const getTimeRemaining = () => {
    const now = new Date()
    const expires = new Date(bhandara.expires_at)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    } else {
      return `${minutes}m remaining`
    }
  }

  const openGoogleMaps = () => {
    window.open(bhandara.location_link, '_blank')
  }

  const formatCreatedTime = () => {
    const created = new Date(bhandara.created_at)
    const now = new Date()
    const diff = now.getTime() - created.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else {
      return created.toLocaleDateString()
    }
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Photos - Top Half */}
      {bhandara.photo_urls && bhandara.photo_urls.length > 0 && (
        <div style={{ 
          marginBottom: '20px',
          height: '250px',
          overflow: 'hidden',
          borderRadius: '8px',
          display: 'flex',
          gap: '8px'
        }}>
          {bhandara.photo_urls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Bhandara ${index + 1}`}
              style={{ 
                width: bhandara.photo_urls!.length === 1 ? '100%' : '50%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          ))}
        </div>
      )}

      {/* Content - Bottom Half or Full Card */}
      <div style={{ 
        padding: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '0' : '8px 0'
      }}>
        {/* Location Description */}
        <h3 style={{ 
          marginBottom: '16px', 
          fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '20px' : '24px', 
          fontWeight: '600',
          lineHeight: '1.3'
        }}>
          {bhandara.location_description}
        </h3>

        {/* Nearby Landmark */}
        {bhandara.nearby_landmark && (
          <p style={{ 
            color: '#888', 
            marginBottom: '16px', 
            fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '15px' : '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📍</span> {bhandara.nearby_landmark}
          </p>
        )}

        {/* Menu */}
        {bhandara.menu && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
              color: '#646cff'
            }}>
              <FileText size={18} style={{ marginRight: '8px' }} />
              <span style={{ 
                fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '16px' : '18px', 
                fontWeight: '500' 
              }}>
                Menu
              </span>
            </div>
            <p style={{ 
              color: '#ccc', 
              fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '15px' : '17px', 
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '12px',
              borderRadius: '6px'
            }}>
              {bhandara.menu}
            </p>
          </div>
        )}

        {/* Actions and Info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button 
            onClick={openGoogleMaps}
            className="btn-primary"
            style={{ 
              padding: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '10px 18px' : '12px 20px',
              fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '14px' : '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MapPin size={bhandara.photo_urls && bhandara.photo_urls.length > 0 ? 16 : 18} />
            View Location
          </button>
          
          <div style={{ textAlign: 'right' }}>
            <div className="time-remaining" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '13px' : '14px'
            }}>
              <Clock size={bhandara.photo_urls && bhandara.photo_urls.length > 0 ? 14 : 16} />
              {getTimeRemaining()}
            </div>
            <div style={{ 
              color: '#666', 
              fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '11px' : '12px',
              marginTop: '4px'
            }}>
              Added {formatCreatedTime()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
