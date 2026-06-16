'use client'
import { useState } from 'react'
import type { Perfume, Recommendation } from './types'

function genderLabel(gender: string) {
  if (gender === 'for women') return 'Femme'
  if (gender === 'for men') return 'Homme'
  if (gender === 'for women and men') return 'Mixte'
  return ''
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Josefin+Sans:wght@100;300;400&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#050508; color:#e8e0d0; font-family:'Josefin Sans',sans-serif; min-height:100vh; }
        .bg { position:fixed; inset:0; z-index:0; background: radial-gradient(ellipse at 20% 50%, rgba(80,40,120,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(40,80,120,0.1) 0%, transparent 60%); pointer-events:none; }
        .app { position:relative; z-index:1; max-width:720px; margin:0 auto; padding:0 24px 80px; }
        .header { padding:60px 0 48px; text-align:center; }
        .logo-mark { display:inline-flex; align-items:center; gap:12px; margin-bottom:16px; }
        .logo-dot { width:6px; height:6px; border-radius:50%; background:#d4af37; box-shadow:0 0 12px rgba(212,175,55,0.6); }
        .logo-line { width:40px; height:0.5px; background:linear-gradient(90deg, transparent, #d4af37, transparent); }
        .title { font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:300; letter-spacing:8px; color:#f0e8d8; line-height:1; }
        .title span { color:#d4af37; }
        .subtitle { font-size:10px; letter-spacing:6px; color:rgba(212,175,55,0.6); margin-top:12px; text-transform:uppercase; }
        .search-section { margin-bottom:40px; }
        .search-label { font-size:9px; letter-spacing:5px; color:rgba(212,175,55,0.5); text-transform:uppercase; margin-bottom:16px; text-align:center; }
        .search-wrap { position:relative; display:flex; gap:0; }
        .search-input { flex:1; background:rgba(255,255,255,0.03); border:0.5px solid rgba(212,175,55,0.2); border-right:none; padding:16px 24px; font-family:'Josefin Sans',sans-serif; font-size:13px; letter-spacing:2px; color:#e8e0d0; outline:none; transition:border-color 0.3s; }
        .search-input::placeholder { color:rgba(232,224,208,0.3); letter-spacing:2px; }
        .search-input:focus { border-color:rgba(212,175,55,0.5); }
        .search-btn { background:rgba(212,175,55,0.1); border:0.5px solid rgba(212,175,55,0.2); padding:16px 20px; color:#d4af37; font-size:18px; cursor:pointer; transition:all 0.3s; flex-shrink:0; }
        .search-btn:hover { background:rgba(212,175,55,0.2); }
        .chips { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:16px; }
        .chip { font-size:9px; letter-spacing:3px; padding:6px 14px; border:0.5px solid rgba(212,175,55,0.15); color:rgba(212,175,55,0.5); cursor:pointer; text-transform:uppercase; transition:all 0.3s; }
        .chip:hover { border-color:rgba(212,175,55,0.4); color:rgba(212,175,55,0.9); background:rgba(212,175,55,0.05); }
        .divider { display:flex; align-items:center; gap:16px; margin:32px 0; }
        .divider-line { flex:1; height:0.5px; background:linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent); }
        .divider-text { font-size:8px; letter-spacing:4px; color:rgba(212,175,55,0.3); text-transform:uppercase; }
        .perf-card { background:rgba(255,255,255,0.02); border:0.5px solid rgba(212,175,55,0.12); padding:20px 24px; margin-bottom:8px; cursor:pointer; transition:all 0.3s; display:flex; align-items:center; gap:20px; }
        .perf-card:hover { background:rgba(212,175,55,0.04); border-color:rgba(212,175,55,0.3); transform:translateX(4px); }
        .perf-num { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; color:rgba(212,175,55,0.2); min-width:32px; }
        .perf-info { flex:1; }
        .perf-name { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; color:#f0e8d8; letter-spacing:1px; }
        .perf-brand { font-size:9px; letter-spacing:4px; color:rgba(212,175,55,0.5); text-transform:uppercase; margin-top:2px; }
        .perf-notes { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
        .note { font-size:8px; letter-spacing:2px; padding:3px 8px; border:0.5px solid rgba(212,175,55,0.1); color:rgba(232,224,208,0.4); text-transform:uppercase; }
        .arrow { color:rgba(212,175,55,0.3); font-size:18px; }
        .selected-header { margin-bottom:32px; }
        .selected-label { font-size:8px; letter-spacing:5px; color:rgba(212,175,55,0.4); text-transform:uppercase; margin-bottom:8px; }
        .selected-name { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; color:#f0e8d8; letter-spacing:2px; }
        .selected-brand { font-size:9px; letter-spacing:4px; color:#d4af37; text-transform:uppercase; margin-top:4px; }
        .selected-notes { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
        .back-btn { display:inline-flex; align-items:center; gap:8px; font-size:8px; letter-spacing:4px; color:rgba(212,175,55,0.4); cursor:pointer; text-transform:uppercase; border:none; background:none; margin-bottom:32px; transition:color 0.3s; }
        .back-btn:hover { color:rgba(212,175,55,0.8); }
        .recos-label { font-size:8px; letter-spacing:5px; color:rgba(212,175,55,0.4); text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:12px; }
        .live-dot { width:5px; height:5px; border-radius:50%; background:#d4af37; box-shadow:0 0 8px rgba(212,175,55,0.8); animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .reco-card { background:rgba(255,255,255,0.02); border:0.5px solid rgba(212,175,55,0.12); padding:24px; margin-bottom:12px; transition:all 0.3s; animation:fadeIn 0.5s ease forwards; opacity:0; }
        .reco-card:nth-child(1){animation-delay:0.05s} .reco-card:nth-child(2){animation-delay:0.1s} .reco-card:nth-child(3){animation-delay:0.15s} .reco-card:nth-child(4){animation-delay:0.2s} .reco-card:nth-child(5){animation-delay:0.25s} .reco-card:nth-child(6){animation-delay:0.3s} .reco-card:nth-child(7){animation-delay:0.35s} .reco-card:nth-child(8){animation-delay:0.4s} .reco-card:nth-child(9){animation-delay:0.45s} .reco-card:nth-child(10){animation-delay:0.5s}
        @keyframes fadeIn { to{opacity:1} }
        .reco-card:hover { background:rgba(212,175,55,0.04); border-color:rgba(212,175,55,0.25); }
        .reco-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
        .reco-name { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:300; color:#f0e8d8; }
        .reco-brand { font-size:9px; letter-spacing:4px; color:rgba(212,175,55,0.5); text-transform:uppercase; margin-top:2px; }
        .reco-score { text-align:right; }
        .score-num { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:#d4af37; line-height:1; }
        .score-label { font-size:7px; letter-spacing:3px; color:rgba(212,175,55,0.4); text-transform:uppercase; }
        .reco-accords { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
        .accord { font-size:8px; letter-spacing:2px; padding:4px 10px; border:0.5px solid rgba(212,175,55,0.15); color:rgba(212,175,55,0.6); text-transform:uppercase; }
        .reco-why { border-top:0.5px solid rgba(212,175,55,0.08); padding-top:14px; font-style:italic; font-family:'Cormorant Garamond',serif; font-size:15px; color:rgba(232,224,208,0.5); line-height:1.7; }
        .loading-wrap { text-align:center; padding:48px 0; }
        .loading-text { font-size:9px; letter-spacing:5px; color:rgba(212,175,55,0.4); text-transform:uppercase; animation:flicker 1.5s infinite; }
        @keyframes flicker { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .empty { text-align:center; padding:48px; }
        .empty-icon { font-family:'Cormorant Garamond',serif; font-size:48px; color:rgba(212,175,55,0.1); margin-bottom:12px; }
        .empty-text { font-size:9px; letter-spacing:4px; color:rgba(212,175,55,0.3); text-transform:uppercase; }
        .error-box { border:0.5px solid rgba(220,60,60,0.3); background:rgba(220,60,60,0.05); padding:16px 24px; margin:16px 0; text-align:center; }
        .error-text { font-size:10px; letter-spacing:3px; color:rgba(220,100,100,0.8); text-transform:uppercase; }
        @media (max-width:640px) {
          .app { padding:0 16px 60px; }
          .header { padding:40px 0 28px; }
          .title { font-size:36px; letter-spacing:4px; }
          .subtitle { font-size:9px; letter-spacing:3px; }
          .search-input { font-size:12px; letter-spacing:1px; padding:14px 16px; }
          .chips { gap:6px; }
          .chip { font-size:8px; letter-spacing:2px; padding:5px 10px; }
          .perf-card { padding:14px 16px; gap:12px; }
          .perf-num { font-size:22px; min-width:24px; }
          .perf-name { font-size:18px; }
          .perf-brand { font-size:8px; letter-spacing:2px; }
          .selected-name { font-size:28px; letter-spacing:1px; }
          .selected-brand { font-size:8px; letter-spacing:2px; }
          .reco-card { padding:18px 16px; }
          .reco-name { font-size:20px; }
          .reco-brand { font-size:8px; letter-spacing:2px; }
          .score-num { font-size:26px; }
          .reco-why { font-size:14px; }
          .back-btn { font-size:8px; letter-spacing:3px; }
          .divider-text { font-size:7px; letter-spacing:3px; }
          .recos-label { font-size:7px; letter-spacing:3px; }
        }
        @media (max-width:380px) {
          .title { font-size:30px; letter-spacing:3px; }
          .subtitle { display:none; }
          .perf-name { font-size:16px; }
          .selected-name { font-size:24px; }
          .reco-name { font-size:18px; }
          .chips { display:none; }
        }
      `}</style>

      <div className="bg" />

      <div className="app">
        <div className="header">
          <div className="logo-mark">
            <div className="logo-line" />
            <div className="logo-dot" />
            <div className="logo-line" />
          </div>
          <div className="title">Parfum<span>Layer</span></div>
          <div className="subtitle">L&apos;art du layering par l&apos;intelligence artificielle</div>
        </div>

        {!selected ? (
          <>
            <div className="search-section">
              <div className="search-label">Votre fragrance</div>
              <div className="search-wrap">
                <input
                  className="search-input"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') search(query) }}
                  placeholder="Nom, marque ou note olfactive..."
                  suppressHydrationWarning
                />
                <button className="search-btn" onClick={() => search(query)}>→</button>
              </div>
              <div className="chips">
                {['Sauvage', 'Black Opium', 'Aventus', 'Libre', 'Bleu de Chanel'].map(n => (
                  <span key={n} className="chip" onClick={() => { setQuery(n); search(n) }}>{n}</span>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-box">
                <div className="error-text">{error}</div>
              </div>
            )}

            {searching && (
              <div className="loading-wrap">
                <div className="loading-text">Recherche en cours...</div>
              </div>
            )}

            {!searching && results.length === 0 && query === '' && (
              <div className="empty">
                <div className="empty-icon">◈</div>
                <div className="empty-text">Entrez votre parfum pour commencer</div>
              </div>
            )}

            {!searching && results.length > 0 && (
              <>
                <div className="divider">
                  <div className="divider-line" />
                  <div className="divider-text">Résultats</div>
                  <div className="divider-line" />
                </div>
                {results.map((p, i) => (
                  <div key={p.id} className="perf-card" onClick={() => selectPerfume(p)}>
                    <div className="perf-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="perf-info">
                      <div className="perf-name">{p.name}</div>
                      <div className="perf-brand">{p.brand}{genderLabel(p.gender) && ` — ${genderLabel(p.gender)}`}</div>
                      <div className="perf-notes">
                        {p.accords.slice(0, 3).map(a => <span key={a} className="note">{a}</span>)}
                      </div>
                    </div>
                    <div className="arrow">→</div>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => { setSelected(null); setRecos([]); setQuery('') }}>
              ← Retour
            </button>

            <div className="selected-header">
              <div className="selected-label">Fragrance sélectionnée</div>
              <div className="selected-name">{selected.name}</div>
              <div className="selected-brand">{selected.brand}{genderLabel(selected.gender) && ` — ${genderLabel(selected.gender)}`}</div>
              <div className="selected-notes">
                {selected.accords.map(a => <span key={a} className="note">{a}</span>)}
              </div>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <div className="divider-text">Accords suggérés</div>
              <div className="divider-line" />
            </div>

            <div className="recos-label">
              <div className="live-dot" />
              Recommandations par intelligence artificielle
            </div>

            {error && (
              <div className="error-box">
                <div className="error-text">{error}</div>
              </div>
            )}

            {loading && (
              <div className="loading-wrap">
                <div className="loading-text">Analyse des accords olfactifs en cours...</div>
              </div>
            )}

            {recos.map((r, i) => (
              <div key={i} className="reco-card">
                <div className="reco-top">
                  <div>
                    <div className="reco-name">{r.name}</div>
                    <div className="reco-brand">{r.brand}{genderLabel(r.gender) && ` — ${genderLabel(r.gender)}`}</div>
                  </div>
                  <div className="reco-score">
                    <div className="score-num">{r.score}</div>
                    <div className="score-label">% match</div>
                  </div>
                </div>
                <div className="reco-accords">
                  {r.accords.map(a => <span key={a} className="accord">{a}</span>)}
                </div>
                <div className="reco-why">{r.why}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
