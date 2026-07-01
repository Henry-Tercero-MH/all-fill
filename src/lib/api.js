// Capa de datos: habla con el Web App de Google Apps Script.
// La URL se configura en .env como VITE_APPS_SCRIPT_URL (ver .env.example).
import { products as STATIC_PRODUCTS } from '../data/products'

const BASE = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export const hasBackend = () => Boolean(BASE)

// Convierte el producto del Sheet al shape que usan los componentes del sitio.
export function mapProduct(r) {
  return {
    id: String(r.id ?? ''),
    name: r.nombre ?? '',
    desc: r.descripcion ?? '',
    price: Number(r.precio) || 0,
    category: r.categoria ?? '',
    tag: r.tag || undefined,
    photo: r.imagenUrl || '',
    disponible: r.disponible !== false,
    destacado: Boolean(r.destacado),
    likes: Number(r.likes) || 0,
  }
}

async function get(action, params = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString()
  const res = await fetch(`${BASE}?${qs}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// POST como text/plain para evitar el preflight CORS (Apps Script lee el body crudo).
async function post(payload) {
  const res = await fetch(BASE, { method: 'POST', body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// SHA-256 en hex (igual que Apps Script) usando Web Crypto.
export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ── Público ──────────────────────────────────────────────
export async function fetchProductos() {
  // Sin backend configurado: usamos el catálogo estático (modo desarrollo).
  if (!BASE) return STATIC_PRODUCTS
  const data = await get('getProductos')
  if (data?.error) throw new Error(data.error)
  return (Array.isArray(data) ? data : []).map(mapProduct)
}

export async function fetchConfig() {
  if (!BASE) return null
  return get('getConfig')
}

// ── Admin ────────────────────────────────────────────────
export async function fetchProductosAdmin() {
  const data = await get('getProductosAdmin')
  if (data?.error) throw new Error(data.error)
  return (Array.isArray(data) ? data : []).map((r) => ({ ...mapProduct(r), raw: r }))
}

// Token de escritura = passwordHash del admin (se guarda al iniciar sesión).
export const getAuth = () => sessionStorage.getItem('allfill_auth') || ''
export const clearAuth = () => sessionStorage.removeItem('allfill_auth')

export async function login(usuario, password) {
  const passwordHash = await sha256Hex(password)
  const res = await post({ action: 'login', usuario, passwordHash })
  if (res?.ok) sessionStorage.setItem('allfill_auth', passwordHash)
  return res
}

export async function crearProducto(p) {
  return post({ action: 'crearProducto', auth: getAuth(), ...p })
}

export async function actualizarProducto(p) {
  return post({ action: 'actualizarProducto', auth: getAuth(), ...p })
}

export async function eliminarProducto(id) {
  return post({ action: 'eliminarProducto', auth: getAuth(), id })
}

// "Me gusta" público (sin login). delta = 1 al favoritear, -1 al quitar.
export async function darLike(id, delta = 1) {
  if (!BASE) return null
  return post({ action: 'darLike', id, delta })
}

// file: File del input. Devuelve { ok, imagenUrl }.
export async function subirImagen(file) {
  const base64 = await fileToBase64(file)
  return post({
    action: 'subirImagen',
    auth: getAuth(),
    base64,
    mimeType: file.type,
    nombreArchivo: file.name,
  })
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1]) // quita el prefijo data:
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
