import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

const DURATION = 0.18

/**
 * Anima la aparición/desaparición de paneles flotantes (sugerencias de
 * Combobox, LocationInput, PhoneInput) y la rotación del chevron asociado.
 * `shouldRender` se mantiene en true durante la animación de salida para que
 * el panel no desaparezca instantáneamente al cerrar.
 */
export function useDropdownReveal(open: boolean) {
  const panelRef = useRef<HTMLDivElement>(null)
  const chevronRef = useRef<SVGSVGElement>(null)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) setShouldRender(true)
  }, [open])

  useGSAP(() => {
    if (!panelRef.current) return
    if (open) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: DURATION, ease: 'power2.out' }
      )
    } else {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: -6,
        duration: DURATION,
        ease: 'power1.in',
        onComplete: () => setShouldRender(false),
      })
    }
  }, [open, shouldRender])

  useGSAP(() => {
    if (!chevronRef.current) return
    gsap.to(chevronRef.current, { rotation: open ? 180 : 0, duration: DURATION, ease: 'power2.out' })
  }, [open])

  return { panelRef, chevronRef, shouldRender }
}
