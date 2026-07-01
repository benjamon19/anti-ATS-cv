import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

interface Props {
  currentStep: number
  steps: string[]
}

export default function StepIndicator({ currentStep, steps }: Props) {
  const navRef = useRef<HTMLElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const beforeFillRefs = useRef<(HTMLDivElement | null)[]>([])
  const afterFillRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    steps.forEach((_, i) => {
      const completed = i < currentStep
      const target = completed ? 1 : 0
      const before = beforeFillRefs.current[i]
      const after = afterFillRefs.current[i]
      if (before) gsap.to(before, { scaleX: target, duration: 0.4, ease: 'power2.out' })
      if (after) gsap.to(after, { scaleX: target, duration: 0.4, ease: 'power2.out' })
    })

    const activeDot = dotRefs.current[currentStep]
    if (activeDot) {
      gsap.fromTo(activeDot, { scale: 0.7 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' })
    }
  }, { scope: navRef, dependencies: [currentStep, steps.length] })

  return (
    <nav ref={navRef} aria-label="Progreso" className="flex items-center justify-between">
      {steps.map((label, i) => {
        const completed = i < currentStep
        const active = i === currentStep

        return (
          <div key={label} className="flex-1 flex items-center">
            {/* Connector line before (except first) */}
            {i > 0 && (
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                <div
                  ref={el => { beforeFillRefs.current[i] = el }}
                  className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 origin-left"
                  style={{ transform: `scaleX(${completed ? 1 : 0})` }}
                />
              </div>
            )}

            {/* Dot + label */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                ref={el => { dotRefs.current[i] = el }}
                className={`
                  transition-colors duration-300 flex items-center justify-center
                  ${active
                    ? 'w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold ring-4 ring-zinc-900/10 dark:ring-white/10'
                    : completed
                    ? 'w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950'
                    : 'w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                  }
                `}
              >
                {completed ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : active ? (
                  <span>{i + 1}</span>
                ) : null}
              </div>

              <span
                className={`
                  text-[10px] font-medium text-center leading-tight max-w-[68px] transition-colors duration-300
                  ${active ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : completed ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-300 dark:text-zinc-700'}
                `}
              >
                {label}
              </span>
            </div>

            {/* Connector line after (except last) */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                <div
                  ref={el => { afterFillRefs.current[i] = el }}
                  className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 origin-left"
                  style={{ transform: `scaleX(${completed ? 1 : 0})` }}
                />
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
