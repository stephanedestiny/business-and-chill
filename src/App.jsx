import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import BusinessPage from './BusinessPage'
import BlogPage from './BlogPage'
import ArticlePage from './ArticlePage'

const NAF = {
  '10':'🍽️|Alimentation|#FF6B35','11':'🍹|Boissons|#FF6B35',
  '41':'🏗️|Construction|#6B7280','42':'🏗️|Construction|#6B7280','43':'🏗️|Construction|#6B7280',
  '45':'🚗|Auto|#3B82F6','46':'🛒|Commerce|#8B5CF6','47':'🛒|Commerce|#8B5CF6',
  '49':'🚌|Transport|#F59E0B','55':'🏨|Hébergement|#06B6D4','56':'🍴|Restauration|#EF4444',
  '62':'💻|Digital|#6366F1','63':'💻|Digital|#6366F1','68':'🏠|Immobilier|#10B981',
  '70':'🧠|Consulting|#F59E0B','74':'🎨|Créatif|#EC4899','75':'🐾|Vétérinaire|#10B981',
  '81':'🧹|Entretien|#6B7280','82':'📋|Services|#6B7280','85':'🎓|Formation|#8B5CF6',
  '86':'🏥|Santé|#EF4444','88':'🤝|Social|#10B981','90':'🎭|Arts|#EC4899',
  '93':'⚽|Sport|#F59E0B','96':'💆|Beauté|#EC4899',
}

const PHOTOS = {
  'Restauration':'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
  'Commerce':'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  'Beauté':'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  'Construction':'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
  'Santé':'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'Digital':'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
  'Formation':'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
  'Immobilier':'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  'Transport':'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
  'Sport':'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'Arts':'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=300&fit=crop',
  'Hébergement':'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop',
  'Consulting':'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  'Auto':'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'Alimentation':'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
  'Entretien':'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  'Services':'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
  'Autre':'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
}

const CATEGORIES = [
  {label:'Tous', emoji:'🌴'},
  {label:'Restauration', emoji:'🍴'},
  {label:'Commerce', emoji:'🛒'},
  {label:'Beauté', emoji:'💆'},
  {label:'Construction', emoji:'🏗️'},
  {label:'Auto', emoji:'🚗'},
  {label:'Transport', emoji:'🚌'},
  {label:'Hébergement', emoji:'🏨'},
  {label:'Digital', emoji:'💻'},
  {label:'Immobilier', emoji:'🏠'},
  {label:'Consulting', emoji:'🧠'},
  {label:'Formation', emoji:'🎓'},
  {label:'Santé', emoji:'🏥'},
  {label:'Sport', emoji:'⚽'},
  {label:'Arts', emoji:'🎭'},
  {label:'Alimentation', emoji:'🍽️'},
  {label:'Entretien', emoji:'🧹'},
  {label:'Services', emoji:'📋'},
]

function getCat(code) {
  if (!code) return {emoji:'🏪',label:'Autre',color:'#6B7280'}
  const v = NAF[code.substring(0,2)]
  if (!v) return {emoji:'🏪',label:'Autre',color:'#6B7280'}
  const [emoji,label,color] = v.split('|')
  return {emoji,label,color}
}

function getPhoto(label, photoUrl) {
  if (photoUrl) return photoUrl
  return PHOTOS[label] || PHOTOS['Autre']
}

