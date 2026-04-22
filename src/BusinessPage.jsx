import { useState } from 'react'
import PricingPage from './PricingPage'

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
  const [showPricing, setShowPricing] = useState(false)
  const cat = getCat(b.sector)
  const photo = b.photo_url || PHOTOS[cat.label] || PHOTOS['Autre']
  const whatsappNumber = b.whatsapp || b.phone
  const whatsappUrl = whatsappNumber ? 'https://wa.me/' + whatsappNumber.replace(/[^0-9]/g, '') : null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

          <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl">
            <img src={photo} alt={b.name} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
            <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 rounded-full w-9 h-9 flex items-center justify-center font-bold text-gray-700">✕</button>
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/90 rounded-full px-3 py-1 text-xs font-bold">{cat.emoji} {cat.label}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 mb-1">{b.name}</h1>
                <p className="text-orange-500 font-semibold text-sm">📍 {b.territory}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-semibold mt-1" style={{background: cat.color + '18', color: cat.color}}>{cat.label}</span>
            </div>

            {b.description && <p className="text-gray-600 text-sm leading-relaxed mb-6">{b.description}</p>}

            {/* HORAIRES */}
            {b.horaires && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2">🕐 Horaires d ouverture</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{b.horaires}</p>
              </div>
            )}

            {/* INFOS CONTACT */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm mb-3">📋 Informations</h3>
              {b.phone && (
                <a href={"tel:" + b.phone} className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500">
                  <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">📞</span>
                  {b.phone}
                </a>
              )}
              {b.email && (
                <a href={"mailto:" + b.email} className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500">
                  <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">✉️</span>
                  {b.email}
                </a>
              )}
              {b.website && (
                <a href={b.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500">
                  <span className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">🌐</span>
                  {b.website}
                </a>
              )}
            </div>

            {/* CTA BOUTONS */}
            <div className="flex gap-3 mb-6">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-full text-center text-sm transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
              {b.phone && (
                <a href={"tel:" + b.phone} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-full text-center text-sm transition">
                  📞 Appeler
                </a>
              )}
              {b.email && (
                <a href={"mailto:" + b.email} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-full text-center text-sm transition">
                  ✉️ Email
                </a>
              )}
            </div>

            {/* PARTAGE */}
            <div className="flex gap-2 mb-6">
              <p className="text-xs text-gray-400 mr-2 self-center">Partager :</p>
              {whatsappUrl && (
                <a href={"https://wa.me/?text=Decouvre " + encodeURIComponent(b.name) + " sur Business Chill"} target="_blank" rel="noreferrer"
                  className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-green-100 transition">
                  WhatsApp
                </a>
              )}
              <a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://business-and-chill.vercel.app")} target="_blank" rel="noreferrer"
                className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full hover:bg-blue-100 transition">
                Facebook
              </a>
            </div>

            {/* BANNER PREMIUM */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 text-center">
              <p className="text-sm font-bold text-gray-900 mb-1">🚀 Vous etes proprietaire de ce business ?</p>
              <p className="text-xs text-gray-500 mb-3">Ameliorez votre fiche avec une page de vente complete</p>
              <button onClick={() => setShowPricing(true)} className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-6 py-2 rounded-full transition">
                Voir les offres
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPricing && <PricingPage onClose={() => setShowPricing(false)} businessName={b.name}/>}
    </>
  )
}
