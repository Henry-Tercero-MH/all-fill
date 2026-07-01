import { useEffect, useMemo, useState } from 'react'
import { FiZap, FiTruck, FiTool, FiTrendingUp } from 'react-icons/fi'

const KEY = 'allfill_calc_config'

// Config del taller (se guarda en el navegador; la pones una vez).
const defaultConfig = {
  rollo: 250, // precio del rollo (Q)
  pesoRollo: 1000, // gramos por rollo
  watts: 150, // consumo de la impresora
  kwh: 1.6, // precio del kWh (Q) — ajústalo a tu recibo
  desgaste: 1.5, // desgaste/mantenimiento por hora (Q)
  margen: 60, // % de ganancia
  fijos: 0, // costos fijos / inversión (Q): impresora, renta, etc.
}

const money = (n) => `Q${(Number(n) || 0).toFixed(2)}`

function Field({ label, value, onChange, suffix, step = '1', hint }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-700 text-ink/80">{label}</span>
      <div className="relative">
        <input
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 pr-14 text-ink outline-none focus:border-electric"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-700 text-ink/40">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  )
}

export default function PriceCalculator() {
  const [cfg, setCfg] = useState(() => {
    try {
      return { ...defaultConfig, ...JSON.parse(localStorage.getItem(KEY)) }
    } catch {
      return defaultConfig
    }
  })
  const [gramos, setGramos] = useState(30)
  const [horas, setHoras] = useState(2)
  const [mano, setMano] = useState(0)
  const [transporte, setTransporte] = useState(0)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(cfg)), [cfg])
  const setC = (k) => (v) => setCfg((c) => ({ ...c, [k]: Number(v) || 0 }))

  const r = useMemo(() => {
    const costoGramo = cfg.rollo / (cfg.pesoRollo || 1)
    const material = (Number(gramos) || 0) * costoGramo
    const energia = (cfg.watts / 1000) * (Number(horas) || 0) * cfg.kwh
    const desgaste = (Number(horas) || 0) * cfg.desgaste
    const manoObra = Number(mano) || 0
    const costoUnit = material + energia + desgaste + manoObra
    const precioUnit = costoUnit * (1 + (cfg.margen || 0) / 100)
    const qty = Math.max(1, Number(cantidad) || 1)
    const total = precioUnit * qty + (Number(transporte) || 0)
    const sugerido = Math.ceil(precioUnit / 5) * 5 // redondeado hacia arriba a Q5
    // Punto de equilibrio: unidades para recuperar los costos fijos.
    const gananciaUnidad = precioUnit - costoUnit
    const equilibrio = cfg.fijos > 0 && gananciaUnidad > 0 ? Math.ceil(cfg.fijos / gananciaUnidad) : 0
    return { costoGramo, material, energia, desgaste, manoObra, costoUnit, precioUnit, qty, total, sugerido, gananciaUnidad, equilibrio }
  }, [cfg, gramos, horas, mano, transporte, cantidad])

  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
      {/* Entradas */}
      <div className="space-y-6 lg:col-span-3">
        {/* Config del taller */}
        <section className="rounded-[1.2rem] border border-ink/10 bg-white p-5">
          <h3 className="mb-1 font-display text-lg font-700 text-ink">Datos de tu taller</h3>
          <p className="mb-4 text-sm text-ink/50">Se guardan solos. Ponlos una vez y ajústalos cuando cambien.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio del rollo" value={cfg.rollo} onChange={setC('rollo')} suffix="Q" />
            <Field label="Peso del rollo" value={cfg.pesoRollo} onChange={setC('pesoRollo')} suffix="g" hint="Normalmente 1000 g (1 kg)" />
            <Field label="Consumo de la impresora" value={cfg.watts} onChange={setC('watts')} suffix="W" hint="Típico: 120–200 W" />
            <Field label="Precio de la electricidad" value={cfg.kwh} onChange={setC('kwh')} suffix="Q/kWh" step="0.1" hint="Míralo en tu recibo de luz" />
            <Field label="Desgaste / mantenimiento" value={cfg.desgaste} onChange={setC('desgaste')} suffix="Q/h" step="0.1" hint="Boquillas, correas, etc. por hora" />
            <Field label="Margen de ganancia" value={cfg.margen} onChange={setC('margen')} suffix="%" hint="Lo que quieres ganar encima del costo" />
            <Field label="Costos fijos / inversión" value={cfg.fijos} onChange={setC('fijos')} suffix="Q" hint="Impresora, renta, etc. (para el punto de equilibrio)" />
          </div>
          <p className="mt-3 rounded-lg bg-electric/5 px-3 py-2 text-sm text-ink/60">
            Costo del filamento: <b className="text-ink">{money(r.costoGramo)}/g</b>
          </p>
        </section>

        {/* Datos de la pieza */}
        <section className="rounded-[1.2rem] border border-ink/10 bg-white p-5">
          <h3 className="mb-4 font-display text-lg font-700 text-ink">Esta pieza</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Filamento que usa" value={gramos} onChange={setGramos} suffix="g" hint="Lo ves en tu slicer (Cura, etc.)" />
            <Field label="Tiempo de impresión" value={horas} onChange={setHoras} suffix="h" step="0.1" />
            <Field label="Mano de obra / diseño" value={mano} onChange={setMano} suffix="Q" hint="Opcional, por pieza" />
            <Field label="Cantidad" value={cantidad} onChange={setCantidad} suffix="u" />
            <Field label="Transporte / envío" value={transporte} onChange={setTransporte} suffix="Q" hint="Se suma una vez al total" />
          </div>
        </section>
      </div>

      {/* Resultado */}
      <div className="lg:col-span-2 lg:sticky lg:top-24">
        <div className="rounded-[1.4rem] bg-metal-dark p-6 text-white shadow-glow">
          <p className="text-sm font-700 uppercase tracking-widest text-white/50">Precio de venta por unidad</p>
          <p className="mt-1 font-display text-5xl font-800 text-electric">{money(r.precioUnit)}</p>
          <p className="mt-1 text-sm text-white/60">Precio sugerido (redondeado): <b className="text-white">{money(r.sugerido)}</b></p>

          {/* Desglose de costos */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-2 text-xs font-800 uppercase tracking-widest text-white/40">Desglose de costos</p>
            <div className="space-y-2 text-sm">
              <Row icon={<span className="text-white/40">◼</span>} label="Material (filamento)" value={money(r.material)} />
              <Row icon={<FiZap className="text-white/40" />} label="Energía" value={money(r.energia)} />
              <Row icon={<FiTool className="text-white/40" />} label="Desgaste impresora" value={money(r.desgaste)} />
              {r.manoObra > 0 && <Row icon={<FiTool className="text-white/40" />} label="Mano de obra" value={money(r.manoObra)} />}
              <div className="flex justify-between border-t border-white/10 pt-2 font-700">
                <span>Precio bruto (costo)</span>
                <span>{money(r.costoUnit)}</span>
              </div>
              <Row icon={<FiTrendingUp className="text-electric" />} label={`Ganancia (${cfg.margen}%)`} value={money(r.precioUnit - r.costoUnit)} accent />
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-2 text-xs font-800 uppercase tracking-widest text-white/40">Resumen del pedido</p>
            <div className="space-y-2 text-sm">
              <Row label={`Subtotal (${r.qty} u × ${money(r.precioUnit)})`} value={money(r.precioUnit * r.qty)} />
              <Row icon={<FiTruck className="text-white/40" />} label="Transporte / envío" value={money(transporte)} />
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-800">Precio total</span>
                <span className="font-display text-2xl font-800 text-electric">{money(r.total)}</span>
              </div>
            </div>
          </div>

          {/* Punto de equilibrio */}
          {r.equilibrio > 0 && (
            <div className="mt-5 rounded-xl border border-electric/30 bg-electric/10 p-4">
              <p className="text-xs font-800 uppercase tracking-widest text-electric">Punto de equilibrio</p>
              <p className="mt-1 text-sm text-white/80">
                Vendiendo esta pieza, necesitas <b className="text-white">~{r.equilibrio} unidades</b> para
                recuperar tus costos fijos ({money(cfg.fijos)}).
              </p>
              <p className="mt-1 text-xs text-white/50">Ganancia por unidad: {money(r.gananciaUnidad)}</p>
            </div>
          )}

          <p className="mt-4 text-xs text-white/40">
            * Estimado guía. El <b>precio bruto</b> es tu costo; el <b>precio de venta</b> ya incluye tu ganancia. Ajusta el margen según tu mercado.
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`flex items-center gap-2 ${accent ? 'text-electric' : 'text-white/70'}`}>
        {icon} {label}
      </span>
      <span className={accent ? 'font-700 text-electric' : 'text-white'}>{value}</span>
    </div>
  )
}
