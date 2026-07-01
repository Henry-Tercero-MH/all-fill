import { motion } from 'framer-motion'
import { FiGrid, FiKey, FiSmartphone, FiRefreshCw, FiVolume2, FiStar, FiMusic, FiHome } from 'react-icons/fi'

const items = [
  { id: 'todos', label: 'Todo', icon: FiGrid, type: 'filter' },
  { id: 'llaveros', label: 'Llaveros', icon: FiKey, type: 'filter' },
  { id: 'soportes', label: 'Soportes', icon: FiSmartphone, type: 'filter' },
  { id: 'antiestres', label: 'Antiestrés', icon: FiRefreshCw, type: 'filter' },
  { id: 'silbatos', label: 'Silbatos', icon: FiVolume2, type: 'filter' },
  { id: 'figuritas', label: 'Figuritas', icon: FiStar, type: 'filter' },
  { id: 'instrumentos', label: 'Instrumentos', icon: FiMusic, type: 'filter' },
  { id: 'hogar', label: 'Hogar', icon: FiHome, type: 'filter' },
]

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export default function CategoryCircles() {
  const handle = (it) => {
    if (it.type === 'filter') {
      window.dispatchEvent(new CustomEvent('hemith:filter', { detail: it.id }))
      go('catalogo')
    } else {
      go(it.id)
    }
  }

  return (
    <section id="categorias" className="py-10 sm:py-12">
      <div className="container-x">
        <div className="flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-4 lg:grid-cols-8 [&::-webkit-scrollbar]:hidden">
          {items.map((it, i) => (
            <motion.button
              key={it.id}
              onClick={() => handle(it)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group flex shrink-0 flex-col items-center gap-2.5"
            >
              <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-coral/10 text-2xl text-coral shadow-raised transition-all duration-300 group-hover:-translate-y-1.5 group-hover:bg-coral group-hover:text-white group-hover:shadow-lift">
                <it.icon />
              </span>
              <span className="whitespace-nowrap text-center text-sm font-700 text-ink/75 transition-colors group-hover:text-ink">
                {it.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
