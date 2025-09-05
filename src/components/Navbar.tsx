import React from 'react'
import { Plus, X } from 'lucide-react'

interface NavbarProps {
  showForm: boolean
  onToggleForm: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ showForm, onToggleForm }) => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px 0',
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            // background: 'linear-gradient(135deg, #646cff 0%, #747bff 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #646cff 0%, #747bff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Bhandare ki jaankari
          </h1>
        </div>

        {/* Add Bhandara Button */}
        <button
          onClick={onToggleForm}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          {showForm ? (
            <>
              <X size={20} />
              Close Form
            </>
          ) : (
            <>
              <Plus size={20} />
              Add a Bhandara
            </>
          )}
        </button>
      </div>
    </nav>
  )
}
