/**
 * Ajouter des notes à un parfum manuellement.
 *
 * Usage :
 *   node scripts/add-notes.mjs "Nom du parfum" "Marque" "note1, note2, note3"
 *   node scripts/add-notes.mjs "Sauvage" "Dior" "bergamote, poivre, ambroxan, cèdre"
 *   node scripts/add-notes.mjs "Black Opium" "YSL" "café noir, vanille, jasmin, patchouli"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PERFUMES_FILE = path.join(ROOT, 'data', 'perfumes.json')
const NOTES_FILE = path.join(ROOT, 'data', 'notes.json')

const [,, searchName, searchBrand, rawNotes] = process.argv

if (!searchName || !searchBrand || !rawNotes) {
  console.log('\n📝 Usage :')
  console.log('  node scripts/add-notes.mjs "Nom" "Marque" "note1, note2, note3"\n')
  console.log('Exemples :')
  console.log('  node scripts/add-notes.mjs "Sauvage" "Dior" "bergamote, poivre de sichuan, ambroxan, cèdre"')
  console.log('  node scripts/add-notes.mjs "Black Opium" "YSL" "café noir, vanille, jasmin, patchouli"')
  console.log('  node scripts/add-notes.mjs "Bleu de Chanel" "Chanel" "pamplemousse, cèdre, santal, musc blanc"\n')
  process.exit(0)
}

const perfumes = JSON.parse(readFileSync(PERFUMES_FILE, 'utf-8'))
const notes = existsSync(NOTES_FILE) ? JSON.parse(readFileSync(NOTES_FILE, 'utf-8')) : {}

const qName = searchName.toLowerCase()
const qBrand = searchBrand.toLowerCase()

// Chercher par nom ET marque
const matches = perfumes.filter(p =>
  p.name.toLowerCase().includes(qName) && p.brand.toLowerCase().includes(qBrand)
)

if (matches.length === 0) {
  // Fallback : juste le nom
  const byName = perfumes.filter(p => p.name.toLowerCase().includes(qName)).slice(0, 5)
  if (byName.length > 0) {
    console.log(`\n❌ Pas trouvé "${searchName}" chez "${searchBrand}". Résultats proches :\n`)
    byName.forEach(p => console.log(`  → "${p.name}" — ${p.brand}`))
    console.log(`\nRelance avec la marque correcte.\n`)
  } else {
    console.log(`\n❌ Aucun parfum trouvé pour "${searchName}".\n`)
  }
  process.exit(1)
}

// Préférer la correspondance exacte sur le nom
const exact = matches.find(p => p.name.toLowerCase() === qName) || matches[0]
const notesList = rawNotes.split(',').map(n => n.trim()).filter(Boolean)

// Pas de distinction tête/cœur/fond pour un ajout manuel : on les place en cœur (notes principales)
notes[String(exact.id)] = { top: [], heart: notesList, base: [] }
writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2))

console.log(`\n✅ "${exact.name}" — ${exact.brand}`)
console.log(`   Notes : ${notesList.join(', ')}`)
console.log(`   (${Object.keys(notes).length} parfums avec notes au total)\n`)
