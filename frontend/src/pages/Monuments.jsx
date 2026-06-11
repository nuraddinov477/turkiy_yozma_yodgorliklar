import { useState, useEffect, useCallback } from 'react'
import { monuments as api } from '../api'
import { useApp } from '../context/AppContext'
import MonumentCard from '../components/MonumentCard'
import MonumentModal from '../components/MonumentModal'

const SCRIPTS = ['Orxun-Enasoy', 'Uyg\'ur', 'Arab', 'Mug\'al', 'Kiril', 'Boshqa']
const CATEGORIES = ['Epigrafiya', 'Qo\'lyozma', 'Yozishmalar', 'Shoir asari', 'Diniy matn', 'Huquqiy hujjat']

export default function Monuments() {
  const { t } = useApp()
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [filters, setFilters] = useState({
    search: '', script: '', category: '', ordering: 'year', year_min: '', year_max: '',
  })

  const fetchData = useCallback(async (params, pg) => {
    setLoading(true)
    setError(null)
    try {
      const p = { ...params, page: pg }
      if (!p.search) delete p.search
      if (!p.script) delete p.script
      if (!p.category) delete p.category
      if (!p.year_min) delete p.year_min
      if (!p.year_max) delete p.year_max
      const r = await api.list(p)
      setData(r.data.results || r.data)
      setCount(r.data.count || 0)
    } catch {
      setError(t('error_load'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      fetchData(filters, 1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [filters, fetchData])

  const pageCount = Math.ceil(count / 20)

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('nav_monuments')} ({count})</h1>

        {/* Filters */}
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          <input
            type="search"
            placeholder={t('search_placeholder')}
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{ flex:'1 1 240px', minWidth:0 }}
          />
          <select value={filters.script} onChange={e => setFilters(f => ({ ...f, script: e.target.value }))}
            style={{ flex:'0 0 auto' }}>
            <option value="">{t('filter_script')}</option>
            {SCRIPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            style={{ flex:'0 0 auto' }}>
            <option value="">{t('filter_category')}</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.ordering} onChange={e => setFilters(f => ({ ...f, ordering: e.target.value }))}
            style={{ flex:'0 0 auto' }}>
            <option value="year">{t('sort_year')}</option>
            <option value="title">{t('sort_title')}</option>
            <option value="-views">{t('sort_views')}</option>
          </select>
          <div style={{ display:'flex', gap:'0.4rem', alignItems:'center', flex:'0 0 auto' }}>
            <input type="number" placeholder="Yildan" value={filters.year_min}
              onChange={e => setFilters(f => ({ ...f, year_min: e.target.value }))}
              style={{ width:'90px' }} />
            <span style={{ color:'var(--text2)' }}>—</span>
            <input type="number" placeholder="Yilgacha" value={filters.year_max}
              onChange={e => setFilters(f => ({ ...f, year_max: e.target.value }))}
              style={{ width:'90px' }} />
          </div>
        </div>

        {loading && <div className="spinner" />}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && data.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--text2)' }}>
            {t('no_results')}
          </div>
        )}

        {!loading && (
          <div className="grid grid-2">
            {data.map(m => (
              <MonumentCard key={m.id} monument={m} onClick={setSelected} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', marginTop:'2rem', flexWrap:'wrap' }}>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(pg => (
              <button key={pg} onClick={() => { setPage(pg); fetchData(filters, pg); }}
                className={`btn ${pg === page ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding:'0.4rem 0.8rem', minHeight:'36px' }}>
                {pg}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && <MonumentModal monument={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
