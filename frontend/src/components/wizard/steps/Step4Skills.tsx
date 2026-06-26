import type { CVData, SkillGroup } from '../../../types/cv'
import NavigationButtons from '../NavigationButtons'

interface Props {
  data: CVData
  setData: (d: CVData) => void
  onNext: () => void
  onPrev: () => void
}

const SUGGESTED_CATEGORIES = [
  'Lenguajes',
  'Frameworks & Librerías',
  'Bases de Datos',
  'DevOps & Cloud',
  'Herramientas',
  'Idiomas',
  'Metodologías',
  'Soft Skills',
]

export default function Step4Skills({ data, setData, onNext, onPrev }: Props) {
  const addGroup = (label = '') => {
    setData({ ...data, skills: [...data.skills, { label, details: '' }] })
  }

  const update = (i: number, field: keyof SkillGroup, value: string) => {
    const skills = data.skills.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
    setData({ ...data, skills })
  }

  const remove = (i: number) => {
    setData({ ...data, skills: data.skills.filter((_, idx) => idx !== i) })
  }

  const existingLabels = new Set(data.skills.map(s => s.label))

  return (
    <div>
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Habilidades</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6 ml-11">
          Agrupa tus habilidades por categorías para mayor legibilidad en el CV.
        </p>
      </div>

      <div className="px-8 pb-2 space-y-2.5">
        {data.skills.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-sm">
            <svg className="w-8 h-8 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Usa las sugerencias o añade un grupo personalizado
          </div>
        )}

        {data.skills.map((skill, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors duration-150"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Categoría</label>
                <input
                  value={skill.label}
                  onChange={e => update(i, 'label', e.target.value)}
                  placeholder="Lenguajes"
                  className="
                    w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900
                    placeholder-slate-300 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300
                    transition-all duration-150
                  "
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Habilidades (separadas por coma)</label>
                <input
                  value={skill.details}
                  onChange={e => update(i, 'details', e.target.value)}
                  placeholder="Python, TypeScript, Go..."
                  className="
                    w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-900
                    placeholder-slate-300 text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300
                    transition-all duration-150
                  "
                />
              </div>
            </div>
            <button
              onClick={() => remove(i)}
              className="mt-6 p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Add button */}
        <button
          onClick={() => addGroup()}
          className="w-full py-3 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/40 transition-all duration-200"
        >
          + Añadir grupo
        </button>

        {/* Suggestions */}
        {SUGGESTED_CATEGORIES.filter(s => !existingLabels.has(s)).length > 0 && (
          <div className="mt-1 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2.5">Sugerencias rápidas:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_CATEGORIES.filter(s => !existingLabels.has(s)).map(s => (
                <button
                  key={s}
                  onClick={() => addGroup(s)}
                  className="
                    px-2.5 py-1 rounded-md bg-white text-slate-500 text-xs font-medium
                    border border-slate-200 hover:border-slate-300 hover:text-slate-700
                    transition-all duration-150
                  "
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={onNext} />
    </div>
  )
}
