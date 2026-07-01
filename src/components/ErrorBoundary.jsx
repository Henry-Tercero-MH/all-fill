import { Component } from 'react'

// Evita pantallas en blanco: si algo revienta en render, muestra un fallback.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ALL-FILL] Error de render:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 text-center">
          <img src="/logo-mark.png" alt="ALL-FILL" className="h-16 w-16 object-contain" />
          <p className="mt-5 font-display text-xl font-700 text-ink">Algo salió mal</p>
          <p className="mt-2 max-w-sm text-ink/60">Tuvimos un problema al mostrar esta parte.</p>
          <button onClick={() => window.location.reload()} className="btn-coral mt-6">
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
