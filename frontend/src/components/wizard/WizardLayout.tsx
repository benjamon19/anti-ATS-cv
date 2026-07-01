import type { ReactNode } from 'react'
import { Sun, Moon } from 'lucide-react'
import StepIndicator from './StepIndicator'

interface Props {
  step: number
  steps: string[]
  children: ReactNode
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export default function WizardLayout({ step, steps, children, theme, onToggleTheme }: Props) {
  const progress = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-200">

      {/* Full-width progress bar — Antigravity style, pinned to very top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-zinc-100 dark:bg-zinc-900 z-50">
        <div
          className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top nav */}
      <header className="relative z-40 mt-[3px] flex items-center justify-between px-6 sm:px-10 h-14 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-200">
        <div className="w-10 sm:w-16" /> {/* spacer to balance toggle */}
        
        {/* Step label */}
        <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tabular-nums text-center">
          Paso {step + 1} de {steps.length} — {steps[step]}
        </p>

        {/* Theme Toggle Button */}
        <div className="flex justify-end w-10 sm:w-16">
          <button
            onClick={onToggleTheme}
            type="button"
            className="
              p-2 rounded-xl border border-zinc-200 dark:border-zinc-800
              bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400
              hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100
              transition-colors duration-150
            "
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="py-10 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Step indicator */}
          <div className="mb-8">
            <StepIndicator currentStep={step} steps={steps} />
          </div>

          {/* Main card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-850 shadow-sm overflow-hidden transition-colors duration-200">
            {children}
          </div>

          {/* Privacy note */}
          <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Tus datos nunca se almacenan · Solo se usan para generar el documento
          </p>
        </div>
      </main>
    </div>
  )
}
