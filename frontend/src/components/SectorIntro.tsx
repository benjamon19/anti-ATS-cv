import {
  Code2, Stethoscope, HardHat, Pickaxe, ChefHat,
  ShoppingBag, Briefcase, GraduationCap, Sparkles,
} from 'lucide-react'
import type { Sector } from '../types/cv'

interface Props {
  onSelect: (sector: Sector) => void
}

const SECTORS: { id: Sector; label: string; icon: typeof Code2 }[] = [
  { id: 'tecnologia', label: 'Tecnología', icon: Code2 },
  { id: 'salud', label: 'Salud', icon: Stethoscope },
  { id: 'construccion', label: 'Construcción', icon: HardHat },
  { id: 'mineria', label: 'Minería', icon: Pickaxe },
  { id: 'gastronomia', label: 'Gastronomía', icon: ChefHat },
  { id: 'retail', label: 'Retail y Ventas', icon: ShoppingBag },
  { id: 'administracion', label: 'Administración', icon: Briefcase },
  { id: 'educacion', label: 'Educación', icon: GraduationCap },
  { id: 'otro', label: 'Otro rubro', icon: Sparkles },
]

export default function SectorIntro({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          ¿A qué rubro pertenece tu trabajo?
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Así adaptamos el formulario a tu caso — por ejemplo, no te pediremos datos que no apliquen a tu rubro.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SECTORS.map(s => {
            const Icon = s.icon
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-900 hover:shadow-md transition-all duration-200 flex flex-col items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <p className="text-sm font-semibold text-zinc-900">{s.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
