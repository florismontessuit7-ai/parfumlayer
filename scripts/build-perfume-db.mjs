import XLSX from 'xlsx'
import { writeFileSync, mkdirSync } from 'fs'

const wb = XLSX.readFile('C:\\Users\\Delmarflo\\Downloads\\PARFUM.xlsx')
const sheet = wb.Sheets['fra_perfumes']
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

function parseAccords(raw) {
  if (!raw || raw === '[]') return []
  return raw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map(s => s.trim().replace(/^'|'$/g, ''))
    .filter(Boolean)
}

function extractBrand(url) {
  const m = url.match(/\/perfume\/([^/]+)\//)
  if (!m) return ''
  try {
    return decodeURIComponent(m[1]).replace(/-/g, ' ').trim()
  } catch {
    return m[1].replace(/-/g, ' ').trim()
  }
}

const perfumes = []
for (let i = 1; i < rows.length; i++) {
  const [rawName, gender, rawAccords, url] = rows[i]
  if (!rawName || rawName === 'N/A') continue

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
  if (!name) continue

  perfumes.push({
    id: perfumes.length + 1,
    name,
    brand,
    gender: gender === 'N/A' ? '' : gender,
    accords: parseAccords(rawAccords)
  })
}

mkdirSync('data', { recursive: true })
writeFileSync('data/perfumes.json', JSON.stringify(perfumes))

console.log('Total perfumes:', perfumes.length)
console.log('Sample:', perfumes[0])
console.log('Sample:', perfumes.find(p => p.brand === 'Al Haramain Perfumes'))
