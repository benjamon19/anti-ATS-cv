import { Code2, Briefcase } from 'lucide-react'
import type { ProfileType } from '../types/cv'

interface Props {
  onSelect: (type: ProfileType) => void
}

export default function ProfileTypeIntro({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-2">
          ¿Para qué tipo de perfil es tu CV?
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Así te sugerimos cargos, habilidades y ejemplos más relevantes para tu rubro.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelect('developer')}
            className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-900 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-900 transition-colors duration-200">
              <Code2 className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <p className="font-semibold text-zinc-900 mb-1">Desarrollador / Tech</p>
            <p className="text-xs text-zinc-500">
              Software, datos, DevOps, QA, ciberseguridad...
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelect('other')}
            className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-900 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-900 transition-colors duration-200">
              <Briefcase className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <p className="font-semibold text-zinc-900 mb-1">Otro rubro</p>
            <p className="text-xs text-zinc-500">
              Diseño, marketing, ventas, negocio, RRHH...
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
