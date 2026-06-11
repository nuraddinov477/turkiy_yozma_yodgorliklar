import { useState, useEffect } from 'react'
import { monuments as api } from '../api'
import { useApp } from '../context/AppContext'
import MonumentModal from '../components/MonumentModal'

export default function Timeline() {
  const { t } = useApp()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.list({ ordering: 'year', page_size: 200 }).then(r => {
      setData(r.data.results || r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Group by century
  const byCentury = {}
  data.forEach(m => {
    if (m.year == null) return
    const century = Math.floor(Math.abs(m.year) / 100) + 1
    const label = m.year < 0 ? `${century} BCE` : `${century}-asr`
    if (!byCentury[label]) byCentury[label] = []
    byCentury[label].push(m)
  })

  const centuries = Object.entries(byCentury).sort(([a], [b]) => {
    const n = s => {
      const m = s.match(/^(\d+)/)
      return m ? (s.includes('BCE') ? -parseInt(m[1]) : parseInt(m[1]))  : 0
    }
    return n(a) - n(b)
  })

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('timeline_title')}</h1>
        {loading && <div className="spinner" />}
        <div style={{ position:'relative' }}>
          {/* Timeline line */}
          <div style={{
            position:'absolute', left:'calc(50% - 1px)', top:0, bottom:0,
            width:'2px', background:'var(--border)',
          }} />
          {centuries.map(([century, items], ci) => (
            <div key={century} style={{
              display:'flex',
              flexDirection: ci % 2 === 0 ? 'row' : 'row-reverse',
              gap:'2rem',
              marginBottom:'2rem',
              alignItems:'flex-start',
            }}>
              {/* Content */}
              <div style={{ flex:1 }}>
                <div className="card">
                  <h3 style={{ color:'var(--accent)', marginBottom:'0.75rem', fontSize:'1.1rem' }}>
                    {century}
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                    {items.map(m => (
                      <button key={m.id} onClick={() => setSelected(m)}
                        style={{
                          textAlign:'left', padding:'0.5rem 0.75rem',
                          background:'var(--bg3)', border:'1px solid var(--border)',
                          borderRadius:'6px', cursor:'pointer', color:'var(--text)',
                          fontSize:'0.85rem', transition:'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background='var(--bg3)'}
                      >
                        <span style={{ color:'var(--accent)', marginRight:'0.5rem' }}>
                          {m.year < 0 ? `${Math.abs(m.year)} BCE` : m.year}
                        </span>
                        {m.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center dot */}
              <div style={{
                flex:'0 0 auto', width:'14px', height:'14px',
                background:'var(--accent)', borderRadius:'50%',
                border:'3px solid var(--bg)',
                marginTop:'1rem',
                zIndex:1,
              }} />

              <div style={{ flex:1 }} />
            </div>
          ))}
        </div>
      </div>
      {selected && <MonumentModal monument={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
