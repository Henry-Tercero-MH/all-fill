import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { FiSearch, FiHeart, FiUser, FiGrid } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const WA = 'https://wa.me/50240705002'

const links = [
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'como', label: 'Cómo funciona' },
  { id: 'cotizador', label: 'Precios' },
  { id: 'galeria', label: 'Trabajos' },
  { id: 'testimonios', label: 'Opiniones' },
]

const promos = [
  { id: 'catalogo', label: '🔥 Lo + pedido' },
  { id: 'cotizador', label: 'Precios al instante' },
  { id: 'galeria', label: 'Trabajos reales' },
  { id: 'contacto', label: 'Vende tu idea' },
]

const go = (id, after) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  after?.()
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 })

  const submit = (e) => {
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('hemith:search', { detail: q }))
    go('catalogo')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barra principal */}
      <div className="bg-coral text-white">
        <div className="container-x flex h-16 items-center gap-3 md:h-[72px] md:gap-5">
          {/* Logo */}
          <button onClick={() => go('inicio')} className="flex shrink-0 items-center gap-2" aria-label="Inicio">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-ink ring-1 ring-white/20">
              <img src="/logo-mark.png" alt="ALL-FILL" className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-xl font-800 tracking-tight">ALL-FILL</span>
          </button>

          {/* Categorías */}
          <button
            onClick={() => go('categorias')}
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2.5 text-sm font-700 transition-colors hover:bg-white/25 lg:flex"
          >
            <FiGrid className="text-base" /> Categorías
          </button>

          {/* Buscador */}
          <form onSubmit={submit} className="relative hidden flex-1 sm:block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="¿Qué quieres crear hoy?"
              className="h-11 w-full rounded-full border-0 bg-white pl-5 pr-12 text-ink outline-none placeholder:text-ink/40 focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-white transition-colors hover:bg-coral-600"
            >
              <FiSearch />
            </button>
          </form>

          {/* Iconos */}
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-0">
            <a href={WA} target="_blank" rel="noreferrer" aria-label="Favoritos" className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/15 md:flex">
              <FiHeart className="text-xl" />
            </a>
            <a href={WA} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-700 transition-colors hover:bg-white/15 md:flex">
              <FiUser className="text-xl" /> Mi cuenta
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-800 text-coral shadow-sm transition-transform hover:-translate-y-0.5 md:flex"
            >
              <FaWhatsapp className="text-base text-[#128c4a]" /> Pedir
            </a>

            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-2xl md:hidden"
              aria-label="Menú"
              aria-expanded={open}
            >
              {open ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>

        {/* Buscador móvil */}
        <form onSubmit={submit} className="container-x relative pb-3 sm:hidden">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="¿Qué quieres crear hoy?"
            className="h-11 w-full rounded-full border-0 bg-white pl-5 pr-12 text-ink outline-none placeholder:text-ink/40"
          />
          <button type="submit" aria-label="Buscar" className="absolute right-[calc(1.25rem+6px)] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-white">
            <FiSearch />
          </button>
        </form>
      </div>

      {/* Barra secundaria de promos */}
      <div className="hidden bg-coral-600 text-white md:block">
        <div className="container-x flex h-10 items-center gap-6 text-[13px] font-700">
          {promos.map((p) => (
            <button key={p.label} onClick={() => go(p.id)} className="transition-opacity hover:opacity-80">
              {p.label}
            </button>
          ))}
          <span className="ml-auto text-white/80">+500 pedidos entregados · respuesta el mismo día</span>
        </div>
      </div>

      {/* Progreso de scroll */}
      <motion.div style={{ scaleX: progress }} className="h-0.5 w-full origin-left bg-ink/80" />

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-coral text-white md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-3">
              {links.map((l) => (
                <li key={l.id}>
                  <button onClick={() => go(l.id, () => setOpen(false))} className="w-full rounded-xl px-4 py-3 text-left text-base font-700 hover:bg-white/10">
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="px-1 pt-2">
                <a href={WA} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 font-800 text-coral">
                  <FaWhatsapp className="text-[#128c4a]" /> Pedir por WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
