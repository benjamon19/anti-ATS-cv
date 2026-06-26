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
  return (
    <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 mt-2">
      {/* Back */}
      <button
        onClick={onPrev}
        disabled={!onPrev}
        className="
          inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
          text-slate-600 bg-slate-100 hover:bg-slate-200
          disabled:opacity-0 disabled:pointer-events-none
          transition-all duration-200
        "
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Atrás
      </button>

      {/* Next */}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="
            inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
            text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all duration-200 shadow-md shadow-indigo-200/60
          "
        >
          {nextLabel}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  )
}
