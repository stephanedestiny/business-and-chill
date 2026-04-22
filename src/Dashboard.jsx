import { useEffect, useState } from 'react'
import Galerie from './Galerie'
import { supabase } from './supabase'

export default function Dashboard() {
  const [business, setBusiness] = useState(null)
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) { setNotFound(true); setLoading(false); return }
    fetchBusiness(token)
  }, [])

  async function fetchBusiness(token) {
    const { data } = await supabase.from('businesses').select('*').eq('token', token).single()
    if (!data) { setNotFound(true); setLoading(false); return }
    setBusiness(data)
    const { data: avisData } = await supabase.from('avis').select('*').eq('business_id', data.id).order('created_at', {ascending: false})
    if (avisData) setAvis(avisData)
    setLoading(false)
    await supabase.from('businesses').update({vues: (data.vues || 0) + 1}).eq('id', data.id)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FDFAF7] flex items-center justify-center">
      <p className="text-gray-400">Chargement...</p>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-[#FDFAF7] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Lien invalide</h1>
        <p className="text-gray-500">Ce lien de tableau de bord est invalide ou a expire.</p>
        <a href="/" className="mt-4 inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-full">
          Retour accueil
        </a>
      </div>
    </div>
  )

  const moyenne = avis.length > 0 ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1) : null

  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-black text-gray-900">
          Business <span className="text-orange-500">&</span> Chill
        </div>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-900">Voir le site</a>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-wide mb-1">Tableau de bord</p>
          <h1 className="text-3xl font-black text-gray-900">{business.name}</h1>
          <p className="text-gray-500 mt-1">📍 {business.territory} · {business.plan === 'gratuit' ? 'Plan Gratuit' : 'Plan Premium'}</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {label:'Vues fiche', value: business.vues || 0, emoji:'👁️'},
            {label:'Clics tel', value: business.clics_tel || 0, emoji:'📞'},
            {label:'Clics email', value: business.clics_email || 0, emoji:'✉️'},
            {label:'Avis recus', value: avis.length, emoji:'⭐'},
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-3xl mb-1">{stat.emoji}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* NOTE MOYENNE */}
        {moyenne && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <div className="text-4xl font-black text-yellow-500">{moyenne}</div>
            <div>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={"text-xl " + (i <= Math.round(moyenne) ? 'text-yellow-400' : 'text-gray-200')}>★</span>
                ))}
              </div>
              <p className="text-sm text-gray-600">{avis.length} avis clients</p>
            </div>
          </div>
        )}

        {/* UPGRADE */}
        {business.plan === 'gratuit' && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-8">
            <h3 className="font-black text-gray-900 mb-2">🚀 Passez au Premium</h3>
            <p className="text-sm text-gray-600 mb-4">Obtenez une page de vente complete, plus de visibilite et des statistiques avancees.</p>
            <div className="flex gap-3">
              <a href="/?upgrade=true" className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-6 py-3 rounded-full transition">
                Voir les offres a partir de 25€/mois
              </a>
            </div>
          </div>
        )}

        {/* AVIS */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-black text-gray-900 mb-4">Derniers avis clients</h3>
          {avis.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">⭐</p>
              <p className="text-gray-500 text-sm">Aucun avis pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {avis.map(a => (
                <div key={a.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 text-sm">{a.nom}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className={"text-sm " + (i <= a.note ? 'text-yellow-400' : 'text-gray-200')}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{a.commentaire}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
          <h3 className="font-black text-gray-900 mb-4">Galerie photos</h3>
          <Galerie businessId={business.id} canEdit={true}/>
        </div>

        {/* INFOS FICHE */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
          <h3 className="font-black text-gray-900 mb-4">Informations de votre fiche</h3>
          <div className="space-y-2 text-sm text-gray-600">
            {business.phone && <p>📞 {business.phone}</p>}
            {business.email && <p>✉️ {business.email}</p>}
            {business.website && <p>🌐 {business.website}</p>}
            {business.horaires && <p>🕐 {business.horaires}</p>}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Pour modifier vos informations contactez-nous a contact@business-chill.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}