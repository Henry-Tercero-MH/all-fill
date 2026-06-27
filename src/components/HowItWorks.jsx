import { FiMessageCircle, FiPenTool, FiGift } from 'react-icons/fi'
import { U, PHOTOS } from '../data/images'
import Reveal from './Reveal'

const steps = [
  {
    icon: FiMessageCircle,
    color: '#F95C4B',
    title: 'Nos cuentas tu idea',
    text: 'Por WhatsApp o el formulario. Una foto, un dibujo o solo la descripción: con eso arrancamos.',
  },
  {
    icon: FiPenTool,
    color: '#171818',
    title: 'La preparamos contigo',
    text: 'Afinamos forma, tamaño y color, y te confirmamos el precio antes de empezar. Sin sorpresas.',
  },
  {
    icon: FiGift,
    color: '#F95C4B',
    title: 'La creamos y te la damos',
    text: 'La hacemos pieza por pieza y te avisamos cuando está lista para recoger o enviar.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como" className="bg-white py-24">
      <div className="container-x">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className=”relative pb-16 md:pb-0”>
              <div className=”absolute -left-4 -top-4 h-28 w-28 rounded-3xl bg-cream” />
              <img
                src={U(PHOTOS.soporteTelefonoGatito, 800)}
                alt=”Pieza ALL-FILL impresa en 3D”
                className=”relative aspect-[5/4] w-full rounded-[1.6rem] border border-ink/10 object-cover shadow-soft”
              />
              <div className=”absolute -bottom-14 right-0 max-w-[210px] rounded-2xl border border-ink/10 bg-white p-4 shadow-lift md:-bottom-6 md:-right-4”>
                <p className=”font-display text-base font-600 italic text-ink”>
                  “No tienes que saber nada de impresión 3D. Para eso estamos nosotros.”
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">Cómo funciona</p>
              <h2 className="h-section">Tan fácil como contarnos qué quieres</h2>
              <p className="lead mt-4">
                No necesitas medidas exactas ni términos raros. Nosotros nos encargamos de
                lo técnico para que tú solo pienses en la idea.
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
                      style={{ color: s.color, background: `${s.color}14` }}
                    >
                      <s.icon />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-600 text-ink">
                        {i + 1}. {s.title}
                      </h3>
                      <p className="mt-1 text-ink/65">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
