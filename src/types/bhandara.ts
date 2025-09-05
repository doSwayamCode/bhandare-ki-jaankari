export interface Bhandara {
  id: string
  location_link: string
  nearby_landmark?: string
  photo_urls: string[]
  menu?: string
  location_description: string
  created_at: string
  expires_at: string
}

export interface BhandaraFormData {
  location_link: string
  nearby_landmark?: string
  photos: FileList | null
  menu?: string
  location_description: string
}
