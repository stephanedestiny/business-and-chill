import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function Stars({ note, onClick, size = 'md' }) {
  const s = size === 'lg' ? 'text-2xl' : 'text-lg'
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onClick && onClick(i)}
          className={s + ' ' + (i <= note ? 'text-yellow-400' : 'text-gray-300') + (onClick ? ' hover:text-yellow-300 transition' : '')}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function AvisSection({ businessId }) {
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({nom:'', note:5, commentaire:''})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { fetchAvis() }, [businessId])

  async function fetchAvis() {
    const { data } = await supabase.from('avis').select('*').eq('business_id', businessId).order('created_at', {ascending: false})
    if (data) setAvis(data)
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form.nom || !form.commentaire) return alert('Nom et commentaire requis')
    setSubmitting(true)
    const { error } = await supabase.from('avis').insert([{...form, business_id: businessId}])
    if (!error) {
      setSuccess(true)
      setShowForm(false)
      setForm({nom:'', note:5, commentaire:''})
      fetchAvis()
    }
    setSubmitting(false)
  }

  const moyenne = avis.length > 0 ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1) : null

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-black text-gray-900 text-lg">Avis clients</h3>
          {moyenne && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-bold text-gray-900">{moyenne}</span>
              <span className="text-gray-400 text-sm">({avis.length})</span>
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-4 py-2 rounded-full transition">
          + Laisser un avis
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 font-semibold">
          Merci pour votre avis !
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-3">Votre avis</h4>
          <div className="space-y-3">
            <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-white"
              placeholder="Votre nom" value={form.nom} onChange={e => setForm({...form,nom:e.target.value})}/>
            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">Note</p>
              <Stars note={form.note} onClick={note => setForm({...form,note})} size="lg"/>
            </div>
            <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-white resize-none" rows={3}
              placeholder="Votre commentaire..." value={form.commentaire} onChange={e => setForm({...form,commentaire:e.target.value})}/>
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-full text-sm disabled:opacity-50">
                {submitting ? 'Envoi...' : 'Publier mon avis'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 border border-gray-200 rounded-full text-sm text-gray-600">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : avis.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-2xl">
          <p className="text-3xl mb-2">⭐</p>
          <p className="text-gray-500 text-sm">Soyez le premier a laisser un avis</p>
        </div>
      ) : (
        <div className="space-y-3">
          {avis.map(a => (
            <div key={a.id} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-500">
                    {a.nom.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{a.nom}</span>
                </div>
                <Stars note={a.note} size="sm"/>
              </div>
              <p className="text-sm text-gray-600">{a.commentaire}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}