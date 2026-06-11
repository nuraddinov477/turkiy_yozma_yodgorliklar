import { useState } from 'react'
import { submit } from '../api'
import { useApp } from '../context/AppContext'

const SCRIPTS = ['Orxun-Enasoy', "Uyg'ur", 'Arab', "Mug'al", 'Kiril', 'Boshqa']
const CATEGORIES = ['Epigrafiya', "Qo'lyozma", 'Yozishmalar', 'Shoir asari', 'Diniy matn', 'Huquqiy hujjat']

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom:'1rem' }}>
      <label style={{ display:'block', marginBottom:'0.35rem', fontSize:'0.85rem', fontWeight:500, color:'var(--text2)' }}>
        {label}{required && <span style={{ color:'#e57373' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

export default function Submit() {
  const { t } = useApp()
  const [form, setForm] = useState({
    title: '', year: '', location: '', script: '', category: '', language: '',
    description: '', full_text: '', transliteration: '', translation: '',
    source_info: '', author_name: '', author_email: '', author_institution: '', author_bio: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [docFile, setDocFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (imageFile) fd.append('image_file', imageFile)
      if (docFile) fd.append('document', docFile)
      await submit(fd)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || t('submit_error'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth:'600px', textAlign:'center', paddingTop:'4rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
          <h2 style={{ color:'var(--accent)', marginBottom:'1rem' }}>{t('submit_success')}</h2>
          <p style={{ color:'var(--text2)' }}>Admin ko'rib chiqqandan so'ng saytda ko'rinadi.</p>
          <button onClick={() => setSuccess(false)} className="btn btn-outline" style={{ marginTop:'1.5rem' }}>
            Yana yuborish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'800px' }}>
        <h1 className="page-title">{t('submit_title')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem', color:'var(--accent)' }}>Yodgorlik ma'lumotlari</h3>
            <div className="grid grid-2">
              <Field label={t('submit_monument_name')} required>
                <input type="text" value={form.title} onChange={set('title')} required style={{ width:'100%' }} />
              </Field>
              <Field label={t('submit_year')} required>
                <input type="number" value={form.year} onChange={set('year')} required
                  min="-3000" max="2000" placeholder="-600" style={{ width:'100%' }} />
              </Field>
              <Field label={t('submit_location')}>
                <input type="text" value={form.location} onChange={set('location')} style={{ width:'100%' }} />
              </Field>
              <Field label={t('submit_script')}>
                <select value={form.script} onChange={set('script')} style={{ width:'100%' }}>
                  <option value="">—</option>
                  {SCRIPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t('submit_category')}>
                <select value={form.category} onChange={set('category')} style={{ width:'100%' }}>
                  <option value="">—</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t('submit_language')}>
                <input type="text" value={form.language} onChange={set('language')} placeholder="Ko'hna turkiy" style={{ width:'100%' }} />
              </Field>
            </div>
            <Field label={t('submit_description')} required>
              <textarea value={form.description} onChange={set('description')} required rows={3}
                style={{ width:'100%', resize:'vertical' }} />
            </Field>
          </div>

          <div className="card" style={{ marginBottom:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem', color:'var(--accent)' }}>Matn</h3>
            <Field label={t('submit_full_text')}>
              <textarea value={form.full_text} onChange={set('full_text')} rows={5}
                style={{ width:'100%', resize:'vertical', fontFamily:'serif' }} />
            </Field>
            <Field label={t('submit_transliteration')}>
              <textarea value={form.transliteration} onChange={set('transliteration')} rows={4}
                style={{ width:'100%', resize:'vertical', fontFamily:'monospace' }} />
            </Field>
            <Field label={t('submit_translation')}>
              <textarea value={form.translation} onChange={set('translation')} rows={4}
                style={{ width:'100%', resize:'vertical' }} />
            </Field>
            <Field label={t('submit_source_info')}>
              <input type="text" value={form.source_info} onChange={set('source_info')} style={{ width:'100%' }} />
            </Field>
          </div>

          {/* File uploads */}
          <div className="card" style={{ marginBottom:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem', color:'var(--accent)' }}>Fayllar</h3>
            <div className="grid grid-2">
              <Field label={t('submit_image')}>
                <input type="file" accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  style={{ width:'100%', padding:'0.4rem' }} />
                {imageFile && <p style={{ fontSize:'0.8rem', color:'var(--text2)', marginTop:'0.25rem' }}>{imageFile.name}</p>}
              </Field>
              <Field label={`${t('submit_document')} (PDF, Word, ...)`}>
                <input type="file" accept=".pdf,.doc,.docx,.odt,.txt,.rtf"
                  onChange={e => setDocFile(e.target.files[0])}
                  style={{ width:'100%', padding:'0.4rem' }} />
                {docFile && <p style={{ fontSize:'0.8rem', color:'var(--text2)', marginTop:'0.25rem' }}>{docFile.name}</p>}
              </Field>
            </div>
          </div>

          <div className="card" style={{ marginBottom:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem', color:'var(--accent)' }}>Muallif</h3>
            <div className="grid grid-2">
              <Field label={t('submit_author_name')} required>
                <input type="text" value={form.author_name} onChange={set('author_name')} required style={{ width:'100%' }} />
              </Field>
              <Field label={t('submit_author_email')} required>
                <input type="email" value={form.author_email} onChange={set('author_email')} required style={{ width:'100%' }} />
              </Field>
              <Field label={t('submit_author_institution')}>
                <input type="text" value={form.author_institution} onChange={set('author_institution')} style={{ width:'100%' }} />
              </Field>
            </div>
            <Field label={t('submit_author_bio')}>
              <textarea value={form.author_bio} onChange={set('author_bio')} rows={3}
                style={{ width:'100%', resize:'vertical' }} />
            </Field>
          </div>

          {error && (
            <div style={{ color:'#e57373', padding:'0.75rem 1rem', background:'rgba(229,115,115,0.1)',
              border:'1px solid rgba(229,115,115,0.3)', borderRadius:'var(--radius)', marginBottom:'1rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ fontSize:'1rem', padding:'0.75rem 2.5rem', width:'100%' }}>
            {loading ? t('loading') : t('submit_send')}
          </button>
        </form>
      </div>
    </div>
  )
}
