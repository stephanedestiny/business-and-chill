import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const NAF = {
  '10':'🍽️|Alimentation|#FF6B35','56':'🍴|Restauration|#EF4444',
  '46':'🛒|Commerce|#8B5CF6','47':'🛒|Commerce|#8B5CF6',
  '96':'💆|Beauté|#EC4899','86':'🏥|Santé|#EF4444',
  '62':'💻|Digital|#6366F1','85':'🎓|Formation|#8B5CF6',
  '68':'🏠|Immobilier|#10B981','70':'🧠|Consulting|#F59E0B',
  '41':'🏗️|Construction|#6B7280','45':'🚗|Auto|#3B82F6',
  '49':'🚌|Transport|#F59E0B','55':'🏨|Hébergement|#06B6D4',
  '93':'⚽|Sport|#F59E0B','90':'🎭|Arts|#EC4899',
  '81':'🧹|Entretien|#6B7280','82':'📋|Services|#6B7280',
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

function getCat(code) {
  if (!code) return {emoji:'🏪',label:'Autre',color:'#6B7280'}
  const v = NAF[code.substring(0,2)]
  if (!v) return {emoji:'🏪',label:'Autre',color:'#6B7280'}
  const [emoji,label,color] = v.split('|')
  return {emoji,label,color}
}

function getPhoto(label) {
  return PHOTOS[label] || PHOTOS['Autre']
}

function App() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [territory, setTerritory] = useState('Tous')
  const [showModal, setShowModal] = useState(false)
  const [sector, setSector] = useState('Tous')
  const categories = ['Tous', ...new Set(Object.values(NAF).map(v => v.split('|')[1]))]

  useEffect(() => { fetchBusinesses() }, [])

  async function fetchBusinesses() {
    const { data, error } = await supabase.from('businesses').select('*')
    if (!error) setBusinesses(data)
    setLoading(false)
  }

  const filtered = businesses.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase())
    const matchTerritory = territory === 'Tous' || b.territory === territory
    const matchSector = sector === 'Tous' || getCat(b.sector).label === sector
    return matchSearch && matchTerritory && matchSector
  })

  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-black text-gray-900">
            Business <span className="text-orange-500">&</span> Chill
            <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Beta</span>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-5 py-2 rounded-full transition">
            + Mon business
          </button>
        </div>
      </nav>
      <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-orange-50 to-[#FDFAF7] text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Découvre les business<br/>
          <span className="text-orange-500 italic">des Caraïbes</span>
        </h1>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden">
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-6 py-4 text-sm outline-none"/>
          <select value={territory} onChange={e => setTerritory(e.target.value)} className="px-4 py-4 text-sm border-l border-gray-100 outline-none bg-white">
            <option>Tous</option><option>Guadeloupe</option><option>Martinique</option><option>Guyane</option>
          </select>
          <button className="bg-orange-500 text-white px-8 font-bold text-sm">Chercher</button>
        </div>
      </div>
      
      <div className="border-b border-gray-100 bg-white sticky top-[65px] z-40">
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-2 py-3 w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSector(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  sector === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold mb-6">{loading ? 'Chargement...' : filtered.length + ' business'}</h2>
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(b => {
              const cat = getCat(b.sector)
              return (
                <div key={b.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={getPhoto(cat.label)} alt={cat.label} className="w-full h-full object-cover"/>
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-bold">
                      {cat.emoji} {cat.label}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-orange-500 font-bold uppercase mb-1">📍 {b.territory}</p>
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{b.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{b.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {showModal && <AddBusinessModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchBusinesses() }}/>}
    </div>
  )
}

function AddBusinessModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({name:'',description:'',territory:'Guadeloupe',sector:'56.10A',email:'',website:''})
  const [loading, setLoading] = useState(false)
  async function handleSubmit() {
    if (!form.name || !form.email) return alert('Nom et email requis')
    setLoading(true)
    const { error } = await supabase.from('businesses').insert([{...form, plan:'gratuit'}])
    if (error) alert('Erreur: ' + error.message)
    else onSuccess()
    setLoading(false)
  }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-xl">X</button>
        <h2 className="text-2xl font-black mb-6">Mon business</h2>
        <div className="space-y-4">
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Nom *" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
          <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Email *" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
          <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none" rows={3} placeholder="Description" value={form.description} onChange={e => setForm({...form,description:e.target.value})}/>
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-orange-500 text-white font-bold py-4 rounded-full disabled:opacity-50">
            {loading ? 'Envoi...' : 'Créer ma fiche gratuite'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App