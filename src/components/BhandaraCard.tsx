import React, { useState, useEffect } from 'react'
import { MapPin, Clock, FileText, ChevronUp, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import type { Bhandara } from '../types/bhandara'
import { trackBhandaraViewed, trackBhandaraLiked } from '../lib/analytics'

interface BhandaraCardProps {
  bhandara: Bhandara
}

export const BhandaraCard: React.FC<BhandaraCardProps> = ({ bhandara }) => {
  const { user } = useAuth()
  const [upvotes, setUpvotes] = useState(bhandara.upvotes || 0)
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [checkingVoteStatus, setCheckingVoteStatus] = useState(false)

  // Track bhandara view when card is mounted
  useEffect(() => {
    trackBhandaraViewed(
      bhandara.id.toString(),
      bhandara.location_description || bhandara.nearby_landmark || 'Unknown location'
    )
  }, [bhandara.id, bhandara.location_description, bhandara.nearby_landmark])

  // Check if user has already voted when component mounts or user changes
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (!user) {
        setHasVoted(false)
        return
      }

      setCheckingVoteStatus(true)
      try {
        const { data, error } = await supabase
          .from('user_votes')
          .select('id')
          .eq('user_id', user.uid)
          .eq('bhandara_id', bhandara.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error
        }

        setHasVoted(!!data)
      } catch (error) {
        console.error('Error checking vote status:', error)
      } finally {
        setCheckingVoteStatus(false)
      }
    }

    checkVoteStatus()
  }, [user, bhandara.id])
  
  const handleUpvote = async () => {
    if (!user) {
      alert('Please sign in to upvote')
      return
    }

    if (hasVoted) {
      alert('You have already upvoted this bhandara. Each user can only upvote once to maintain authenticity.')
      return
    }
    
    if (isUpvoting) return
    
    setIsUpvoting(true)
    
    try {
      // First, check one more time if user has voted (to prevent race conditions)
      const { data: existingVote } = await supabase
        .from('user_votes')
        .select('id')
        .eq('user_id', user.uid)
        .eq('bhandara_id', bhandara.id)
        .maybeSingle()

      if (existingVote) {
        setHasVoted(true)
        alert('You have already upvoted this bhandara.')
        return
      }

      // Insert the vote record
      const { error: voteError } = await supabase
        .from('user_votes')
        .insert({
          user_id: user.uid,
          bhandara_id: bhandara.id
        })

      if (voteError) throw voteError

      // Update the upvote count
      const newUpvoteCount = upvotes + 1
      const { error: updateError } = await supabase
        .from('bhandaras')
        .update({ upvotes: newUpvoteCount })
        .eq('id', bhandara.id)
      
      if (updateError) throw updateError
      
      setUpvotes(newUpvoteCount)
      setHasVoted(true)
      
      // Track successful upvote
      trackBhandaraLiked(
        bhandara.id.toString(),
        bhandara.location_description || bhandara.nearby_landmark || 'Unknown location'
      )
    } catch (error) {
      console.error('Error upvoting:', error)
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { // Unique constraint violation
        setHasVoted(true)
        alert('You have already upvoted this bhandara.')
      } else {
        alert('Failed to upvote. Please try again.')
      }
    } finally {
      setIsUpvoting(false)
    }
  }
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
          marginBottom: '12px', 
          fontSize: bhandara.photo_urls && bhandara.photo_urls.length > 0 ? '20px' : '24px', 
          fontWeight: '600',
          lineHeight: '1.3'
        }}>
          {bhandara.location_description}
        </h3>

        {/* Posted by user info */}
        {bhandara.user_name && (
          <p style={{ 
            color: '#888', 
            marginBottom: '16px', 
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Posted by {bhandara.user_name}
          </p>
        )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            
            {/* Upvote Button */}
            <button
              onClick={handleUpvote}
              disabled={isUpvoting || checkingVoteStatus || hasVoted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: hasVoted 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : user 
                    ? 'rgba(46, 160, 67, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                border: hasVoted
                  ? '1px solid rgba(34, 197, 94, 0.5)'
                  : user 
                    ? '1px solid rgba(46, 160, 67, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                color: hasVoted
                  ? '#22c55e'
                  : user 
                    ? '#4ade80' 
                    : '#999',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: hasVoted 
                  ? 'not-allowed' 
                  : user 
                    ? 'pointer' 
                    : 'not-allowed',
                transition: 'all 0.2s ease',
                opacity: isUpvoting || checkingVoteStatus ? 0.6 : 1
              }}
              title={
                hasVoted 
                  ? 'You have already upvoted this bhandara'
                  : user 
                    ? 'Upvote this bhandara (one time only)'
                    : 'Sign in to upvote'
              }
            >
              {hasVoted ? <Check size={16} /> : <ChevronUp size={16} />}
              {upvotes}
              {hasVoted && <span style={{ fontSize: '11px', marginLeft: '4px' }}>✓</span>}
            </button>
          </div>
          
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
