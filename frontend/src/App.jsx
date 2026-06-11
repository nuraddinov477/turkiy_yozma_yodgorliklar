import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Monuments from './pages/Monuments'
import Timeline from './pages/Timeline'
import Scripts from './pages/Scripts'
import Stats from './pages/Stats'
import Concordance from './pages/Concordance'
import Compare from './pages/Compare'
import Bibliography from './pages/Bibliography'
import Glossary from './pages/Glossary'
import Submit from './pages/Submit'
import About from './pages/About'
import Login from './pages/Login'

function Layout() {
  const { theme } = useApp()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monuments" element={<Monuments />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/scripts" element={<Scripts />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/concordance" element={<Concordance />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/bibliography" element={<Bibliography />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="page" style={{ textAlign:'center' }}>
      <div style={{ fontSize:'5rem', color:'var(--accent)', fontWeight:700 }}>404</div>
      <p style={{ color:'var(--text2)', margin:'1rem 0' }}>Sahifa topilmadi</p>
      <a href="/" className="btn btn-outline">Bosh sahifaga</a>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
