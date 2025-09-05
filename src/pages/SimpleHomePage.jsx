import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext.jsx'
import { BhandaraCard } from '../components/BhandaraCard'
import type { Bhandara } from '../types/bhandara'
import { MapPin, Plus, User, LogOut, RefreshCw } from 'lucide-react'

export function HomePage() {
  const { user, signInWithGoogle, logout, loading: authLoading } = useAuth()
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBhandaras = async () => {
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
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBhandaras()
  }

  useEffect(() => {
    fetchBhandaras()

    // Set up real-time subscription
    const subscription = supabase
      .channel('bhandaras')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'bhandaras' },
        () => {
          fetchBhandaras()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      backgroundImage: 'url("/SQUARE-scaled.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Simple Navbar */}
        <nav className="bg-gray-900/90 backdrop-blur border-b border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">Bhandara Near You</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {authLoading ? (
                <div className="text-white">Loading...</div>
              ) : user ? (
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

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Bhandaras Near You
            </h1>
            <p className="text-gray-300 text-lg">
              Discover free food distributions and community meals in your area
            </p>
          </div>

          {/* Refresh button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Bhandaras grid */}
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin h-8 w-8 border-b-2 border-orange-500 rounded-full mx-auto"></div>
              <p className="mt-4">Loading bhandaras...</p>
            </div>
          ) : bhandaras.length === 0 ? (
            <div className="text-center text-white">
              <p className="text-xl mb-4">No active bhandaras found</p>
              <p className="text-gray-400">
                {user ? 'Be the first to add one!' : 'Sign in to add a bhandara'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bhandaras.map((bhandara) => (
                <BhandaraCard key={bhandara.id} bhandara={bhandara} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
