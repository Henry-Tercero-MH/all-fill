import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import { U } from '../data/images'
import { waCheckout } from '../lib/whatsapp'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, clearCart, cartTotal } = useStore()

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartOpen(false)}
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
                <FiShoppingBag /> Tu pedido
              </h2>
              <button onClick={() => setCartOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5"><FiX /></button>
            </header>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <FiShoppingBag className="text-4xl text-ink/20" />
                <p className="text-ink/60">Tu carrito está vacío.</p>
                <button onClick={() => setCartOpen(false)} className="btn-coral mt-2">Ver productos</button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                  {cart.map((it) => (
                    <div key={it.id} className="flex gap-3 rounded-2xl border border-ink/[0.08] bg-white p-3">
                      <img src={U(it.photo, 160)} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-ink/5 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-700 text-ink">{it.name}</p>
                        <p className="text-sm text-ink/50">Q{it.price}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <button onClick={() => setQty(it.id, it.qty - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/15 text-ink">−</button>
                          <span className="w-6 text-center font-700 text-ink">{it.qty}</span>
                          <button onClick={() => setQty(it.id, it.qty + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/15 text-ink">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeFromCart(it.id)} className="text-ink/40 hover:text-coral"><FiTrash2 /></button>
                        <span className="font-800 text-ink">Q{it.price * it.qty}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={clearCart} className="text-sm font-600 text-ink/50 hover:text-coral">Vaciar carrito</button>
                </div>

                <footer className="border-t border-ink/10 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-ink/60">Total estimado</span>
                    <span className="font-display text-2xl font-800 text-ink">Q{cartTotal}</span>
                  </div>
                  <a href={waCheckout(cart)} target="_blank" rel="noreferrer" className="btn-wa w-full">
                    <FaWhatsapp className="text-xl" /> Pedir por WhatsApp
                  </a>
                  <p className="mt-2 text-center text-xs text-ink/45">Confirmamos disponibilidad y total por WhatsApp.</p>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
