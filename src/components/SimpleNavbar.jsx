import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { MapPin, Plus, User, LogOut } from 'lucide-react'

function Navbar() {
  const { user, signInWithGoogle, logout, loading } = useAuth()

  if (loading) {
    return (
      <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <MapPin className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">Bhandara Near You</span>
          </Link>
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-white">
          <MapPin className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold">Bhandara Near You</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/admin"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Bhandara</span>
              </Link>
              <div className="flex items-center space-x-2 text-white">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.displayName}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
