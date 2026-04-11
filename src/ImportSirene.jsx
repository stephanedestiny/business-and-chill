import { useState } from 'react'
import { supabase } from './supabase'

const SIRENE_KEY = import.meta.env.VITE_SIRENE_API_KEY

const TERRITOIRES = [
  { nom: 'Guadeloupe', codes: ['97100','97110','97120','97122','97130','97139','97140','97150','97160','97170','97180','97190'] },
  { nom: 'Martinique', codes: ['97200','97210','97212','97213','97214','97215','97216','97217','97218','97220','97221','97222','97224','97225','97226','97227','97228','97229','97230','97231','97232','97233','97234','97240','97250','97260','97270','97280','97290'] },
  { nom: 'Guyane', codes: ['97300','97310','97311','97312','97313','97314','97315','97316','97317','97318','97319','97320','97330','97340','97350','97355','97356','97358','97360','97370','97380','97388','97390'] },
]

export default function ImportSirene() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)

  function addLog(msg) {
    setLogs(prev => [...prev, msg])
  }

  async function importerCodePostal(territoire, codePostal) {
    try {
      const response = await fetch(
        `https://api.insee.fr/api-sirene/3.11/siret?q=codePostalEtablissement:${codePostal}&nombre=20`,
        {
          headers: {
            'X-INSEE-Api-Key-Integration': SIRENE_KEY,
            'Accept': 'application/json'
          }
        }
      )

      if (!response.ok) return 0

      const data = await response.json()
      const etablissements = data.etablissements || []

      let importes = 0
      for (const etab of etablissements) {
        const etat = etab.periodesEtablissement?.[0]?.etatAdministratifEtablissement
        if (etat !== 'A') continue

        const nom = etab.uniteLegale?.denominationUniteLegale ||
          `${etab.uniteLegale?.prenom1UniteLegale || ''} ${etab.uniteLegale?.nomUniteLegale || ''}`.trim()

        if (!nom) continue

        const ville = etab.adresseEtablissement?.libelleCommuneEtablissement || territoire.nom
        const activite = etab.periodesEtablissement?.[0]?.activitePrincipaleEtablissement || ''

        const { error } = await supabase
          .from('businesses')
          .upsert({
            name: nom,
            territory: territoire.nom,
            sector: activite,
            description: `Business situé à ${ville}, ${territoire.nom}.`,
            email: '',
            website: '',
            plan: 'gratuit'
          }, { onConflict: 'name' })

        if (!error) importes++
      }

      return importes

    } catch (err) {
      return 0
    }
  }

  async function lancerImport() {
    setLoading(true)
    setLogs([])
    setTotal(0)
    addLog('🚀 Démarrage de l\'import Sirene...')

    let totalImportes = 0

    for (const territoire of TERRITOIRES) {
      addLog(`🔍 Import ${territoire.nom} (${territoire.codes.length} codes postaux)...`)
      let territoireTotal = 0

      for (const code of territoire.codes) {
        const nb = await importerCodePostal(territoire, code)
        territoireTotal += nb
        await new Promise(r => setTimeout(r, 300))
      }

      addLog(`✅ ${territoireTotal} business importés depuis ${territoire.nom}`)
      totalImportes += territoireTotal
    }

    setTotal(totalImportes)
    addLog(`🎉 Import terminé ! ${totalImportes} business importés au total.`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          🗺️ Import API Sirene
        </h1>
        <p className="text-gray-500 mb-2">
          Importe automatiquement les business actifs de Guadeloupe, Martinique et Guyane.
        </p>
        <p className="text-xs text-gray-400 mb-8">
          ⚠️ Cette page est réservée à l'admin. À supprimer avant la mise en production.
        </p>

        <button
          onClick={lancerImport}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition disabled:opacity-50 mb-8"
        >
          {loading ? '⏳ Import en cours...' : '🚀 Lancer l\'import'}
        </button>

        {total > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-700 font-bold text-lg">
              ✅ {total} business importés avec succès !
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 mb-1">{log}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}