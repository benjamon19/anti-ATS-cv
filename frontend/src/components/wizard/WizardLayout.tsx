import type { ReactNode } from 'react'
import StepIndicator from './StepIndicator'

interface Props {
  step: number
  steps: string[]
  children: ReactNode
}

export default function WizardLayout({ step, steps, children }: Props) {
  const progress = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div className="min-h-screen bg-white">

      {/* Full-width progress bar — Antigravity style, pinned to very top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-zinc-100 z-50">
        <div
          className="h-full bg-zinc-900 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top nav */}
      <header className="sticky top-[3px] z-40 flex items-center justify-center px-6 sm:px-10 h-14 bg-white/95 backdrop-blur-sm border-b border-zinc-100">
        {/* Step label */}
        <p className="text-xs font-semibold text-zinc-400 tabular-nums">
          Paso {step + 1} de {steps.length} — {steps[step]}
        </p>
      </header>

      {/* Page content */}
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Step indicator */}
          <div className="mb-8">
            <StepIndicator currentStep={step} steps={steps} />
          </div>

          {/* Main card */}
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            {children}
          </div>

          {/* Privacy note */}
          <p className="mt-5 text-center text-xs text-zinc-400">
            Tus datos nunca se almacenan · Solo se usan para generar el documento
          </p>
        </div>
      </main>
    </div>
  )
}
