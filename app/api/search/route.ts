import { readFileSync } from 'fs'
import path from 'path'
import type { NextRequest } from 'next/server'
import type { Perfume } from '@/app/types'

let perfumes: Perfume[] | null = null

function getPerfumes(): Perfume[] {
  if (!perfumes) {
    const file = readFileSync(path.join(process.cwd(), 'data', 'perfumes.json'), 'utf-8')
    perfumes = JSON.parse(file)
  }
  return perfumes!
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''
  if (!q) return Response.json({ results: [] })

  const data = getPerfumes()
  const results: Perfume[] = []
  for (const p of data) {
    if (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.accords.some(a => a.includes(q))
    ) {
      results.push(p)
      if (results.length >= 30) break
    }
  }
  return Response.json({ results })
}
