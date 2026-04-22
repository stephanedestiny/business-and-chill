export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, token } = req.body;
  if (!email || !token) return res.status(400).json({ error: 'Email et token requis' });

  const dashboardUrl = 'https://business-and-chill.vercel.app/dashboard?token=' + token;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Business & Chill <onboarding@resend.dev>',
        to: [email],
        subject: 'Votre fiche Business & Chill est en ligne !',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #111; font-size: 28px; margin: 0;">
                Business <span style="color: #f97316;">&</span> Chill
              </h1>
            </div>

            <div style="background: #fff7ed; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
              <h2 style="color: #111; margin: 0 0 8px 0;">Bienvenue ${name} ! 🎉</h2>
              <p style="color: #666; margin: 0;">Votre fiche business est maintenant visible sur l annuaire des business caribeens.</p>
            </div>

            <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #111; margin: 0 0 16px 0;">📊 Votre tableau de bord</h3>
              <p style="color: #666; margin: 0 0 16px 0;">Suivez vos statistiques : vues, clics, avis clients et bien plus encore.</p>
              <a href="${dashboardUrl}" style="display: inline-block; background: #f97316; color: white; font-weight: bold; padding: 12px 24px; border-radius: 50px; text-decoration: none;">
                Acceder a mon tableau de bord
              </a>
            </div>

            <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #111; margin: 0 0 16px 0;">🚀 Boostez votre visibilite</h3>
              <p style="color: #666; margin: 0 0 8px 0;">Passez au plan Premium pour :</p>
              <ul style="color: #666; margin: 0 0 16px 0; padding-left: 20px;">
                <li>Une page de vente complete sur-mesure</li>
                <li>Meilleur referencement SEO</li>
                <li>Badge Verifie sur votre fiche</li>
                <li>Statistiques avancees mensuelles</li>
              </ul>
              <div style="display: flex; gap: 12px;">
                <a href="https://business-and-chill.vercel.app" style="display: inline-block; background: #111; color: white; font-weight: bold; padding: 12px 24px; border-radius: 50px; text-decoration: none;">
                  Plan 25€/mois
                </a>
              </div>
            </div>

            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Business & Chill · Destiny Media Group · Guadeloupe</p>
              <p>Votre lien dashboard personnel : <a href="${dashboardUrl}" style="color: #f97316;">${dashboardUrl}</a></p>
            </div>
          </div>
        `
      })
    });

    const data = await response.json();
    if (data.id) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: 'Erreur envoi email' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}