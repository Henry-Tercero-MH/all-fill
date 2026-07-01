import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchProductos } from '../lib/api'

const Ctx = createContext({ products: [], loading: true, error: null, reload: () => {} })

export const useProducts = () => useContext(Ctx)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchProductos()
      .then((list) => setProducts(list.filter((p) => p.disponible !== false)))
      .catch((e) => {
        console.error('[ALL-FILL] Error al cargar productos:', e)
        setError(e.message || 'No se pudieron cargar los productos')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Actualiza los likes localmente (optimista) al dar/quitar me gusta,
  // para que el ranking y la sección "Los favoritos de todos" reaccionen al instante.
  const bumpLike = useCallback((id, delta) => {
    setProducts((list) =>
      list.map((p) => (p.id === id ? { ...p, likes: Math.max(0, (p.likes || 0) + delta) } : p)),
    )
  }, [])

  return (
    <Ctx.Provider value={{ products, loading, error, reload: load, bumpLike }}>{children}</Ctx.Provider>
  )
}
