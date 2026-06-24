import type { Metadata } from 'next'
import DarkPageShell from '../components/DarkPageShell'

export const metadata: Metadata = {
  title: "Ce que nous faisons - ParfumLayer",
  description: "Comment ParfumLayer utilise l'IA pour recommander des associations de layering de parfums.",
}

export default function CeQueNousFaisonsPage() {
  return (
    <DarkPageShell eyebrow="Ce que nous faisons" title="L'IA au service du layering">
      <div className="dark-card">
        <h2>Le layering, en bref</h2>
        <p>
          Le layering consiste à porter plusieurs parfums en même temps, ou l'un après l'autre, pour
          créer une fragrance personnelle et unique. Bien fait, il ajoute de la profondeur, prolonge
          la tenue, ou crée un contraste surprenant entre deux familles olfactives.
        </p>
      </div>

      <div className="dark-card">
        <h2>Comment fonctionne ParfumLayer</h2>
        <p>
          Vous entrez le nom d'un parfum que vous possédez ou qui vous plaît. Notre moteur identifie
          ses accords olfactifs et sa composition (notes de tête, de cœur et de fond), puis interroge
          notre base de 70 000 fragrances pour repérer celles qui s'associeraient le mieux selon les
          règles de compatibilité utilisées en parfumerie (accords complémentaires, contrastes
          maîtrisés, équilibre des intensités).
        </p>
        <p>
          Une intelligence artificielle affine ensuite cette sélection : elle évalue une dizaine de
          parfums candidats, leur attribue un score de compatibilité et un style de layering
          (Classique, Osé, Frais, Intense ou Signature), et explique en quelques mots pourquoi
          l'association fonctionne.
        </p>
      </div>

      <div className="dark-card">
        <h2>Une base de données, pas un avis</h2>
        <p>
          Nos recommandations s'appuient sur des données olfactives réelles (familles d'accords,
          pyramides de notes) plutôt que sur des préférences subjectives. L'objectif n'est pas de
          vous dire quoi acheter, mais de vous donner les clés pour explorer ce que vous possédez déjà
          différemment.
        </p>
      </div>
    </DarkPageShell>
  )
}
