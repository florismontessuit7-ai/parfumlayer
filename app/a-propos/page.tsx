import type { Metadata } from 'next'
import DarkPageShell from '../components/DarkPageShell'

export const metadata: Metadata = {
  title: "Qui sommes-nous - ParfumLayer",
  description: "L'équipe et le projet derrière ParfumLayer, l'IA dédiée au layering de parfums.",
}

export default function AProposPage() {
  return (
    <DarkPageShell eyebrow="Qui sommes-nous" title="Le projet ParfumLayer">
      <div className="dark-card">
        <h2>Une idée née d'une frustration de parfumeur amateur</h2>
        <p>
          ParfumLayer est né d'un constat simple : superposer plusieurs parfums (le « layering »)
          peut transformer une fragrance, mais trouver les bonnes associations relève souvent du
          tâtonnement. Les communautés de passionnés s'échangent des combinaisons au coup de cœur,
          sans réelle méthode pour explorer les milliers d'options possibles.
        </p>
        <p>
          Nous avons construit ParfumLayer pour combler ce manque : une base de données de plus de
          70 000 fragrances, croisée avec une intelligence artificielle capable de raisonner sur les
          accords olfactifs, les familles de notes et les logiques de superposition utilisées par les
          parfumeurs professionnels.
        </p>
      </div>

      <div className="dark-card">
        <h2>Une petite équipe, un projet indépendant</h2>
        <p>
          ParfumLayer est développé par une équipe restreinte, passionnée de parfumerie et
          d'intelligence artificielle. Le projet est indépendant des marques et maisons de parfum
          qu'il référence : nos recommandations ne sont influencées par aucun partenariat commercial.
        </p>
      </div>

      <div className="dark-card">
        <h2>Notre ambition</h2>
        <p>
          Rendre le layering accessible à toutes et tous, du néophyte qui découvre sa première
          fragrance au collectionneur qui cherche une association inédite, en s'appuyant sur la
          donnée et l'IA plutôt que sur le seul hasard.
        </p>
      </div>
    </DarkPageShell>
  )
}
