import { supabase } from './supabase'

const PHOTOS = {
  'Restauration':'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
  'Commerce':'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
  'Beauté':'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
  'Construction':'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop',
  'Santé':'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
  'Digital':'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  'Autre':'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
}

const NAF = {
  '10':'🍽️|Alimentation|#FF6B35','56':'🍴|Restauration|#EF4444',
  '46':'🛒|Commerce|#8B5CF6','47':'🛒|Commerce|#8B5CF6',
  '96':'💆|Beauté|#EC4899','86':'🏥|Santé|#EF4444',
  '62':'💻|Digital|#6366F1','85':'🎓|Formation|#8B5CF6',
  '68':'🏠|Immobilier|#10B981','70':'🧠|Consulting|#F59E0B',
  '41':'🏗️|Construction|#6B7280','45':'🚗|Auto|#3B82F6',
}

function getCat(code) {
  if (!code) return {emoji:'🏪',label:'Autre',color:'#6B7280'}
  const v = NAF[code.substring(0,2)]
  if (!v) return {emoji:'🏪',label:'Autre',color:'#6B7280'}
  const [emoji,label,color] = v.split('|')
  return {emoji,label,color}
}

export default function BusinessPage({ business: b, onClose }) {
  const cat = getCat(b.sector)
  const photo = b.photo_url || PHOTOS[cat.label] || PHOTOS['Autre']

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* PHOTO HERO */}
        <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img src={photo} alt={b.name} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 rounded-full w-9 h-9 flex items-center justify-center font-bold text-gray-700 hover:bg-white transition">
            ✕
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-bold">
              {cat.emoji} {cat.label}
            </span>
          </div>
        </div>

        {/* CONTENU */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-1">{b.name}</h1>
              <p className="text-orange-500 font-semibold text-sm">📍 {b.territory}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-semibold mt-1" style={{background: cat.color + '18', color: cat.color}}>
              {cat.label}
            </span>
          </div>

          {b.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-6">{b.description}</p>
          )}

          {/* INFOS CONTACT */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">📋 Informations</h3>
            {b.phone && (
              <a href={`tel:${b.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500 transition">
                <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">📞</span>
                {b.phone}
              </a>
            )}
            {b.email && (
              <a href={`mailto:${b.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500 transition">
                <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">✉️</span>
                {b.email}
              </a>
            )}
            {b.website && (
              <a href={b.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500 transition">
                <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">🌐</span>
                {b.website}
              </a>
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            {b.phone && (
              <a href={`tel:${b.phone}`} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-full text-center text-sm transition">
                📞 Appeler
              </a>
            )}
            {b.email && (
              <a href={`mailto:${b.email}`} className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-full text-center text-sm transition">
                ✉️ Contacter
              </a>
            )}
          </div>

          {/* BANNER PREMIUM */}
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-gray-900 mb-1">🚀 Vous êtes propriétaire de ce business ?</p>
            <p className="text-xs text-gray-500 mb-3">Améliorez votre fiche avec une page de vente complète</p>
            <button className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-6 py-2 rounded-full transition">
              Voir les offres →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}