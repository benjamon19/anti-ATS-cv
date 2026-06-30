export interface Country {
  name: string
  iso2: string
  dialCode: string
}

// Chile primero (mercado principal), luego Hispanoamérica y España, luego el resto del mundo.
// Para añadir un país nuevo solo hace falta una línea aquí — el resto (banderas, búsqueda,
// orden) se calcula automáticamente.
export const COUNTRIES: Country[] = [
  { name: 'Chile', iso2: 'CL', dialCode: '56' },
  { name: 'Argentina', iso2: 'AR', dialCode: '54' },
  { name: 'Bolivia', iso2: 'BO', dialCode: '591' },
  { name: 'Brasil', iso2: 'BR', dialCode: '55' },
  { name: 'Colombia', iso2: 'CO', dialCode: '57' },
  { name: 'Costa Rica', iso2: 'CR', dialCode: '506' },
  { name: 'Cuba', iso2: 'CU', dialCode: '53' },
  { name: 'Ecuador', iso2: 'EC', dialCode: '593' },
  { name: 'El Salvador', iso2: 'SV', dialCode: '503' },
  { name: 'España', iso2: 'ES', dialCode: '34' },
  { name: 'Estados Unidos', iso2: 'US', dialCode: '1' },
  { name: 'Guatemala', iso2: 'GT', dialCode: '502' },
  { name: 'Honduras', iso2: 'HN', dialCode: '504' },
  { name: 'México', iso2: 'MX', dialCode: '52' },
  { name: 'Nicaragua', iso2: 'NI', dialCode: '505' },
  { name: 'Panamá', iso2: 'PA', dialCode: '507' },
  { name: 'Paraguay', iso2: 'PY', dialCode: '595' },
  { name: 'Perú', iso2: 'PE', dialCode: '51' },
  { name: 'Puerto Rico', iso2: 'PR', dialCode: '1' },
  { name: 'República Dominicana', iso2: 'DO', dialCode: '1' },
  { name: 'Uruguay', iso2: 'UY', dialCode: '598' },
  { name: 'Venezuela', iso2: 'VE', dialCode: '58' },
  // Resto del mundo
  { name: 'Alemania', iso2: 'DE', dialCode: '49' },
  { name: 'Andorra', iso2: 'AD', dialCode: '376' },
  { name: 'Australia', iso2: 'AU', dialCode: '61' },
  { name: 'Austria', iso2: 'AT', dialCode: '43' },
  { name: 'Bélgica', iso2: 'BE', dialCode: '32' },
  { name: 'Canadá', iso2: 'CA', dialCode: '1' },
  { name: 'China', iso2: 'CN', dialCode: '86' },
  { name: 'Corea del Sur', iso2: 'KR', dialCode: '82' },
  { name: 'Dinamarca', iso2: 'DK', dialCode: '45' },
  { name: 'Emiratos Árabes Unidos', iso2: 'AE', dialCode: '971' },
  { name: 'Finlandia', iso2: 'FI', dialCode: '358' },
  { name: 'Francia', iso2: 'FR', dialCode: '33' },
  { name: 'Grecia', iso2: 'GR', dialCode: '30' },
  { name: 'India', iso2: 'IN', dialCode: '91' },
  { name: 'Irlanda', iso2: 'IE', dialCode: '353' },
  { name: 'Israel', iso2: 'IL', dialCode: '972' },
  { name: 'Italia', iso2: 'IT', dialCode: '39' },
  { name: 'Japón', iso2: 'JP', dialCode: '81' },
  { name: 'Marruecos', iso2: 'MA', dialCode: '212' },
  { name: 'Noruega', iso2: 'NO', dialCode: '47' },
  { name: 'Nueva Zelanda', iso2: 'NZ', dialCode: '64' },
  { name: 'Países Bajos', iso2: 'NL', dialCode: '31' },
  { name: 'Polonia', iso2: 'PL', dialCode: '48' },
  { name: 'Portugal', iso2: 'PT', dialCode: '351' },
  { name: 'Reino Unido', iso2: 'GB', dialCode: '44' },
  { name: 'Rusia', iso2: 'RU', dialCode: '7' },
  { name: 'Sudáfrica', iso2: 'ZA', dialCode: '27' },
  { name: 'Suecia', iso2: 'SE', dialCode: '46' },
  { name: 'Suiza', iso2: 'CH', dialCode: '41' },
  { name: 'Turquía', iso2: 'TR', dialCode: '90' },
]

