import { useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import { catColor } from '../data/products'
import { U } from '../data/images'
import { useProducts } from '../context/ProductsContext'
import { waProduct } from '../lib/whatsapp'
import Reveal from './Reveal'

export default function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false, dragFree: true })
  const { products, loading } = useProducts()

  // Destacados; si no hay marcados, mostramos los primeros como muestra.
  const featured = useMemo(() => {
    const dest = products.filter((p) => p.destacado)
    return (dest.length ? dest : products).slice(0, 12)
  }, [products])

  if (loading || featured.length === 0) return null

  return (
    <section className="py-12">
      <div className="container-x">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">✨ Recomendados</p>
              <h2 className="h-section">ALL-FILL te recomienda</h2>
            </div>
            <div className="flex gap-2">
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
            {featured.map((p) => {
              const color = catColor[p.category] || '#076DDF'
              return (
                <div key={p.id} className="min-w-0 flex-[0_0_100%] pr-5 sm:flex-[0_0_50%] lg:flex-[0_0_25%]">
                  <article className="card group flex h-full flex-col">
                    <div className="relative overflow-hidden">
                      <img src={U(p.photo, 500)} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      {p.tag && (
                        <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-700 text-white" style={{ background: color }}>
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-display text-base font-600 text-ink">{p.name}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-ink/50">
                          desde <span className="font-800 text-base text-ink">Q{p.price}</span>
                        </p>
                        <button
                          onClick={() => window.open(waProduct(p), '_blank')}
                          aria-label={`Pedir ${p.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
                          style={{ background: color }}
                        >
                          <FiArrowUpRight />
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
