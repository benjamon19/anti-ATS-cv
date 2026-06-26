import { motion } from 'framer-motion'
import {
  ArrowRight,
  FileText,
  Zap,
  ShieldCheck,
  Sparkles,
  LayoutTemplate,
  User,
  AlignLeft,
  Briefcase,
  Star,
  Palette,
  Check,
} from 'lucide-react'

interface Props {
  onStart: () => void
}

const STEPS = [
  { n: '01', icon: User, label: 'Datos\nPersonales' },
  { n: '02', icon: AlignLeft, label: 'Resumen\nProfesional' },
  { n: '03', icon: Briefcase, label: 'Experiencia\n& Educación' },
  { n: '04', icon: Star, label: 'Habilidades' },
  { n: '05', icon: Palette, label: 'Plantilla\n& Formato' },
]

const FEATURES = [
  {
    icon: LayoutTemplate,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    title: '4 plantillas premium',
    desc: 'Classic, Engineering, ModernCV y más. Diseños validados para pasar filtros ATS.',
  },
  {
    icon: Zap,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    title: 'Generación en segundos',
    desc: 'RenderCV produce un PDF tipográficamente perfecto en menos de 10 segundos.',
  },
  {
    icon: ShieldCheck,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    title: 'Cero almacenamiento',
    desc: 'Tus datos nunca salen de tu máquina. Sin cuentas, sin base de datos.',
  },
]

function CVMockup() {
  return (
    <div className="relative select-none">
      {/* Back shadow card */}
      <div className="absolute inset-0 bg-zinc-300/60 rounded-2xl translate-x-4 translate-y-4 blur-sm" />

      <div className="relative bg-white rounded-2xl border border-zinc-200/80 shadow-2xl shadow-zinc-300/30 overflow-hidden w-[260px]">
        {/* Colored header strip */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

        <div className="p-6">
          {/* Name block */}
          <div className="mb-5">
            <div className="h-3.5 bg-zinc-900 rounded-md w-[70%] mb-2" />
            <div className="flex gap-2 mb-1">
              <div className="h-2 bg-indigo-400/50 rounded w-20" />
              <div className="h-2 bg-zinc-200 rounded w-14" />
            </div>
            <div className="h-1.5 bg-zinc-200 rounded w-32 mt-1" />
          </div>

          <div className="h-px bg-zinc-100 mb-4" />

          {/* Experience section */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="h-2 bg-indigo-600 rounded w-2" />
              <div className="h-1.5 bg-zinc-800 rounded w-20" />
            </div>
            {[80, 60].map((w, i) => (
              <div key={i} className="pl-3 border-l-2 border-zinc-100 mb-3">
                <div className="h-2 bg-zinc-700 rounded mb-1" style={{ width: `${w}%` }} />
                <div className="h-1.5 bg-zinc-300 rounded mb-1.5 w-2/5" />
                <div className="space-y-1">
                  <div className="h-1 bg-zinc-100 rounded w-full" />
                  <div className="h-1 bg-zinc-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>

          {/* Skills section */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="h-2 bg-indigo-600 rounded w-2" />
              <div className="h-1.5 bg-zinc-800 rounded w-16" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[28, 36, 24, 40, 20].map((w, i) => (
                <div
                  key={i}
                  className="h-4 rounded bg-zinc-100 border border-zinc-200"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-300/40">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight">CV Inteligente</span>
          </div>

          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 active:scale-95 transition-all duration-200"
          >
            Empezar
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 w-full">

        {/* ── HERO ── */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center py-20 sm:py-28">

          {/* Left col — text */}
          <div className="lg:col-span-3">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700">Potenciado por RenderCV</span>
            </motion.div>

            <motion.h1
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-5xl sm:text-6xl font-extrabold text-zinc-900 leading-[1.05] tracking-tighter"
            >
              Crea un CV que{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-indigo-600">consiga</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-x-0 bottom-1 h-3 bg-indigo-100 rounded -z-0 origin-left"
                />
              </span>{' '}
              entrevistas.
            </motion.h1>

            <motion.p
              custom={0.25}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 text-lg text-zinc-500 leading-relaxed max-w-lg"
            >
              Completa 5 pasos simples, elige tu plantilla y descarga un currículum
              con tipografía y diseño de nivel profesional — en PDF o PNG.
            </motion.p>

            <motion.div
              custom={0.35}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-10 flex items-center gap-4 flex-wrap"
            >
              <button
                onClick={onStart}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-300/50"
              >
                Crear mi CV ahora
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>

            <motion.ul
              custom={0.45}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 flex items-center gap-5 flex-wrap"
            >
              {['Sin registro', '100% gratuito', 'PDF y PNG'].map(item => (
                <li key={item} className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <Check className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right col — mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 6 }}
            animate={{ opacity: 1, x: 0, rotate: 2 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-2 flex justify-center lg:justify-end"
          >
            <CVMockup />
          </motion.div>
        </section>

        {/* ── STEPS ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="pb-16 sm:pb-20"
        >
          <div className="border-t border-zinc-200 pt-12">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-10">
              Cómo funciona — 5 pasos
            </p>

            <div className="grid grid-cols-5 gap-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={s.n} className="flex flex-col items-start pr-4">
                    {/* Icon + line */}
                    <div className="flex items-center w-full mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-500 flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 mx-3 border-t-2 border-dashed border-zinc-200" />
                      )}
                    </div>
                    <span className="block text-[10px] font-bold text-indigo-500 tracking-widest mb-1">{s.n}</span>
                    <span className="block text-xs font-semibold text-zinc-600 whitespace-pre-line leading-snug">
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* ── FEATURES ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="pb-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 hover:shadow-md hover:shadow-zinc-100 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900 mb-1.5">{f.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* ── BOTTOM CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mb-20"
        >
          <div className="rounded-3xl bg-zinc-900 px-10 py-14 text-center relative overflow-hidden">
            {/* Subtle accent shape */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Tu próximo trabajo
                <br />
                empieza con el CV correcto.
              </h2>
              <p className="text-zinc-400 text-base mb-8 max-w-md mx-auto">
                Rellena tu información en menos de 10 minutos y obtén un currículum
                listo para enviar a cualquier empresa.
              </p>
              <button
                onClick={onStart}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-900/40"
              >
                Crear mi CV gratis
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-zinc-400">CV Inteligente</span>
          </div>
          <p className="text-xs text-zinc-400">
            Generado con RenderCV · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