function BusinessCard({ b, onClick, featured }) {
  const cat = getCat(b.sector)
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
      <div className={"relative overflow-hidden " + (featured ? "aspect-[3/2]" : "aspect-[4/3]")}>
        <img src={getPhoto(cat.label, b.photo_url)} alt={cat.label} className="w-full h-full object-cover"/>
        <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-bold">{cat.emoji} {cat.label}</div>
        {b.photo_url && <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">Verifie</div>}
      </div>
      <div className="p-4">
        <p className="text-xs text-orange-500 font-bold uppercase tracking-wide mb-1">📍 {b.territory}</p>
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{b.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{b.description || 'Business local caribeen'}</p>
        {b.phone && <p className="text-xs text-gray-400 mt-2">📞 {b.phone}</p>}
      </div>
    </div>
  )
}

function App() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [territory, setTerritory] = useState('Tous')
  const [sector, setSector] = useState('Tous')
  const [showModal, setShowModal] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [showBlog, setShowBlog] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => { fetchBusinesses() }, [])

  async function fetchBusinesses() {
    const { data } = await supabase.from('businesses').select('*')
    if (data) setBusinesses(data)
    setLoading(false)
  }

  const filtered = businesses.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase())
    const matchTerritory = territory === 'Tous' || b.territory === territory
    const matchSector = sector === 'Tous' || getCat(b.sector).label === sector
    return matchSearch && matchTerritory && matchSector
  })

  const isFiltered = sector !== 'Tous' || territory !== 'Tous' || search

  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-black text-gray-900">
            Business <span className="text-orange-500">&</span> Chill
            <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowBlog(true)} className="text-gray-600 hover:text-gray-900 font-semibold text-sm">Blog</button>
            <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-5 py-2 rounded-full transition">
              + Mon business
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="pt-24 pb-8 px-6 bg-gradient-to-b from-orange-50 to-[#FDFAF7] text-center">
        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">L'annuaire des business caribeens</p>
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Decouvre les business<br/>
          <span className="text-orange-500 italic">des Caraibes</span>
        </h1>
        <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">Guadeloupe, Martinique, Guyane et les 44 iles.</p>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden">
          <input type="text" placeholder="Rechercher un business..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-6 py-4 text-sm outline-none"/>
          <select value={territory} onChange={e => setTerritory(e.target.value)} className="px-4 py-4 text-sm border-l border-gray-100 outline-none bg-white">
            <option>Tous</option><option>Guadeloupe</option><option>Martinique</option><option>Guyane</option><option>Saint-Martin</option>
          </select>
          <button onClick={() => {}} className="bg-orange-500 hover:bg-orange-400 text-white px-8 font-bold text-sm transition">Chercher</button>
        </div>
      </div>

      {/* CATEGORIES AIRBNB STYLE */}
      <div className="border-b border-gray-100 bg-white sticky top-[65px] z-40">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-6 py-4 w-max">
            {CATEGORIES.map(cat => (
              <button key={cat.label} onClick={() => setSector(cat.label)} className="flex flex-col items-center gap-1 min-w-[64px] group">
                <div className={"w-14 h-14 rounded-full flex items-center justify-center text-2xl transition " + (sector === cat.label ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-100 group-hover:bg-gray-200')}>
                  {cat.emoji}
                </div>
                <span className={"text-xs font-medium whitespace-nowrap " + (sector === cat.label ? 'text-orange-500 font-bold' : 'text-gray-600')}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌴</p>
            <p className="text-gray-500 text-lg">Aucun business trouve</p>
          </div>
        ) : isFiltered ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{filtered.length} business trouve(s)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(b => <BusinessCard key={b.id} b={b} onClick={() => setSelectedBusiness(b)}/>)}
            </div>
          </>
        ) : (
          <>
            {/* BUSINESS EN VEDETTE */}
            {filtered.filter(b => b.photo_url).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-black text-gray-900 mb-6">⭐ Business en vedette</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filtered.filter(b => b.photo_url).slice(0,4).map(b => <BusinessCard key={b.id} b={b} onClick={() => setSelectedBusiness(b)} featured/>)}
                </div>
              </div>
            )}

            {/* PAR TERRITOIRE */}
            {['Guadeloupe','Martinique','Guyane','Saint-Martin'].map(t => {
              const biz = filtered.filter(b => b.territory === t)
              if (biz.length === 0) return null
              return (
                <div key={t} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900">📍 {t}</h2>
                    <button onClick={() => setTerritory(t)} className="text-sm font-semibold text-gray-500 hover:text-gray-900 underline">
                      Voir tout ({biz.length})
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {biz.slice(0,8).map(b => <BusinessCard key={b.id} b={b} onClick={() => setSelectedBusiness(b)}/>)}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-black text-gray-900 mb-4">Business Chill</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setShowBlog(true)} className="text-sm text-gray-500 hover:text-gray-800">Blog</button></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800">A propos</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-4">Territoires</h4>
              <ul className="space-y-2">
                {['Guadeloupe','Martinique','Guyane','Saint-Martin'].map(t => (
                  <li key={t}><button onClick={() => setTerritory(t)} className="text-sm text-gray-500 hover:text-gray-800">{t}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-4">Pour les business</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setShowModal(true)} className="text-sm text-gray-500 hover:text-gray-800">Ajouter mon business</button></li>
                <li><a href="/admin" className="text-sm text-gray-500 hover:text-gray-800">Espace admin</a></li>
                <li><a href="https://calendly.com/stephanedestiny" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-800">Prendre RDV</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-4">NANO AGENCY</h4>
              <ul className="space-y-2">
                <li><a href="https://calendly.com/stephanedestiny" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-800">Consulting</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800">UGC & Contenus</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-gray-800">Creation de site</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">2025 Business Chill · Destiny Media Group · Guadeloupe</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600">Mentions legales</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600">CGU</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600">Confidentialite</a>
            </div>
          </div>
        </div>
      </footer>

      {showModal && <AddBusinessModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchBusinesses() }}/>}
      {selectedBusiness && <BusinessPage business={selectedBusiness} onClose={() => setSelectedBusiness(null)}/>}
      {showBlog && <BlogPage onClose={() => setShowBlog(false)} onArticle={a => { setShowBlog(false); setSelectedArticle(a) }}/>}
      {selectedArticle && <ArticlePage article={selectedArticle} onClose={() => setSelectedArticle(null)}/>}
    </div>
  )
}

function AddBusinessModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({name:'',description:'',territory:'Guadeloupe',sector:'56.10A',email:'',phone:'',website:'',photo_url:''})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileName = Date.now() + '-' + file.name.replace(/[^a-z0-9.]/gi, '-')
    const { error } = await supabase.storage.from('business-photos').upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from('business-photos').getPublicUrl(fileName)
      setForm(f => ({...f, photo_url: data.publicUrl}))
    } else {
      alert('Erreur: ' + error.message)
    }
    setUploading(false)
  }

  async function handleSubmit() {
    if (!form.name || !form.email) return alert('Nom et email requis')
    setLoading(true)
    const { error } = await supabase.from('businesses').insert([{...form, plan:'gratuit'}])
    if (error) alert('Erreur: ' + error.message)
    else onSuccess()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-xl">X</button>
        <h2 className="text-2xl font-black mb-2">Mon business</h2>
        <p className="text-gray-500 text-sm mb-6">Gratuit et immediat.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Nom *</label>
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50" placeholder="Restaurant Chez Marie" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Territoire *</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50" value={form.territory} onChange={e => setForm({...form,territory:e.target.value})}>
                <option>Guadeloupe</option><option>Martinique</option><option>Guyane</option><option>Saint-Martin</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Email *</label>
              <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50" placeholder="contact@..." value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Categorie</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50" value={form.sector} onChange={e => setForm({...form,sector:e.target.value})}>
              <option value="56.10A">Restauration</option>
              <option value="47.00A">Commerce</option>
              <option value="96.02A">Beauté</option>
              <option value="41.00A">Construction</option>
              <option value="45.00A">Auto</option>
              <option value="49.00A">Transport</option>
              <option value="55.00A">Hébergement</option>
              <option value="62.00A">Digital</option>
              <option value="68.00A">Immobilier</option>
              <option value="70.00A">Consulting</option>
              <option value="85.00A">Formation</option>
              <option value="86.00A">Santé</option>
              <option value="93.00A">Sport</option>
              <option value="90.00A">Arts</option>
              <option value="10.00A">Alimentation</option>
              <option value="81.00A">Entretien</option>
              <option value="82.00A">Services</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Telephone</label>
            <input type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50" placeholder="+596 696 00 00 00" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}/>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Description</label>
            <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 resize-none" rows={3} placeholder="Decrivez votre activite..." value={form.description} onChange={e => setForm({...form,description:e.target.value})}/>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-2">Photo</label>
            {form.photo_url ? (
              <div className="relative">
                <img src={form.photo_url} className="w-full h-40 object-cover rounded-xl"/>
                <button type="button" onClick={() => setForm({...form,photo_url:''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 text-sm font-bold">X</button>
              </div>
            ) : (
              <label className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-orange-400 transition bg-gray-50">
                {uploading ? <span className="text-orange-500 font-semibold">Upload...</span> : (
                  <>
                    <span className="text-4xl mb-2">📷</span>
                    <span className="text-sm font-semibold text-gray-700">Cliquez pour ajouter une photo</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG max 5MB</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload}/>
              </label>
            )}
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-full transition disabled:opacity-50">
            {loading ? 'Envoi...' : 'Creer ma fiche gratuite'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App