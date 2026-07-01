import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiPlus, FiLogOut, FiUploadCloud, FiExternalLink, FiX } from 'react-icons/fi'
import { categories } from '../data/products'
import { U } from '../data/images'
import {
  hasBackend,
  login as apiLogin,
  clearAuth,
  fetchProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  subirImagen,
} from '../lib/api'

const CATS = categories.filter((c) => c.id !== 'todos')
const emptyForm = { nombre: '', descripcion: '', precio: '', categoria: 'llaveros', tag: '', imagenUrl: '', disponible: true, destacado: false }

// ── Login ────────────────────────────────────────────────
function Login({ onOk }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiLogin(usuario.trim(), password)
      if (res?.ok) {
        sessionStorage.setItem('allfill_admin', usuario.trim())
        onOk()
      } else setError('Usuario o contraseña incorrectos.')
    } catch (err) {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-metal-dark p-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[1.4rem] bg-white p-8 shadow-lift">
        <div className="mb-6 flex items-center gap-2.5">
          <img src="/logo-mark.png" alt="ALL-FILL" className="h-10 w-10 object-contain" />
          <div>
            <p className="font-display text-xl font-800 text-ink">ALL-FILL</p>
            <p className="text-xs text-ink/50">Panel de administración</p>
          </div>
        </div>
        <label className="mb-1.5 block text-sm font-700 text-ink/80">Usuario</label>
        <input value={usuario} onChange={(e) => setUsuario(e.target.value)} className="mb-4 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none focus:border-electric" />
        <label className="mb-1.5 block text-sm font-700 text-ink/80">Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-5 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink outline-none focus:border-electric" />
        {error && <p className="mb-4 text-sm font-600 text-coral">{error}</p>}
        <button type="submit" disabled={loading} className="btn-electric w-full disabled:opacity-50">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-ink/50 hover:text-ink">← Volver al sitio</Link>
      </form>
    </div>
  )
}

