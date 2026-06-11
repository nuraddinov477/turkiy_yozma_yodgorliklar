import { useApp } from '../context/AppContext'

export default function MonumentCard({ monument, onClick }) {
  const { t } = useApp()

  const yearLabel = monument.year
    ? (monument.year < 0 ? `${Math.abs(monument.year)} BCE` : `${monument.year}`)
    : '—'

  return (
    <div className="card" onClick={() => onClick(monument)} style={{
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {monument.image && (
        <div style={{ borderRadius:'6px', overflow:'hidden', height:'140px' }}>
          <img src={monument.image} alt={monument.title}
            style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
      )}

      <div>
        <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginBottom:'0.3rem' }}>
          {monument.script_display || monument.script}
          {monument.category && <> · {monument.category}</>}
        </div>
        <h3 style={{ fontSize:'1rem', fontWeight:600, lineHeight:1.3, marginBottom:'0.4rem' }}>
          {monument.title}
        </h3>
        {monument.title_original && (
          <p style={{ fontSize:'0.85rem', color:'var(--text2)', fontStyle:'italic', marginBottom:'0.3rem' }}>
            {monument.title_original}
          </p>
        )}
        {monument.description && (
          <p style={{ fontSize:'0.85rem', color:'var(--text2)', lineHeight:1.5,
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {monument.description}
          </p>
        )}
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginTop:'auto' }}>
        {monument.year && <span className="badge">{yearLabel}</span>}
        {monument.location && <span className="badge">{monument.location}</span>}
        {monument.word_count > 0 && (
          <span className="badge">{monument.word_count} {t('card_words')}</span>
        )}
        {monument.featured && <span className="badge badge-accent">★</span>}
      </div>
    </div>
  )
}
