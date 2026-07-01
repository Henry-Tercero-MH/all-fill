import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FaStar } from 'react-icons/fa'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import Reveal from './Reveal'

const testimonials = [
  {
    name: 'María José',
    place: 'Ciudad de Guatemala',
    initials: 'MJ',
    color: '#076DDF',
    text: 'Le pedí la figura del personaje favorito de mi hijo y quedó fascinado. Se ve igualita a la de la película.',
  },
  {
    name: 'Carlos Andrés',
    place: 'Quetzaltenango',
    initials: 'CA',
    color: '#171818',
    text: 'Convirtieron una foto de mi familia en una lámpara preciosa. Todos me preguntan dónde la conseguí.',
  },
  {
    name: 'Luisa Fernanda',
    place: 'Antigua',
    initials: 'LF',
    color: '#076DDF',
    text: 'Tenía una idea en la cabeza y la hicieron real. Fácil de pedir por WhatsApp y rapidísimo.',
  },
  {
    name: 'Diego Morales',
    place: 'Mixco',
    initials: 'DM',
    color: '#171818',
    text: 'Necesitaba una pieza de repuesto que ya no se vende. Me la imprimieron idéntica en dos días.',
  },
  {
    name: 'Andrea Pérez',
    place: 'Villa Nueva',
    initials: 'AP',
    color: '#076DDF',
    text: 'Pedí recuerditos personalizados para mi boda y fueron el detalle que más gustó. Calidad increíble.',
  },
]

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true }),
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
    <section id="testimonios" className="bg-sky/25 py-24">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Opiniones</p>
              <h2 className="h-section">Lo que dicen quienes ya pidieron</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi && emblaApi.scrollPrev()}
                aria-label="Anterior"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-all hover:border-coral hover:text-coral"
              >
                <FiArrowLeft />
              </button>
              <button
                onClick={() => emblaApi && emblaApi.scrollNext()}
                aria-label="Siguiente"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-all hover:border-coral hover:text-coral"
              >
                <FiArrowRight />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="min-w-0 flex-[0_0_100%] pr-5 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <figure className="flex h-full flex-col rounded-[1.4rem] border border-ink/[0.06] bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift">
                  <div className="mb-3 flex gap-0.5 text-coral">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <FaStar key={s} className="text-sm" />
                    ))}
                  </div>
                  <blockquote className="flex-1 font-display text-lg italic leading-relaxed text-ink/85">
                    “{t.text}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full font-display text-base font-700 text-white"
                      style={{ background: t.color }}
                    >
                      {t.initials}
                    </span>
                    <div>
                      <p className="font-700 text-ink">{t.name}</p>
                      <p className="text-sm text-ink/50">{t.place}</p>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir a la opinión ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === selected ? 26 : 8,
                background: i === selected ? '#076DDF' : 'rgba(23,24,24,0.18)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
