import type { CVData, CVTheme, OutputFormat } from '../../../types/cv'

interface Props {
  data: CVData
  setData: (d: CVData) => void
  onPrev: () => void
  onGenerate: () => void
  isGenerating: boolean
  downloadUrl: string | null
}

const THEMES: {
  id: CVTheme
  name: string
  description: string
  accentBg: string
  accentText: string
  preview: { heading: string; subtext: string }[]
}[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Diseño tradicional y elegante. Funciona para cualquier industria.',
    accentBg: 'bg-slate-800',
    accentText: 'text-white',
    preview: [
      { heading: '█████████████', subtext: '██████ · ██████' },
      { heading: '██████', subtext: '████████████████████' },
      { heading: '██████', subtext: '████████████' },
    ],
  },
  {
    id: 'sb2nov',
    name: 'SB2Nov',
    description: 'Moderno, minimalista. Muy valorado en tecnología y startups.',
    accentBg: 'bg-blue-700',
    accentText: 'text-white',
    preview: [
      { heading: '█████████████', subtext: '██████ · ██████' },
      { heading: '██████', subtext: '████████████████████' },
      { heading: '██████', subtext: '████████████' },
    ],
  },
  {
    id: 'engineeringresumes',
    name: 'Engineering',
    description: 'Optimizado para ingeniería de software y ciencias de la computación.',
    accentBg: 'bg-emerald-700',
    accentText: 'text-white',
    preview: [
      { heading: '█████████████', subtext: '██████ · ██████' },
      { heading: '██████', subtext: '████████████████████' },
      { heading: '██████', subtext: '████████████' },
    ],
  },
  {
    id: 'moderncv',
    name: 'ModernCV',
    description: 'Colorido y diferenciado. Ideal para creativos y diseñadores.',
    accentBg: 'bg-violet-700',
    accentText: 'text-white',
    preview: [
      { heading: '█████████████', subtext: '██████ · ██████' },
      { heading: '██████', subtext: '████████████████████' },
      { heading: '██████', subtext: '████████████' },
    ],
  },
]

export default function Step5Template({ data, setData, onPrev, onGenerate, isGenerating, downloadUrl }: Props) {
  const { theme, format } = data.template

  const setTheme = (t: CVTheme) =>
    setData({ ...data, template: { ...data.template, theme: t } })

  const setFormat = (f: OutputFormat) =>
    setData({ ...data, template: { ...data.template, format: f } })

  return (
    <div>
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Plantilla & Formato</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6 ml-11">
          Elige el diseño visual y el formato de descarga de tu CV.
        </p>
      </div>

      <div className="px-8 pb-6 space-y-8">
        {/* Theme grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Diseño de plantilla
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {THEMES.map(t => {
              const selected = theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`
                    group flex flex-col rounded-2xl overflow-hidden border-2 text-left
                    transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                    ${selected
                      ? 'border-indigo-500 shadow-lg shadow-indigo-100/80 scale-[1.02]'
                      : 'border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-slate-100'
                    }
                  `}
                >
                  {/* Mock CV preview */}
                  <div className={`${t.accentBg} p-4 h-28 relative overflow-hidden flex-shrink-0`}>
                    <div className={`${t.accentText} opacity-90 space-y-2`}>
                      <div className="h-2 w-3/4 bg-white/50 rounded-full" />
                      <div className="h-1.5 w-1/2 bg-white/30 rounded-full" />
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="h-1 w-full bg-white/20 rounded-full" />
                      <div className="h-1 w-5/6 bg-white/15 rounded-full" />
                      <div className="h-1 w-4/6 bg-white/15 rounded-full" />
                    </div>
                    {selected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white flex-1">
                    <p className={`text-sm font-bold ${selected ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Format picker */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Formato de entrega
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {([
              {
                id: 'pdf' as OutputFormat,
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
                label: 'PDF',
                sub: 'Listo para imprimir y enviar',
              },
              {
                id: 'png' as OutputFormat,
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                ),
                label: 'PNG',
                sub: 'Imagen de alta resolución',
              },
            ] as const).map(f => {
              const sel = format === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left
                    transition-all duration-200
                    ${sel
                      ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                    }
                  `}
                >
                  <span className={sel ? 'text-indigo-600' : 'text-slate-400'}>{f.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{f.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{f.sub}</p>
                  </div>
                  {sel && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* CV Summary card */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Resumen del CV</h3>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
            {[
              ['Nombre', data.personal.name || '—'],
              ['Email', data.personal.email || '—'],
              ['Experiencias', String(data.experience.length)],
              ['Formaciones', String(data.education.length)],
              ['Grupos de habilidades', String(data.skills.length)],
              ['Plantilla', THEMES.find(t => t.id === theme)?.name ?? theme],
            ].map(([key, val]) => (
              <div key={key} className="contents">
                <dt className="text-slate-500">{key}:</dt>
                <dd className="text-slate-900 font-semibold truncate">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100">
        <button
          onClick={onPrev}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
            text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-200
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Atrás
        </button>

        <div className="flex items-center gap-3">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={`cv.${format}`}
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100
                transition-all duration-200
              "
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Descargar {format.toUpperCase()}
            </a>
          )}

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="
              inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold
              text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
              transition-all duration-200 shadow-md shadow-indigo-200/70
            "
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generando CV...
              </>
            ) : (
              <>
                Generar CV
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
