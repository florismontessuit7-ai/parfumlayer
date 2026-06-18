export const ACCORDS_FR: Record<string, string> = {
  // Familles principales
  woody: 'boisé',
  citrus: 'agrumes',
  floral: 'floral',
  fruity: 'fruité',
  musky: 'musqué',
  amber: 'ambré',
  fresh: 'frais',
  sweet: 'sucré',
  spicy: 'épicé',
  aromatic: 'aromatique',
  oriental: 'oriental',
  green: 'végétal',
  aquatic: 'aquatique',
  earthy: 'terreux',
  smoky: 'fumé',
  powdery: 'poudré',
  leather: 'cuiré',
  gourmand: 'gourmand',
  mineral: 'minéral',
  herbal: 'herbacé',
  soapy: 'savonneux',
  ozonic: 'ozonic',
  // Sous-familles
  'warm spicy': 'épicé chaud',
  'soft spicy': 'épicé doux',
  'fresh spicy': 'épicé frais',
  'woody spice': 'boisé épicé',
  'white floral': 'floral blanc',
  'yellow floral': 'floral jaune',
  'rose': 'rose',
  'iris': 'iris',
  'violet': 'violette',
  'lavender': 'lavande',
  'tuberose': 'tubéreuse',
  'jasmine': 'jasmin',
  'vanilla': 'vanille',
  'cinnamon': 'cannelle',
  'patchouli': 'patchouli',
  'oud': 'oud',
  'mossy': 'mousse',
  'balsamic': 'balsamique',
  'animalic': 'animalique',
  'tobacco': 'tabac',
  'metallic': 'métallique',
  'coconut': 'noix de coco',
  'honey': 'miel',
  'caramel': 'caramel',
  'watery': 'aqueux',
  'sandalwood': 'santal',
  'cedar': 'cèdre',
  'vetiver': 'vétiver',
  'musk': 'musc',
  'bergamot': 'bergamote',
  'pepper': 'poivre',
  'incense': 'encens',
}

export function toFr(accord: string): string {
  return ACCORDS_FR[accord.toLowerCase()] ?? accord
}

// Pour la recherche : l'utilisateur tape en français, on cherche en anglais
const FR_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(ACCORDS_FR).map(([en, fr]) => [fr, en])
)

export function searchTermToEn(term: string): string {
  return FR_TO_EN[term.toLowerCase()] ?? term
}
