import { useState } from 'react'
import type { CVData, Experience, Education } from '../../../types/cv'
import NavigationButtons from '../NavigationButtons'

const genId = () => Math.random().toString(36).slice(2, 10)

interface Props {
  data: CVData
  setData: (d: CVData) => void
  onNext: () => void
  onPrev: () => void
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function Field({ label, value, onChange, placeholder, className = '', disabled = false }: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900
          placeholder-slate-300 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:opacity-40 disabled:bg-slate-50
          transition-all duration-200
        "
      />
    </div>
  )
}

function ExperienceCard({
  exp,
  index,
  onUpdate,
  onRemove,
}: {
  exp: Experience
  index: number
  onUpdate: (id: string, field: keyof Experience, value: Experience[keyof Experience]) => void
  onRemove: (id: string) => void
}) {
  const updateHighlight = (i: number, val: string) => {
    const h = [...exp.highlights]
    h[i] = val
    onUpdate(exp.id, 'highlights', h)
  }

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {exp.position || 'Nueva posición'}
          </span>
        </div>
        <button
          onClick={() => onRemove(exp.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Empresa" value={exp.company} onChange={v => onUpdate(exp.id, 'company', v)} placeholder="Google" />
        <Field label="Cargo / Posición" value={exp.position} onChange={v => onUpdate(exp.id, 'position', v)} placeholder="Senior Engineer" />
        <Field label="Inicio (AAAA-MM)" value={exp.startDate} onChange={v => onUpdate(exp.id, 'startDate', v)} placeholder="2021-03" />
        <div>
          <Field
            label="Fin (AAAA-MM)"
            value={exp.endDate}
            onChange={v => onUpdate(exp.id, 'endDate', v)}
            placeholder="2024-01"
            disabled={exp.current}
          />
          <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={e => onUpdate(exp.id, 'current', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-600 font-medium">Posición actual</span>
          </label>
        </div>
        <Field
          label="Ubicación"
          value={exp.location}
          onChange={v => onUpdate(exp.id, 'location', v)}
          placeholder="Madrid, España / Remoto"
          className="sm:col-span-2"
        />
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
          Logros y responsabilidades
        </label>
        <div className="space-y-2">
          {exp.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-slate-300 text-sm">›</span>
              <input
                value={h}
                onChange={e => updateHighlight(i, e.target.value)}
                placeholder={`Logro o responsabilidad ${i + 1}`}
                className="
                  flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900
                  placeholder-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                  transition-all duration-200
                "
              />
              <button
                onClick={() => onUpdate(exp.id, 'highlights', exp.highlights.filter((_, idx) => idx !== i))}
                className="text-slate-300 hover:text-red-400 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => onUpdate(exp.id, 'highlights', [...exp.highlights, ''])}
          className="mt-2 text-xs font-semibold text-indigo-500 hover:text-indigo-700 hover:underline transition-colors"
        >
          + Añadir logro
        </button>
      </div>
    </div>
  )
}

function EducationCard({
  edu,
  index,
  onUpdate,
  onRemove,
}: {
  edu: Education
  index: number
  onUpdate: (id: string, field: keyof Education, value: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {edu.institution || 'Nueva formación'}
          </span>
        </div>
        <button
          onClick={() => onRemove(edu.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Institución" value={edu.institution} onChange={v => onUpdate(edu.id, 'institution', v)} placeholder="Universidad Complutense" className="sm:col-span-2" />
        <Field label="Grado / Título" value={edu.degree} onChange={v => onUpdate(edu.id, 'degree', v)} placeholder="Grado en..." />
        <Field label="Área de estudio" value={edu.area} onChange={v => onUpdate(edu.id, 'area', v)} placeholder="Ingeniería Informática" />
        <Field label="Inicio (AAAA-MM)" value={edu.startDate} onChange={v => onUpdate(edu.id, 'startDate', v)} placeholder="2016-09" />
        <Field label="Fin (AAAA-MM)" value={edu.endDate} onChange={v => onUpdate(edu.id, 'endDate', v)} placeholder="2020-06" />
        <Field label="Nota media (opcional)" value={edu.gpa} onChange={v => onUpdate(edu.id, 'gpa', v)} placeholder="8.5 / 10" className="sm:col-span-2" />
      </div>
    </div>
  )
}

type Tab = 'experience' | 'education'

export default function Step3Experience({ data, setData, onNext, onPrev }: Props) {
  const [tab, setTab] = useState<Tab>('experience')

  const addExp = () => {
    const newExp: Experience = {
      id: genId(), company: '', position: '', startDate: '', endDate: '',
      current: false, location: '', highlights: [''],
    }
    setData({ ...data, experience: [...data.experience, newExp] })
  }

  const updateExp = (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
    setData({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    })
  }

  const removeExp = (id: string) =>
    setData({ ...data, experience: data.experience.filter(e => e.id !== id) })

  const addEdu = () => {
    const newEdu: Education = {
      id: genId(), institution: '', degree: '', area: '', startDate: '', endDate: '', gpa: '',
    }
    setData({ ...data, education: [...data.education, newEdu] })
  }

  const updateEdu = (id: string, field: keyof Education, value: string) => {
    setData({
      ...data,
      education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    })
  }

  const removeEdu = (id: string) =>
    setData({ ...data, education: data.education.filter(e => e.id !== id) })

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'experience', label: 'Experiencia Laboral', count: data.experience.length },
    { id: 'education', label: 'Educación', count: data.education.length },
  ]

  return (
    <div>
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Experiencia & Educación</h2>
        </div>
        <p className="text-slate-500 text-sm mb-5 ml-11">
          Añade tu historial laboral y formación académica, del más reciente al más antiguo.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="px-8 mb-5">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all duration-200
                ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`
                  w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold
                  ${tab === t.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}
                `}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-2 space-y-4">
        {tab === 'experience' && (
          <>
            {data.experience.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">
                <svg className="w-10 h-10 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38" />
                </svg>
                Añade tu primera experiencia laboral
              </div>
            )}
            {data.experience.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} onUpdate={updateExp} onRemove={removeExp} />
            ))}
            <button
              onClick={addExp}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50/60 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar experiencia laboral
            </button>
          </>
        )}

        {tab === 'education' && (
          <>
            {data.education.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">
                <svg className="w-10 h-10 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                Añade tu primera formación académica
              </div>
            )}
            {data.education.map((edu, i) => (
              <EducationCard key={edu.id} edu={edu} index={i} onUpdate={updateEdu} onRemove={removeEdu} />
            ))}
            <button
              onClick={addEdu}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-emerald-200 text-emerald-600 text-sm font-semibold hover:border-emerald-400 hover:bg-emerald-50/60 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar formación académica
            </button>
          </>
        )}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  )
}
