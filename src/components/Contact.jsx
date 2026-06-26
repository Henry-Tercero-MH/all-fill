import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCheckCircle, FiUploadCloud } from 'react-icons/fi'
import Reveal from './Reveal'

const WA_NUMBER = '50240705002'

const initial = { name: '', email: '', message: '', file: null }

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Cuéntanos tu nombre'
  else if (v.name.trim().length < 3) e.name = 'Un poco más, por favor'
  if (!v.email.trim()) e.email = 'Necesitamos tu correo'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Ese correo no se ve bien'
  if (!v.message.trim()) e.message = 'Describe tu idea'
  else if (v.message.trim().length < 10) e.message = 'Cuéntanos un poquito más'
  return e
}

function Field({ label, error, touched, children }) {
  const invalid = touched && error
  return (
    <div>
      <label className="mb-1.5 block text-sm font-700 text-ink/80">{label}</label>
      <motion.div animate={invalid ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
        {children}
      </motion.div>
      <AnimatePresence>
        {invalid && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-xs font-600 text-coral"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState({})
  const [sent, setSent] = useState(false)
  const errors = validate(values)

  const field =
    'w-full rounded-xl border bg-paper px-4 py-3 text-ink outline-none transition-all placeholder:text-ink/35 ' +
    'border-ink/12 focus:border-coral focus:shadow-[0_0_0_4px_rgba(249,92,75,0.12)]'

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setValues((v) => ({ ...v, [name]: files ? files[0] : value }))
  }
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))
  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errors).length === 0) {
      const text =
        `¡Hola ALL-FILL! 🙂\n\n` +
        `*Nombre:* ${values.name}\n` +
        `*Correo:* ${values.email}\n` +
        `*Mi idea:* ${values.message}` +
        (values.file ? `\n\n(Tengo una foto de referencia para enviarte)` : '')
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
      setSent(true)
      setValues(initial)
      setTouched({})
      setTimeout(() => setSent(false), 5000)
    }
  }

  const wa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('¡Hola ALL-FILL! Quiero hacer realidad una idea 🙂')}`

  return (
    <section id="contacto" className="bg-white py-24">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Hablemos</p>
          <h2 className="h-section">Cuéntanos tu idea</h2>
          <p className="lead mt-4 max-w-md">
            Escríbenos qué tienes en mente. Si ya tienes una foto o referencia, mejor todavía.
            Te respondemos el mismo día.
          </p>

          <a href={wa} target="_blank" rel="noreferrer" className="btn-wa mt-8 px-7 py-4 text-lg">
            <FaWhatsapp className="text-2xl" /> Escríbenos por WhatsApp
          </a>
          <p className="mt-3 text-sm text-ink/50">Es la forma más rápida (y la que más nos gusta).</p>

          <div className="mt-8 space-y-2 text-ink/70">
            <p>📍 Ciudad de Guatemala</p>
            <p>✉️ hola@all-fill.gt</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 rounded-[1.6rem] border border-ink/10 bg-paper/60 p-6 shadow-soft sm:p-8"
          >
            <Field label="Tu nombre" error={errors.name} touched={touched.name}>
              <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="¿Cómo te llamas?" className={field} />
            </Field>
            <Field label="Tu correo" error={errors.email} touched={touched.email}>
              <input name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="tucorreo@ejemplo.com" className={field} />
            </Field>
            <Field label="¿Qué te gustaría crear?" error={errors.message} touched={touched.message}>
              <textarea name="message" rows="4" value={values.message} onChange={handleChange} onBlur={handleBlur} placeholder="Cuéntanos: qué es, para qué, colores que te gustan..." className={`${field} resize-none`} />
            </Field>

            <div>
              <label className="mb-1.5 block text-sm font-700 text-ink/80">
                Foto de referencia <span className="font-500 text-ink/45">(opcional)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink/20 bg-paper px-4 py-3.5 text-sm text-ink/55 transition-all hover:border-coral hover:text-coral">
                <FiUploadCloud className="text-xl text-coral" />
                <span>{values.file ? <span className="text-coral">{values.file.name}</span> : 'Sube una foto o imagen de lo que imaginas'}</span>
                <input type="file" name="file" onChange={handleChange} accept="image/*,.pdf" className="hidden" />
              </label>
            </div>

            <button type="submit" className="btn-coral w-full">Enviar mi idea</button>

            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-700 text-emerald-700"
                >
                  <FiCheckCircle /> Te llevamos a WhatsApp para enviar tu idea.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
