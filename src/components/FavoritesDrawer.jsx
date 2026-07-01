import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiHeart, FiShoppingBag } from 'react-icons/fi'
import { useStore } from '../context/StoreContext'
import { U } from '../data/images'

export default function FavoritesDrawer() {
  const { favs, favsOpen, setFavsOpen, toggleFav, addToCart } = useStore()

  return (
    <AnimatePresence>
      {favsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFavsOpen(false)}
          className="fixed inset-0 z-[80] bg-ink/50 backdrop-blur-sm"
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-lift"
          >
            <header className="flex items-center justify-between border-b border-ink/10 p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-700 text-ink">
                <FiHeart /> Favoritos
              </h2>
              <button onClick={() => setFavsOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5"><FiX /></button>
            </header>

            {favs.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <FiHeart className="text-4xl text-ink/20" />
                <p className="text-ink/60">Aún no tienes favoritos.</p>
                <p className="text-sm text-ink/45">Toca el corazón en cualquier producto para guardarlo.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {favs.map((p) => (
                  <div key={p.id} className="flex gap-3 rounded-2xl border border-ink/[0.08] bg-white p-3">
                    <img src={U(p.photo, 160)} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-ink/5 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-700 text-ink">{p.name}</p>
                      <p className="text-sm text-ink/50">Q{p.price}</p>
                      <button onClick={() => addToCart(p)} className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-xs font-700 text-white">
                        <FiShoppingBag /> Agregar
                      </button>
                    </div>
                    <button onClick={() => toggleFav(p)} aria-label="Quitar de favoritos" className="self-start text-coral">
                      <FiHeart className="fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
