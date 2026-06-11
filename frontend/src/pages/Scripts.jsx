import { useState, useEffect } from 'react'
import { monuments as api } from '../api'
import { useApp } from '../context/AppContext'
import MonumentCard from '../components/MonumentCard'
import MonumentModal from '../components/MonumentModal'

const SCRIPT_INFO = {
  'Orxun-Enasoy': {
    desc: "Qadimgi turkiy runik yozuvi. VII-X asrlarda qo'llanilgan.",
    sample: '𐰴𐰃𐰔 𐱃𐰇𐰼𐰚 𐰉𐰆𐰑𐰣',
  },
  "Uyg'ur": {
    desc: "O'rta asrlar uyg'ur yozuvi. VIII-XVIII asrlarda qo'llanilgan.",
    sample: 'ᠤᠶᠭᠤᠷ ᠪᠢᠴᠢᠭ᠌',
  },
  'Arab': {
    desc: "Arab alifbosi asosida turkiy yozuv. X asrdan hozirgi kungacha.",
    sample: 'خط عربی',
  },
  "Mug'al": {
    desc: "Mo'g'ul-turkiy davri yozuvi.",
    sample: 'ᠮᠣᠩᠭᠣᠯ',
  },
}

export default function Scripts() {
  const { t } = useApp()
  const [byScript, setByScript] = useState({})
  const [activeScript, setActiveScript] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.list({ ordering: 'year', page_size: 200 }).then(r => {
      const items = r.data.results || r.data
      const grouped = {}
      items.forEach(m => {
        const key = m.script || 'Boshqa'
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(m)
      })
      setByScript(grouped)
      setActiveScript(Object.keys(grouped)[0] || null)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('scripts_title')}</h1>
        {loading && <div className="spinner" />}

        {!loading && (
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
            {/* Script list */}
            <div style={{ flex:'0 0 220px', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {Object.entries(byScript).map(([script, items]) => (
                <button key={script}
                  onClick={() => setActiveScript(script)}
                  className={`card ${activeScript === script ? 'badge-accent' : ''}`}
                  style={{
                    textAlign:'left', cursor:'pointer',
                    border: activeScript === script ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: activeScript === script ? 'rgba(201,168,76,0.1)' : 'var(--bg2)',
                    color:'var(--text)',
                  }}>
                  <div style={{ fontWeight:600, fontSize:'0.95rem' }}>{script}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text2)' }}>{items.length} ta yodgorlik</div>
                  {SCRIPT_INFO[script] && (
                    <div style={{ fontSize:'1.1rem', marginTop:'0.25rem', letterSpacing:'0.05em' }}>
                      {SCRIPT_INFO[script].sample}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Monuments in script */}
            <div style={{ flex:1, minWidth:0 }}>
              {activeScript && (
                <>
                  {SCRIPT_INFO[activeScript] && (
                    <div className="card" style={{ marginBottom:'1rem', background:'rgba(201,168,76,0.05)', borderColor:'var(--accent)' }}>
                      <p style={{ color:'var(--text2)' }}>{SCRIPT_INFO[activeScript].desc}</p>
                    </div>
                  )}
                  <div className="grid grid-2">
                    {(byScript[activeScript] || []).map(m => (
                      <MonumentCard key={m.id} monument={m} onClick={setSelected} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {selected && <MonumentModal monument={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