export interface ChileRegion {
  name: string
  communes: string[]
}

// Las 16 regiones de Chile con sus principales comunas. Seleccionar la región
// primero acota el listado de comunas — evita tener que buscar entre cientos
// de comunas del país completo. Añadir una comuna que falte es una línea.
export const CHILE_REGIONS: ChileRegion[] = [
  { name: 'Arica y Parinacota', communes: ['Arica', 'Putre', 'General Lagos'] },
  { name: 'Tarapacá', communes: ['Iquique', 'Alto Hospicio', 'Pozo Almonte'] },
  { name: 'Antofagasta', communes: ['Antofagasta', 'Calama', 'Tocopilla', 'San Pedro de Atacama', 'Mejillones'] },
  { name: 'Atacama', communes: ['Copiapó', 'Vallenar', 'Caldera', 'Chañaral'] },
  { name: 'Coquimbo', communes: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña'] },
  { name: 'Valparaíso', communes: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Los Andes', 'San Felipe', 'Quillota', 'Concón', 'Casablanca'] },
  { name: 'Metropolitana de Santiago', communes: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 'San Bernardo', 'Vitacura', 'La Reina', 'Peñalolén', 'Quilicura', 'Recoleta', 'Independencia', 'Macul', 'San Miguel'] },
  { name: "Libertador General Bernardo O'Higgins", communes: ['Rancagua', 'San Fernando', 'Rengo', 'Santa Cruz', 'Pichilemu'] },
  { name: 'Maule', communes: ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes'] },
  { name: 'Ñuble', communes: ['Chillán', 'Chillán Viejo', 'San Carlos'] },
  { name: 'Biobío', communes: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel', 'San Pedro de la Paz', 'Hualpén', 'Tomé', 'Lota'] },
  { name: 'La Araucanía', communes: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol', 'Pucón'] },
  { name: 'Los Ríos', communes: ['Valdivia', 'La Unión', 'Panguipulli'] },
  { name: 'Los Lagos', communes: ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud', 'Frutillar'] },
  { name: 'Aysén', communes: ['Coyhaique', 'Puerto Aysén', 'Chile Chico'] },
  { name: 'Magallanes y de la Antártica Chilena', communes: ['Punta Arenas', 'Puerto Natales', 'Porvenir'] },
]

// Ciudades sugeridas por país (atajo rápido). Si la ciudad no está listada,
// el usuario puede escribirla igual — no limita, solo acelera.
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  AR: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
  BO: ['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba'],
  BR: ['São Paulo', 'Río de Janeiro', 'Brasilia', 'Belo Horizonte'],
  CO: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
  CR: ['San José'],
  EC: ['Quito', 'Guayaquil', 'Cuenca'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza', 'Murcia', 'Palma de Mallorca', 'Las Palmas', 'Alicante'],
  US: ['Nueva York', 'San Francisco', 'Los Ángeles', 'Miami', 'Austin', 'Chicago', 'Seattle'],
  GT: ['Ciudad de Guatemala'],
  HN: ['Tegucigalpa', 'San Pedro Sula'],
  MX: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  NI: ['Managua'],
  PA: ['Ciudad de Panamá'],
  PY: ['Asunción'],
  PE: ['Lima', 'Arequipa', 'Trujillo'],
  DO: ['Santo Domingo'],
  UY: ['Montevideo'],
  VE: ['Caracas', 'Maracaibo', 'Valencia'],
  DE: ['Berlín', 'Múnich', 'Fráncfort', 'Hamburgo'],
  CA: ['Toronto', 'Vancouver', 'Montreal'],
  FR: ['París', 'Lyon', 'Marsella'],
  GB: ['Londres', 'Mánchester', 'Edimburgo'],
  IT: ['Roma', 'Milán', 'Turín'],
  PT: ['Lisboa', 'Oporto'],
  NL: ['Ámsterdam', 'Róterdam'],
}
