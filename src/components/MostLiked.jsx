import { useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { FiArrowLeft, FiArrowRight, FiHeart } from 'react-icons/fi'
import { catColor } from '../data/products'
import { U } from '../data/images'
import { useProducts } from '../context/ProductsContext'
import { useStore } from '../context/StoreContext'
import Reveal from './Reveal'

export default function MostLiked() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false, dragFree: true })
  const { products } = useProducts()
  const { setDetail } = useStore()

  // Solo productos con al menos 1 me gusta, ordenados de mayor a menor.
  const top = useMemo(
    () => products.filter((p) => (p.likes || 0) > 0).sort((a, b) => b.likes - a.likes).slice(0, 12),
    [products],
  )

  // Si nadie ha dado me gusta todavía, no mostramos la sección.
  if (top.length === 0) return null

  return (
    <section className="py-12">
      <div className="container-x">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">❤️ Lo más querido</p>
              <h2 className="h-section">Los favoritos de todos</h2>
              <p className="lead mt-2">Lo que más le gusta a la gente que nos visita.</p>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => emblaApi && emblaApi.scrollPrev()} aria-label="Anterior" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-coral hover:text-coral">
                <FiArrowLeft />
              </button>
              <button onClick={() => emblaApi && emblaApi.scrollNext()} aria-label="Siguiente" className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-coral hover:text-coral">
                <FiArrowRight />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {top.map((p, i) => {
              const color = catColor[p.category] || '#076DDF'
              return (
                <div key={p.id} className="min-w-0 flex-[0_0_78%] pr-4 sm:flex-[0_0_42%] lg:flex-[0_0_25%]">
                  <article className="card group flex h-full flex-col">
                    <button onClick={() => setDetail(p)} className="relative block overflow-hidden">
                      <img src={U(p.photo, 500)} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {/* Ranking */}
                      <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-xs font-800 text-white backdrop-blur">
                        {i + 1}
                      </span>
                      {/* Contador de me gusta */}
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-800 text-coral backdrop-blur">
                        <FiHeart className="fill-current" /> {p.likes}
                      </span>
                    </button>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-600 text-ink">{p.name}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-ink/50">
                          desde <span className="font-800 text-base text-ink">Q{p.price}</span>
                        </p>
                        <button
                          onClick={() => setDetail(p)}
                          className="rounded-full px-3 py-1.5 text-xs font-700 text-white"
                          style={{ background: color }}
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
