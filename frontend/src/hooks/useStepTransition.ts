import { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const DURATION = 0.38

/**
 * Reproduce el mismo comportamiento que <AnimatePresence mode="wait"> de framer-motion:
 * al cambiar `step`, primero anima la salida del contenido actual y recién después
 * monta/anima la entrada del nuevo paso (nunca se solapan).
 */
export function useStepTransition<T>(step: T, direction: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayedStep, setDisplayedStep] = useState(step)
  const prevStepRef = useRef(step)

  useLayoutEffect(() => {
    if (step === prevStepRef.current) return
    const el = containerRef.current
    const dir = direction

    if (!el) {
      prevStepRef.current = step
      setDisplayedStep(step)
      return
    }

    gsap.to(el, {
      x: dir > 0 ? '-60%' : '60%',
      opacity: 0,
      scale: 0.97,
      duration: DURATION,
      ease: EASE,
      onComplete: () => {
        prevStepRef.current = step
        setDisplayedStep(step)
      },
    })
  }, [step, direction])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    gsap.fromTo(
      el,
      { x: direction > 0 ? '60%' : '-60%', opacity: 0, scale: 0.97 },
      { x: 0, opacity: 1, scale: 1, duration: DURATION, ease: EASE }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedStep])

  return { containerRef, displayedStep }
}
