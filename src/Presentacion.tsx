import { useState, useEffect, useCallback } from 'react'

// ⚠️ CONFIGURACIÓN - Pegar aquí la URL del Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyp5QfM4b2eSbAL8uOxlBrPmqs0uu5U7w_7JgWn_nqjkw1MMboljQNdZmapV0ssy-Jw/exec' // Ejemplo: 'https://script.google.com/macros/s/xxx/exec'

// Intervalo de actualización (en milisegundos)
const REFRESH_INTERVAL = 5000 // 5 segundos
const SLIDE_DURATION = 6000 // 6 segundos por foto

interface Photo {
  id: string
  url: string
  name: string
  timestamp: number
}

// Convertir URL de Drive a una que funcione en <img>
// Google Drive tiene varias URLs posibles, esta es la más confiable para thumbnails grandes
const getDriveImageUrl = (photo: Photo): string => {
  // Opción 1: Thumbnail de Drive (más confiable, soporta tamaños grandes)
  return `https://drive.google.com/thumbnail?id=${photo.id}&sz=w1600`
}

function Presentacion() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lastPhotoCount, setLastPhotoCount] = useState(0)
  const [showNewPhotoAlert, setShowNewPhotoAlert] = useState(false)

  // Función para obtener fotos de Drive (cuando esté configurado)
  const fetchPhotos = useCallback(async () => {
    if (!SCRIPT_URL) {
      console.log('No hay SCRIPT_URL configurada')
      return
    }

    try {
      console.log('Fetching photos from:', `${SCRIPT_URL}?action=list`)
      const response = await fetch(`${SCRIPT_URL}?action=list`, {
        method: 'GET',
        redirect: 'follow',
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Data received:', data)
      
      if (data.success && data.photos) {
        const newPhotos = data.photos as Photo[]
        console.log('Photos loaded:', newPhotos.length)
        
        // Detectar si hay fotos nuevas
        if (newPhotos.length > lastPhotoCount && lastPhotoCount > 0) {
          setShowNewPhotoAlert(true)
          setTimeout(() => setShowNewPhotoAlert(false), 3000)
          
          // Saltar a la foto nueva (la primera es la más reciente)
          setCurrentIndex(0)
        }
        
        setPhotos(newPhotos)
        setLastPhotoCount(newPhotos.length)
      } else {
        console.log('Response not successful or no photos:', data)
      }
    } catch (error) {
      console.error('Error al obtener fotos:', error)
    }
  }, [lastPhotoCount])

  // Polling para nuevas fotos
  useEffect(() => {
    fetchPhotos()
    const interval = setInterval(fetchPhotos, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchPhotos])

  // Cambio automático de slides
  useEffect(() => {
    if (photos.length === 0) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length)
        setIsTransitioning(false)
      }, 500)
    }, SLIDE_DURATION)

    return () => clearInterval(interval)
  }, [photos.length])

  // Si no hay fotos
  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-boda-text flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-8 border-4 border-boda border-t-transparent rounded-full animate-spin" />
          <h2 className="font-display text-3xl text-boda mb-4">
            Esperando fotos...
          </h2>
          <p className="font-body text-boda-light/70">
            Las fotos aparecerán aquí cuando los invitados las suban
          </p>
        </div>
      </div>
    )
  }

  const currentPhoto = photos[currentIndex]

  return (
    <div className="min-h-screen bg-boda-text relative overflow-hidden">
      {/* Foto actual */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={getDriveImageUrl(currentPhoto)}
          alt={currentPhoto.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain bg-black"
        />
      </div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Header */}
      <header className="absolute top-4 left-4 pt-8 pb-8 pl-12 pr-8 sm:pt-10 sm:pb-10 sm:pl-16 sm:pr-10 z-10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-white/90">
            Tefo & Geli
          </h1>
          <p className="font-body text-boda-light text-sm">
            29 de Noviembre 2025
          </p>
        </div>
      </header>

      {/* Alerta de nueva foto */}
      {showNewPhotoAlert && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-fade-in-up">
          <div className="bg-boda text-white px-8 py-4 rounded-2xl shadow-2xl">
            <p className="font-display text-2xl">¡Nueva foto!</p>
          </div>
        </div>
      )}


      {/* Miniaturas laterales */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-10">
        {photos.slice(
          Math.max(0, currentIndex - 2),
          Math.min(photos.length, currentIndex + 3)
        ).map((photo, idx) => {
          const actualIndex = Math.max(0, currentIndex - 2) + idx
          return (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(actualIndex)}
              aria-label={`Ver foto ${actualIndex + 1}`}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                actualIndex === currentIndex
                  ? 'border-boda scale-110'
                  : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={getDriveImageUrl(photo)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Presentacion

