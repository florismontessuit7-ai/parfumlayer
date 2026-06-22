/**
 * Traduit en français les notes olfactives anglaises présentes dans data/notes.json
 * (issues du dataset Parfumo) via l'API Claude, par lots.
 *
 * Usage : node scripts/translate-notes.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const NOTES_FILE = path.join(ROOT, 'data', 'notes.json')
const TRANSLATIONS_FILE = path.join(ROOT, 'data', 'notes-translations.json')

// Charger .env.local manuellement (pas de dépendance dotenv dans ce projet)
const envFile = path.join(ROOT, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf-8').split('\n')) {
    const m = line.replace(/\r$/, '').match(/^([A-Z_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

function isLikelyFrench(s) {
  // Heuristique simple : déjà des notes scrapées en français (accents, mots-clés connus)
  return /[éèêàâôûîç]/i.test(s)
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function translateBatch(terms) {
  const prompt = `Traduis ces noms de notes olfactives de parfumerie de l'anglais vers le français, en utilisant la terminologie standard de la parfumerie française (ex: "Pink pepper" -> "poivre rose", "Tonka bean" -> "fève de tonka", "Blackcurrant" -> "cassis").
Si un terme est une marque déposée ou un nom propriétaire intraduisible (ex: "Ambrox", "Dreamwood™"), garde-le tel quel.
Réponds UNIQUEMENT avec un objet JSON valide {"terme anglais": "traduction française", ...}, sans markdown, sans explication.

Termes à traduire :
${terms.map(t => `- ${t}`).join('\n')}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await res.json()
  const text = data.content?.[0]?.text
  if (!text) {
    console.error('Réponse inattendue:', JSON.stringify(data).slice(0, 300))
    return {}
  }
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return {}
  try {
    return JSON.parse(match[0])
  } catch {
    return {}
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY manquant (vérifie .env.local)')
    process.exit(1)
  }

  const notes = JSON.parse(readFileSync(NOTES_FILE, 'utf-8'))
  const existingTranslations = existsSync(TRANSLATIONS_FILE)
    ? JSON.parse(readFileSync(TRANSLATIONS_FILE, 'utf-8'))
    : {}

  // Collecter les notes uniques anglaises (pas déjà traduites, pas déjà en français)
  const unique = new Set()
  for (const id in notes) {
    for (const n of notes[id]) {
      if (!existingTranslations[n] && !isLikelyFrench(n)) unique.add(n)
    }
  }
  const terms = [...unique]
  console.log(`${terms.length} notes à traduire (${Object.keys(existingTranslations).length} déjà traduites)\n`)

  const BATCH_SIZE = 80
  const translations = { ...existingTranslations }

  for (let i = 0; i < terms.length; i += BATCH_SIZE) {
    const batch = terms.slice(i, i + BATCH_SIZE)
    process.stdout.write(`Lot ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(terms.length / BATCH_SIZE)} (${batch.length} termes)... `)
    const result = await translateBatch(batch)
    let count = 0
    for (const [en, fr] of Object.entries(result)) {
      if (terms.includes(en)) { translations[en] = fr; count++ }
    }
    console.log(`✅ ${count} traduites`)

    // Sauvegarde incrémentale
    writeFileSync(TRANSLATIONS_FILE, JSON.stringify(translations, null, 2))
    await sleep(500)
  }

  // Appliquer les traductions à notes.json
  let applied = 0
  for (const id in notes) {
    notes[id] = notes[id].map(n => {
      if (translations[n]) { applied++; return translations[n] }
      return n
    })
  }
  writeFileSync(NOTES_FILE, JSON.stringify(notes))

  console.log(`\n✅ Terminé : ${Object.keys(translations).length} traductions au total, ${applied} occurrences appliquées dans notes.json`)
}

main().catch(console.error)
