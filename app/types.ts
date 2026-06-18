export interface Perfume {
  id: number
  name: string
  brand: string
  gender: string
  accords: string[]
}

export type LayeringStyle = 'Classique' | 'Osé' | 'Frais' | 'Intense' | 'Signature'

export interface Recommendation {
  name: string
  brand: string
  gender: string
  accords: string[]
  notes: string[]
  score: number
  style: LayeringStyle
  why: string
}
