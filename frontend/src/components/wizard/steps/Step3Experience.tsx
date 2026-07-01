import { useMemo, useRef, useState } from 'react'
import { Lightbulb, CheckCircle2, AlertCircle, ExternalLink, Award, BookOpen, Heart, Sparkles, Loader2 } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { CVData, Experience, Education, Project, Certification, VolunteerEntry, PublicationEntry } from '../../../types/cv'
import type { ServerErrorMap } from '../../../utils/serverErrors'
import NavigationButtons from '../NavigationButtons'
import Combobox from '../../ui/Combobox'
import AnimatedListItem from '../../ui/AnimatedListItem'
import { useDropdownReveal } from '../../../hooks/useDropdownReveal'
import {
  JOB_TITLES, DEGREES, ACTION_VERBS_ES,
  ROLE_PLACEHOLDER_EXAMPLES, HIGHLIGHT_PLACEHOLDER_EXAMPLES,
  DEGREE_PLACEHOLDER_EXAMPLES, AREA_PLACEHOLDER_EXAMPLES, pickRandom,
} from '../../../data/suggestions'
import { startsWithActionVerb } from '../../../utils/ats'
import { validateRequired, validateExperienceDates, validateEducationDates } from '../../../utils/validation'

const genId = () => Math.random().toString(36).slice(2, 10)

interface Props {
  data: CVData
  setData: (d: CVData) => void
  onNext: () => void
  onPrev: () => void
  serverErrors?: ServerErrorMap
  onClearServerError?: (field: string) => void
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: string | null
}

