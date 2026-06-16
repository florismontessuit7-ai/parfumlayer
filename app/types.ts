export interface Perfume {
  id: number
  name: string
  brand: string
  gender: string
  accords: string[]
}

export interface Recommendation {
  name: string
  brand: string
  gender: string
  accords: string[]
  score: number
  why: string
}
