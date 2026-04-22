import { supabase } from './supabase'

export default function ArticlePage({ article: a, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-48 overflow-hidden rounded-t-3xl">
          <img src={a.photo_url} alt={a.title} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 rounded-full w-9 h-9 flex items-center justify-center font-bold">X</button>
        </div>
        <div className="p-6">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">{a.category}</span>
          <h1 className="text-2xl font-black text-gray-900 mt-2 mb-4">{a.title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{a.excerpt}</p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-gray-700 text-sm leading-relaxed">{a.content}</p>
          </div>
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
            <p className="text-sm font-bold text-gray-900 mb-1">Votre business sur Business Chill ?</p>
            <p className="text-xs text-gray-500 mb-3">Referencez gratuitement votre entreprise</p>
            <button onClick={onClose} className="bg-orange-500 text-white font-bold text-xs px-6 py-2 rounded-full">
              Ajouter mon business
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}