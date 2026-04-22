import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Galerie({ businessId, canEdit }) {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchPhotos() }, [businessId])

  async function fetchPhotos() {
    const { data } = await supabase.from('galerie').select('*').eq('business_id', businessId).order('ordre')
    if (data) setPhotos(data)
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files).slice(0, 5 - photos.length)
    if (files.length === 0) return
    setUploading(true)
    for (const file of files) {
      const fileName = Date.now() + '-' + file.name.replace(/[^a-z0-9.]/gi, '-')
      const { error } = await supabase.storage.from('business-photos').upload(fileName, file)
      if (!error) {
        const { data } = supabase.storage.from('business-photos').getPublicUrl(fileName)
        await supabase.from('galerie').insert([{business_id: businessId, photo_url: data.publicUrl, ordre: photos.length}])
      }
    }
    await fetchPhotos()
    setUploading(false)
  }

  async function handleDelete(id) {
    await supabase.from('galerie').delete().eq('id', id)
    fetchPhotos()
  }

  if (photos.length === 0 && !canEdit) return null

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-gray-900">Photos</h3>
        {canEdit && photos.length < 5 && (
          <label className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition">
            {uploading ? 'Upload...' : '+ Ajouter'}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading}/>
          </label>
        )}
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <div key={p.id} onClick={() => setSelected(p.photo_url)}
              className={"relative cursor-pointer overflow-hidden rounded-xl " + (i === 0 ? 'col-span-3 aspect-video' : 'aspect-square')}>
              <img src={p.photo_url} alt="Photo" className="w-full h-full object-cover hover:scale-105 transition-transform"/>
              {canEdit && (
                <button onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center">
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      ) : canEdit && (
        <label className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:border-orange-400 transition bg-gray-50">
          <span className="text-3xl mb-2">📸</span>
          <span className="text-sm font-semibold text-gray-700">Ajouter des photos</span>
          <span className="text-xs text-gray-400 mt-1">Max 5 photos</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload}/>
        </label>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <img src={selected} alt="Photo" className="max-w-full max-h-full rounded-2xl object-contain"/>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">X</button>
        </div>
      )}
    </div>
  )
}