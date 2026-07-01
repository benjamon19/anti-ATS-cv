import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

/**
 * Envuelve un item de lista (tarjeta de experiencia, educación, skill, etc.)
 * y anima su entrada la primera vez que se monta — cubre tanto la carga
 * inicial del tab como el agregado de un nuevo item.
 */
export default function AnimatedListItem({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(ref.current, { opacity: 0, y: 14, duration: 0.35, ease: 'power2.out' })
  }, { scope: ref })

  return <div ref={ref}>{children}</div>
}
