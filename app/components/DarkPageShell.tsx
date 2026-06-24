export default function DarkPageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        .dark-page {
          min-height: 100vh;
          background: radial-gradient(ellipse 1200px 600px at 50% -10%, rgba(56, 189, 248, 0.16), transparent 60%), #060B14;
          padding: 64px 24px 120px;
        }

        .dark-shell {
          max-width: 720px;
          margin: 0 auto;
        }

        .dark-eyebrow {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #38BDF8;
          margin-bottom: 14px;
        }

        .dark-title {
          font-family: var(--font-cormorant), serif;
          font-size: 44px;
          font-weight: 300;
          color: #E6F1FF;
          line-height: 1.1;
          margin-bottom: 40px;
        }

        .dark-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(56, 189, 248, 0.18);
          border-radius: 18px;
          padding: 36px;
          margin-bottom: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .dark-card h2 {
          font-family: var(--font-cormorant), serif;
          font-weight: 400;
          font-size: 22px;
          color: #E6F1FF;
          margin-bottom: 12px;
        }

        .dark-card p, .dark-card li {
          font-size: 14.5px;
          line-height: 1.75;
          color: #AEC0D2;
        }

        .dark-card p + p {
          margin-top: 12px;
        }

        .dark-card ul {
          padding-left: 18px;
          margin-top: 8px;
        }

        .dark-card a {
          color: #38BDF8;
          text-decoration: none;
        }

        .dark-card a:hover {
          text-decoration: underline;
        }

        .dark-placeholder {
          color: #5B8AA6;
          font-style: italic;
        }

        @media (max-width: 640px) {
          .dark-title { font-size: 32px; }
          .dark-card { padding: 24px; }
        }
      `}</style>

      <div className="dark-page">
        <div className="dark-shell">
          <div className="dark-eyebrow">{eyebrow}</div>
          <div className="dark-title">{title}</div>
          {children}
        </div>
      </div>
    </>
  )
}
