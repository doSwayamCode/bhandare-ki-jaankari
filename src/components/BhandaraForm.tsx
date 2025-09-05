import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, MapPin, Camera, FileText, X } from 'lucide-react'
import type { BhandaraFormData } from '../types/bhandara'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface BhandaraFormProps {
  onSubmit: () => void
  onClose: () => void
}

export const BhandaraForm: React.FC<BhandaraFormProps> = ({ onSubmit, onClose }) => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<BhandaraFormData>()

  const watchedPhotos = watch('photos')

  React.useEffect(() => {
    if (watchedPhotos && watchedPhotos.length > 0) {
      const files = Array.from(watchedPhotos)
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviewImages(urls)
      
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url))
      }
    } else {
      setPreviewImages([])
    }
  }, [watchedPhotos])

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error } = await supabase.storage
        .from('bhandara-images')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('bhandara-images')
        .getPublicUrl(fileName)

      return publicUrl
    })

    return Promise.all(uploadPromises)
  }

  const onFormSubmit = async (data: BhandaraFormData) => {
    // Only require authentication if Firebase is configured
    if (!user) {
      alert('You must be signed in to post a bhandara.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Validate photos are provided (now mandatory)
      if (!data.photos || data.photos.length === 0) {
        throw new Error('Please select at least 1 photo')
      }

      // Upload images (now required)
      const photoUrls = await uploadImages(data.photos)

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const insertData: any = {
        location_link: data.location_link,
        nearby_landmark: data.nearby_landmark || null,
        photo_urls: photoUrls,
        menu: data.menu || null,
        location_description: data.location_description,
        expires_at: expiresAt.toISOString(),
        upvotes: 0  // Initialize upvotes to 0
      }

      // Add user info (now required since auth is mandatory)
      if (user) {
        insertData.user_id = user.uid
        insertData.user_name = user.displayName || user.email || 'Anonymous'
      } else {
        throw new Error('Authentication required to add bhandara')
      }

      const { error } = await supabase
        .from('bhandaras')
        .insert(insertData)

      if (error) {
        throw error
      }

      reset()
      setPreviewImages([])
      onSubmit()
      
      alert('Bhandara added successfully! It will be visible for 24 hours.')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      
      // More detailed error handling
      let errorMessage = 'Error submitting form. '
      
      if (error instanceof Error) {
        errorMessage += `Details: ${error.message}`
      } else if (typeof error === 'object' && error !== null) {
        errorMessage += `Details: ${JSON.stringify(error)}`
      } else {
        errorMessage += 'Unknown error occurred.'
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: '32px', position: 'relative' }}>
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <X size={16} />
      </button>
      
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600', paddingRight: '48px' }}>
        Fill Bhandara Info
      </h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="form-group">
          <label>
            <MapPin size={16} style={{ display: 'inline-block', marginRight: '8px' }} />
            Google Map Link or Live Location *
          </label>
          <input
            type="url"
            placeholder="https://maps.google.com/... or live location share link"
            {...register('location_link', { 
              required: 'Google Maps link is required',
              validate: (value) => {
                const validPatterns = [
                  /https:\/\/(www\.)?google\.com\/maps/,
                  /https:\/\/maps\.google\.com/,
                  /https:\/\/goo\.gl\/maps/,
                  /https:\/\/maps\.app\.goo\.gl/,
                  /https:\/\/plus\.codes/,
                  /@-?\d+\.\d+,-?\d+\.\d+/,
                  /place\//,
                  /\?q=/,
                  /\/dir\//,
                  /\/share\?/,
                ];
                
                const isValid = validPatterns.some(pattern => pattern.test(value));
                return isValid || 'Please enter a valid Google Maps link (including live location shares)';
              }
            })}
          />
          {errors.location_link && (
            <div className="error-text">{errors.location_link.message}</div>
          )}
        </div>

        <div className="form-group">
          <label>Nearby Landmark</label>
          <input
            type="text"
            placeholder="e.g., Near ABC Mall, opposite XYZ Temple"
            {...register('nearby_landmark')}
          />
        </div>

        <div className="form-group">
          <label>
            <Camera size={16} style={{ display: 'inline-block', marginRight: '8px' }} />
            Bhandara Photos (1-2 photos) *
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              multiple
              accept="image/*"
              {...register('photos', {
                required: 'Please select at least 1 photo',
                validate: (files) => {
                  if (!files || files.length === 0) return 'Please select at least 1 photo'
                  if (files.length > 2) return 'Please select maximum 2 photos'
                  return true
                }
              })}
            />
            <div className="file-input-button">
              <Upload size={20} />
              Choose Photos
            </div>
          </div>
          {errors.photos && (
            <div className="error-text">{errors.photos.message}</div>
          )}
          
          {previewImages.length > 0 && (
            <div className="images-grid">
              {previewImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            <FileText size={16} style={{ display: 'inline-block', marginRight: '8px' }} />
            Menu (if available)
          </label>
          <textarea
            rows={3}
            placeholder="List the food items being served"
            {...register('menu')}
          />
        </div>

        <div className="form-group">
          <label>Location Description *</label>
          <textarea
            rows={3}
            placeholder="Describe the location in words (e.g., Main road near traffic light, first floor of community center)"
            {...register('location_description', { 
              required: 'Location description is required' 
            })}
          />
          {errors.location_description && (
            <div className="error-text">{errors.location_description.message}</div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%', padding: '16px' }}
        >
          {isSubmitting ? (
            <>
              <span className="loading"></span>
              <span style={{ marginLeft: '8px' }}>Submitting...</span>
            </>
          ) : (
            'Add Bhandara'
          )}
        </button>
      </form>
    </div>
  )
}