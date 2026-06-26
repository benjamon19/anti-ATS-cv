interface Props {
  currentStep: number
  steps: string[]
}

export default function StepIndicator({ currentStep, steps }: Props) {
  return (
    <nav aria-label="Progreso">
      <ol className="flex items-start justify-between">
        {steps.map((label, i) => {
          const completed = i < currentStep
          const active = i === currentStep

          return (
            <li key={label} className="flex-1 flex items-start">
              <div className="flex flex-col items-center gap-2 w-full">
                {/* Track line + circle row */}
                <div className="flex items-center w-full">
                  {/* Left connector */}
                  {i > 0 ? (
                    <div
                      className={`flex-1 h-0.5 transition-colors duration-500 ${
                        completed ? 'bg-indigo-500' : 'bg-slate-200'
                      }`}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}

                  {/* Circle */}
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                      transition-all duration-300 ring-2 ring-offset-2 flex-shrink-0
                      ${active
                        ? 'bg-indigo-600 text-white ring-indigo-600 scale-110'
                        : completed
                        ? 'bg-indigo-600 text-white ring-indigo-500'
                        : 'bg-white text-slate-400 ring-slate-200'
                      }
                    `}
                  >
                    {completed ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>

                  {/* Right connector */}
                  {i < steps.length - 1 ? (
                    <div
                      className={`flex-1 h-0.5 transition-colors duration-500 ${
                        completed ? 'bg-indigo-500' : 'bg-slate-200'
                      }`}
                    />
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-xs font-medium text-center leading-tight max-w-[72px]
                    transition-colors duration-300
                    ${active ? 'text-indigo-700 font-semibold' : completed ? 'text-indigo-500' : 'text-slate-400'}
                  `}
                >
                  {label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
