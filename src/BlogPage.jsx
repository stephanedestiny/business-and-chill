import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function BlogPage({ onClose, onArticle }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('blog').select('*').eq('published', true).order('created_at', {ascending: false})
      .then(({ data }) => { if (data) setArticles(data); setLoading(false) })
  }, [])

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Blog Business Caraibes</h2>
            <p className="text-gray-500 text-sm mt-1">Conseils, tendances et actus des business caribeens</p>
          </div>
          <button onClick={onClose} className="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center font-bold">X</button>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400">Chargement...</div>
          ) : articles.map(a => (
            <div key={a.id} onClick={() => onArticle(a)} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition cursor-pointer">
              <img src={a.photo_url} alt={a.title} className="w-24 h-20 object-cover rounded-xl flex-shrink-0"/>
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">{a.category}</span>
                <h3 className="font-black text-gray-900 text-sm mt-1 mb-2">{a.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{a.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}