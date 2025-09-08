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
    trackBhandaraViewed(bhandara.id, bhandara.location_link)
  }, [])

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

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? 's' : ''} left`
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`
    }
    
    return `${minutes}m left`
  }

  const formatLocation = (locationLink: string) => {
    try {
      const url = new URL(locationLink)
      if (url.hostname.includes('maps.google')) {
        return 'Google Maps'
      } else if (url.hostname.includes('maps.apple')) {
        return 'Apple Maps'
      } else if (url.hostname.includes('waze')) {
        return 'Waze'
      }
      return 'Map Link'
    } catch {
      return 'Map Link'
    }
  }

  return (
    <div style={{
      background: 'rgba(15, 15, 15, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 100, 100, 0.3)',
      borderRadius: '16px',
      marginBottom: '20px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}
    className="bhandara-card"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 100, 255, 0.1)'
      e.currentTarget.style.borderColor = 'rgba(100, 100, 255, 0.3)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.borderColor = 'rgba(100, 100, 100, 0.2)'
    }}>
      
      {/* Top 50% - Image Area */}
      {bhandara.photo_urls && bhandara.photo_urls.length > 0 ? (
        <div style={{
          height: '50%', // Takes up 50% of card height
          width: '100%',
          display: 'flex',
          gap: bhandara.photo_urls.length > 1 ? '2px' : '0px',
          padding: '0',
          margin: '0',
          background: '#000',
          borderRadius: '16px 16px 0 0', // Only round top corners
          overflow: 'hidden',
          position: 'relative',
          flex: '0 0 50%' // Explicit flex sizing
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
                border: 'none',
                display: 'block',
                margin: '0',
                padding: '0',
                minHeight: '100%',
                minWidth: bhandara.photo_urls!.length === 1 ? '100%' : '50%'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ))}
        </div>
      ) : (
        // If no images, show a placeholder or reduce content area
        <div style={{
          height: '60px', // Small placeholder area
          background: 'rgba(100, 100, 100, 0.1)',
          margin: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
          No image available
        </div>
      )}

      {/* Bottom 50% - Content Area */}
      <div 
        className="bhandara-card-content"
        style={{
          height: '50%', // Takes exactly 50% of remaining space
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
        
        {/* Main Content */}
        <div>
          {/* Header with time remaining */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={16} style={{ color: '#999' }} />
              <span style={{
                fontSize: '14px',
                color: '#999'
              }}>
                {formatTimeRemaining(bhandara.expires_at)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <MapPin size={16} style={{ color: '#646cff', marginTop: '2px', flexShrink: 0 }} />
            <div>
              {bhandara.nearby_landmark && (
                <p style={{
                  fontSize: '14px',
                  color: '#ccc',
                  margin: '0 0 4px 0',
                  lineHeight: '1.4'
                }}>
                  Near: {bhandara.nearby_landmark}
                </p>
              )}
              <a
                href={bhandara.location_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#646cff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none'
                }}
              >
                📍 Open {formatLocation(bhandara.location_link)}
              </a>
            </div>
          </div>

          {/* Description */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <FileText size={16} style={{ color: '#999', marginTop: '2px', flexShrink: 0 }} />
            <p style={{
              fontSize: '14px',
              color: '#ccc',
              margin: 0,
              lineHeight: '1.5',
              flex: 1,
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {bhandara.location_description}
            </p>
          </div>

          {/* Menu (if available) */}
          {bhandara.menu && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              background: 'rgba(100, 100, 255, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(100, 100, 255, 0.2)'
            }}>
              <p style={{
                fontSize: '11px',
                color: '#646cff',
                margin: '0 0 4px 0',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Menu
              </p>
              <p style={{
                fontSize: '13px',
                color: '#ccc',
                margin: 0,
                lineHeight: '1.4',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {bhandara.menu}
              </p>
            </div>
          )}
        </div>

        {/* Footer with upvote and metadata */}
        <div style={{
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 'auto',
          flexShrink: 0 // Prevent footer from shrinking
        }}>
          {/* Upvote button and action row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px'
          }}>
            <span style={{
              fontSize: '11px',
              color: '#888',
              fontStyle: 'italic'
            }}>
              Upvote if above bhandara is genuine
            </span>
            
            {/* Upvote Button */}
            <button
              onClick={handleUpvote}
              disabled={isUpvoting || checkingVoteStatus || hasVoted}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
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
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
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
              {hasVoted ? <Check size={12} /> : <ChevronUp size={12} />}
              {upvotes}
              {hasVoted && <span style={{ fontSize: '9px', marginLeft: '2px' }}>✓</span>}
            </button>
          </div>
          
          {/* Metadata row */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            fontSize: '10px',
            color: '#666',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Added by {bhandara.user_name || 'Anonymous'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
