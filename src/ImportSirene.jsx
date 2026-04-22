import { useState } from 'react'
import { supabase } from './supabase'

const SIRENE_KEY = import.meta.env.VITE_SIRENE_API_KEY

const TERRITOIRES = [
  { nom: 'Guadeloupe', codes: [
    '97100','97110','97111','97112','97113','97114','97115','97116','97117','97118','97119',
    '97120','97121','97122','97123','97124','97125','97126','97127','97128','97129',
    '97130','97131','97132','97133','97134','97135','97136','97137','97138','97139',
    '97140','97141','97142','97143','97144','97145','97146','97147','97148','97149',
    '97150','97151','97152','97153','97154','97155','97156','97157','97158','97159',
    '97160','97170','97180','97190'
  ]},
  { nom: 'Martinique', codes: [
    '97200','97210','97211','97212','97213','97214','97215','97216','97217','97218','97219',
    '97220','97221','97222','97223','97224','97225','97226','97227','97228','97229',
    '97230','97231','97232','97233','97234','97235','97236','97237','97238','97239',
    '97240','97241','97242','97243','97244','97245','97246','97247','97248','97249',
    '97250','97260','97270','97280','97290'
  ]},
  { nom: 'Guyane', codes: [
    '97300','97301','97302','97303','97304','97305','97306','97307','97308','97309',
    '97310','97311','97312','97313','97314','97315','97316','97317','97318','97319',
    '97320','97330','97340','97350','97355','97356','97358','97360','97370','97380','97390'
  ]},
  { nom: 'Saint-Martin', codes: ['97150','97800'] },
]

export default function ImportSirene() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)

  function addLog(msg) { setLogs(prev => [...prev, msg]) }

  async function importerCodePostal(territoire, codePostal) {
    try {
      const response = await fetch(
        'https://api.insee.fr/api-sirene/3.11/siret?q=codePostalEtablissement:' + codePostal + '&nombre=20',
        { headers: { 'X-INSEE-Api-Key-Integration': SIRENE_KEY, 'Accept': 'application/json' } }
      )
      if (!response.ok) return 0
      const data = await response.json()
      const etablissements = data.etablissements || []
      let importes = 0
      for (const etab of etablissements) {
        const etat = etab.periodesEtablissement?.[0]?.etatAdministratifEtablissement
        if (etat !== 'A') continue
        const nom = etab.uniteLegale?.denominationUniteLegale ||
          ((etab.uniteLegale?.prenom1UniteLegale || '') + ' ' + (etab.uniteLegale?.nomUniteLegale || '')).trim()
        if (!nom || nom.length < 2) continue
        const ville = etab.adresseEtablissement?.libelleCommuneEtablissement || territoire.nom
        const activite = etab.periodesEtablissement?.[0]?.activitePrincipaleEtablissement || ''
        const { error } = await supabase.from('businesses').upsert({
          name: nom, territory: territoire.nom, sector: activite,
          description: 'Business situe a ' + ville + ', ' + territoire.nom + '.',
          email: '', website: '', plan: 'gratuit'
        }, { onConflict: 'name' })
        if (!error) importes++
      }
      return importes
    } catch { return 0 }
  }

  async function lancerImport() {
    setLoading(true); setLogs([]); setTotal(0)
    addLog('Demarrage import Sirene elargi...')
    let totalImportes = 0
    for (const territoire of TERRITOIRES) {
      addLog('Import ' + territoire.nom + ' (' + territoire.codes.length + ' codes postaux)...')
      let t = 0
      for (const code of territoire.codes) {
        const nb = await importerCodePostal(territoire, code)
        t += nb
        await new Promise(r => setTimeout(r, 200))
      }
      addLog(t + ' business importes depuis ' + territoire.nom)
      totalImportes += t
    }
    setTotal(totalImportes)
    addLog('Import termine ! ' + totalImportes + ' business importes.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Import API Sirene</h1>
        <p className="text-gray-500 mb-8">Import elargi Guadeloupe, Martinique, Guyane et Saint-Martin</p>
        <button onClick={lancerImport} disabled={loading}
          className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition disabled:opacity-50 mb-8">
          {loading ? 'Import en cours...' : 'Lancer import elargi'}
        </button>
        {total > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-700 font-bold">{total} business importes avec succes !</p>
          </div>
        )}
        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, i) => <div key={i} className="text-green-400 mb-1">{log}</div>)}
          </div>
        )}
      </div>
    </div>
  )
}