import { motion } from 'framer-motion'

// Wrapper de aparición al hacer scroll.
// "molecular" = se materializa con desenfoque (efecto de partículas ensamblándose).
const variants = {
  molecular: {
    hidden: { opacity: 0, y: 24, scale: 0.98, filter: 'blur(14px)' },
    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  },
  up: {
    hidden: { opacity: 0, y: 28, filter: 'blur(0px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
}

export default function Reveal({
  children,
  delay = 0,
  once = true,
  variant = 'molecular',
  className = '',
}) {
  const v = variants[variant] || variants.molecular
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      variants={v}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.61, 0.35, 1] }}
    >
      {children}
    </motion.div>
  )
}
