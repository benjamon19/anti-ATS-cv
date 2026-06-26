import type { CVData } from '../../../types/cv'
import NavigationButtons from '../NavigationButtons'

interface Props {
  data: CVData
  setData: (d: CVData) => void
  onNext: () => void
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  className?: string
  hint?: string
}

function Field({ label, value, onChange, placeholder, type = 'text', className = '', hint }: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900
          placeholder-slate-400 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white
          transition-all duration-200
        "
      />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

export default function Step1Personal({ data, setData, onNext }: Props) {
  const p = data.personal

  const update = (field: keyof typeof p, value: string) =>
    setData({ ...data, personal: { ...p, [field]: value } })

  const canProceed = p.name.trim() !== '' && p.email.trim() !== '' && p.phone.trim() !== '' && p.location.trim() !== ''

  return (
    <div>
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Datos Personales</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6 ml-11">
          Tu información de contacto y presencia online. Los campos con * son obligatorios.
        </p>
      </div>

      <div className="px-8 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          label="Nombre completo *"
          value={p.name}
          onChange={v => update('name', v)}
          placeholder="Ana García López"
          className="sm:col-span-2"
        />
        <Field
          label="Email *"
          type="email"
          value={p.email}
          onChange={v => update('email', v)}
          placeholder="ana@ejemplo.com"
        />
        <Field
          label="Teléfono *"
          value={p.phone}
          onChange={v => update('phone', v)}
          placeholder="+34 612 345 678"
        />
        <Field
          label="Ubicación *"
          value={p.location}
          onChange={v => update('location', v)}
          placeholder="Madrid, España"
        />
        <Field
          label="Sitio web"
          value={p.website}
          onChange={v => update('website', v)}
          placeholder="https://ana.dev"
          hint="Opcional — portfolio, blog personal..."
        />
        <Field
          label="LinkedIn"
          value={p.linkedin}
          onChange={v => update('linkedin', v)}
          placeholder="linkedin.com/in/anagarcia"
          hint="Opcional — URL o nombre de usuario"
        />
        <Field
          label="GitHub"
          value={p.github}
          onChange={v => update('github', v)}
          placeholder="github.com/anagarcia"
          hint="Opcional"
        />
      </div>

      <NavigationButtons onNext={onNext} nextDisabled={!canProceed} />
    </div>
  )
}
