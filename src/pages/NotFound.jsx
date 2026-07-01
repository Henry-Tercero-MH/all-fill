import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-metal-dark p-6 text-center text-white">
      <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-electric/25 blur-3xl" />

      <img src="/logo-mark.png" alt="ALL-FILL" className="relative h-20 w-20 object-contain drop-shadow-xl" />

      <p className="relative mt-6 font-display text-7xl font-800 leading-none">404</p>
      <p className="relative mt-3 font-display text-2xl font-700">Página no encontrada</p>
      <p className="relative mt-2 max-w-sm text-white/60">
        La página que buscas no existe o se movió. Volvamos a lo bueno.
      </p>

      <Link to="/" className="btn-coral relative mt-8">
        <FiArrowLeft /> Volver al inicio
      </Link>

      <p className="relative mt-10 text-sm text-white/40">ALL-FILL · Impresión 3D con estrategia</p>
    </div>
  )
}
