interface Props {
  iso2: string
  className?: string
}

// Windows no renderiza emojis de bandera (regional indicators) en ninguna
// fuente del sistema — se ven como las dos letras del código de país. Usamos
// imágenes reales servidas por flagcdn.com para que la bandera se vea igual
// en cualquier SO/navegador.
export default function FlagIcon({ iso2, className = '' }: Props) {
  const code = iso2.toLowerCase()
  return (
    <img
      src={`https://flagcdn.com/h40/${code}.png`}
      srcSet={`https://flagcdn.com/h80/${code}.png 2x`}
      alt=""
      width={20}
      height={14}
      className={`inline-block flex-shrink-0 rounded-[2px] object-cover ${className}`}
      loading="lazy"
    />
  )
}
