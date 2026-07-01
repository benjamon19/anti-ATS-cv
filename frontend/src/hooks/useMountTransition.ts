import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

const DURATION = 0.28

/**
 * Anima la entrada de un overlay (backdrop + panel) al montarse, y difiere el
 * desmontaje real hasta que termine la animación de salida — reemplaza el
 * exit animation que framer-motion daba "gratis" vía AnimatePresence.
 */
export function useMountTransition(onClose: () => void) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  useGSAP(() => {
    if (closing) return
    gsap.set(backdropRef.current, { opacity: 0 })
    gsap.set(panelRef.current, { opacity: 0, scale: 0.95, y: 12 })
    const tl = gsap.timeline()
    tl.to(backdropRef.current, { opacity: 1, duration: DURATION })
    tl.to(panelRef.current, { opacity: 1, scale: 1, y: 0, duration: DURATION, ease: 'power2.out' }, '<')
    return () => { tl.kill() }
  }, [closing])

  const requestClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { opacity: 0, scale: 0.95, y: 12, duration: DURATION, ease: 'power1.in' })
    tl.to(backdropRef.current, { opacity: 0, duration: DURATION }, '<')
  }, [closing, onClose])

  return { backdropRef, panelRef, requestClose }
}
