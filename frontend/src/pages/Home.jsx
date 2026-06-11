import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { monuments as api } from '../api'
import { useApp } from '../context/AppContext'
import MonumentCard from '../components/MonumentCard'
import MonumentModal from '../components/MonumentModal'

export default function Home() {
  const { t } = useApp()
  const [featured, setFeatured] = useState([])
  const [stats, setStats] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.featured().then(r => setFeatured(r.data.slice(0, 6))).catch(() => {})
    api.stats().then(r => setStats(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 0 4rem',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ fontSize:'3rem', marginBottom:'1rem', letterSpacing:'0.1em', color:'var(--accent)' }}>
            𐰴𐰃𐰔 𐱃𐰇𐰼𐰚
          </div>
          <h1 style={{ fontSize:'2.5rem', fontWeight:700, marginBottom:'0.5rem' }}>
            {t('hero_title')}
          </h1>
          <p style={{ fontSize:'1.3rem', color:'var(--accent)', marginBottom:'1rem' }}>
            {t('hero_subtitle')}
          </p>
          <p style={{ fontSize:'1rem', color:'var(--text2)', maxWidth:'600px', margin:'0 auto 2rem' }}>
            {t('hero_desc')}
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/monuments" className="btn btn-primary" style={{ fontSize:'1rem', padding:'0.75rem 2rem' }}>
              {t('hero_explore')}
            </Link>
            <Link to="/submit" className="btn btn-outline" style={{ fontSize:'1rem', padding:'0.75rem 2rem' }}>
              {t('hero_submit')}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      {stats && (
        <section style={{ background:'var(--bg3)', borderBottom:'1px solid var(--border)', padding:'1.5rem 0' }}>
          <div className="container" style={{ display:'flex', justifyContent:'center', gap:'3rem', flexWrap:'wrap' }}>
            {[
              { label: t('stats_total'), value: stats.total },
              { label: t('stats_words'), value: stats.totalWords?.toLocaleString() || 0 },
              { label: t('stats_views'), value: stats.totalViews?.toLocaleString() || 0 },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'2rem', fontWeight:700, color:'var(--accent)' }}>{value}</div>
                <div style={{ fontSize:'0.85rem', color:'var(--text2)' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick nav */}
      <section className="container" style={{ padding:'3rem 1rem' }}>
        <div className="grid grid-3" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))' }}>
          {[
            { to:'/timeline', icon:'📅', label:t('nav_timeline') },
            { to:'/scripts', icon:'✍️', label:t('nav_scripts') },
            { to:'/stats', icon:'📊', label:t('nav_stats') },
            { to:'/concordance', icon:'🔍', label:t('nav_concordance') },
            { to:'/compare', icon:'⚖️', label:t('nav_compare') },
            { to:'/bibliography', icon:'📚', label:t('nav_bibliography') },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="card" style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              gap:'0.5rem', textAlign:'center', color:'var(--text)',
              transition:'transform 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform=''}
            >
              <span style={{ fontSize:'1.8rem' }}>{icon}</span>
              <span style={{ fontWeight:500, fontSize:'0.9rem' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured monuments */}
      {featured.length > 0 && (
        <section className="container" style={{ paddingBottom:'3rem', paddingLeft:'1rem', paddingRight:'1rem' }}>
          <h2 className="page-title">★ {t('nav_monuments')}</h2>
          <div className="grid grid-2">
            {featured.map(m => (
              <MonumentCard key={m.id} monument={m} onClick={setSelected} />
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
            <Link to="/monuments" className="btn btn-outline">{t('hero_explore')} →</Link>
          </div>
        </section>
      )}

      {selected && <MonumentModal monument={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
