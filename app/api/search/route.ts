import { readFileSync } from 'fs'
import path from 'path'
import type { NextRequest } from 'next/server'
import type { Perfume } from '@/app/types'
import { searchTermToEn } from '@/lib/accords'

let perfumes: Perfume[] | null = null

function getPerfumes(): Perfume[] {
  if (!perfumes) {
    const file = readFileSync(path.join(process.cwd(), 'data', 'perfumes.json'), 'utf-8')
    perfumes = JSON.parse(file)
  }
  return perfumes!
}

function score(p: Perfume, q: string, qEn: string): number {
  const name = p.name.toLowerCase()
  const brand = p.brand.toLowerCase()
  // Correspondance exacte nom = priorité maximale
  if (name === q) return 100
  // Nom commence par la recherche
  if (name.startsWith(q)) return 80
  // Recherche "marque nom" ou "nom marque" ex: "dior sauvage"
  const full = `${brand} ${name}`
  const fullRev = `${name} ${brand}`
  if (full.includes(q) || fullRev.includes(q)) return 70
  // Nom contient la recherche
  if (name.includes(q)) return 60
  // Marque correspond exactement
  if (brand === q) return 50
  // Marque commence par la recherche
  if (brand.startsWith(q)) return 40
  // Marque contient la recherche
  if (brand.includes(q)) return 30
  // Accord correspond
  if (p.accords.some(a => a.includes(q) || a.includes(qEn))) return 10
  return 0
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''
  if (!q) return Response.json({ results: [] })

  const qEn = searchTermToEn(q)

  const data = getPerfumes()
  const scored: { p: Perfume; s: number }[] = []

  for (const p of data) {
    const s = score(p, q, qEn)
    if (s > 0) scored.push({ p, s })
  }

  scored.sort((a, b) => b.s - a.s)
  const results = scored.slice(0, 30).map(x => x.p)

  return Response.json({ results })
}
