/**
 * Fusionne les notes olfactives (top/middle/base) du dataset Parfumo
 * avec data/perfumes.json (base Fragrantica), par correspondance nom+marque.
 *
 * Usage : node scripts/merge-parfumo-notes.mjs
 * Source : data/parfumo_raw.csv (TidyTuesday, https://github.com/rfordatascience/tidytuesday)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PERFUMES_FILE = path.join(ROOT, 'data', 'perfumes.json')
const PARFUMO_CSV = path.join(ROOT, 'data', 'parfumo_raw.csv')
const NOTES_FILE = path.join(ROOT, 'data', 'notes.json')

// Parseur CSV simple gérant les champs entre guillemets avec virgules internes
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\r') continue
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else field += c
    }
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // retirer les accents
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function splitNotes(field) {
  if (!field || field === 'NA') return []
  return field.split(',').map(s => s.trim()).filter(Boolean)
}

// Parfumo (et parfois Fragrantica) accolent au nom du parfum la marque, l'année
// et le type de concentration ("Eau de Parfum", "Cologne"...). On les retire pour
// faire correspondre les variantes de concentration d'un même parfum entre les deux sources.
const CONCENTRATIONS = [
  'Eau de Toilette', 'Eau de Parfum', 'Eau de Cologne', 'Eau Fraîche', 'Eau Fraichissante',
  'Eau Fraîchissante', 'Eau Sensuelle', 'Eau Délice', 'Extrait de Parfum', 'Absolu Parfum',
  'Parfum', 'Cologne Concentrée', 'Cologne', 'Elixir', 'Lotion Après-Rasage',
  'Lotion Après Rasage', 'Déodorant', 'Concentrée', 'Concentree',
]
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
const CONC_PATTERN = CONCENTRATIONS.map(escapeRe).sort((a, b) => b.length - a.length).join('|')

// Retire un éventuel suffixe correspondant à la marque, en comparant les formes
// normalisées (insensible aux accents/casse) plutôt que le texte brut, car les deux
// sources n'orthographient pas toujours la marque de la même façon ("Hermes" vs "Hermès").
function stripBrandSuffix(s, normBrand) {
  if (!normBrand) return s
  const words = s.split(/\s+/).filter(Boolean)
  for (let cut = 1; cut <= words.length; cut++) {
    const suffix = words.slice(words.length - cut).join(' ')
    if (normalize(suffix) === normBrand) {
      return words.slice(0, words.length - cut).join(' ').trim()
    }
  }
  return s
}

function stripConcentrationAndYear(name, brand) {
  let s = name
  const normBrand = normalize(brand)
  const yearPattern = '(?:19|20)\\d{2}'
  let prev
  let iter = 0
  do {
    prev = s
    s = s.replace(new RegExp('\\s*(?:' + CONC_PATTERN + ')\\s*$', 'i'), '').trim()
    s = s.replace(new RegExp('\\s*' + yearPattern + '\\s*$', 'i'), '').trim()
    s = stripBrandSuffix(s, normBrand)
    iter++
  } while (s !== prev && iter < 10)
  return s || name
}

function matchKey(name, brand) {
  return normalize(stripConcentrationAndYear(name, brand)) + '|' + normalize(brand)
}

console.log('Lecture du CSV Parfumo...')
const rows = parseCsv(readFileSync(PARFUMO_CSV, 'utf-8'))
const header = rows[0]
const idx = {
  name: header.indexOf('Name'),
  brand: header.indexOf('Brand'),
  top: header.indexOf('Top_Notes'),
  mid: header.indexOf('Middle_Notes'),
  base: header.indexOf('Base_Notes'),
}

// Construire un index nom+marque -> notes (combinées, ordre top -> mid -> base)
const parfumoIndex = new Map()
for (let i = 1; i < rows.length; i++) {
  const r = rows[i]
  if (!r || r.length < 2) continue
  const name = r[idx.name]
  const brand = r[idx.brand]
  if (!name || !brand) continue

  const top = splitNotes(r[idx.top])
  const heart = splitNotes(r[idx.mid])
  const base = splitNotes(r[idx.base])
  if (top.length === 0 && heart.length === 0 && base.length === 0) continue

  const key = matchKey(name, brand)
  const existing = parfumoIndex.get(key)
  // Si plusieurs entrées Parfumo se réduisent à la même clé (variantes de concentration),
  // on fusionne leurs notes plutôt que d'écraser.
  parfumoIndex.set(key, existing ? {
    top: [...new Set([...existing.top, ...top])],
    heart: [...new Set([...existing.heart, ...heart])],
    base: [...new Set([...existing.base, ...base])],
  } : { top, heart, base })
}
console.log(`Index Parfumo construit : ${parfumoIndex.size} parfums avec notes\n`)

console.log('Lecture de la base de parfums ParfumLayer...')
const perfumes = JSON.parse(readFileSync(PERFUMES_FILE, 'utf-8'))
const notes = existsSync(NOTES_FILE) ? JSON.parse(readFileSync(NOTES_FILE, 'utf-8')) : {}

function hasNotes(entry) {
  return !!entry && (entry.top?.length || entry.heart?.length || entry.base?.length)
}

let matched = 0
let alreadyHad = 0
for (const p of perfumes) {
  const id = String(p.id)
  if (hasNotes(notes[id])) { alreadyHad++; continue }
  const key = matchKey(p.name, p.brand)
  const found = parfumoIndex.get(key)
  if (found) {
    notes[id] = found
    matched++
  }
}

writeFileSync(NOTES_FILE, JSON.stringify(notes))

console.log(`\n✅ Terminé`)
console.log(`   Nouveaux parfums avec notes : ${matched}`)
console.log(`   Déjà présents avant fusion  : ${alreadyHad}`)
console.log(`   Total dans notes.json       : ${Object.keys(notes).length} / ${perfumes.length}`)
