// ─────────────────────────────────────────────────────────────────────────────
// gemini.ts — Typed client for the Vercel AI serverless functions
// All calls go to /api/* (Vercel functions), never to the Render backend.
// The GEMINI_API_KEY lives server-side; this file contains no secrets.
// ─────────────────────────────────────────────────────────────────────────────

export interface AIError {
  error: string
}

export interface ImproveSummaryResponse {
  result: string
}

export interface SuggestHighlightsResponse {
  highlights: string[]
}

export interface ImproveHighlightResponse {
  result: string
}

async function callAPI<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json() as T | AIError

  if (!res.ok) {
    const errData = data as AIError
    throw new Error(errData.error ?? `Error ${res.status}`)
  }

  return data as T
}

/** Mejora el resumen profesional del usuario. */
export function improveSummary(draft: string): Promise<ImproveSummaryResponse> {
  return callAPI<ImproveSummaryResponse>('improve-summary', { draft })
}

/** Sugiere 4 bullets de logros dado un cargo y empresa. */
export function suggestHighlights(
  position: string,
  company: string,
  existingHighlights: string[] = []
): Promise<SuggestHighlightsResponse> {
  return callAPI<SuggestHighlightsResponse>('suggest-highlights', {
    position,
    company,
    existingHighlights,
  })
}

/** Mejora un bullet individual de experiencia. */
export function improveHighlight(
  highlight: string,
  position: string = ''
): Promise<ImproveHighlightResponse> {
  return callAPI<ImproveHighlightResponse>('improve-highlight', { highlight, position })
}
