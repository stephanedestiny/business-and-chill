import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { supabase } from './supabase'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const TERRITOIRE_COORDS = {
  'Guadeloupe': [16.265, -61.551],
  'Martinique': [14.641, -61.024],
  'Guyane': [3.933, -53.125],
  'Saint-Martin': [18.075, -63.082],
}

async function geocodeAddress(business) {
  const query = business.name + ' ' + business.territory + ' Antilles'
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1')
    const data = await res.json()
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch {}
  const base = TERRITOIRE_COORDS[business.territory] || [14.641, -61.024]
  return [base[0] + (Math.random() - 0.5) * 0.1, base[1] + (Math.random() - 0.5) * 0.1]
}

export default function MapPage({ onClose, onBusiness }) {
  const [businesses, setBusinesses] = useState([])
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [territory, setTerritory] = useState('Guadeloupe')

  useEffect(() => {
    supabase.from('businesses').select('*').limit(200)
      .then(({ data }) => { if (data) setBusinesses(data); setLoading(false) })
  }, [])

  useEffect(() => {
    if (businesses.length === 0) return
    const filtered = businesses.filter(b => b.territory === territory).slice(0, 50)
    setMarkers([])
    setLoading(true)
    Promise.all(filtered.map(async b => {
      const coords = await geocodeAddress(b)
      return { ...b, coords }
    })).then(results => {
      setMarkers(results)
      setLoading(false)
    })
  }, [territory, businesses])

  const center = TERRITOIRE_COORDS[territory] || [14.641, -61.024]

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-4xl rounded-3xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900">🗺️ Carte des business</h2>
            <div className="flex gap-2">
              {Object.keys(TERRITOIRE_COORDS).map(t => (
                <button key={t} onClick={() => setTerritory(t)}
                  className={"px-3 py-1 rounded-full text-xs font-semibold transition " + (territory === t ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center font-bold">X</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 text-gray-400">
            <div className="text-center">
              <p className="text-4xl mb-2">🗺️</p>
              <p>Chargement de la carte...</p>
            </div>
          </div>
        ) : (
          <MapContainer center={center} zoom={11} style={{height:'500px', width:'100%'}}>
            <TileLayer
              attribution='OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map(b => (
              <Marker key={b.id} position={b.coords}>
                <Popup>
                  <div className="p-2 min-w-[160px]">
                    <p className="font-bold text-gray-900 text-sm mb-1">{b.name}</p>
                    <p className="text-xs text-orange-500 mb-2">📍 {b.territory}</p>
                    {b.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{b.description}</p>}
                    <button onClick={() => { onBusiness(b); onClose() }}
                      className="w-full bg-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                      Voir la fiche
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        <div className="p-3 bg-gray-50 text-center">
          <p className="text-xs text-gray-400">{markers.length} business affichés sur la carte · {territory}</p>
        </div>
      </div>
    </div>
  )
}