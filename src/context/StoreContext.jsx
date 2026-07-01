import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { darLike } from '../lib/api'

const KEY_CART = 'allfill_cart'
const KEY_FAV = 'allfill_favs'

const load = (k) => {
  try {
    return JSON.parse(localStorage.getItem(k)) || []
  } catch {
    return []
  }
}

const snapshot = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  photo: p.photo,
  category: p.category,
  tag: p.tag,
})

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load(KEY_CART))
  const [favs, setFavs] = useState(() => load(KEY_FAV))
  const [cartOpen, setCartOpen] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [detail, setDetail] = useState(null)

  useEffect(() => localStorage.setItem(KEY_CART, JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem(KEY_FAV, JSON.stringify(favs)), [favs])

  // Bloquea el scroll del fondo cuando hay un panel/modal abierto.
  useEffect(() => {
    const open = cartOpen || favsOpen || Boolean(detail)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen, favsOpen, detail])

  // Cerrar con Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setCartOpen(false)
      setFavsOpen(false)
      setDetail(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Carrito ──
  const addToCart = (p, qty = 1) => {
    setCart((c) => {
      const found = c.find((x) => x.id === p.id)
      if (found) return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + qty } : x))
      return [...c, { ...snapshot(p), qty }]
    })
    setCartOpen(true)
  }
  const setQty = (id, qty) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)))
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id))
  const clearCart = () => setCart([])

  // ── Favoritos ──
  const isFav = (id) => favs.some((x) => x.id === id)
  const toggleFav = (p) => {
    const already = favs.some((x) => x.id === p.id)
    setFavs((f) => (already ? f.filter((x) => x.id !== p.id) : [...f, snapshot(p)]))
    // Suma/resta el "me gusta" global (para ordenar el hero por popularidad).
    darLike(p.id, already ? -1 : 1).catch(() => {})
  }

  const cartCount = useMemo(() => cart.reduce((s, x) => s + x.qty, 0), [cart])
  const cartTotal = useMemo(() => cart.reduce((s, x) => s + x.price * x.qty, 0), [cart])

  const value = {
    cart, cartCount, cartTotal, addToCart, setQty, removeFromCart, clearCart,
    favs, isFav, toggleFav,
    cartOpen, setCartOpen, favsOpen, setFavsOpen, detail, setDetail,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
