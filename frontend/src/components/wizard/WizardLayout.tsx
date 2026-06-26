import type { ReactNode } from 'react'
import StepIndicator from './StepIndicator'

interface Props {
  step: number
  steps: string[]
  children: ReactNode
}

export default function WizardLayout({ step, steps, children }: Props) {
  const progress = Math.round(((step) / (steps.length - 1)) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-widest">
              Generador de CV con IA
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            CV Inteligente
          </h1>
          <p className="mt-2 text-slate-500 text-base">
            Crea tu currículum profesional en minutos — impulsado por RenderCV
          </p>
        </header>

        {/* Progress bar */}
        <div className="mb-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stepper */}
        <StepIndicator currentStep={step} steps={steps} />

        {/* Main card */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {children}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Tus datos nunca se almacenan permanentemente — solo se usan para generar el documento.
        </p>
      </div>
    </div>
  )
}
