import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <style>{`
        .site-footer {
          background: #060B14;
          border-top: 1px solid rgba(56, 189, 248, 0.18);
          padding: 32px 24px;
        }

        .footer-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-links a {
          font-size: 12px;
          letter-spacing: 0.5px;
          color: #9FB3C8;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #38BDF8;
        }

        .footer-copyright {
          font-size: 11px;
          letter-spacing: 0.5px;
          color: #5B6F80;
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-inner">
          <nav className="footer-links">
            <Link href="/cgu">CGU</Link>
          </nav>
          <div className="footer-copyright">© {new Date().getFullYear()} ParfumLayer</div>
        </div>
      </footer>
    </>
  )
}
