import { useEffect, useState } from 'react'
import { FiWifiOff } from 'react-icons/fi'

// Aviso a pantalla completa cuando el navegador pierde conexión a internet.
export default function OfflineOverlay() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (online) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-metal-dark/95 p-6 text-center text-white backdrop-blur">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
          <FiWifiOff />
        </div>
        <p className="font-display text-2xl font-700">Sin internet</p>
        <p className="mt-2 text-white/60">
          Parece que perdiste la conexión. Vuelve a conectarte para seguir viendo ALL-FILL.
        </p>
        <p className="mt-6 text-sm text-white/40">Se reanudará solo cuando vuelva el internet.</p>
      </div>
    </div>
  )
}
