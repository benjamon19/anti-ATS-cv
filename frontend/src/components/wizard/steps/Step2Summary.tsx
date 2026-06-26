import type { CVData } from '../../../types/cv'
import NavigationButtons from '../NavigationButtons'

interface Props {
  data: CVData
  setData: (d: CVData) => void
  onNext: () => void
  onPrev: () => void
}

const MAX_CHARS = 600

const EXAMPLE =
  'Desarrolladora Full-Stack con 5 años de experiencia construyendo aplicaciones web escalables. ' +
  'Especializada en React y Python, con sólida trayectoria en startups de tecnología financiera. ' +
  'Apasionada por el diseño de APIs limpias y la experiencia de usuario.'

export default function Step2Summary({ data, setData, onNext, onPrev }: Props) {
  const len = data.summary.length
  const pct = Math.min((len / MAX_CHARS) * 100, 100)
  const color = len > MAX_CHARS ? 'text-red-500' : len > MAX_CHARS * 0.8 ? 'text-amber-500' : 'text-slate-400'

  return (
    <div>
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Resumen Profesional</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6 ml-11">
          Un párrafo conciso (2-4 frases) que destaque tu perfil y propuesta de valor única.
        </p>
      </div>

      <div className="px-8 pb-2">
        <div className="relative">
          <textarea
            rows={6}
            value={data.summary}
            onChange={e => setData({ ...data, summary: e.target.value })}
            placeholder={EXAMPLE}
            className="
              w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900
              placeholder-slate-400 text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white
              transition-all duration-200
            "
          />

          {/* Char counter bar */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden mr-4">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-violet-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={`text-xs font-medium tabular-nums ${color}`}>
              {len} / {MAX_CHARS}
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-2">Consejos para un buen resumen:</p>
          <ul className="space-y-1">
            {[
              'Menciona años de experiencia y tu especialidad principal',
              'Incluye 1-2 tecnologías o áreas clave',
              'Cierra con tu motivación o valor diferencial',
              'Evita clichés como "apasionado" sin contexto concreto',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2 text-xs text-slate-500">
                <span className="mt-0.5 text-violet-400">›</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <NavigationButtons
        onPrev={onPrev}
        onNext={onNext}
        nextDisabled={data.summary.trim() === ''}
      />
    </div>
  )
}
