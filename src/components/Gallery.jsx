import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { U, PHOTOS } from '../data/images'
import Reveal from './Reveal'

const works = [
  { id: PHOTOS.llaveroPerrito, label: 'Llavero perrito', cat: 'Llaveros', tall: true },
  { id: PHOTOS.macetas, label: 'Macetas decorativas', cat: 'Hogar' },
  { id: PHOTOS.soporteTelefonoGatito, label: 'Soporte gatito', cat: 'Soportes', tall: true },
  { id: PHOTOS.engranaje, label: 'Engranaje antiestrés', cat: 'Antiestrés' },
  { id: PHOTOS.llaveroPulpo, label: 'Llavero pulpo', cat: 'Llaveros' },
  { id: PHOTOS.soporteLaptopPerforado, label: 'Soporte de laptop', cat: 'Soportes', tall: true },
  { id: PHOTOS.tiburon, label: 'Tiburoncín', cat: 'Figuritas' },
  { id: PHOTOS.rodilloPies, label: 'Rodillo para pies', cat: 'Antiestrés' },
  { id: PHOTOS.delfin, label: 'Delfín miniatura', cat: 'Figuritas' },
]

export default function Gallery() {
  const [index, setIndex] = useState(null)
  const open = index !== null
  const current = open ? works[index] : null
  const move = (d) => setIndex((i) => (i + d + works.length) % works.length)

  return (
    <section id="galeria" className="py-24">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Trabajos</p>
          <h2 className="h-section">Cosas reales que hemos creado</h2>
          <p className="lead mt-3 max-w-lg">Cada pieza empezó como una idea de alguien. Toca para verla de cerca.</p>
        </Reveal>

        <div className="mt-9 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {works.map((w, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5 }}
              className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-ink/10 bg-white"
            >
              <img
                src={U(w.id, 600)}
                alt={w.label}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4 text-left">
                  <p className="text-xs font-700 uppercase tracking-wide text-coral">{w.cat}</p>
                  <p className="font-display text-lg font-600 text-white">{w.label}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIndex(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-5 backdrop-blur-sm"
          >
            <button onClick={() => setIndex(null)} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-2xl text-white hover:bg-white/10" aria-label="Cerrar">
              <FiX />
            </button>
            <button onClick={(e) => { e.stopPropagation(); move(-1) }} className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-2xl text-white hover:bg-white/10 sm:left-8" aria-label="Anterior">
              <FiChevronLeft />
            </button>
            <button onClick={(e) => { e.stopPropagation(); move(1) }} className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-2xl text-white hover:bg-white/10 sm:right-8" aria-label="Siguiente">
              <FiChevronRight />
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={current.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85vh] max-w-2xl overflow-hidden rounded-2xl bg-white"
              >
                <img src={U(current.id, 1000)} alt={current.label} className="max-h-[76vh] w-full object-contain" />
                <figcaption className="flex items-center justify-between px-5 py-3">
                  <span className="font-display text-lg font-600 text-ink">{current.label}</span>
                  <span className="text-sm font-700 text-coral">{current.cat}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
