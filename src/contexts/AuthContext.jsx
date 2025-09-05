import * as React from 'react'
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...')
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Sign in successful:', result.user.email)
    } catch (error) {
      console.error('Detailed error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      if (error.code === 'auth/unauthorized-domain') {
        alert('This domain is not authorized for Google sign-in. Please add localhost to your Firebase project authorized domains.')
      } else if (error.code === 'auth/popup-blocked') {
        alert('Pop-up was blocked by browser. Please allow pop-ups for this site.')
      } else if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in was cancelled.')
      } else {
        alert(`Failed to sign in: ${error.message}`)
      }
    }
  }

  const logout = async () => {
    try {
      console.log('AuthContext: Starting sign out...')
      await firebaseSignOut(auth)
      console.log('AuthContext: Sign out completed')
    } catch (error) {
      console.error('AuthContext: Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