function Field({ label, value, onChange, onBlur, placeholder, className = '', disabled = false, error }: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        className={`
          w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
          placeholder-zinc-300 dark:placeholder-zinc-600 text-sm
          focus:outline-none focus:ring-2
          disabled:opacity-40 disabled:bg-zinc-50
          transition-all duration-200
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
            : 'border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-zinc-900/10'
          }
        `}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function VerbPicker({ onSelect }: { onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const { panelRef, shouldRender } = useDropdownReveal(open)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-zinc-500 font-semibold hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        Verbos ATS
      </button>
      {shouldRender && (
        <div ref={panelRef} className="absolute z-50 left-0 top-6 w-56 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-2 grid grid-cols-2 gap-1">
          {ACTION_VERBS_ES.map(v => (
            <button
              key={v}
              type="button"
              onMouseDown={e => {
                e.preventDefault()
                onSelect(v + ' ')
                setOpen(false)
              }}
              className="text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {v}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

interface ExperienceEntryErrors {
  position: string | null
  company: string | null
  startDate: string | null
  endDate: string | null
}

type ExperienceField = 'position' | 'company' | 'startDate' | 'endDate'

function ExperienceCard({
  exp, index, onUpdate, onRemove, jobTitles, errors, forceShowErrors,
}: {
  exp: Experience
  index: number
  onUpdate: (id: string, field: keyof Experience, value: Experience[keyof Experience]) => void
  onRemove: (id: string) => void
  jobTitles: string[]
  errors: ExperienceEntryErrors
  forceShowErrors: boolean
}) {
  const [touched, setTouched] = useState<Partial<Record<ExperienceField, boolean>>>({})
  const markTouched = (field: ExperienceField) => setTouched(t => ({ ...t, [field]: true }))
  const shownError = (field: ExperienceField) => (touched[field] || forceShowErrors) ? errors[field] : null
  const [positionPlaceholder] = useState(() => pickRandom(ROLE_PLACEHOLDER_EXAMPLES))
  const [highlightPlaceholder] = useState(() => pickRandom(HIGHLIGHT_PLACEHOLDER_EXAMPLES))
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [improvingIdx, setImprovingIdx] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const updateHighlight = (i: number, val: string) => {
    const h = [...exp.highlights]
    h[i] = val
    onUpdate(exp.id, 'highlights', h)
  }

  const prependVerb = (i: number, verb: string) => {
    const current = exp.highlights[i] ?? ''
    updateHighlight(i, verb + current)
  }

  const handleSuggestHighlights = async () => {
    setIsSuggesting(true)
    setAiError(null)
    try {
      const { suggestHighlights } = await import('../../../utils/gemini')
      const existing = exp.highlights.filter(h => h.trim())
      const { highlights } = await suggestHighlights(exp.position, exp.company, existing)
      // Append to existing non-empty highlights, replacing empty ones first
      const current = exp.highlights.filter(h => h.trim())
      onUpdate(exp.id, 'highlights', [...current, ...highlights])
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al sugerir logros. Inténtalo de nuevo.')
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleImproveHighlight = async (i: number) => {
    if (!exp.highlights[i]?.trim()) return
    setImprovingIdx(i)
    setAiError(null)
    try {
      const { improveHighlight } = await import('../../../utils/gemini')
      const { result } = await improveHighlight(exp.highlights[i], exp.position)
      updateHighlight(i, result)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al mejorar el bullet. Inténtalo de nuevo.')
    } finally {
      setImprovingIdx(null)
    }
  }

  const canSuggest = exp.position.trim().length > 0 || exp.company.trim().length > 0

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-xs font-bold text-white dark:text-zinc-900 flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[200px]">
            {exp.position || 'Nueva posición'}
            {exp.company ? ` · ${exp.company}` : ''}
          </span>
        </div>
        <button
          onClick={() => onRemove(exp.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Combobox
          label="Cargo / Posición"
          value={exp.position}
          onChange={v => onUpdate(exp.id, 'position', v)}
          onBlur={() => markTouched('position')}
          error={shownError('position')}
          suggestions={jobTitles}
          placeholder={positionPlaceholder}
        />
        <Field
          label="Empresa"
          value={exp.company}
          onChange={v => onUpdate(exp.id, 'company', v)}
          onBlur={() => markTouched('company')}
          error={shownError('company')}
          placeholder="Nombre de la empresa"
        />
        <Field
          label="Inicio (AAAA-MM)"
          value={exp.startDate}
          onChange={v => onUpdate(exp.id, 'startDate', v)}
          onBlur={() => markTouched('startDate')}
          error={shownError('startDate')}
          placeholder="2021-03"
        />
        <div>
          <Field
            label="Fin (AAAA-MM)"
            value={exp.endDate}
            onChange={v => onUpdate(exp.id, 'endDate', v)}
            onBlur={() => markTouched('endDate')}
            error={shownError('endDate')}
            placeholder="2024-01"
            disabled={exp.current}
          />
          <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={e => onUpdate(exp.id, 'current', e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Posición actual</span>
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Logros y responsabilidades
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Comienza con verbo de acción</span>
            {canSuggest && (
              <button
                type="button"
                onClick={handleSuggestHighlights}
                disabled={isSuggesting}
                className="
                  group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold
                  bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                  hover:from-violet-500 hover:to-indigo-500
                  active:scale-95 transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {isSuggesting
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Sparkles className="w-3 h-3" />
                }
                {isSuggesting ? 'Generando…' : 'Sugerir con IA'}
              </button>
            )}
          </div>
        </div>

        {aiError && (
          <div className="mb-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {aiError}
          </div>
        )}

        <div className="space-y-2">
          {exp.highlights.map((h, i) => {
            const ok = h.trim() === '' || startsWithActionVerb(h)
            const isImprovingThis = improvingIdx === i
            return (
              <div key={i} className="flex items-center gap-2">
                {h.trim() !== '' ? (
                  ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 flex-shrink-0" />
                )}
                <input
                  value={h}
                  onChange={e => updateHighlight(i, e.target.value)}
                  placeholder={highlightPlaceholder}
                  disabled={isImprovingThis}
                  className="
                    flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100
                    placeholder-zinc-300 dark:placeholder-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none
                    disabled:opacity-60 transition-all duration-200
                  "
                />
                {/* Wand button — improve this bullet with AI */}
                {h.trim().length > 5 && (
                  <button
                    type="button"
                    onClick={() => handleImproveHighlight(i)}
                    disabled={isImprovingThis || improvingIdx !== null}
                    title="Mejorar con IA"
                    className="text-violet-400 hover:text-violet-600 disabled:opacity-40 transition-colors p-1 flex-shrink-0"
                  >
                    {isImprovingThis
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Sparkles className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
                <button
                  onClick={() => onUpdate(exp.id, 'highlights', exp.highlights.filter((_, idx) => idx !== i))}
                  className="text-zinc-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        {exp.highlights.some(h => h.trim() !== '' && !startsWithActionVerb(h)) && (
          <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            Algunos logros no empiezan con verbo de acción. Usa el selector o la varita IA para mejorarlo.
          </div>
        )}

        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => onUpdate(exp.id, 'highlights', [...exp.highlights, ''])}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors"
          >
            + Añadir logro
          </button>
          <VerbPicker
            onSelect={verb => {
              const emptyIdx = exp.highlights.findIndex(h => h.trim() === '')
              if (emptyIdx !== -1) {
                prependVerb(emptyIdx, verb)
              } else {
                onUpdate(exp.id, 'highlights', [...exp.highlights, verb])
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────

interface EducationEntryErrors {
  institution: string | null
  degree: string | null
  startDate: string | null
  endDate: string | null
}

type EducationField = 'institution' | 'degree' | 'startDate' | 'endDate'

function EducationCard({
  edu, index, onUpdate, onRemove, errors, forceShowErrors,
}: {
  edu: Education
  index: number
  onUpdate: (id: string, field: keyof Education, value: string) => void
  onRemove: (id: string) => void
  errors: EducationEntryErrors
  forceShowErrors: boolean
}) {
  const [touched, setTouched] = useState<Partial<Record<EducationField, boolean>>>({})
  const markTouched = (field: EducationField) => setTouched(t => ({ ...t, [field]: true }))
  const shownError = (field: EducationField) => (touched[field] || forceShowErrors) ? errors[field] : null
  const [degreePlaceholder] = useState(() => pickRandom(DEGREE_PLACEHOLDER_EXAMPLES))
  const [areaPlaceholder] = useState(() => pickRandom(AREA_PLACEHOLDER_EXAMPLES))

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[220px]">
            {edu.institution || 'Nueva formación'}
          </span>
        </div>
        <button
          onClick={() => onRemove(edu.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Institución"
          value={edu.institution}
          onChange={v => onUpdate(edu.id, 'institution', v)}
          onBlur={() => markTouched('institution')}
          error={shownError('institution')}
          placeholder="Nombre de la institución"
          className="sm:col-span-2"
        />
        <Combobox
          label="Grado / Título / Certificación"
          value={edu.degree}
          onChange={v => onUpdate(edu.id, 'degree', v)}
          onBlur={() => markTouched('degree')}
          error={shownError('degree')}
          suggestions={DEGREES}
          placeholder={degreePlaceholder}
          className="sm:col-span-2"
        />
        <Field
          label="Área de estudio"
          value={edu.area}
          onChange={v => onUpdate(edu.id, 'area', v)}
          placeholder={areaPlaceholder}
          className="sm:col-span-2"
        />
        <Field
          label="Inicio (AAAA-MM)"
          value={edu.startDate}
          onChange={v => onUpdate(edu.id, 'startDate', v)}
          onBlur={() => markTouched('startDate')}
          error={shownError('startDate')}
          placeholder="2016-09"
        />
        <Field
          label="Fin (AAAA-MM)"
          value={edu.endDate}
          onChange={v => onUpdate(edu.id, 'endDate', v)}
          onBlur={() => markTouched('endDate')}
          error={shownError('endDate')}
          placeholder="2020-06"
        />
        <Field
          label="Nota media (opcional)"
          value={edu.gpa}
          onChange={v => onUpdate(edu.id, 'gpa', v)}
          placeholder="8.5 / 10"
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectCard({
  project, index, onUpdate, onRemove,
}: {
  project: Project
  index: number
  onUpdate: (id: string, field: keyof Project, value: Project[keyof Project]) => void
  onRemove: (id: string) => void
}) {
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [improvingIdx, setImprovingIdx] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const updateHighlight = (i: number, val: string) => {
    const h = [...project.highlights]
    h[i] = val
    onUpdate(project.id, 'highlights', h)
  }

  const handleSuggestHighlights = async () => {
    if (!project.name.trim()) return
    setIsSuggesting(true)
    setAiError(null)
    try {
      const { suggestHighlights } = await import('../../../utils/gemini')
      const existing = project.highlights.filter(h => h.trim())
      const { highlights } = await suggestHighlights(project.name, 'Proyecto Personal', existing)
      const current = project.highlights.filter(h => h.trim())
      onUpdate(project.id, 'highlights', [...current, ...highlights])
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al sugerir logros. Inténtalo de nuevo.')
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleImproveHighlight = async (i: number) => {
    if (!project.highlights[i]?.trim()) return
    setImprovingIdx(i)
    setAiError(null)
    try {
      const { improveHighlight } = await import('../../../utils/gemini')
      const { result } = await improveHighlight(project.highlights[i], project.name)
      updateHighlight(i, result)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al mejorar el logro. Inténtalo de nuevo.')
    } finally {
      setImprovingIdx(null)
    }
  }

  const canSuggest = project.name.trim().length > 0

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-xs font-bold text-white flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[220px]">
            {project.name || 'Nuevo proyecto'}
          </span>
        </div>
        <button
          onClick={() => onRemove(project.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nombre del proyecto"
          value={project.name}
          onChange={v => onUpdate(project.id, 'name', v)}
          placeholder="Mi App / Proyecto Genial"
          className="sm:col-span-2"
        />
        <Field
          label="URL / Repositorio (opcional)"
          value={project.url}
          onChange={v => onUpdate(project.id, 'url', v)}
          placeholder="https://github.com/usuario/proyecto"
        />
        <Field
          label="Año / Fecha (opcional)"
          value={project.date}
          onChange={v => onUpdate(project.id, 'date', v)}
          placeholder="2024 / 2024-06"
        />
      </div>

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Descripción y logros
          </label>
          {canSuggest && (
            <button
              type="button"
              onClick={handleSuggestHighlights}
              disabled={isSuggesting}
              className="
                group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold
                bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                hover:from-violet-500 hover:to-indigo-500
                active:scale-95 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isSuggesting
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Sparkles className="w-3 h-3" />
              }
              {isSuggesting ? 'Generando…' : 'Sugerir con IA'}
            </button>
          )}
        </div>

        {aiError && (
          <div className="mb-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {aiError}
          </div>
        )}

        <div className="space-y-2">
          {project.highlights.map((h, i) => {
            const isImprovingThis = improvingIdx === i
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 h-4 flex-shrink-0" />
                <input
                  value={h}
                  onChange={e => updateHighlight(i, e.target.value)}
                  placeholder="Desarrollé una plataforma web con React y Node.js..."
                  disabled={isImprovingThis}
                  className="
                    flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100
                    placeholder-zinc-300 dark:placeholder-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none
                    disabled:opacity-60 transition-all duration-200
                  "
                />
                {h.trim().length > 5 && (
                  <button
                    type="button"
                    onClick={() => handleImproveHighlight(i)}
                    disabled={isImprovingThis || improvingIdx !== null}
                    title="Mejorar con IA"
                    className="text-violet-400 hover:text-violet-600 disabled:opacity-40 transition-colors p-1 flex-shrink-0"
                  >
                    {isImprovingThis
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Sparkles className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
                <button
                  onClick={() => onUpdate(project.id, 'highlights', project.highlights.filter((_, idx) => idx !== i))}
                  className="text-zinc-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => onUpdate(project.id, 'highlights', [...project.highlights, ''])}
          className="mt-3 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors"
        >
          + Añadir descripción
        </button>
      </div>
    </div>
  )
}

// ─── Certifications ───────────────────────────────────────────────────────────

function CertificationCard({
  cert, index, onUpdate, onRemove,
}: {
  cert: Certification
  index: number
  onUpdate: (id: string, field: keyof Certification, value: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-500 text-xs font-bold text-white flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[220px]">
            {cert.name || 'Nueva certificación'}
          </span>
        </div>
        <button
          onClick={() => onRemove(cert.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Nombre de la certificación"
          value={cert.name}
          onChange={v => onUpdate(cert.id, 'name', v)}
          placeholder="AWS Certified Solutions Architect"
          className="sm:col-span-2"
        />
        <Field
          label="Institución / Emisor"
          value={cert.institution}
          onChange={v => onUpdate(cert.id, 'institution', v)}
          placeholder="Amazon Web Services / Coursera"
        />
        <Field
          label="Fecha (AAAA-MM)"
          value={cert.date}
          onChange={v => onUpdate(cert.id, 'date', v)}
          placeholder="2023-08"
        />
        <Field
          label="URL / Credencial (opcional)"
          value={cert.url}
          onChange={v => onUpdate(cert.id, 'url', v)}
          placeholder="https://www.credly.com/badges/..."
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}

// ─── Volunteer ────────────────────────────────────────────────────────────────

function VolunteerCard({
  vol, index, onUpdate, onRemove,
}: {
  vol: VolunteerEntry
  index: number
  onUpdate: (id: string, field: keyof VolunteerEntry, value: VolunteerEntry[keyof VolunteerEntry]) => void
  onRemove: (id: string) => void
}) {
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [improvingIdx, setImprovingIdx] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const updateHighlight = (i: number, val: string) => {
    const h = [...vol.highlights]
    h[i] = val
    onUpdate(vol.id, 'highlights', h)
  }

  const handleSuggestHighlights = async () => {
    if (!vol.position.trim() && !vol.organization.trim()) return
    setIsSuggesting(true)
    setAiError(null)
    try {
      const { suggestHighlights } = await import('../../../utils/gemini')
      const existing = vol.highlights.filter(h => h.trim())
      const { highlights } = await suggestHighlights(vol.position || 'Voluntario/a', vol.organization || 'Voluntariado', existing)
      const current = vol.highlights.filter(h => h.trim())
      onUpdate(vol.id, 'highlights', [...current, ...highlights])
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al sugerir logros. Inténtalo de nuevo.')
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleImproveHighlight = async (i: number) => {
    if (!vol.highlights[i]?.trim()) return
    setImprovingIdx(i)
    setAiError(null)
    try {
      const { improveHighlight } = await import('../../../utils/gemini')
      const { result } = await improveHighlight(vol.highlights[i], vol.position || 'Voluntario/a')
      updateHighlight(i, result)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al mejorar el logro. Inténtalo de nuevo.')
    } finally {
      setImprovingIdx(null)
    }
  }

  const canSuggest = vol.position.trim().length > 0 || vol.organization.trim().length > 0

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-xs font-bold text-white flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[220px]">
            {vol.organization || 'Nueva organización'}
          </span>
        </div>
        <button
          onClick={() => onRemove(vol.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Organización"
          value={vol.organization}
          onChange={v => onUpdate(vol.id, 'organization', v)}
          placeholder="Cruz Roja / ONG Local"
          className="sm:col-span-2"
        />
        <Field
          label="Rol / Cargo"
          value={vol.position}
          onChange={v => onUpdate(vol.id, 'position', v)}
          placeholder="Coordinador de eventos"
          className="sm:col-span-2"
        />
        <Field
          label="Inicio (AAAA-MM)"
          value={vol.startDate}
          onChange={v => onUpdate(vol.id, 'startDate', v)}
          placeholder="2022-01"
        />
        <div>
          <Field
            label="Fin (AAAA-MM)"
            value={vol.endDate}
            onChange={v => onUpdate(vol.id, 'endDate', v)}
            placeholder="2023-06"
            disabled={vol.current}
          />
          <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vol.current}
              onChange={e => onUpdate(vol.id, 'current', e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Actualmente activo</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Actividades (opcional)
          </label>
          {canSuggest && (
            <button
              type="button"
              onClick={handleSuggestHighlights}
              disabled={isSuggesting}
              className="
                group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold
                bg-gradient-to-r from-violet-600 to-indigo-600 text-white
                hover:from-violet-500 hover:to-indigo-500
                active:scale-95 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isSuggesting
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Sparkles className="w-3 h-3" />
              }
              {isSuggesting ? 'Generando…' : 'Sugerir con IA'}
            </button>
          )}
        </div>

        {aiError && (
          <div className="mb-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {aiError}
          </div>
        )}

        <div className="space-y-2">
          {vol.highlights.map((h, i) => {
            const isImprovingThis = improvingIdx === i
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 h-4 flex-shrink-0" />
                <input
                  value={h}
                  onChange={e => updateHighlight(i, e.target.value)}
                  placeholder="Organicé campañas de recolección para 500+ familias..."
                  disabled={isImprovingThis}
                  className="
                    flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100
                    placeholder-zinc-300 dark:placeholder-zinc-600 focus:border-zinc-900 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none
                    disabled:opacity-60 transition-all duration-200
                  "
                />
                {h.trim().length > 5 && (
                  <button
                    type="button"
                    onClick={() => handleImproveHighlight(i)}
                    disabled={isImprovingThis || improvingIdx !== null}
                    title="Mejorar con IA"
                    className="text-violet-400 hover:text-violet-600 disabled:opacity-40 transition-colors p-1 flex-shrink-0"
                  >
                    {isImprovingThis
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Sparkles className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
                <button
                  onClick={() => onUpdate(vol.id, 'highlights', vol.highlights.filter((_, idx) => idx !== i))}
                  className="text-zinc-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => onUpdate(vol.id, 'highlights', [...vol.highlights, ''])}
          className="mt-3 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors"
        >
          + Añadir actividad
        </button>
      </div>
    </div>
  )
}

// ─── Publications ─────────────────────────────────────────────────────────────

function PublicationCard({
  pub, index, onUpdate, onRemove,
}: {
  pub: PublicationEntry
  index: number
  onUpdate: (id: string, field: keyof PublicationEntry, value: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-purple-600 text-xs font-bold text-white flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[220px]">
            {pub.title || 'Nueva publicación'}
          </span>
        </div>
        <button
          onClick={() => onRemove(pub.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Título de la publicación"
          value={pub.title}
          onChange={v => onUpdate(pub.id, 'title', v)}
          placeholder="Deep Learning aplicado a..."
          className="sm:col-span-2"
        />
        <Field
          label="Autores"
          value={pub.authors}
          onChange={v => onUpdate(pub.id, 'authors', v)}
          placeholder="Flores, B.; García, A."
          className="sm:col-span-2"
        />
        <Field
          label="Revista / Conferencia"
          value={pub.journal}
          onChange={v => onUpdate(pub.id, 'journal', v)}
          placeholder="IEEE Transactions / NeurIPS"
        />
        <Field
          label="Año / Fecha"
          value={pub.date}
          onChange={v => onUpdate(pub.id, 'date', v)}
          placeholder="2023"
        />
        <Field
          label="URL / DOI (opcional)"
          value={pub.url}
          onChange={v => onUpdate(pub.id, 'url', v)}
          placeholder="https://doi.org/..."
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}

// ─── Validation helpers ────────────────────────────────────────────────────────

interface ExperienceEntryErrorsResult {
  position: string | null
  company: string | null
  startDate: string | null
  endDate: string | null
}

interface EducationEntryErrorsResult {
  institution: string | null
  degree: string | null
  startDate: string | null
  endDate: string | null
}

type Tab = 'experience' | 'education' | 'projects' | 'certifications' | 'volunteer' | 'publications'

function validateExperienceEntry(exp: Experience): ExperienceEntryErrorsResult {
  const dates = validateExperienceDates(exp.startDate, exp.endDate, exp.current)
  return {
    position: validateRequired(exp.position, 'El cargo'),
    company: validateRequired(exp.company, 'La empresa'),
    startDate: dates.startDate,
    endDate: dates.endDate,
  }
}

function validateEducationEntry(edu: Education): EducationEntryErrorsResult {
  const dates = validateEducationDates(edu.startDate, edu.endDate)
  return {
    institution: validateRequired(edu.institution, 'La institución'),
    degree: validateRequired(edu.degree, 'El grado / título'),
    startDate: dates.startDate,
    endDate: dates.endDate,
  }
}

const hasAnyError = (errors: object) => Object.values(errors).some(Boolean)

// ─── Main component ────────────────────────────────────────────────────────────

export default function Step3Experience({ data, setData, onNext, onPrev, serverErrors = {}, onClearServerError }: Props) {
  const [tab, setTab] = useState<Tab>('experience')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const tabPillRef = useRef<HTMLDivElement>(null)
  const pillPositioned = useRef(false)

  const jobTitles = JOB_TITLES

  // Experience
  const addExp = () => {
    const e: Experience = {
      id: genId(), company: '', position: '', startDate: '', endDate: '',
      current: false, location: '', highlights: [''],
    }
    setData({ ...data, experience: [...data.experience, e] })
  }
  const updateExp = (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
    // Find the index of the entry being updated to build the server-error key (e.g. "experience.0.position")
    const idx = data.experience.findIndex(e => e.id === id)
    if (idx !== -1) onClearServerError?.(`experience.${idx}.${String(field)}`)
    setData({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }
  const removeExp = (id: string) =>
    setData({ ...data, experience: data.experience.filter(e => e.id !== id) })

  // Education
  const addEdu = () => {
    const e: Education = { id: genId(), institution: '', degree: '', area: '', startDate: '', endDate: '', gpa: '' }
    setData({ ...data, education: [...data.education, e] })
  }
  const updateEdu = (id: string, field: keyof Education, value: string) => {
    const idx = data.education.findIndex(e => e.id === id)
    if (idx !== -1) onClearServerError?.(`education.${idx}.${String(field)}`)
    setData({ ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }
  const removeEdu = (id: string) =>
    setData({ ...data, education: data.education.filter(e => e.id !== id) })

  // Projects
  const addProject = () => {
    const p: Project = { id: genId(), name: '', url: '', date: '', highlights: [''] }
    setData({ ...data, projects: [...(data.projects ?? []), p] })
  }
  const updateProject = (id: string, field: keyof Project, value: Project[keyof Project]) => {
    const idx = (data.projects ?? []).findIndex(p => p.id === id)
    if (idx !== -1) onClearServerError?.(`projects.${idx}.${String(field)}`)
    setData({ ...data, projects: (data.projects ?? []).map(p => p.id === id ? { ...p, [field]: value } : p) })
  }
  const removeProject = (id: string) =>
    setData({ ...data, projects: (data.projects ?? []).filter(p => p.id !== id) })

  // Certifications
  const addCert = () => {
    const c: Certification = { id: genId(), name: '', institution: '', date: '', url: '' }
    setData({ ...data, certifications: [...(data.certifications ?? []), c] })
  }
  const updateCert = (id: string, field: keyof Certification, value: string) => {
    const idx = (data.certifications ?? []).findIndex(c => c.id === id)
    if (idx !== -1) onClearServerError?.(`certifications.${idx}.${String(field)}`)
    setData({ ...data, certifications: (data.certifications ?? []).map(c => c.id === id ? { ...c, [field]: value } : c) })
  }
  const removeCert = (id: string) =>
    setData({ ...data, certifications: (data.certifications ?? []).filter(c => c.id !== id) })

  // Volunteer
  const addVol = () => {
    const v: VolunteerEntry = { id: genId(), organization: '', position: '', startDate: '', endDate: '', current: false, highlights: [] }
    setData({ ...data, volunteer: [...(data.volunteer ?? []), v] })
  }
  const updateVol = (id: string, field: keyof VolunteerEntry, value: VolunteerEntry[keyof VolunteerEntry]) =>
    setData({ ...data, volunteer: (data.volunteer ?? []).map(v => v.id === id ? { ...v, [field]: value } : v) })
  const removeVol = (id: string) =>
    setData({ ...data, volunteer: (data.volunteer ?? []).filter(v => v.id !== id) })

  // Publications
  const addPub = () => {
    const p: PublicationEntry = { id: genId(), title: '', authors: '', date: '', journal: '', url: '' }
    setData({ ...data, publications: [...(data.publications ?? []), p] })
  }
  const updatePub = (id: string, field: keyof PublicationEntry, value: string) =>
    setData({ ...data, publications: (data.publications ?? []).map(p => p.id === id ? { ...p, [field]: value } : p) })
  const removePub = (id: string) =>
    setData({ ...data, publications: (data.publications ?? []).filter(p => p.id !== id) })

  const experienceErrors = useMemo(
    () => data.experience.map(validateExperienceEntry),
    [data.experience]
  )
  const educationErrors = useMemo(
    () => data.education.map(validateEducationEntry),
    [data.education]
  )

  const experienceHasErrors = experienceErrors.some(hasAnyError)
  const educationHasErrors = educationErrors.some(hasAnyError)

  const handleNext = () => {
    if (experienceHasErrors || educationHasErrors) {
      setSubmitAttempted(true)
      setTab(experienceHasErrors ? 'experience' : 'education')
      return
    }
    onNext()
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number; hasErrors: boolean }[] = [
    {
      id: 'experience',
      label: 'Experiencia',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38" /></svg>,
      count: data.experience.length,
      hasErrors: submitAttempted && experienceHasErrors,
    },
    {
      id: 'education',
      label: 'Educación',
      icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>,
      count: data.education.length,
      hasErrors: submitAttempted && educationHasErrors,
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      count: (data.projects ?? []).length,
      hasErrors: false,
    },
    {
      id: 'certifications',
      label: 'Certificaciones',
      icon: <Award className="w-3.5 h-3.5" />,
      count: (data.certifications ?? []).length,
      hasErrors: false,
    },
    {
      id: 'volunteer',
      label: 'Voluntariado',
      icon: <Heart className="w-3.5 h-3.5" />,
      count: (data.volunteer ?? []).length,
      hasErrors: false,
    },
    {
      id: 'publications',
      label: 'Publicaciones',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      count: (data.publications ?? []).length,
      hasErrors: false,
    },
  ]

  useGSAP(() => {
    const activeEl = tabButtonRefs.current[tab]
    const containerEl = tabListRef.current
    if (!activeEl || !containerEl || !tabPillRef.current) return
    const containerRect = containerEl.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()
    const props = { x: activeRect.left - containerRect.left, width: activeRect.width }
    if (!pillPositioned.current) {
      gsap.set(tabPillRef.current, props)
      pillPositioned.current = true
    } else {
      gsap.to(tabPillRef.current, { ...props, duration: 0.3, ease: 'power2.out' })
    }
  }, [tab])

  return (
    <div>
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Experiencia & Más</h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-5 ml-11">
          Agrega todo lo relevante: experiencia, estudios, proyectos, certificaciones y más.
        </p>
      </div>

      {/* Tab switcher — scrollable on mobile */}
      <div className="px-8 mb-5">
        <div ref={tabListRef} className="relative flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto">
          <div
            ref={tabPillRef}
            className="absolute top-1 left-0 h-[calc(100%-8px)] bg-white dark:bg-zinc-700 rounded-lg shadow-sm z-0"
            style={{ width: 0 }}
          />
          {tabs.map(t => (
            <button
              key={t.id}
              ref={el => { tabButtonRefs.current[t.id] = el }}
              onClick={() => setTab(t.id)}
              className={`
                relative z-10 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap
                transition-colors duration-200 flex-shrink-0
                ${tab === t.id
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }
              `}
            >
              {t.icon}
              {t.label}
              {t.hasErrors ? (
                <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold bg-red-500 text-white">!</span>
              ) : t.count > 0 ? (
                <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${tab === t.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-2 space-y-4">
        {/* Experience tab */}
        {tab === 'experience' && (
          <>
            {data.experience.length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-sm">
                <svg className="w-10 h-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38" />
                </svg>
                Añade tu primera experiencia laboral
              </div>
            )}
            {data.experience.map((exp, i) => (
              <AnimatedListItem key={exp.id}>
                <ExperienceCard
                  exp={exp}
                  index={i}
                  onUpdate={updateExp}
                  onRemove={removeExp}
                  jobTitles={jobTitles}
                  errors={experienceErrors[i]}
                  forceShowErrors={submitAttempted}
                />
              </AnimatedListItem>
            ))}
            <button
              onClick={addExp}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm font-semibold hover:border-zinc-900 dark:hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar experiencia laboral
            </button>
          </>
        )}

        {/* Education tab */}
        {tab === 'education' && (
          <>
            {data.education.length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-sm">
                <svg className="w-10 h-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
                Añade tu primera formación académica
              </div>
            )}
            {data.education.map((edu, i) => (
              <AnimatedListItem key={edu.id}>
                <EducationCard
                  edu={edu}
                  index={i}
                  onUpdate={updateEdu}
                  onRemove={removeEdu}
                  errors={educationErrors[i]}
                  forceShowErrors={submitAttempted}
                />
              </AnimatedListItem>
            ))}
            <button
              onClick={addEdu}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm font-semibold hover:border-zinc-900 dark:hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar formación académica
            </button>
          </>
        )}

        {/* Projects tab */}
        {tab === 'projects' && (
          <>
            {(data.projects ?? []).length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-sm">
                <ExternalLink className="w-10 h-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" />
                <p className="font-medium">Añade tus proyectos personales o profesionales</p>
                <p className="text-xs mt-1 text-zinc-400">Apps, sitios web, herramientas, investigaciones...</p>
              </div>
            )}
            {(data.projects ?? []).map((project, i) => (
              <AnimatedListItem key={project.id}>
                <ProjectCard
                  project={project}
                  index={i}
                  onUpdate={updateProject}
                  onRemove={removeProject}
                />
              </AnimatedListItem>
            ))}
            <button
              onClick={addProject}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar proyecto
            </button>
          </>
        )}

        {/* Certifications tab */}
        {tab === 'certifications' && (
          <>
            {(data.certifications ?? []).length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-sm">
                <Award className="w-10 h-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" />
                <p className="font-medium">Agrega tus certificaciones y cursos</p>
                <p className="text-xs mt-1 text-zinc-400">AWS, Google, Coursera, Udemy, postgrados...</p>
              </div>
            )}
            {(data.certifications ?? []).map((cert, i) => (
              <AnimatedListItem key={cert.id}>
                <CertificationCard
                  cert={cert}
                  index={i}
                  onUpdate={updateCert}
                  onRemove={removeCert}
                />
              </AnimatedListItem>
            ))}
            <button
              onClick={addCert}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm font-semibold hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar certificación o postgrado
            </button>
          </>
        )}

        {/* Volunteer tab */}
        {tab === 'volunteer' && (
          <>
            {(data.volunteer ?? []).length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-sm">
                <Heart className="w-10 h-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" />
                <p className="font-medium">Añade experiencias de voluntariado</p>
                <p className="text-xs mt-1 text-zinc-400">ONGs, comunidades, actividades sin fines de lucro...</p>
              </div>
            )}
            {(data.volunteer ?? []).map((vol, i) => (
              <AnimatedListItem key={vol.id}>
                <VolunteerCard
                  vol={vol}
                  index={i}
                  onUpdate={updateVol}
                  onRemove={removeVol}
                />
              </AnimatedListItem>
            ))}
            <button
              onClick={addVol}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar voluntariado
            </button>
          </>
        )}

        {/* Publications tab */}
        {tab === 'publications' && (
          <>
            {(data.publications ?? []).length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-sm">
                <BookOpen className="w-10 h-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" />
                <p className="font-medium">Añade publicaciones académicas o artículos</p>
                <p className="text-xs mt-1 text-zinc-400">Papers, artículos de blog técnico, libros...</p>
              </div>
            )}
            {(data.publications ?? []).map((pub, i) => (
              <AnimatedListItem key={pub.id}>
                <PublicationCard
                  pub={pub}
                  index={i}
                  onUpdate={updatePub}
                  onRemove={removePub}
                />
              </AnimatedListItem>
            ))}
            <button
              onClick={addPub}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm font-semibold hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 active:scale-[0.99] transition-all duration-200"
            >
              + Agregar publicación
            </button>
          </>
        )}
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  )
}
