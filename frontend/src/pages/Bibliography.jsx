import { useState, useEffect } from 'react'
import { monuments as api } from '../api'
import { useApp } from '../context/AppContext'

export default function Bibliography() {
  const { t } = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.list({ ordering: 'year', page_size: 200 }).then(r => {
      const data = (r.data.results || r.data)
        .filter(m => m.researchers || m.bibliography)
      setItems(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = items.filter(m => {
    const q = search.toLowerCase()
    return !q || m.title.toLowerCase().includes(q) ||
      (m.researchers || '').toLowerCase().includes(q) ||
      (m.bibliography || '').toLowerCase().includes(q)
  })

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('bibliography_title')}</h1>
        <input type="search" placeholder={t('search_placeholder')} value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom:'1.5rem', maxWidth:'400px', display:'block' }} />

        {loading && <div className="spinner" />}

        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {filtered.map(m => (
            <div key={m.id} className="card">
              <h3 style={{ color:'var(--accent)', marginBottom:'0.5rem' }}>{m.title}</h3>
              {m.year && <p style={{ fontSize:'0.8rem', color:'var(--text2)', marginBottom:'0.5rem' }}>
                {m.year < 0 ? `${Math.abs(m.year)} BCE` : m.year}
                {m.location && ` · ${m.location}`}
              </p>}
              {m.researchers && (
                <p style={{ fontSize:'0.9rem', marginBottom:'0.4rem' }}>
                  <strong>Tadqiqotchilar:</strong> {m.researchers}
                </p>
              )}
              {m.bibliography && (
                <pre style={{ fontSize:'0.85rem', whiteSpace:'pre-wrap', color:'var(--text2)', lineHeight:1.6 }}>
                  {m.bibliography}
                </pre>
              )}
            </div>
          ))}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:'center', color:'var(--text2)', padding:'2rem' }}>{t('no_results')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
