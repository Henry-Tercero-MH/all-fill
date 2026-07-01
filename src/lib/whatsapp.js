export const WA_NUMBER = '50240705002'

export function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

// Mensaje de pedido de un producto individual.
export function waProduct(p) {
  const precio = p.price ? ` (desde Q${p.price})` : ''
  return waLink(`¡Hola ALL-FILL! 🙂 Me interesa *${p.name}*${precio}. ¿Me das más información?`)
}

// Mensaje de checkout con varios productos del carrito.
export function waCheckout(items) {
  const lineas = items
    .map((it) => `• ${it.qty}× ${it.name} — Q${it.price * it.qty}`)
    .join('\n')
  const total = items.reduce((s, it) => s + it.price * it.qty, 0)
  return waLink(
    `¡Hola ALL-FILL! 🙂 Quiero hacer este pedido:\n\n${lineas}\n\n*Total estimado: Q${total}*\n¿Me confirmas disponibilidad?`,
  )
}
