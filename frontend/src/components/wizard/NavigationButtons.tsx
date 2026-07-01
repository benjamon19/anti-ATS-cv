import { useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  onPrev?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
}

export default function NavigationButtons({
  onPrev,
  onNext,
  nextLabel = 'Siguiente',
  nextDisabled = false,
}: Props) {
  const prevArrowRef = useRef<SVGSVGElement>(null)
  const nextArrowRef = useRef<SVGSVGElement>(null)

  const press = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.12, ease: 'power2.out' })
  }
  const release = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.18, ease: 'power2.out' })
  }
  const nudge = (ref: React.RefObject<SVGSVGElement>, dir: -1 | 1) => () => {
    gsap.to(ref.current, { x: dir * 3, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 })
  }

  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-zinc-100 mt-2">
      <button
        onClick={onPrev}
        disabled={!onPrev}
        onMouseDown={press}
        onMouseUp={release}
        onMouseLeave={release}
        onMouseEnter={nudge(prevArrowRef, -1)}
        className="
          inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
          text-zinc-600 bg-zinc-100 hover:bg-zinc-200
          disabled:opacity-0 disabled:pointer-events-none
          transition-colors duration-200
        "
      >
        <svg ref={prevArrowRef} className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Atrás
      </button>

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          onMouseDown={press}
          onMouseUp={release}
          onMouseLeave={release}
          onMouseEnter={nudge(nextArrowRef, 1)}
          className="
            inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold
            text-white bg-zinc-900 hover:bg-zinc-700
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          {nextLabel}
          <svg ref={nextArrowRef} className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  )
}
