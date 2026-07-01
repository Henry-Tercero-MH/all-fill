import { FiWifiOff, FiRefreshCw } from 'react-icons/fi'

// Estado reutilizable de "no se pudo conectar". Úsalo compacto (dentro de una
// sección) o a pantalla completa (fullscreen).
export default function ConnectionError({
  onRetry,
  fullscreen = false,
  title = 'Sin conexión',
  message = 'No pudimos conectar con el servidor. Revisa tu internet e inténtalo de nuevo.',
}) {
  const card = (
    <div className="mx-auto max-w-sm text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 text-3xl text-ink/40">
        <FiWifiOff />
      </div>
      <p className="font-display text-xl font-700 text-ink">{title}</p>
      <p className="mt-2 text-ink/60">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-coral mt-6">
          <FiRefreshCw /> Reintentar
        </button>
      )}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper p-6">{card}</div>
    )
  }
  return (
    <div className="mt-10 rounded-[1.4rem] border border-dashed border-ink/15 bg-white px-6 py-14">
      {card}
    </div>
  )
}
