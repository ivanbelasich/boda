import { useState, useRef } from 'react'

// ⚠️ CONFIGURACIÓN - Pegar aquí la URL del Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyp5QfM4b2eSbAL8uOxlBrPmqs0uu5U7w_7JgWn_nqjkw1MMboljQNdZmapV0ssy-Jw/exec' // Ejemplo: 'https://script.google.com/macros/s/xxx/exec'

type UploadStatus = 'idle' | 'selecting' | 'uploading' | 'success' | 'error'

function App() {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setStatus('uploading')
    setUploadProgress(0)

    const totalFiles = files.length
    let uploadedFiles = 0

    for (const file of Array.from(files)) {
      try {
        await uploadFile(file)
        uploadedFiles++
        setUploadProgress(Math.round((uploadedFiles / totalFiles) * 100))
      } catch (error) {
        console.error('Error subiendo archivo:', error)
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
        return
      }
    }

    setStatus('success')
    setTimeout(() => {
      setStatus('idle')
      setUploadProgress(0)
    }, 3000)

    // Limpiar input para permitir subir la misma foto de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFile = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1]
          
          if (!SCRIPT_URL) {
            // Modo demo - simular subida
            console.log('Modo demo - archivo:', file.name)
            await new Promise(r => setTimeout(r, 1000))
            resolve()
            return
          }

          const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
              mimeType: file.type,
            }),
          })

          const result = await response.json()
          
          if (result.success) {
            resolve()
          } else {
            reject(new Error(result.error || 'Error desconocido'))
          }
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  const getButtonContent = () => {
    switch (status) {
      case 'uploading':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Subiendo... {uploadProgress}%
          </span>
        )
      case 'success':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ¡Fotos subidas!
          </span>
        )
      case 'error':
        return (
          <span className="flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Error al subir
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-3">
            <svg 
              className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            Subir Fotos
          </span>
        )
    }
  }

  const getButtonClass = () => {
    const baseClass = "animate-fade-in-up-delay-3 group relative px-12 py-5 font-body text-xl tracking-wide rounded-full shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
    
    switch (status) {
      case 'success':
        return `${baseClass} bg-green-600 text-white shadow-green-600/30`
      case 'error':
        return `${baseClass} bg-red-500 text-white shadow-red-500/30`
      case 'uploading':
        return `${baseClass} bg-boda/70 text-white shadow-boda/30 cursor-wait`
      default:
        return `${baseClass} bg-boda text-white shadow-boda/30 hover:bg-boda-dark hover:shadow-xl hover:shadow-boda/40 hover:scale-105`
    }
  }

  return (
    <main className="min-h-screen bg-boda-cream relative overflow-hidden">
      {/* Input oculto para seleccionar archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleccionar fotos para subir"
      />

      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-boda/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-boda/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-boda-light/30 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Ornamento superior */}
        <div className="animate-fade-in-up mb-8">
          <svg className="w-24 h-auto text-boda" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15C50 15 35 5 20 15C5 25 0 15 0 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M50 15C50 15 65 5 80 15C95 25 100 15 100 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="50" cy="15" r="3" fill="currentColor"/>
          </svg>
        </div>

        {/* Texto de bienvenida */}
        <p className="animate-fade-in-up-delay font-body text-boda-dark/70 text-lg tracking-[0.3em] uppercase mb-4">
          La boda de
        </p>

        {/* Nombres */}
        <h1 className="animate-fade-in-up-delay font-display text-5xl sm:text-7xl md:text-8xl font-medium text-boda-text text-center leading-tight mb-6">
          <span className="block">Tefo</span>
          <span className="text-boda text-3xl sm:text-4xl md:text-5xl font-normal italic my-2 block">&</span>
          <span className="block">Geli</span>
        </h1>

        {/* Línea decorativa */}
        <div className="animate-fade-in-up-delay-2 flex items-center gap-4 my-6">
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-boda" />
          <div className="w-2 h-2 bg-boda rounded-full" />
          <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-boda" />
        </div>

        {/* Fecha */}
        <div className="animate-fade-in-up-delay-2 text-center mb-8">
          <p className="font-display text-2xl sm:text-3xl text-boda-text mb-2">
            Sábado 29 de Noviembre
          </p>
          <p className="font-display text-4xl sm:text-5xl text-boda font-semibold">
            2025
          </p>
        </div>

        {/* Mensaje */}
        <p className="animate-fade-in-up-delay-3 font-body text-lg sm:text-xl text-boda-text/80 text-center max-w-md mb-6 leading-relaxed">
          ¡Comparte tus momentos con nosotros!
        </p>

        {/* Aviso de proyección */}
        <div className="animate-fade-in-up-delay-3 bg-boda/10 border border-boda/30 rounded-2xl px-6 py-4 mb-10 max-w-sm text-center">
          <p className="font-body text-boda-text/90 text-base leading-relaxed">
            Las fotos que subas serán proyectadas
            <span className="font-semibold text-boda-dark"> esta misma noche </span>
            durante la fiesta
          </p>
        </div>

        {/* Botón de subir fotos */}
        <button
          onClick={handleUploadClick}
          disabled={status === 'uploading'}
          className={getButtonClass()}
        >
          {getButtonContent()}
        </button>

        {/* Mensaje modo demo */}
        {!SCRIPT_URL && (
          <p className="mt-4 text-boda-dark/40 text-sm font-body">
            Modo demo - Configura SCRIPT_URL para conectar con Drive
          </p>
        )}

        {/* Ornamento inferior */}
        <div className="animate-fade-in-up-delay-3 mt-12 animate-float">
          <svg className="w-16 h-auto text-boda/50" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0C30 0 40 10 40 20C40 30 30 40 30 40C30 40 20 30 20 20C20 10 30 0 30 0Z" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M30 10C30 10 35 15 35 20C35 25 30 30 30 30C30 30 25 25 25 20C25 15 30 10 30 10Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Footer sutil */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="font-body text-sm text-boda-dark/40">
          Con amor, Tefo & Geli ♥
        </p>
      </footer>
    </main>
  )
}

export default App
