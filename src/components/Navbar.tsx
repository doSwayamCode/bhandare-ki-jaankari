import React, { useState } from 'react'
import { Plus, X, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SignInModal } from './SignInModal'

interface NavbarProps {
  showForm: boolean
  onToggleForm: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ showForm, onToggleForm }) => {
  const { user, signInWithGoogle, logout, loading } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)

  const handleAddBhandaraClick = () => {
    if (!user) {
      setShowSignInModal(true)
      return
    }
    onToggleForm()
  }

  const handleSignOut = async () => {
    console.log('Button clicked! Starting sign out process...')
    try {
      console.log('Signing out...')
      await logout()
      console.log('Sign out successful')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '8px 0',
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {/* Logo/Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #646cff 0%, #747bff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Bhandare ki jaankari
          </h1>
        </div>

        {/* Right side - Auth & Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Auth buttons */}
          {!loading && (
            <>
              {user ? (
                <>
                  {/* Add Bhandara Button - only for authenticated users */}
                  <button
                    onClick={onToggleForm}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {showForm ? (
                      <>
                        <X size={16} />
                        Close Form
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Add a Bhandara
                      </>
                    )}
                  </button>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#999',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#999'
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {/* Google Sign In Button */}
                  <button
                    onClick={signInWithGoogle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      background: '#4285f4',
                      border: 'none',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3367d6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#4285f4'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                  
                  {/* Add Bhandara Button - Always visible but requires auth to use */}
                  <button
                    onClick={handleAddBhandaraClick}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {showForm ? (
                      <>
                        <X size={16} />
                        Close Form
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add a Bhandara
                      </>
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </nav>
  )
}
