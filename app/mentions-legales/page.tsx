import type { Metadata } from 'next'
import DarkPageShell from '../components/DarkPageShell'

export const metadata: Metadata = {
  title: "Mentions légales - ParfumLayer",
  description: "Mentions légales du site ParfumLayer.",
}

export default function MentionsLegalesPage() {
  return (
    <DarkPageShell eyebrow="Informations légales" title="Mentions légales">
      <div className="dark-card">
        <h2>Éditeur du site</h2>
        <p>
          Le site ParfumLayer est édité par <span className="dark-placeholder">[À COMPLÉTER : nom ou raison sociale]</span>,
          {' '}<span className="dark-placeholder">[À COMPLÉTER : statut juridique, ex. entreprise individuelle / société]</span>,
          immatriculée sous le numéro <span className="dark-placeholder">[À COMPLÉTER : SIREN/SIRET]</span>,
          dont le siège est situé <span className="dark-placeholder">[À COMPLÉTER : adresse complète]</span>.
        </p>
        <p>
          Numéro de TVA intracommunautaire : <span className="dark-placeholder">[À COMPLÉTER]</span>
        </p>
        <p>
          Directeur de la publication : <span className="dark-placeholder">[À COMPLÉTER : nom du responsable]</span>
        </p>
        <p>
          Contact : <span className="dark-placeholder">[À COMPLÉTER : adresse e-mail de contact]</span>
        </p>
      </div>

      <div className="dark-card">
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par <span className="dark-placeholder">[À COMPLÉTER : nom de l'hébergeur, ex. Vercel Inc.]</span>,
          {' '}<span className="dark-placeholder">[À COMPLÉTER : adresse de l'hébergeur]</span>.
        </p>
      </div>

      <div className="dark-card">
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments du site ParfumLayer (textes, graphismes, logo, structure, code
          source, algorithmes de recommandation) est protégé par le droit de la propriété
          intellectuelle. Toute reproduction, représentation, modification ou exploitation, totale ou
          partielle, sans autorisation préalable, est interdite.
        </p>
        <p>
          Les noms de marques et de parfums référencés sur le site appartiennent à leurs propriétaires
          respectifs et sont cités à titre informatif uniquement, sans lien de partenariat ni
          d'affiliation, sauf mention contraire.
        </p>
      </div>

      <div className="dark-card">
        <h2>Données personnelles</h2>
        <p>
          Les informations recueillies via le formulaire de contact (nom, e-mail, message) sont
          utilisées uniquement pour traiter votre demande et ne sont ni cédées ni revendues à des
          tiers. Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
          d'un droit d'accès, de rectification et de suppression de vos données, que vous pouvez
          exercer en écrivant à <span className="dark-placeholder">[À COMPLÉTER : adresse e-mail dédiée RGPD]</span>.
        </p>
      </div>

      <div className="dark-card">
        <h2>Cookies</h2>
        <p>
          Le site peut utiliser des cookies techniques nécessaires à son fonctionnement.
          <span className="dark-placeholder"> [À COMPLÉTER : préciser les cookies analytiques/publicitaires éventuels et l'outil de gestion du consentement utilisé]</span>.
        </p>
      </div>

      <div className="dark-card">
        <h2>Limitation de responsabilité</h2>
        <p>
          Les recommandations de layering fournies par ParfumLayer sont générées par intelligence
          artificielle à titre indicatif et ne constituent pas un avis professionnel de parfumerie.
          L'éditeur ne saurait être tenu responsable d'une réaction allergique ou d'une insatisfaction
          liée à l'utilisation des associations suggérées.
        </p>
      </div>

      <div className="dark-card">
        <h2>Droit applicable</h2>
        <p>
          Les présentes mentions légales sont soumises au droit français. Tout litige relatif à
          l'utilisation du site relève de la compétence des tribunaux français.
        </p>
      </div>

      <div className="dark-card">
        <h2>Conditions d'utilisation</h2>
        <p>
          L'utilisation du site ParfumLayer est par ailleurs soumise à nos{' '}
          <a href="/cgu">Conditions Générales d'Utilisation</a>.
        </p>
      </div>
    </DarkPageShell>
  )
}
