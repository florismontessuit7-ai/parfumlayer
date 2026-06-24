'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="dark-card">
        <h2>Message envoyé</h2>
        <p>
          Merci, {name || 'votre message'} a bien été reçu. Nous vous répondrons à {email} dans les
          plus brefs délais.
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .contact-field {
          margin-bottom: 18px;
        }

        .contact-field label {
          display: block;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7C8B9C;
          margin-bottom: 8px;
        }

        .contact-field input,
        .contact-field textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(56, 189, 248, 0.22);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          color: #E6F1FF;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .contact-field input:focus,
        .contact-field textarea:focus {
          border-color: #38BDF8;
          background: rgba(56, 189, 248, 0.06);
        }

        .contact-field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-submit {
          background: linear-gradient(135deg, #38BDF8, #22D3EE);
          border: none;
          border-radius: 10px;
          padding: 13px 28px;
          font-size: 13px;
          letter-spacing: 1px;
          color: #06121C;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .contact-submit:hover {
          opacity: 0.88;
        }
      `}</style>

      <form className="dark-card" onSubmit={handleSubmit}>
        <div className="contact-field">
          <label htmlFor="contact-name">Nom</label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">E-mail</label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="contact-submit">Envoyer le message</button>
      </form>
    </>
  )
}
