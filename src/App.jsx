import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [territory, setTerritory] = useState('Tous')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  async function fetchBusinesses() {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
    if (!error) setBusinesses(data)
    setLoading(false)
  }

  const filtered = businesses.filter(b => {
    const matchSearch = b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase())
    const matchTerritory = territory === 'Tous' || b.territory === territory
    return matchSearch && matchTerritory
  })

  return (
    <div className="min-h-screen bg-[#FDFAF7]">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-black text-gray-900">
            Business <span className="text-orange-500">&</span> Chill
            <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Bêta</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-5 py-2 rounded-full transition"
          >
            + Mon business
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="pt-24 pb-12 px-6 bg-gradient-to-b from-orange-50 to-[#FDFAF7] text-center">
        <p className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-4">
          L'annuaire des business caribéens
        </p>
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Découvre les business<br/>
          <span className="text-orange-500 italic">des Caraïbes</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          Guadeloupe, Martinique, Guyane et les 44 îles — tous référencés ici.
        </p>

        {/* SEARCH */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex overflow-hidden">
          <input
            type="text"
            placeholder="Restaurant, salon, agence web..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-6 py-4 text-sm outline-none"
          />
          <select
            value={territory}
            onChange={e => setTerritory(e.target.value)}
            className="px-4 py-4 text-sm border-l border-gray-100 outline-none bg-white"
          >
            <option>Tous</option>
            <option>Guadeloupe</option>
            <option>Martinique</option>
            <option>Guyane</option>
            <option>Saint-Martin</option>
            <option>Caraïbes</option>
          </select>
          <button className="bg-orange-500 hover:bg-orange-400 text-white px-8 font-bold text-sm transition">
            🔍 Chercher
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {loading ? 'Chargement...' : `${filtered.length} business référencé(s)`}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌴</p>
            <p className="text-gray-500 text-lg">Aucun business trouvé</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-400 transition"
            >
              + Ajouter le premier business
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                <div className="aspect-[4/3] flex items-center justify-center text-5xl"
                  style={{background: 'linear-gradient(135deg, #FF8040, #FF5C00)'}}>
                  🏪
                </div>
                <div className="p-4">
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-wide mb-1">
                    📍 {b.territory}
                  </p>
                  <h3 className="font-bold text-gray-900 mb-1">{b.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{b.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {b.sector}
                    </span>
                    <span className="text-xs font-bold text-orange-500">Voir →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <AddBusinessModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchBusinesses() }}
        />
      )}
    </div>
  )
}

function AddBusinessModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', description: '', territory: 'Guadeloupe',
    sector: 'Restauration', email: '', website: ''
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.email) return alert('Nom et email requis')
    setLoading(true)
    const { error } = await supabase
      .from('businesses')
      .insert([{ ...form, plan: 'gratuit' }])
    if (error) {
      alert('Erreur: ' + error.message)
    } else {
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        <h2 className="text-2xl font-black mb-2">🎉 Mon business</h2>
        <p className="text-gray-500 text-sm mb-6">Gratuit et immédiat. Visible sous 24h.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1">Nom du business *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
              placeholder="Ex: Restaurant Chez Marie"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1">Territoire *</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
                value={form.territory}
                onChange={e => setForm({...form, territory: e.target.value})}
              >
                <option>Guadeloupe</option>
                <option>Martinique</option>
                <option>Guyane</option>
                <option>Saint-Martin</option>
                <option>Caraïbes</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1">Secteur *</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
                value={form.sector}
                onChange={e => setForm({...form, sector: e.target.value})}
              >
                <option>Restauration</option>
                <option>Mode & Beauté</option>
                <option>Services</option>
                <option>Commerce</option>
                <option>Tourisme</option>
                <option>Digital</option>
                <option>Santé</option>
                <option>Autre</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1">Description *</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50 resize-none"
              rows={3}
              placeholder="Décrivez votre activité..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1">Email *</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
              placeholder="contact@monbusiness.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-gray-700 block mb-1">Site web / Instagram</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
              placeholder="https://..."
              value={form.website}
              onChange={e => setForm({...form, website: e.target.value})}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-full transition disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Créer ma fiche gratuite →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App