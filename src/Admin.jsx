import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const ADMIN_PASSWORD = 'destiny2025'

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (auth) fetchBusinesses()
  }, [auth])

  async function fetchBusinesses() {
    setLoading(true)
    const { data } = await supabase.from('businesses').select('*').order('name')
    setBusinesses(data || [])
    setLoading(false)
  }

  async function deleteBusiness(id) {
    if (!confirm('Supprimer ce business ?')) return
    await supabase.from('businesses').delete().eq('id', id)
    fetchBusinesses()
  }

  async function saveBusiness(b) {
    await supabase.from('businesses').update({
      name: b.name,
      description: b.description,
      photo_url: b.photo_url,
      territory: b.territory,
      sector: b.sector,
    }).eq('id', b.id)
    setEditing(null)
    fetchBusinesses()
  }

  const filtered = businesses.filter(b =>
    b.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-2xl font-black mb-2">🔐 Admin</h1>
          <p className="text-gray-500 text-sm mb-6">Business & Chill — Accès réservé</p>
          <input
            type="password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50 mb-3"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuth(true)}
          />
          <button
            onClick={() => password === ADMIN_PASSWORD ? setAuth(true) : alert('Mot de passe incorrect')}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-full transition"
          >
            Accéder →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="font-black text-xl">
          ⚙️ Admin <span className="text-orange-500">Business & Chill</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{businesses.length} business</span>
          <button onClick={() => setAuth(false)} className="text-sm text-gray-500 hover:text-gray-800">
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher un business..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white"
          />
          <button
            onClick={fetchBusinesses}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            🔄 Actualiser
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Chargement...</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Photo</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Nom</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Territoire</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {b.photo_url ? (
                        <img src={b.photo_url} alt="" className="w-16 h-12 object-cover rounded-lg"/>
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          Aucune
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-sm max-w-[180px]">
                      <p className="line-clamp-1">{b.name}</p>
                      <p className="text-xs text-orange-500 font-normal">{b.sector}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.territory}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px]">
                      <p className="line-clamp-2">{b.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing({...b})}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-3 py-2 rounded-lg transition"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => deleteBusiness(b.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-2 rounded-lg transition"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL EDIT */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h2 className="text-xl font-black mb-6">✏️ Modifier le business</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Nom</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
                  value={editing.name || ''}
                  onChange={e => setEditing({...editing, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Territoire</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
                  value={editing.territory || ''}
                  onChange={e => setEditing({...editing, territory: e.target.value})}
                >
                  <option>Guadeloupe</option>
                  <option>Martinique</option>
                  <option>Guyane</option>
                  <option>Saint-Martin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Description</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50 resize-none"
                  rows={4}
                  value={editing.description || ''}
                  onChange={e => setEditing({...editing, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-700 block mb-1">URL de la photo</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 bg-gray-50"
                  placeholder="https://images.unsplash.com/..."
                  value={editing.photo_url || ''}
                  onChange={e => setEditing({...editing, photo_url: e.target.value})}
                />
                {editing.photo_url && (
                  <img src={editing.photo_url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl"/>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => saveBusiness(editing)}
                  className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-full transition"
                >
                  💾 Sauvegarder
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-full transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}