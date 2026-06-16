import { readFileSync } from 'fs'
import path from 'path'
import type { Perfume, Recommendation } from '@/app/types'

let perfumes: Perfume[] | null = null

function getPerfumes(): Perfume[] {
  if (!perfumes) {
    const file = readFileSync(path.join(process.cwd(), 'data', 'perfumes.json'), 'utf-8')
    perfumes = JSON.parse(file)
  }
  return perfumes!
}

function topCandidates(perfume: Perfume, all: Perfume[], limit: number): Perfume[] {
  const accordSet = new Set(perfume.accords)
  const scored: { p: Perfume; overlap: number }[] = []
  for (const p of all) {
    if (p.id === perfume.id) continue
    let overlap = 0
    for (const a of p.accords) if (accordSet.has(a)) overlap++
    if (overlap > 0) scored.push({ p, overlap })
  }
  scored.sort((a, b) => b.overlap - a.overlap)

  // Cap at 2 perfumes per brand so no single brand dominates the candidate pool
  const brandCount: Record<string, number> = {}
  const diverse: Perfume[] = []
  for (const { p } of scored) {
    const brand = p.brand.toLowerCase()
    if ((brandCount[brand] ?? 0) >= 2) continue
    brandCount[brand] = (brandCount[brand] ?? 0) + 1
    diverse.push(p)
    if (diverse.length >= limit) break
  }
  return diverse
}

export async function POST(request: Request) {
  try {
    const { perfume }: { perfume: Perfume } = await request.json()
    const all = getPerfumes()

    let candidates = topCandidates(perfume, all, 60)
    if (candidates.length === 0) candidates = all.slice(0, 60)

    const candidatesText = candidates
      .map(c => `${c.id}: "${c.name}" de ${c.brand}${c.gender ? ` (${c.gender})` : ''} - accords: ${c.accords.join(', ')}`)
      .join('\n')

    const genderPart = perfume.gender ? `, ${perfume.gender}` : ''
    const accordsPart = perfume.accords.length ? perfume.accords.join(', ') : 'inconnus'

    const prompt = `Tu es un expert en parfumerie et layering de parfums. L'utilisateur porte "${perfume.name}" de ${perfume.brand}${genderPart} (accords: ${accordsPart}).

Voici une liste de parfums candidats (id: "nom" de marque (genre) - accords):
${candidatesText}

Choisis exactement 10 parfums de cette liste qui se marient le mieux en layering avec celui de l'utilisateur, classés du meilleur au moins bon. Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans explication, juste le JSON brut, en réutilisant les id ci-dessus:
[{"id":123,"score":90,"why":"Explication courte en français."}]`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    const text = data.content[0].text
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array found')
    const picks: { id: number; score: number; why: string }[] = JSON.parse(match[0])

    const recos: Recommendation[] = picks
      .map(pick => {
        const c = candidates.find(c => c.id === pick.id)
        if (!c) return null
        return { name: c.name, brand: c.brand, gender: c.gender, accords: c.accords, score: pick.score, why: pick.why }
      })
      .filter((r): r is Recommendation => r !== null)

    return Response.json({ recos })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('Error:', message)
    return Response.json({ recos: [], error: message })
  }
}
