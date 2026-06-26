import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiUser, FiHome, FiStar, FiEdit3, FiCheck, FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Reveal from './Reveal'

const BASE = 30 // precio base referencial en Quetzales

const WHAT = [
  { id: 'figurita', label: 'Una figurita', hint: 'Personajes, coleccionables', icon: FiUser, factor: 1.3 },
  { id: 'hogar', label: 'Algo para mi casa', hint: 'Tazas, soportes, macetas', icon: FiHome, factor: 1.1 },
  { id: 'decoracion', label: 'Decoración', hint: 'Jarrones, lámparas, arte', icon: FiStar, factor: 1.2 },
  { id: 'personalizado', label: 'Mi propia idea', hint: 'Algo único, a tu medida', icon: FiEdit3, factor: 1.6 },
]

const SIZE = [
  { id: 'mini', label: 'Como una moneda', hint: 'Pequeño y delicado', factor: 1 },
  { id: 'mano', label: 'Como tu mano', hint: 'El tamaño más pedido', factor: 2.3 },
  { id: 'botella', label: 'Como una botella', hint: 'Grande y con presencia', factor: 4.2 },
]

function StepDots({ step }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-1 items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-800 transition-all"
            style={
              i <= step
                ? { background: '#F95C4B', color: '#fff' }
                : { background: 'rgba(23,24,24,0.07)', color: 'rgba(23,24,24,0.45)' }
            }
          >
            {i < step ? <FiCheck /> : i + 1}
          </div>
          {i < 2 && (
            <div
              className="h-0.5 flex-1 rounded-full"
              style={{ background: i < step ? '#F95C4B' : 'rgba(23,24,24,0.1)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function OptionGrid({ options, value, onPick }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const on = value === o.id
        const Icon = o.icon
        return (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className="flex items-center gap-3 rounded-2xl border p-4 text-left transition-all"
            style={
              on
                ? { borderColor: '#F95C4B', background: 'rgba(249,92,75,0.06)' }
                : { borderColor: 'rgba(23,24,24,0.1)' }
            }
          >
            {Icon && (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ color: on ? '#F95C4B' : '#171818', background: on ? 'rgba(249,92,75,0.1)' : 'rgba(23,24,24,0.05)' }}
              >
                <Icon />
              </span>
            )}
            <span>
              <span className="block font-display font-600 text-ink">{o.label}</span>
              <span className="block text-sm text-ink/55">{o.hint}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Quoter() {
  const [step, setStep] = useState(0)
  const [what, setWhat] = useState(null)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)

  const done = what && size && step === 2

  const price = useMemo(() => {
    if (!what || !size) return null
    const w = WHAT.find((x) => x.id === what).factor
    const s = SIZE.find((x) => x.id === size).factor
    const quantity = Math.max(1, Number(qty) || 1)
    const unit = BASE * w * s
    const discount = quantity >= 10 ? 0.85 : quantity >= 5 ? 0.92 : 1
    return {
      total: Math.round(unit * quantity * discount),
      unit: Math.round(unit),
      quantity,
      discount: discount < 1 ? Math.round((1 - discount) * 100) : 0,
    }
  }, [what, size, qty])

  const next = () => setStep((s) => Math.min(2, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))
  const canNext = (step === 0 && what) || (step === 1 && size)

  const wa = price
    ? `https://wa.me/50240705002?text=${encodeURIComponent(
        `¡Hola ALL-FILL! Quiero cotizar: ${WHAT.find((x) => x.id === what)?.label.toLowerCase()}, tamaño "${SIZE.find((x) => x.id === size)?.label.toLowerCase()}", ${price.quantity} unidad(es). El estimado de la web fue Q${price.total}.`,
      )}`
    : '#'

  return (
    <section id="cotizador" className="bg-cream/40 py-24">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Precios</p>
          <h2 className="h-section">¿Cuánto cuesta lo que imaginas?</h2>
          <p className="lead mt-3 max-w-lg">
            Responde tres preguntas y te damos un estimado al instante. Es solo una guía;
            el precio final lo confirmamos contigo.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3" delay={0.05}>
            <div className="rounded-[1.6rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
              <StepDots step={step} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.28 }}
                >
                  {step === 0 && (
                    <>
                      <h3 className="mb-5 font-display text-xl font-600 text-ink">1. ¿Qué quieres crear?</h3>
                      <OptionGrid options={WHAT} value={what} onPick={setWhat} />
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <h3 className="mb-5 font-display text-xl font-600 text-ink">2. ¿De qué tamaño?</h3>
                      <OptionGrid options={SIZE} value={size} onPick={setSize} />
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h3 className="mb-5 font-display text-xl font-600 text-ink">3. ¿Cuántos necesitas?</h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 text-2xl text-ink hover:border-coral hover:text-coral"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          className="h-12 w-24 rounded-xl border border-ink/15 bg-paper text-center font-display text-xl font-700 text-ink outline-none focus:border-coral"
                        />
                        <button
                          onClick={() => setQty((q) => Number(q) + 1)}
                          className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/15 text-2xl text-ink hover:border-coral hover:text-coral"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-ink/55">
                        {Number(qty) >= 5 ? '🎉 Llevas descuento por cantidad.' : 'Pide 5 o más y ahorras.'}
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-700 text-ink/60 transition-colors hover:text-ink disabled:opacity-30"
                >
                  <FiArrowLeft /> Atrás
                </button>
                {step < 2 && (
                  <button onClick={next} disabled={!canNext} className="btn-coral px-6 py-2.5 text-sm disabled:opacity-40">
                    Siguiente <FiArrowRight />
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Resultado */}
          <Reveal className="lg:col-span-2" delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-[1.6rem] bg-metal-dark p-6 text-white shadow-glow lg:sticky lg:top-28">
              <div>
                <p className="text-sm font-700 uppercase tracking-widest text-white/50">Tu estimado</p>
                <div className="mt-3 min-h-[88px]">
                  <AnimatePresence mode="wait">
                    {done && price ? (
                      <motion.div
                        key={price.total}
                        initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(12px)' }}
                        transition={{ duration: 0.5 }}
                        className="flex items-baseline gap-1"
                      >
                        <span className="font-display text-2xl text-white/50">Q</span>
                        <span className="font-display text-5xl font-700 text-coral sm:text-6xl">{price.total}</span>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="ph"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pt-3 text-white/55"
                      >
                        Completa los pasos y aquí aparece tu precio.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {done && price && (
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span>Por unidad</span>
                      <span className="font-700 text-white">Q{price.unit}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span>Cantidad</span>
                      <span className="font-700 text-white">{price.quantity}</span>
                    </li>
                    {price.discount > 0 && (
                      <li className="flex justify-between border-b border-white/10 pb-2 text-spring">
                        <span>Descuento</span>
                        <span className="font-700">−{price.discount}%</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <a
                href={done ? wa : undefined}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => !done && e.preventDefault()}
                className="btn-wa mt-7 w-full"
                style={{ opacity: done ? 1 : 0.45, pointerEvents: done ? 'auto' : 'none' }}
              >
                <FaWhatsapp className="text-xl" /> Pedir esto por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
