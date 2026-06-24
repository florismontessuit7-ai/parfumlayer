import type { Metadata } from 'next'
import DarkPageShell from '../components/DarkPageShell'
import ContactForm from '../components/ContactForm'

export const metadata: Metadata = {
  title: "Contact - ParfumLayer",
  description: "Contactez l'équipe ParfumLayer.",
}

export default function ContactPage() {
  return (
    <DarkPageShell eyebrow="Nous contacter" title="Parlons layering">
      <div className="dark-card">
        <p>
          Une question, une suggestion de fonctionnalité, ou une combinaison de layering à nous
          partager ? Écrivez-nous via le formulaire ci-dessous.
        </p>
      </div>

      <ContactForm />
    </DarkPageShell>
  )
}
