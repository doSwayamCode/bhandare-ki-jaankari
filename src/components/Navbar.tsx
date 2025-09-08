import React, { useState } from 'react'
import { Plus, X, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SignInModal } from './SignInModal'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  showForm: boolean
  onToggleForm: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ showForm, onToggleForm }) => {
  const { user, signInWithGoogle, logout, loading } = useAuth()
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const location = useLocation()

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
      background: '#000000',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
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
          gap: '12px'
        }}>
          {/* Logo Image */}
          <img 
            src="/logo-removebg-preview.png" 
            alt="Bhandare ki jaankari Logo" 
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain'
            }}
          />
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif',
            color: 'white',
            margin: 0,
            letterSpacing: '0.01em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Bhandare ki jaankari
          </h1>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }} className="desktop-nav">
          <Link
            to="/"
            style={{
              color: location.pathname === '/' ? '#ff6b35' : '#ccc',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'color 0.2s ease',
              padding: '8px 0'
            }}
          >
            Home
          </Link>
          <Link
            to="/about"
            style={{
              color: location.pathname === '/about' ? '#ff6b35' : '#ccc',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'color 0.2s ease',
              padding: '8px 0'
            }}
          >
            About
          </Link>
          <Link
            to="/faq"
            style={{
              color: location.pathname === '/faq' ? '#ff6b35' : '#ccc',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'color 0.2s ease',
              padding: '8px 0'
            }}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            style={{
              color: location.pathname === '/contact' ? '#ff6b35' : '#ccc',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'color 0.2s ease',
              padding: '8px 0'
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <Menu size={24} />
        </button>

        {/* Right side - Auth & Actions - Desktop */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }} className="desktop-actions">
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
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
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
                      background: 'linear-gradient(135deg, #ff8c42 0%, #ffab61 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #e67938 0%, #e6955b 100%)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ff8c42 0%, #ffab61 100%)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 140, 66, 0.3)'
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

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          padding: '20px'
        }} className="mobile-menu">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center'
          }}>
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={() => setShowMobileMenu(false)}
              style={{
                color: location.pathname === '/' ? '#ff6b35' : '#fff',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '18px',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                textAlign: 'center'
              }}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setShowMobileMenu(false)}
              style={{
                color: location.pathname === '/about' ? '#ff6b35' : '#fff',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '18px',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                textAlign: 'center'
              }}
            >
              About
            </Link>
            <Link
              to="/faq"
              onClick={() => setShowMobileMenu(false)}
              style={{
                color: location.pathname === '/faq' ? '#ff6b35' : '#fff',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '18px',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                textAlign: 'center'
              }}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              onClick={() => setShowMobileMenu(false)}
              style={{
                color: location.pathname === '/contact' ? '#ff6b35' : '#fff',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '18px',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                textAlign: 'center'
              }}
            >
              Contact
            </Link>

            {/* Mobile Auth Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
              maxWidth: '300px',
              marginTop: '20px'
            }}>
              {!loading && (
                <>
                  {user ? (
                    <>
                      {/* Add Bhandara Button - Mobile */}
                      <button
                        onClick={() => {
                          onToggleForm()
                          setShowMobileMenu(false)
                        }}
                        className="btn-primary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          fontSize: '16px',
                          fontWeight: '500',
                          width: '100%'
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

                      {/* Sign Out Button - Mobile */}
                      <button
                        onClick={() => {
                          handleSignOut()
                          setShowMobileMenu(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#fff',
                          borderRadius: '6px',
                          fontSize: '16px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Google Sign In Button - Mobile */}
                      <button
                        onClick={() => {
                          signInWithGoogle()
                          setShowMobileMenu(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          background: 'linear-gradient(135deg, #ff8c42 0%, #ffab61 100%)',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '16px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          width: '100%',
                          boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)'
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                      </button>
                      
                      {/* Add Bhandara Button - Mobile */}
                      <button
                        onClick={() => {
                          handleAddBhandaraClick()
                          setShowMobileMenu(false)
                        }}
                        className="btn-primary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px 20px',
                          fontSize: '16px',
                          fontWeight: '500',
                          width: '100%'
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
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </nav>
  )
}
