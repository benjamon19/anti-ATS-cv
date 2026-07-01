// Mapea los errores 422 estructurados que devuelve el backend
// (`{ field: "personal.phone", message: "..." }`) a los inputs del wizard.
// Los `field` que manda el backend usan exactamente los mismos nombres que
// `CVData` (ver backend/main.py `_format_validation_errors`), así que el
// mapeo es un lookup directo por string.

export interface ServerFieldError {
  field: string
  message: string
}

export type ServerErrorMap = Record<string, string>

export function buildServerErrorMap(errors: ServerFieldError[]): ServerErrorMap {
  return Object.fromEntries(errors.map(e => [e.field, e.message]))
}

const STEP_PREFIXES: [string, number][] = [
  ['personal.', 0],
  ['summary', 1],
  ['experience.', 2],
  ['education.', 2],
  ['projects.', 2],
  ['certifications.', 2],
  ['volunteer.', 2],
  ['publications.', 2],
  ['skills.', 3],
  ['template.', 4],
]

export function stepForField(field: string): number {
  for (const [prefix, step] of STEP_PREFIXES) {
    if (field === prefix || field.startsWith(prefix)) return step
  }
  return 0
}

export function earliestStepForFields(fields: string[]): number {
  if (fields.length === 0) return 0
  return Math.min(...fields.map(stepForField))
}
