import { FaInstagram, FaWhatsapp, FaFacebookF, FaTiktok } from 'react-icons/fa'

const socials = [
  { name: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
  { name: 'WhatsApp', href: 'https://wa.me/50240705002', icon: FaWhatsapp },
  { name: 'Facebook', href: 'https://facebook.com', icon: FaFacebookF },
  { name: 'TikTok', href: 'https://tiktok.com', icon: FaTiktok },
]

export default function Footer() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/15">
                <img src="/logo-mark.png" alt="ALL-FILL" className="h-full w-full object-cover" />
              </span>
              <div className="leading-tight">
                <span className="block font-display text-2xl font-700 tracking-tight">ALL-FILL</span>
                <span className="text-xs font-600 uppercase tracking-[0.2em] text-coral">Impresión 3D con estrategia</span>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-white/70">
              Tomamos tus ideas y las convertimos en cosas reales. Hecho con cuidado en
              Guatemala.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-lg text-white/80 transition-all hover:border-coral hover:bg-coral hover:text-white"
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-2.5 text-white/75">
            <span className="mb-1 text-sm font-700 uppercase tracking-widest text-white/40">Explora</span>
            {[
              ['catalogo', 'Catálogo'],
              ['como', 'Cómo funciona'],
              ['cotizador', 'Precios'],
              ['galeria', 'Trabajos'],
              ['contacto', 'Contacto'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-left transition-colors hover:text-coral">
                {label}
              </button>
            ))}
          </nav>

          <div className="max-w-xs">
            <span className="text-sm font-700 uppercase tracking-widest text-white/40">¿Listo?</span>
            <p className="mt-3 font-display text-2xl font-600 leading-tight">
              Donde la imaginación toma forma.
            </p>
            <button onClick={() => go('contacto')} className="btn-coral mt-5">
              Empezar mi pedido
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ALL-FILL. Todos los derechos reservados.</p>
          <p>Impresión 3D · Guatemala</p>
        </div>
      </div>
    </footer>
  )
}
