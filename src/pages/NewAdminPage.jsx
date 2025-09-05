import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { BhandaraForm } from '../components/BhandaraForm'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function AdminPage() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in Required</h2>
          <p className="mb-6">You need to sign in with Google to add a bhandara.</p>
          <button
            onClick={signInWithGoogle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-4"
          >
            Sign in with Google
          </button>
          <div>
            <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center justify-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6">Add New Bhandara</h1>
        <BhandaraForm 
          onSubmit={() => {
            window.location.href = '/'
          }}
          onClose={() => {
            window.location.href = '/'
          }}
        />
      </div>
    </div>
  )
}