// ── Formulario de producto ───────────────────────────────
function ProductForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const editing = Boolean(initial?.id)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    setErr('')
    try {
      const res = await subirImagen(file)
      if (res?.imagenUrl) set('imagenUrl', res.imagenUrl)
      else setErr(res?.error || 'No se pudo subir la imagen.')
    } catch {
      setErr('Error al subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) return setErr('El nombre es obligatorio.')
    setSaving(true)
    setErr('')
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio) || 0,
        categoria: form.categoria,
        tag: form.tag,
        imagenUrl: form.imagenUrl,
        disponible: form.disponible,
        destacado: form.destacado,
      }
      const res = editing ? await actualizarProducto({ id: form.id, ...payload }) : await crearProducto(payload)
      if (res?.ok) onSaved()
      else setErr(res?.error || 'No se pudo guardar.')
    } catch {
      setErr('Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const field = 'w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-ink outline-none focus:border-electric'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm">
      <form onSubmit={save} className="my-8 w-full max-w-lg rounded-[1.4rem] bg-white p-6 shadow-lift">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-700 text-ink">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5"><FiX /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-700 text-ink/80">Nombre</label>
            <input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-700 text-ink/80">Descripción</label>
            <textarea rows="2" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} className={`${field} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-700 text-ink/80">Precio (Q)</label>
              <input type="number" min="0" value={form.precio} onChange={(e) => set('precio', e.target.value)} className={field} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-700 text-ink/80">Categoría</label>
              <select value={form.categoria} onChange={(e) => set('categoria', e.target.value)} className={field}>
                {CATS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-700 text-ink/80">Etiqueta (opcional)</label>
            <input value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Nuevo, El más pedido…" className={field} />
          </div>

          {/* Imagen */}
          <div>
            <label className="mb-1 block text-sm font-700 text-ink/80">Foto</label>
            <div className="flex items-center gap-3">
              {form.imagenUrl ? (
                <img src={U(form.imagenUrl, 200)} alt="" className="h-16 w-16 rounded-xl border border-ink/10 object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-ink/20 text-ink/30"><FiUploadCloud /></div>
              )}
              <label className="cursor-pointer rounded-xl border border-ink/15 px-4 py-2 text-sm font-700 text-ink hover:border-electric hover:text-electric">
                {uploading ? 'Subiendo…' : 'Subir foto'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files[0])} />
              </label>
            </div>
            <input value={form.imagenUrl} onChange={(e) => set('imagenUrl', e.target.value)} placeholder="o pega una URL de imagen" className={`${field} mt-2 text-xs`} />
          </div>

          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm font-600 text-ink/80">
              <input type="checkbox" checked={form.disponible} onChange={(e) => set('disponible', e.target.checked)} /> Disponible
            </label>
            <label className="flex items-center gap-2 text-sm font-600 text-ink/80">
              <input type="checkbox" checked={form.destacado} onChange={(e) => set('destacado', e.target.checked)} /> Destacado
            </label>
          </div>

          {err && <p className="text-sm font-600 text-coral">{err}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ink px-5 py-2.5 text-sm">Cancelar</button>
          <button type="submit" disabled={saving || uploading} className="btn-coral px-6 py-2.5 text-sm disabled:opacity-50">
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Panel principal ──────────────────────────────────────
function Dashboard({ onLogout }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null) // producto en edición, {} para nuevo, null cerrado

  const load = () => {
    setLoading(true)
    fetchProductosAdmin()
      .then((data) => setList(data))
      .catch((e) => setError(e.message || 'Error al cargar'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"?`)) return
    await eliminarProducto(p.id)
    load()
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="ALL-FILL" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-800 text-ink">ALL-FILL · Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-700 text-ink/70 hover:text-ink sm:flex">
              Ver sitio <FiExternalLink />
            </Link>
            <button onClick={onLogout} className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-sm font-700 text-ink hover:border-coral hover:text-coral">
              <FiLogOut /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="container-x py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-700 text-ink">Productos</h1>
            <p className="text-sm text-ink/50">{list.length} en el catálogo</p>
          </div>
          <button onClick={() => setForm({})} className="btn-coral px-5 py-2.5 text-sm">
            <FiPlus /> Nuevo producto
          </button>
        </div>

        {loading ? (
          <p className="py-16 text-center text-ink/50">Cargando…</p>
        ) : error ? (
          <p className="py-16 text-center text-coral">{error}</p>
        ) : (
          <div className="overflow-hidden rounded-[1.2rem] border border-ink/10 bg-white">
            {list.map((p) => (
              <div key={p.id} className="flex items-center gap-4 border-b border-ink/[0.06] p-3 last:border-0">
                <img src={U(p.photo, 120)} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-ink/5 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-700 text-ink">{p.name}</p>
                  <p className="text-sm text-ink/50">{p.category} · Q{p.price}{p.tag ? ` · ${p.tag}` : ''}{!p.disponible ? ' · oculto' : ''}</p>
                </div>
                <button onClick={() => setForm(p.raw ? { id: p.id, nombre: p.name, descripcion: p.desc, precio: p.price, categoria: p.category, tag: p.tag || '', imagenUrl: p.photo, disponible: p.disponible, destacado: p.destacado } : p)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-electric"><FiEdit2 /></button>
                <button onClick={() => remove(p)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-ink/5 hover:text-coral"><FiTrash2 /></button>
              </div>
            ))}
            {list.length === 0 && <p className="py-16 text-center text-ink/50">Aún no hay productos. Crea el primero.</p>}
          </div>
        )}
      </main>

      {form !== null && (
        <ProductForm
          initial={form.id ? form : null}
          onClose={() => setForm(null)}
          onSaved={() => { setForm(null); load() }}
        />
      )}
    </div>
  )
}

// ── Página ───────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(sessionStorage.getItem('allfill_admin')))

  if (!hasBackend()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-metal-dark p-6 text-center">
        <div className="max-w-sm rounded-[1.4rem] bg-white p-8 shadow-lift">
          <p className="font-display text-xl font-700 text-ink">Backend no configurado</p>
          <p className="mt-2 text-sm text-ink/60">
            Falta definir <code className="rounded bg-ink/5 px-1">VITE_APPS_SCRIPT_URL</code> en el archivo <code className="rounded bg-ink/5 px-1">.env</code> con la URL del Web App de Apps Script.
          </p>
          <Link to="/" className="mt-5 inline-block text-sm font-700 text-electric">← Volver al sitio</Link>
        </div>
      </div>
    )
  }

  const logout = () => {
    sessionStorage.removeItem('allfill_admin')
    clearAuth()
    setAuthed(false)
  }

  return authed ? <Dashboard onLogout={logout} /> : <Login onOk={() => setAuthed(true)} />
}
