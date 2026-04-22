const PLANS = [
  {
    id: 'ref',
    name: 'Referencement',
    price: 25,
    priceId: 'price_1TOntxA8nCQYywL8s7YKWpu2',
    color: '#FF5C00',
    emoji: '🌴',
    features: ['Fiche visible sur annuaire','SEO optimise','1 article blog/mois','Badge Verifie','Statistiques mensuelles','Support prioritaire']
  },
  {
    id: 'sales',
    name: 'Page de vente',
    price: 55,
    priceId: 'price_1TOnuXA8nCQYywL8U4Kk6nn7',
    color: '#006B5E',
    emoji: '🚀',
    features: ['Tout le plan Ref inclus','Page de vente sur-mesure','Copywriting pro','SEO + SEA','Chatbot IA','Reporting mensuel','Acces prioritaire']
  }
]

export default function PricingPage({ onClose, businessName }) {
  async function handleSubscribe(plan) {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, businessName })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur: ' + (data.error || 'Probleme de connexion'))
      }
    } catch (err) {
      alert('Erreur: ' + err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Boostez votre visibilite</h2>
            <p className="text-gray-500 text-sm mt-1">Choisissez votre plan</p>
          </div>
          <button onClick={onClose} className="bg-gray-100 rounded-full w-9 h-9 flex items-center justify-center font-bold">X</button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLANS.map(plan => (
            <div key={plan.id} className="border-2 rounded-2xl p-6 flex flex-col" style={{borderColor: plan.color}}>
              <div className="text-3xl mb-3">{plan.emoji}</div>
              <h3 className="text-xl font-black mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black" style={{color: plan.color}}>{plan.price}€</span>
                <span className="text-gray-400 text-sm">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span style={{color: plan.color}} className="font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSubscribe(plan)} className="w-full py-3 rounded-full font-bold text-white text-sm" style={{background: plan.color}}>
                Choisir ce plan
              </button>
            </div>
          ))}
        </div>
        <div className="mx-6 mb-6 bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-sm font-bold mb-1">Besoin d un accompagnement ?</p>
          <p className="text-xs text-gray-500 mb-3">Consulting avec Stephane DESTINY - NANO AGENCY</p>
          <a href="https://calendly.com/stephanedestiny" target="_blank" rel="noreferrer" className="inline-block bg-gray-900 text-white font-bold text-xs px-6 py-2 rounded-full">
            Prendre RDV
          </a>
        </div>
      </div>
    </div>
  )
}