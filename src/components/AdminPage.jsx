import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { BhandaraForm } from './BhandaraForm'

function AdminPage() {
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Bhandara</h1>
        <BhandaraForm 
          onSubmit={() => {
            // Handle form submission
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

export default AdminPage
