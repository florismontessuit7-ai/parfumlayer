/**
 * Scrape les notes olfactives depuis Fragrantica pour chaque parfum.
 *
 * Usage : node scripts/scrape-notes.mjs
 *
 * - Reprend là où il s'est arrêté (sauvegarde tous les 50 parfums)
 * - Délai de 2–4 secondes entre chaque requête pour éviter le blocage
 * - Résultat final : data/notes.json  →  { "1": ["bergamote","rose",...], ... }
 */

import XLSX from 'xlsx'
import * as cheerio from 'cheerio'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const NOTES_FILE = path.join(ROOT, 'data', 'notes.json')
const EXCEL_FILE = 'C:/Users/Delmarflo/Downloads/PARFUM.xlsx'

// Délai aléatoire entre min et max ms
function sleep(min = 2000, max = 4000) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(r => setTimeout(r, ms))
}

// Headers pour ressembler à un vrai navigateur
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}

// Extraire les notes depuis le HTML Fragrantica
function parseNotes(html) {
  const $ = cheerio.load(html)
  const notes = new Set()

  // Sélecteurs Fragrantica pour les notes (plusieurs variantes selon la version)
  $('[itemprop="description"] span, .notes-box span, .note-box-img p, .notes span, #pyramid span, .accord-box span').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length > 1 && text.length < 40 && !/^\d+$/.test(text)) {
      notes.add(text)
    }
  })

  // Fallback : chercher les spans dans la section notes
  if (notes.size === 0) {
    $('div').filter((_, el) => {
      const id = $(el).attr('id') || ''
      const cls = $(el).attr('class') || ''
      return id.includes('note') || cls.includes('note') || id === 'pyramid'
    }).find('span, p').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 1 && text.length < 40 && !/^\d+$/.test(text)) {
        notes.add(text)
      }
    })
  }

  return [...notes].filter(n => !['Top Notes', 'Middle Notes', 'Base Notes', 'Heart Notes', 'Notes', 'Top', 'Middle', 'Base', 'Heart'].includes(n))
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('html')) return null
    return await res.text()
  } catch {
    return null
  }
}

async function main() {
  // Charger la progression existante
  const notes = existsSync(NOTES_FILE)
    ? JSON.parse(readFileSync(NOTES_FILE, 'utf-8'))
    : {}

  const alreadyDone = Object.keys(notes).length
  console.log(`\n📦 Notes déjà récupérées : ${alreadyDone}`)

  // Lire les URLs depuis l'Excel
  console.log('📖 Lecture du fichier Excel...')
  const wb = XLSX.readFile(EXCEL_FILE)
  const sheet = wb.Sheets['fra_perfumes']
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

  // Reconstruire le mapping id → url (même logique que build-perfume-db.mjs)
  const urlMap = []
  for (let i = 1; i < rows.length; i++) {
    const [rawName, , , url] = rows[i]
    if (!rawName || rawName === 'N/A' || !url) continue
    urlMap.push({ idx: urlMap.length + 1, url })
  }

  console.log(`🔍 ${urlMap.length} parfums à traiter\n`)

  let saved = 0
  let blocked = 0
  let errors = 0

  for (const { idx, url } of urlMap) {
    const id = String(idx)
    if (notes[id]) continue // déjà fait

    process.stdout.write(`[${idx}/${urlMap.length}] ${url.split('/').pop()} ... `)

    const html = await fetchPage(url)

    if (!html) {
      process.stdout.write('❌ échec\n')
      errors++
      if (errors > 10) {
        console.log('\n⚠️  Trop d\'erreurs consécutives, Fragrantica bloque peut-être. Pause de 30s...')
        await sleep(30000, 35000)
        errors = 0
        blocked++
      }
      await sleep(3000, 5000)
      continue
    }

    // Vérifier si Cloudflare a bloqué
    if (html.includes('Just a moment') || html.includes('cf-browser-verification')) {
      process.stdout.write('🔒 Cloudflare bloqué\n')
      console.log('\n⛔ Fragrantica a détecté le bot. Pause de 2 minutes...')
      await sleep(120000, 130000)
      continue
    }

    errors = 0
    const parsedNotes = parseNotes(html)
    // Pas de distinction tête/cœur/fond dans ce scrape direct : on les place en cœur
    notes[id] = { top: [], heart: parsedNotes, base: [] }
    saved++

    process.stdout.write(`✅ ${parsedNotes.length} notes : ${parsedNotes.slice(0, 3).join(', ')}${parsedNotes.length > 3 ? '...' : ''}\n`)

    // Sauvegarder tous les 50 parfums
    if (saved % 50 === 0) {
      writeFileSync(NOTES_FILE, JSON.stringify(notes))
      console.log(`\n💾 Progression sauvegardée : ${Object.keys(notes).length} parfums\n`)
    }

    await sleep(2000, 4000)
  }

  // Sauvegarde finale
  writeFileSync(NOTES_FILE, JSON.stringify(notes))
  console.log(`\n✅ Terminé ! ${Object.keys(notes).length} parfums avec notes dans data/notes.json`)
  console.log(`   ${blocked} fois bloqué par Cloudflare`)
}

main().catch(console.error)
