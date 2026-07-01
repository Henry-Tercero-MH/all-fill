import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FiArrowLeft, FiArrowRight, FiHeart } from 'react-icons/fi'
import { U } from '../data/images'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { useStore } from '../context/StoreContext'

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))

// Slide de respaldo mientras cargan los productos.
const FALLBACK = {
  fallback: true,
  eyebrow: 'ALL-FILL',
  title: 'Impresión 3D con estrategia',
  text: 'Llaveros, soportes, silbatos, instrumentos y más — a tu medida.',
}

export default function HeroBento() {
  const { products } = useProducts()
  const { setDetail } = useStore()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState([])
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi])

  // Los más gustados primero (likes desc, luego destacados).
  const slides = useMemo(() => {
    const ranked = [...products].sort(
      (a, b) => (b.likes || 0) - (a.likes || 0) || (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0),
    )
    const top = ranked.slice(0, 5)
    return top.length ? top : [FALLBACK]
  }, [products])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    const sync = () => {
      setSnaps(emblaApi.scrollSnapList())
      onSelect()
    }
    sync()
    emblaApi.on('select', onSelect).on('reInit', sync)
  }, [emblaApi, slides.length])

  return (
    <section id="inicio" className="pt-[150px] sm:pt-[128px]">
      <div className="container-x flex flex-col gap-4 lg:grid lg:grid-cols-3">
        {/* Carrusel principal — productos con más me gusta */}
        <div className="relative lg:col-span-2">
          <div className="overflow-hidden rounded-[1.6rem]" ref={emblaRef}>
            <div className="flex">
              {slides.map((s, i) => (
                <div key={s.id || `f-${i}`} className="relative min-w-0 flex-[0_0_100%]">
                  <div className="relative h-[340px] sm:h-[380px] lg:h-[470px]">
                    {s.fallback ? (
                      <div className="absolute inset-0 bg-metal-dark" />
                    ) : (
                      <img src={U(s.photo, 1100)} alt={s.name} className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
                    <div className="relative flex h-full max-w-xs flex-col justify-center p-6 text-white sm:max-w-md sm:p-12">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-coral px-3 py-1 text-xs font-800 uppercase tracking-wider">
                          {s.fallback ? s.eyebrow : catLabel[s.category] || 'ALL-FILL'}
                        </span>
                        {!s.fallback && s.likes > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-700 backdrop-blur">
                            <FiHeart className="fill-current text-coral" /> {s.likes}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-2xl font-700 leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
                        {s.fallback ? s.title : s.name}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-white/80 sm:mt-3 sm:text-base">
                        {s.fallback ? s.text : s.desc}
                      </p>
                      <button
                        onClick={() => (s.fallback ? go('catalogo') : setDetail(s))}
                        className="btn-coral mt-4 w-fit text-sm sm:mt-6 sm:text-base"
                      >
                        {s.fallback ? 'Ver catálogo' : 'Lo quiero'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flechas */}
          <button onClick={() => emblaApi && emblaApi.scrollPrev()} aria-label="Anterior" className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white sm:flex">
            <FiArrowLeft />
          </button>
          <button onClick={() => emblaApi && emblaApi.scrollNext()} aria-label="Siguiente" className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white sm:flex">
            <FiArrowRight />
          </button>

          {/* Puntos */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Ir al banner ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: i === selected ? 24 : 8, background: i === selected ? '#076DDF' : 'rgba(255,255,255,0.7)' }}
              />
            ))}
          </div>
        </div>

        {/* Banners laterales */}
        <div className="grid grid-cols-1 gap-4 lg:grid-rows-2">
          {/* Banner logo — solo desktop */}
          <div className="relative hidden overflow-hidden rounded-[1.6rem] bg-white shadow-soft lg:flex lg:flex-col lg:items-center lg:justify-center">
            <img src="/logo-mark.png" alt="ALL-FILL" className="relative h-32 w-32 object-contain drop-shadow-xl" />
            <p className="relative mt-3 font-display text-2xl font-800 tracking-tight text-ink">ALL-FILL</p>
            <p className="relative mt-1 text-sm text-ink/40">Impresión 3D a tu medida</p>
          </div>

          {/* Banner cotizador */}
          <button
            onClick={() => go('cotizador')}
            className="group relative h-[130px] overflow-hidden rounded-[1.6rem] bg-metal-dark p-5 text-left text-white shadow-glow lg:h-full"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-electric/40 blur-2xl transition-transform duration-500 group-hover:scale-125" />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-coral px-3 py-1 text-xs font-800 uppercase tracking-wider">
              Precios
            </span>
            <p className="relative mt-2 font-display text-xl font-700 leading-tight lg:text-2xl">
              ¿Cuánto cuesta tu idea?
            </p>
            <p className="relative mt-1 text-sm text-white/70">Calcúlalo en 3 toques →</p>
          </button>
        </div>
      </div>
    </section>
  )
}
