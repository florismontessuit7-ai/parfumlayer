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

// Familles olfactives compatibles pour le layering
// Clé = accord de base, valeurs = accords qui se marient bien avec lui
const LAYERING_COMPAT: Record<string, string[]> = {
  woody:       ['musky', 'amber', 'vanilla', 'citrus', 'aromatic', 'spicy', 'warm spicy', 'fresh spicy', 'earthy', 'smoky', 'leather', 'sandalwood', 'cedar', 'vetiver', 'patchouli'],
  citrus:      ['woody', 'aromatic', 'fresh', 'aquatic', 'green', 'floral', 'musky', 'fresh spicy'],
  floral:      ['musky', 'woody', 'powdery', 'fresh', 'citrus', 'fruity', 'amber', 'vanilla', 'white floral', 'rose'],
  musky:       ['woody', 'floral', 'amber', 'vanilla', 'powdery', 'warm spicy', 'soft spicy', 'citrus', 'fruity'],
  amber:       ['woody', 'vanilla', 'musky', 'warm spicy', 'oriental', 'floral', 'smoky', 'leather', 'oud'],
  fresh:       ['citrus', 'aromatic', 'aquatic', 'green', 'woody', 'musky', 'floral'],
  sweet:       ['vanilla', 'fruity', 'gourmand', 'musky', 'floral', 'powdery', 'caramel', 'honey'],
  aromatic:    ['woody', 'citrus', 'fresh', 'lavender', 'herbal', 'green', 'musky'],
  oriental:    ['amber', 'woody', 'vanilla', 'warm spicy', 'oud', 'leather', 'smoky', 'musky'],
  leather:     ['woody', 'smoky', 'amber', 'oriental', 'oud', 'tobacco', 'earthy', 'warm spicy'],
  oud:         ['leather', 'amber', 'woody', 'oriental', 'rose', 'warm spicy', 'smoky'],
  vanilla:     ['musky', 'sweet', 'amber', 'woody', 'floral', 'powdery', 'gourmand', 'caramel'],
  fruity:      ['floral', 'citrus', 'sweet', 'musky', 'fresh', 'green'],
  gourmand:    ['vanilla', 'sweet', 'caramel', 'musky', 'floral', 'woody'],
  aquatic:     ['fresh', 'citrus', 'woody', 'musky', 'green', 'aromatic'],
  green:       ['citrus', 'fresh', 'woody', 'aromatic', 'aquatic', 'floral', 'herbal'],
  powdery:     ['musky', 'floral', 'vanilla', 'iris', 'sweet', 'amber'],
  smoky:       ['woody', 'leather', 'amber', 'oud', 'earthy', 'tobacco'],
  spicy:       ['woody', 'amber', 'oriental', 'musky', 'citrus'],
  'warm spicy':  ['woody', 'amber', 'oriental', 'vanilla', 'musky', 'leather'],
  'soft spicy':  ['floral', 'musky', 'woody', 'fruity', 'citrus'],
  'fresh spicy': ['citrus', 'woody', 'aromatic', 'fresh', 'musky'],
  earthy:      ['woody', 'leather', 'smoky', 'mossy', 'vetiver', 'earthy'],
  mossy:       ['woody', 'earthy', 'leather', 'green', 'amber'],
  lavender:    ['aromatic', 'woody', 'fresh', 'musky', 'herbal'],
  rose:        ['floral', 'musky', 'powdery', 'oud', 'fruity', 'woody'],
  iris:        ['powdery', 'floral', 'woody', 'musky', 'violet'],
  patchouli:   ['woody', 'earthy', 'amber', 'sweet', 'oriental', 'musky'],
  tobacco:     ['leather', 'woody', 'smoky', 'amber', 'vanilla', 'honey'],
  mineral:     ['woody', 'aquatic', 'citrus', 'earthy', 'fresh'],
}

function getCompatibleAccords(accords: string[]): Set<string> {
  const compatible = new Set<string>(accords)
  for (const a of accords) {
    const comps = LAYERING_COMPAT[a] ?? []
    for (const c of comps) compatible.add(c)
  }
  return compatible
}

function topCandidates(perfume: Perfume, all: Perfume[], limit: number): Perfume[] {
  const baseAccords = new Set(perfume.accords)
  const compatAccords = getCompatibleAccords(perfume.accords)

  const scored: { p: Perfume; score: number }[] = []

  for (const p of all) {
    if (p.id === perfume.id) continue

    let score = 0
    for (const a of p.accords) {
      if (baseAccords.has(a)) score += 3        // accord identique = fort lien
      else if (compatAccords.has(a)) score += 1  // accord complémentaire = bon pour le layering
    }
    if (score > 0) scored.push({ p, score })
  }

  scored.sort((a, b) => b.score - a.score)

  // Max 2 par marque pour éviter qu'une seule marque domine
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

    const prompt = `Tu es un expert en parfumerie et en art du layering (superposition de parfums). L'utilisateur porte "${perfume.name}" de ${perfume.brand}${genderPart}.

Accords olfactifs de ce parfum : ${accordsPart}

Règles du layering olfactif :
- Un bon layering crée de la profondeur en combinant des accords complémentaires, pas juste identiques
- Boisé s'harmonise avec : musqué, ambré, vanillé, agrumes, épicé
- Floral s'harmonise avec : musqué, boisé, poudré, fruité, ambré
- Oriental s'harmonise avec : boisé, ambré, épicé chaud, oud, cuiré
- Agrumes s'harmonisent avec : boisé, aromatique, frais, floral, musqué
- Éviter deux parfums aux accords quasiment identiques (sans intérêt)

Styles de layering à attribuer à chaque recommandation :
- "Classique" : association harmonieuse, sûre, élégante — accords proches qui se renforcent
- "Osé" : contraste intéressant et inattendu — familles différentes qui créent une surprise olfactive
- "Frais" : résultat léger et aérien — idéal au quotidien ou par temps chaud
- "Intense" : profondeur et sillage puissant — idéal le soir ou en soirée
- "Signature" : combinaison rare qui crée un olfactif unique et mémorable

Voici une liste de parfums candidats (id: "nom" de marque (genre) - accords):
${candidatesText}

Sélectionne exactement 10 parfums de cette liste qui créent le meilleur layering avec "${perfume.name}". Assigne à chacun UN style parmi : Classique, Osé, Frais, Intense, Signature. Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans explication, juste le JSON brut :
[{"id":123,"score":90,"style":"Classique","why":"Explication courte en français de pourquoi ce layering fonctionne et ce qu'il apporte."}]`

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
    const picks: { id: number; score: number; style: string; why: string }[] = JSON.parse(match[0])

    const recos: Recommendation[] = picks
      .map(pick => {
        const c = candidates.find(c => c.id === pick.id)
        if (!c) return null
        return { name: c.name, brand: c.brand, gender: c.gender, accords: c.accords, score: pick.score, style: pick.style ?? 'Classique', why: pick.why }
      })
      .filter((r): r is Recommendation => r !== null)

    return Response.json({ recos })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('Error:', message)
    return Response.json({ recos: [], error: message })
  }
}
