import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiHeart, FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import { catColor } from '../data/products'
import { U } from '../data/images'
import { waProduct } from '../lib/whatsapp'

export default function ProductModal() {
  const { detail, setDetail, addToCart, toggleFav, isFav } = useStore()
  const [qty, setQty] = useState(1)

  useEffect(() => setQty(1), [detail])

  const p = detail
  const color = (p && catColor[p.category]) || '#076DDF'
  const fav = p ? isFav(p.id) : false

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDetail(null)}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[1.6rem] bg-white shadow-lift sm:grid-cols-2"
          >
            <div className="relative">
              <img src={U(p.photo, 800)} alt={p.name} className="h-56 w-full object-cover sm:h-full" />
              {p.tag && (
                <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-700 text-white" style={{ background: color }}>{p.tag}</span>
              )}
            </div>

            <div className="flex flex-col p-6">
              <button onClick={() => setDetail(null)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink/60 backdrop-blur hover:bg-white"><FiX /></button>

              <span className="mb-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-700 text-white" style={{ background: color }}>
                {p.category}
              </span>
              <h2 className="font-display text-2xl font-700 leading-tight text-ink">{p.name}</h2>
              <p className="mt-2 flex-1 text-ink/65">{p.desc}</p>

              <p className="mt-4 text-ink/50">
                desde <span className="font-800 text-2xl text-ink">Q{p.price}</span>
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-xl">−</button>
                  <span className="w-8 text-center font-display text-lg font-700">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-xl">+</button>
                </div>
                <button
                  onClick={() => toggleFav(p)}
                  aria-label="Favorito"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${fav ? 'border-coral text-coral' : 'border-ink/15 text-ink/60 hover:text-coral'}`}
                >
                  <FiHeart className={fav ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => { addToCart(p, qty); setDetail(null) }} className="btn-coral w-full">
                  <FiShoppingBag /> Agregar al carrito
                </button>
                <a href={waProduct(p)} target="_blank" rel="noreferrer" className="btn-wa w-full">
                  <FaWhatsapp className="text-lg" /> Pedir por WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
