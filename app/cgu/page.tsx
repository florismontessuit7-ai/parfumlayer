import type { Metadata } from 'next'
import DarkPageShell from '../components/DarkPageShell'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - ParfumLayer",
  description: "Conditions Générales d'Utilisation du site ParfumLayer.",
}

const SECTIONS = [
  { id: 'objet', label: '1. Objet' },
  { id: 'acces', label: '2. Accès au service et création de compte' },
  { id: 'description', label: '3. Description du service et des recommandations IA' },
  { id: 'propriete', label: '4. Propriété intellectuelle' },
  { id: 'obligations', label: '5. Obligations de l’utilisateur' },
  { id: 'responsabilite', label: '6. Limitation de responsabilité' },
  { id: 'donnees', label: '7. Données personnelles' },
  { id: 'modification', label: '8. Modification des CGU' },
  { id: 'droit', label: '9. Droit applicable et juridiction' },
]

export default function CguPage() {
  return (
    <DarkPageShell eyebrow="Informations légales" title="Conditions Générales d'Utilisation">
      <style>{`
        .cgu-toc {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cgu-toc a {
          font-size: 13px;
        }

        .cgu-card h2 {
          scroll-margin-top: 90px;
        }
      `}</style>

      <div className="dark-card">
        <h2>Sommaire</h2>
        <nav className="cgu-toc">
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`}>{s.label}</a>
          ))}
        </nav>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="objet">1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les
          modalités et conditions dans lesquelles ParfumLayer met à disposition des utilisateurs son
          service en ligne de recommandation d'associations de superposition de parfums (« layering »),
          basé sur une intelligence artificielle et une base de données olfactives.
        </p>
        <p>
          L'utilisation du site ParfumLayer implique l'acceptation pleine et entière des présentes CGU.
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="acces">2. Accès au service et création de compte</h2>
        <p>
          Le service est accessible gratuitement à toute personne disposant d'un accès à internet.
          Aucune création de compte n'est requise pour effectuer une recherche ou obtenir des
          recommandations de layering.
        </p>
        <p>
          <span className="dark-placeholder">[À COMPLÉTER : si une création de compte ou un abonnement payant est ajouté ultérieurement, préciser ici les modalités d'inscription, les conditions d'accès aux fonctionnalités payantes, et les conditions de résiliation.]</span>
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="description">3. Description du service et des recommandations IA</h2>
        <p>
          ParfumLayer permet à l'utilisateur de rechercher un parfum dans une base de plus de 70 000
          fragrances, puis de recevoir des suggestions d'associations de layering générées par une
          intelligence artificielle, accompagnées d'un score de compatibilité, d'un style et d'une
          explication.
        </p>
        <p>
          Ces recommandations sont fournies <strong>à titre purement indicatif</strong>. Elles résultent
          d'un traitement automatisé fondé sur des données olfactives publiques (accords, familles,
          pyramides de notes) et ne constituent ni un avis professionnel de parfumerie, ni une garantie
          de résultat olfactif. Le ressenti final d'une association de parfums dépend de nombreux
          facteurs propres à chaque utilisateur (chimie de peau, quantité appliquée, conditions
          environnementales) sur lesquels ParfumLayer n'a aucun contrôle. ParfumLayer ne saurait donc
          être tenu responsable du résultat olfactif obtenu par l'utilisateur.
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="propriete">4. Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments composant le site ParfumLayer (code source, design, structure,
          textes, logo, identité visuelle et tout autre contenu) est la propriété exclusive de{' '}
          <span className="dark-placeholder">[À COMPLÉTER : votre nom ou raison sociale]</span> et est
          protégé par le droit d'auteur et le droit de la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction, représentation, diffusion, modification ou réutilisation, totale ou
          partielle, de ces éléments, par quelque procédé que ce soit, sans autorisation écrite
          préalable, est strictement interdite et pourra faire l'objet de poursuites.
        </p>
        <p>
          Les noms de marques et de parfums référencés dans la base de données appartiennent à leurs
          propriétaires respectifs et sont cités à titre informatif, sans lien d'affiliation sauf
          mention contraire.
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="obligations">5. Obligations de l'utilisateur</h2>
        <p>L'utilisateur s'engage à :</p>
        <ul>
          <li>Utiliser le service conformément à sa destination et aux présentes CGU ;</li>
          <li>Ne pas tenter de perturber, surcharger ou détourner le fonctionnement du service
            (extraction massive de données, usage de robots ou scripts automatisés non autorisés,
            tentative d'intrusion) ;</li>
          <li>Ne pas utiliser le service à des fins frauduleuses, illicites ou contraires à l'ordre
            public ;</li>
          <li>Ne pas reproduire ou exploiter commercialement les recommandations générées sans
            autorisation.</li>
        </ul>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="responsabilite">6. Limitation de responsabilité</h2>
        <p>
          ParfumLayer met en œuvre tous les moyens raisonnables pour assurer un service fiable et
          disponible, sans pouvoir garantir une disponibilité continue ni l'absence d'erreurs. Le
          service est fourni « en l'état », sans garantie d'aucune sorte.
        </p>
        <p>
          ParfumLayer ne pourra être tenu responsable des dommages directs ou indirects résultant de
          l'utilisation ou de l'impossibilité d'utiliser le service, y compris en cas de réaction
          allergique, d'insatisfaction olfactive ou de perte de données.
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="donnees">7. Données personnelles</h2>
        <p>
          Les données personnelles collectées via le site (notamment via le formulaire de contact) sont
          traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
          Informatique et Libertés.
          <span className="dark-placeholder"> [À COMPLÉTER : si une politique de confidentialité dédiée est créée, ajouter ici un lien vers cette page.]</span>
        </p>
        <p>
          Pour plus de détails, consultez nos <a href="/mentions-legales">mentions légales</a>.
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="modification">8. Modification des CGU</h2>
        <p>
          ParfumLayer se réserve le droit de modifier les présentes CGU à tout moment, notamment pour
          les adapter aux évolutions du service ou de la réglementation. La version en vigueur est
          celle publiée sur le site à la date de consultation. Il est recommandé à l'utilisateur de
          consulter régulièrement cette page.
        </p>
      </div>

      <div className="dark-card cgu-card">
        <h2 id="droit">9. Droit applicable et juridiction</h2>
        <p>
          Les présentes CGU sont régies par le droit français. En cas de litige et à défaut de
          résolution amiable, compétence exclusive est attribuée aux tribunaux français.
        </p>
      </div>
    </DarkPageShell>
  )
}
