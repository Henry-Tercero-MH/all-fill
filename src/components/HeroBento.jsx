import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { U, PHOTOS } from '../data/images'

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const slides = [
  {
    photo: PHOTOS.llaveroPerrito,
    eyebrow: 'Llaveros',
    title: 'Llaveros con un detalle increíble',
    text: 'Mascotas, figuras y diseños únicos, en el color que quieras.',
    cta: 'Ver el catálogo',
    to: 'catalogo',
  },
  {
    photo: PHOTOS.macetas,
    eyebrow: 'Hogar',
    title: 'Piezas que tu espacio va a amar',
    text: 'Macetas, soportes y útiles con diseño que no ves en otro lado.',
    cta: 'Explorar piezas',
    to: 'catalogo',
  },
  {
    photo: PHOTOS.ukulele,
    eyebrow: 'Instrumentos',
    title: 'Un ukelele que suena de verdad',
    text: 'Impreso en 3D, en el color que tú elijas. Sí, se toca.',
    cta: 'Lo quiero',
    to: 'catalogo',
  },
]

export default function HeroBento() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState([])
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setSnaps(emblaApi.scrollSnapList())
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaApi])

  return (
    <section id="inicio" className="pt-[150px] sm:pt-[128px]">
      <div className="container-x flex flex-col gap-4 lg:grid lg:grid-cols-3">
        {/* Carrusel principal */}
        <div className="relative lg:col-span-2">
          <div className="overflow-hidden rounded-[1.6rem]" ref={emblaRef}>
            <div className="flex">
              {slides.map((s) => (
                <div key={s.title} className="relative min-w-0 flex-[0_0_100%]">
                  <div className="relative h-[340px] sm:h-[380px] lg:h-[470px]">
                    <img src={U(s.photo, 1100)} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
                    <div className="relative flex h-full max-w-xs flex-col justify-center p-6 text-white sm:max-w-md sm:p-12">
                      <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-coral px-3 py-1 text-xs font-800 uppercase tracking-wider">
                        {s.eyebrow}
                      </span>
                      <h2 className="font-display text-2xl font-700 leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
                        {s.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/80 sm:mt-3 sm:text-base">{s.text}</p>
                      <button onClick={() => go(s.to)} className="btn-coral mt-4 w-fit text-sm sm:mt-6 sm:text-base">
                        {s.cta}
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
                style={{ width: i === selected ? 24 : 8, background: i === selected ? '#F95C4B' : 'rgba(255,255,255,0.7)' }}
              />
            ))}
          </div>
        </div>

        {/* Banners laterales — en móvil: columna completa; en lg: columna del sidebar */}
        <div className="grid grid-cols-1 gap-4 lg:grid-rows-2">
          {/* Banner logo — solo desktop */}
          <div className="relative hidden overflow-hidden rounded-[1.6rem] bg-white lg:flex lg:flex-col lg:items-center lg:justify-center">
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
