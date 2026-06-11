import { useState, useEffect } from 'react'
import { monuments as api } from '../api'
import { useApp } from '../context/AppContext'

export default function MonumentModal({ monument, onClose }) {
  const { t } = useApp()
  const [detail, setDetail] = useState(null)
  const [tab, setTab] = useState('text')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(monument.id).then(r => {
      setDetail(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [monument.id])

  const data = detail || monument

  const tabs = [
    { key: 'text', label: t('modal_text') },
    { key: 'transliteration', label: t('modal_transliteration') },
    { key: 'translation', label: t('modal_translation') },
    { key: 'info', label: t('modal_info') },
    ...(data.bibliography ? [{ key: 'bibliography', label: t('modal_bibliography') }] : []),
  ]

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize:'1.2rem', marginBottom:'0.2rem' }}>{data.title}</h2>
            {data.title_original && (
              <p style={{ fontSize:'0.9rem', color:'var(--text2)', fontStyle:'italic' }}>{data.title_original}</p>
            )}
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize:'1.4rem', padding:'0.25rem 0.5rem' }}>✕</button>
        </div>

        <div className="modal-tabs">
          {tabs.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={`modal-tab ${tab === tb.key ? 'active' : ''}`}>
              {tb.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {loading && <div className="spinner" />}

          {!loading && tab === 'text' && (
            <pre style={{ fontFamily:'serif', fontSize:'1rem', lineHeight:1.8, whiteSpace:'pre-wrap', color:'var(--text)' }}>
              {data.full_text || '—'}
            </pre>
          )}

          {!loading && tab === 'transliteration' && (
            <pre style={{ fontFamily:'monospace', fontSize:'0.95rem', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
              {data.transliteration || '—'}
            </pre>
          )}

          {!loading && tab === 'translation' && (
            <div style={{ lineHeight:1.8, fontSize:'0.95rem' }}>
              {data.translation || '—'}
            </div>
          )}

          {!loading && tab === 'info' && (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
              <tbody>
                {[
                  [t('modal_year'), data.year ? (data.year < 0 ? `${Math.abs(data.year)} BCE` : data.year) : '—'],
                  [t('modal_location'), data.location],
                  [t('modal_script'), data.script_display || data.script],
                  [t('modal_language'), data.language],
                  [t('modal_words'), data.word_count],
                  [t('modal_lines'), data.line_count],
                  [t('modal_researchers'), data.researchers],
                ].map(([label, value]) => value ? (
                  <tr key={label} style={{ borderBottom:'1px solid var(--border)' }}>
                    <td style={{ padding:'0.6rem', color:'var(--text2)', width:'40%', fontWeight:500 }}>{label}</td>
                    <td style={{ padding:'0.6rem' }}>{value}</td>
                  </tr>
                ) : null)}
              </tbody>
            </table>
          )}

          {!loading && tab === 'bibliography' && (
            <div style={{ lineHeight:1.8, fontSize:'0.9rem', whiteSpace:'pre-wrap' }}>
              {data.bibliography}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
