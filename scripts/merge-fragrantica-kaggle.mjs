/**
 * Fusionne les notes olfactives extraites du dataset Kaggle "Fragrantica.com Fragrance Dataset"
 * (même source que data/perfumes.json) avec notre base, par correspondance nom+marque exacte.
 *
 * Usage : node scripts/merge-fragrantica-kaggle.mjs
 * Source : data/fragrantica_kaggle/fra_perfumes.csv
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PERFUMES_FILE = path.join(ROOT, 'data', 'perfumes.json')
const RAW_CSV = path.join(ROOT, 'data', 'fragrantica_kaggle', 'fra_perfumes.csv')
const NOTES_FILE = path.join(ROOT, 'data', 'notes.json')

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
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Mêmes fonctions que scripts/build-perfume-db.mjs pour reconstruire (name, brand)
// à partir de Name+Gender+url, exactement comme notre base a été construite.
function extractBrand(url) {
  const m = url.match(/\/perfume\/([^/]+)\//)
  if (!m) return ''
  try {
    return decodeURIComponent(m[1]).replace(/-/g, ' ').trim()
  } catch {
    return m[1].replace(/-/g, ' ').trim()
  }
}

function splitNameBrand(rawName, gender, url) {
  const brand = extractBrand(url)
  let nameAndBrand = rawName
  if (gender && rawName.endsWith(gender)) {
    nameAndBrand = rawName.slice(0, rawName.length - gender.length)
  }
  let name = nameAndBrand
  if (brand && nameAndBrand.endsWith(brand)) {
    name = nameAndBrand.slice(0, nameAndBrand.length - brand.length)
  }
  name = name.trim().replace(/\s+/g, ' ')
  return { name, brand }
}

function parseNoteList(str) {
  if (!str) return []
  return str
    .replace(/\s+and\s+/gi, ', ')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function extractNotesFromDescription(desc) {
  if (!desc) return []
  const top = desc.match(/top notes? (?:are|is)\s+([^;.]+)/i)
  const mid = desc.match(/middle notes? (?:are|is)\s+([^;.]+)/i)
  const base = desc.match(/base notes? (?:are|is)\s+([^;.]+)/i)
  const all = [
    ...parseNoteList(top?.[1]),
    ...parseNoteList(mid?.[1]),
    ...parseNoteList(base?.[1]),
  ]
  return [...new Set(all)]
}

console.log('Lecture du CSV Kaggle (Fragrantica)...')
const rows = parseCsv(readFileSync(RAW_CSV, 'utf-8'))
const header = rows[0]
const idx = {
  name: header.indexOf('Name'),
  gender: header.indexOf('Gender'),
  desc: header.indexOf('Description'),
  url: header.indexOf('url'),
}

const kaggleIndex = new Map()
let withNotesCount = 0
for (let i = 1; i < rows.length; i++) {
  const r = rows[i]
  if (!r || r.length < 2) continue
  const rawName = r[idx.name]
  const url = r[idx.url]
  if (!rawName || !url) continue

  const { name, brand } = splitNameBrand(rawName, r[idx.gender], url)
  if (!name || !brand) continue

  const notes = extractNotesFromDescription(r[idx.desc])
  if (notes.length === 0) continue
  withNotesCount++

  const key = normalize(name) + '|' + normalize(brand)
  const existing = kaggleIndex.get(key)
  kaggleIndex.set(key, existing ? [...new Set([...existing, ...notes])] : notes)
}
console.log(`Index Kaggle construit : ${kaggleIndex.size} parfums uniques avec notes (${withNotesCount} lignes avec notes)\n`)

console.log('Lecture de la base de parfums ParfumLayer...')
const perfumes = JSON.parse(readFileSync(PERFUMES_FILE, 'utf-8'))
const notes = existsSync(NOTES_FILE) ? JSON.parse(readFileSync(NOTES_FILE, 'utf-8')) : {}

let matched = 0
let alreadyHad = 0
for (const p of perfumes) {
  const id = String(p.id)
  if (notes[id]?.length) { alreadyHad++; continue }
  const key = normalize(p.name) + '|' + normalize(p.brand)
  const found = kaggleIndex.get(key)
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
