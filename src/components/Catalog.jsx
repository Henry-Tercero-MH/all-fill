import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { categories, catColor, products } from '../data/products'
import { U } from '../data/images'
import Reveal from './Reveal'

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

const ProductCard = forwardRef(function ProductCard({ p, i = 0 }, ref) {
  const color = catColor[p.category]
  const rgb = hexToRgb(color)
  const innerRef = useRef(null)
  const goContact = () =>
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })

  // Posición del cursor (0..1) para el tilt 3D y el reflejo.
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 16 })
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 16 })
  const sx = useTransform(mx, (v) => `${v * 100}%`)
  const sy = useTransform(my, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${sx} ${sy}, rgba(${rgb}, 0.16), transparent 65%)`

  const onMove = (e) => {
    const r = innerRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: i * 0.05 }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={innerRef}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="card group relative flex h-full flex-col"
      >
        {/* reflejo que sigue al cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 rounded-[1.4rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />

        <div className="relative overflow-hidden">
          <img
            src={U(p.photo, 600)}
            alt={p.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
          />
          {/* velo inferior para legibilidad del precio en hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {p.tag && (
            <span
              className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-700 text-white shadow-sm"
              style={{ background: color }}
            >
              {p.tag}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5" style={{ transform: 'translateZ(28px)' }}>
          <h3 className="font-display text-lg font-600 text-ink">{p.name}</h3>
          <p className="mt-1 flex-1 text-sm leading-relaxed text-ink/60">{p.desc}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-ink/50">
              desde <span className="font-800 text-lg text-ink">Q{p.price}</span>
            </p>
            <button
              onClick={goContact}
              className="group/btn inline-flex items-center gap-1 rounded-full border border-ink/15 px-3.5 py-2 text-sm font-700 text-ink transition-colors hover:border-transparent hover:text-white"
              onMouseEnter={(e) => (e.currentTarget.style.background = color)}
              onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            >
              Lo quiero
              <FiArrowUpRight className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
})

export default function Catalog() {
  const [active, setActive] = useState('todos')
  const [search, setSearch] = useState('')

  // Conexión con el buscador del header y los círculos de categoría.
  useEffect(() => {
    const onFilter = (e) => {
      setSearch('')
      setActive(e.detail || 'todos')
    }
    const onSearch = (e) => {
      setActive('todos')
      setSearch((e.detail || '').trim().toLowerCase())
    }
    window.addEventListener('hemith:filter', onFilter)
    window.addEventListener('hemith:search', onSearch)
    return () => {
      window.removeEventListener('hemith:filter', onFilter)
      window.removeEventListener('hemith:search', onSearch)
    }
  }, [])

  const filtered = useMemo(() => {
    let list = active === 'todos' ? products : products.filter((p) => p.category === active)
    if (search) {
      list = list.filter((p) =>
        `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(search),
      )
    }
    return list
  }, [active, search])

  return (
    <section id="catalogo" className="py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Catálogo</p>
              <h2 className="h-section">Algunas cosas que hacemos</h2>
              <p className="lead mt-3 max-w-lg">
                Todo se ajusta a tu gusto: tamaño, color y acabado. Estos son solo
                ejemplos para inspirarte.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = active === c.id
              const color = c.id === 'todos' ? '#171818' : catColor[c.id]
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSearch('')
                    setActive(c.id)
                  }}
                  className="relative rounded-full border px-4 py-2 text-sm font-700 transition-colors"
                  style={{
                    borderColor: on ? color : 'rgba(23,24,24,0.14)',
                    color: on ? '#fff' : 'rgba(23,24,24,0.7)',
                  }}
                >
                  {on && (
                    <motion.span
                      layoutId="catalog-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: color }}
                    />
                  )}
                  <span className="relative z-10">{c.label}</span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {search && (
          <p className="mt-4 text-sm text-ink/60">
            Resultados para “<span className="font-700 text-ink">{search}</span>” ·{' '}
            <button onClick={() => setSearch('')} className="font-700 text-coral hover:underline">
              limpiar
            </button>
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-[1.4rem] border border-dashed border-ink/15 bg-white px-6 py-14 text-center">
            <p className="font-display text-xl font-600 text-ink">No encontramos eso… todavía 🙂</p>
            <p className="mt-2 text-ink/60">Pero lo hacemos a tu medida. Cuéntanos tu idea y la creamos.</p>
            <button
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-coral mt-6"
            >
              Pedir algo personalizado
            </button>
          </div>
        ) : (
          <motion.div layout className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
