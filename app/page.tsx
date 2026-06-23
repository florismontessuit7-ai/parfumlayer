'use client'
import { useState } from 'react'
import type { Perfume, Recommendation } from './types'
import { toFr } from '@/lib/accords'

function genderLabel(gender: string) {
  if (gender === 'for women') return 'Femme'
  if (gender === 'for men') return 'Homme'
  if (gender === 'for women and men') return 'Mixte'
  return ''
}

const STYLE_COLORS: Record<string, string> = {
  Classique: '#8B7355',
  Osé:       '#9B6B9B',
  Frais:     '#4A90B8',
  Intense:   '#B85555',
  Signature: '#4A9B7F',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Perfume[]>([])
  const [selected, setSelected] = useState<Perfume | null>(null)
  const [recos, setRecos] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search(q: string) {
    if (!q.trim()) return
    setSearching(true)
    setError(null)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data: { results?: Perfume[] } = await res.json()
      const found = data.results || []
      if (found.length > 0) {
        setResults(found)
        setSelected(null)
        setRecos([])
      } else {
        const custom: Perfume = { id: 0, name: q, brand: '', gender: '', accords: [] }
        await selectPerfume(custom)
      }
    } catch (e) {
      console.error(e)
      setError('La recherche a échoué. Vérifiez votre connexion et réessayez.')
    }
    setSearching(false)
  }

  async function selectPerfume(p: Perfume) {
    setSelected(p)
    setResults([])
    setRecos([])
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfume: p })
      })
      const data: { recos?: Recommendation[]; error?: string } = await res.json()
      if (data.error) throw new Error(data.error)
      setRecos(data.recos || [])
    } catch (e) {
      console.error(e)
      setError('Les recommandations sont indisponibles pour le moment. Réessayez.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;0,500&display=swap');

        * { margin:0; padding:0; box-sizing:border-box; }

        body {
          background: #F9F8F6;
          color: #1A1A1A;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .app {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px 100px;
        }

        /* ── HEADER ── */
        .header {
          padding: 72px 0 64px;
          text-align: center;
          border-bottom: 1px solid #E8E5E0;
          margin-bottom: 56px;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 300;
          letter-spacing: 4px;
          color: #1A1A1A;
          line-height: 1;
        }

        .logo em {
          font-style: italic;
          font-weight: 300;
        }

        .tagline {
          margin-top: 14px;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #999;
        }

        /* ── RECHERCHE ── */
        .search-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 14px;
        }

        .search-row {
          display: flex;
          border: 1px solid #D8D5D0;
          background: #fff;
          transition: border-color 0.2s;
        }

        .search-row:focus-within {
          border-color: #1A1A1A;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 16px 20px;
          font-size: 15px;
          color: #1A1A1A;
          outline: none;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: #BBB;
        }

        .search-btn {
          background: #1A1A1A;
          border: none;
          padding: 16px 22px;
          color: #F9F8F6;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .search-btn:hover { background: #333; }

        /* ── ÉTAT VIDE ── */
        .empty {
          text-align: center;
          padding: 80px 0;
        }

        .empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: #BBB;
          margin-bottom: 10px;
        }

        .empty-sub {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #CCC;
        }

        /* ── RÉSULTATS DE RECHERCHE ── */
        .section-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 20px;
          margin-top: 40px;
        }

        .result-list {
          border-top: 1px solid #E8E5E0;
        }

        .result-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid #E8E5E0;
          cursor: pointer;
          transition: padding-left 0.2s;
          gap: 16px;
        }

        .result-item:hover {
          padding-left: 8px;
        }

        .result-item:hover .result-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .result-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: #1A1A1A;
          line-height: 1.2;
        }

        .result-brand {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          margin-top: 3px;
        }

        .result-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .tag {
          font-size: 10px;
          letter-spacing: 1px;
          padding: 3px 8px;
          background: #F0EDE8;
          color: #888;
          text-transform: uppercase;
        }

        .result-arrow {
          color: #CCC;
          font-size: 18px;
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
        }

        /* ── VUE PARFUM SÉLECTIONNÉ ── */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 40px;
          transition: color 0.2s;
        }

        .back-btn:hover { color: #1A1A1A; }

        .selected-block {
          padding-bottom: 40px;
          border-bottom: 1px solid #E8E5E0;
          margin-bottom: 48px;
        }

        .selected-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 12px;
        }

        .selected-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          color: #1A1A1A;
          line-height: 1.1;
        }

        .selected-brand {
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #888;
          margin-top: 8px;
        }

        .selected-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        /* ── CARTES DE RECOMMANDATION ── */
        .recos-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .recos-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #999;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1A1A1A;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        .reco-card {
          background: #fff;
          border: 1px solid #E8E5E0;
          padding: 28px;
          margin-bottom: 12px;
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .reco-card:hover {
          border-color: #C8C5C0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }

        .reco-card:nth-child(1){animation-delay:0.05s}
        .reco-card:nth-child(2){animation-delay:0.1s}
        .reco-card:nth-child(3){animation-delay:0.15s}
        .reco-card:nth-child(4){animation-delay:0.2s}
        .reco-card:nth-child(5){animation-delay:0.25s}
        .reco-card:nth-child(6){animation-delay:0.3s}
        .reco-card:nth-child(7){animation-delay:0.35s}
        .reco-card:nth-child(8){animation-delay:0.4s}
        .reco-card:nth-child(9){animation-delay:0.45s}
        .reco-card:nth-child(10){animation-delay:0.5s}

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to { opacity:1; transform:translateY(0); }
        }

        .reco-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .reco-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: #1A1A1A;
          line-height: 1.2;
        }

        .reco-brand {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          margin-top: 3px;
        }

        .reco-score {
          text-align: right;
          flex-shrink: 0;
        }

        .score-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          color: #1A1A1A;
          line-height: 1;
        }

        .score-pct {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #BBB;
        }

        .style-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .style-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .reco-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .notes-section {
          margin-bottom: 18px;
        }

        .notes-tier {
          margin-bottom: 10px;
        }

        .notes-tier:last-child {
          margin-bottom: 0;
        }

        .notes-label {
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #BBB;
          margin-bottom: 8px;
        }

        .notes-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .note-pill {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          font-style: italic;
          font-family: 'Cormorant Garamond', serif;
        }

        .note-pill-top {
          background: #FAF8F4;
          color: #777;
        }

        .note-pill-heart {
          background: #F5F3EF;
          color: #555;
        }

        .note-pill-base {
          background: #ECE7DE;
          color: #443;
        }

        .reco-why {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-style: italic;
          color: #666;
          line-height: 1.7;
          border-top: 1px solid #F0EDE8;
          padding-top: 16px;
        }

        /* ── LOADING / ERREUR ── */
        .loading-wrap {
          text-align: center;
          padding: 60px 0;
        }

        .loading-text {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #BBB;
          animation: flicker 1.4s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .error-box {
          border: 1px solid #E8C8C8;
          background: #FDF5F5;
          padding: 16px 20px;
          margin: 20px 0;
        }

        .error-text {
          font-size: 12px;
          letter-spacing: 1px;
          color: #C05555;
        }

        /* ── RESPONSIVE MOBILE ── */
        @media (max-width: 640px) {
          .app { padding: 0 16px 80px; }
          .header { padding: 48px 0 40px; margin-bottom: 36px; }
          .logo { font-size: 36px; letter-spacing: 2px; }
          .tagline { font-size: 10px; letter-spacing: 2px; }
          .search-input { font-size: 14px; padding: 14px 16px; }
          .search-btn { padding: 14px 18px; }
          .result-name { font-size: 19px; }
          .selected-name { font-size: 32px; }
          .reco-card { padding: 20px; }
          .reco-name { font-size: 22px; }
          .score-num { font-size: 28px; }
          .reco-why { font-size: 15px; }
        }

        @media (max-width: 380px) {
          .logo { font-size: 30px; }
          .tagline { display: none; }
          .selected-name { font-size: 26px; }
        }
      `}</style>

      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="logo">Parfum<em>Layer</em></div>
          <div className="tagline">L&apos;art du layering par l&apos;intelligence artificielle</div>
        </div>

        {!selected ? (
          <>
            {/* RECHERCHE */}
            <div className="search-label">Votre fragrance</div>
            <div className="search-row">
              <input
                className="search-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') search(query) }}
                placeholder="Nom, marque ou accord olfactif..."
                suppressHydrationWarning
              />
              <button className="search-btn" onClick={() => search(query)}>→</button>
            </div>

            {error && (
              <div className="error-box">
                <div className="error-text">{error}</div>
              </div>
            )}

            {searching && (
              <div className="loading-wrap">
                <div className="loading-text">Recherche en cours</div>
              </div>
            )}

            {!searching && results.length === 0 && !error && (
              <div className="empty">
                <div className="empty-title">Entrez un parfum pour commencer</div>
                <div className="empty-sub">70 000 fragrances disponibles</div>
              </div>
            )}

            {!searching && results.length > 0 && (
              <>
                <div className="section-label">{results.length} résultat{results.length > 1 ? 's' : ''}</div>
                <div className="result-list">
                  {results.map(p => (
                    <div key={p.id} className="result-item" onClick={() => selectPerfume(p)}>
                      <div>
                        <div className="result-name">{p.name}</div>
                        <div className="result-brand">
                          {p.brand}{genderLabel(p.gender) && ` · ${genderLabel(p.gender)}`}
                        </div>
                        <div className="result-tags">
                          {p.accords.slice(0, 3).map(a => (
                            <span key={a} className="tag">{toFr(a)}</span>
                          ))}
                        </div>
                      </div>
                      <span className="result-arrow">→</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => { setSelected(null); setRecos([]); setQuery('') }}>
              ← Retour
            </button>

            {/* PARFUM SÉLECTIONNÉ */}
            <div className="selected-block">
              <div className="selected-label">Fragrance sélectionnée</div>
              <div className="selected-name">{selected.name}</div>
              <div className="selected-brand">
                {selected.brand}{genderLabel(selected.gender) && ` · ${genderLabel(selected.gender)}`}
              </div>
              <div className="selected-tags">
                {selected.accords.map(a => (
                  <span key={a} className="tag">{toFr(a)}</span>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-box">
                <div className="error-text">{error}</div>
              </div>
            )}

            {loading && (
              <div className="loading-wrap">
                <div className="loading-text">Analyse des accords olfactifs</div>
              </div>
            )}

            {recos.length > 0 && (
              <>
                <div className="recos-header">
                  <div className="live-dot" />
                  <div className="recos-label">Recommandations de layering</div>
                </div>

                {recos.map((r, i) => {
                  const color = STYLE_COLORS[r.style] ?? '#888'
                  return (
                    <div key={i} className="reco-card">
                      <div className="reco-top">
                        <div>
                          <div className="reco-name">{r.name}</div>
                          <div className="reco-brand">
                            {r.brand}{genderLabel(r.gender) && ` · ${genderLabel(r.gender)}`}
                          </div>
                        </div>
                        <div className="reco-score">
                          <div className="score-num">{r.score}</div>
                          <div className="score-pct">% match</div>
                        </div>
                      </div>

                      <div className="style-badge" style={{ color }}>
                        <span className="style-dot" style={{ background: color }} />
                        {r.style}
                      </div>

                      <div className="reco-tags">
                        {r.accords.map(a => (
                          <span key={a} className="tag">{toFr(a)}</span>
                        ))}
                      </div>

                      {(r.notes.top.length > 0 || r.notes.heart.length > 0 || r.notes.base.length > 0) && (
                        <div className="notes-section">
                          {r.notes.top.length > 0 && (
                            <div className="notes-tier">
                              <div className="notes-label">Tête</div>
                              <div className="notes-list">
                                {r.notes.top.map(n => (
                                  <span key={n} className="note-pill note-pill-top">{n}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {r.notes.heart.length > 0 && (
                            <div className="notes-tier">
                              <div className="notes-label">Cœur</div>
                              <div className="notes-list">
                                {r.notes.heart.map(n => (
                                  <span key={n} className="note-pill note-pill-heart">{n}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {r.notes.base.length > 0 && (
                            <div className="notes-tier">
                              <div className="notes-label">Fond</div>
                              <div className="notes-list">
                                {r.notes.base.map(n => (
                                  <span key={n} className="note-pill note-pill-base">{n}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="reco-why">{r.why}</div>
                    </div>
                  )
                })}
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
