'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Users, Layers, FileText, Mail, Menu, X } from 'lucide-react'

const LINKS = [
  { href: '/a-propos', label: 'Qui sommes-nous', icon: Users },
  { href: '/ce-que-nous-faisons', label: 'Ce que nous faisons', icon: Layers },
  { href: '/mentions-legales', label: 'Informations légales', icon: FileText },
  { href: '/contact', label: 'Nous contacter', icon: Mail },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Range la nav quand on scrolle vers le bas (pour ne pas cacher le logo de la page),
  // la fait réapparaître dès qu'on remonte. Mutation directe du style (pas de useState
  // par frame) pour éviter de re-render à chaque tick de scroll.
  useEffect(() => {
    let lastY = window.scrollY

    function update() {
      const y = window.scrollY
      const el = wrapRef.current
      if (el) {
        el.style.transform = y > lastY && y > 80 ? 'translateY(-100%)' : 'translateY(0)'
      }
      lastY = y
    }

    let ticking = false
    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { update(); ticking = false })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapRef} className="nav-wrap">
      <style>{`
        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 100;
          transition: transform 0.3s ease;
          will-change: transform;
        }

        .nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: rgba(8, 12, 22, 0.65);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-bottom: 1px solid rgba(56, 189, 248, 0.18);
        }

        .nav-brand {
          font-family: var(--font-cormorant), serif;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 1px;
          color: #E6F1FF;
          text-decoration: none;
        }

        .nav-brand em {
          font-style: italic;
          color: #38BDF8;
        }

        .nav-links {
          display: flex;
          gap: 6px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.5px;
          color: #9FB3C8;
          text-decoration: none;
          border: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #E6F1FF;
          background: rgba(56, 189, 248, 0.08);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .nav-toggle {
          display: none;
          background: none;
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          color: #E6F1FF;
          padding: 7px;
          cursor: pointer;
        }

        .nav-mobile-panel {
          display: none;
          flex-direction: column;
          gap: 4px;
          padding: 12px 16px 18px;
          background: rgba(8, 12, 22, 0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(56, 189, 248, 0.18);
        }

        .nav-mobile-panel.open {
          display: flex;
        }

        .nav-mobile-panel .nav-link {
          padding: 12px 14px;
        }

        @media (max-width: 720px) {
          .nav-links { display: none; }
          .nav-toggle { display: inline-flex; }
        }
      `}</style>

      <header className="nav-bar">
        <Link href="/" className="nav-brand">Parfum<em>Layer</em></Link>

        <nav className="nav-links">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="nav-link">
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className={`nav-mobile-panel ${open ? 'open' : ''}`}>
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="nav-link" onClick={() => setOpen(false)}>
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
