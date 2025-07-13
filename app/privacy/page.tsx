import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - CodeClinic',
  description: 'Lees hoe CodeClinic uw privacy beschermt en hoe wij uw gegevens verwerken volgens de AVG/GDPR.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Inleiding</h2>
            <p className="mb-4">
              CodeClinic respecteert uw privacy en zorgt ervoor dat alle persoonlijke informatie die u ons verschaft vertrouwelijk wordt behandeld. 
              Deze privacy policy is van toepassing op alle diensten van CodeClinic.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Verwerking van persoonsgegevens</h2>
            <p className="mb-4">
              CodeClinic verwerkt persoonsgegevens wanneer u gebruik maakt van onze diensten en/of wanneer u deze zelf aan ons verstrekt. 
              Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Voor- en achternaam</li>
              <li>E-mailadres</li>
              <li>Telefoonnummer</li>
              <li>Adresgegevens</li>
              <li>IP-adres</li>
              <li>Website gebruik (via cookies)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Doel en grondslag</h2>
            <p className="mb-4">
              CodeClinic verwerkt uw persoonsgegevens voor de volgende doelen:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Het afhandelen van uw betaling</li>
              <li>U te kunnen bellen of e-mailen indien dit nodig is om onze dienstverlening uit te kunnen voeren</li>
              <li>U te informeren over wijzigingen van onze diensten en producten</li>
              <li>Om goederen en diensten bij u af te leveren</li>
              <li>CodeClinic analyseert uw gedrag op de website om de website te verbeteren en producten en diensten aan te bieden op uw behoeften af te stemmen.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies en tracking</h2>
            <p className="mb-4">
              CodeClinic gebruikt cookies en vergelijkbare technologieën om uw ervaring te verbeteren en websiteverkeer te analyseren. 
              Wij gebruiken Google Analytics met consent mode om uw privacy te respecteren.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Google Analytics</h3>
            <p className="mb-4">
              Onze website gebruikt Google Analytics om bezoekersstatistieken bij te houden. 
              Google Analytics gebruikt cookies om informatie over uw bezoek aan onze website te verzamelen.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Consent Mode</h3>
            <p className="mb-4">
              Wij hebben Google Analytics Consent Mode geïmplementeerd om te voldoen aan de AVG/GDPR. 
              Dit betekent dat:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Geen tracking plaatsvindt zonder uw toestemming</li>
              <li>U kunt kiezen tussen verschillende niveaus van toestemming</li>
              <li>Uw voorkeuren worden opgeslagen en gerespecteerd</li>
              <li>U kunt uw toestemming op elk moment wijzigen</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Bewaartermijn</h2>
            <p className="mb-4">
              CodeClinic bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. 
              Onze bewaartermijn is 7 jaar (dit geldt voor de wettelijke bewaarplicht).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Delen van persoonsgegevens met derden</h2>
            <p className="mb-4">
              CodeClinic verkoopt uw gegevens niet aan derden en verstrekt deze uitsluitend indien dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies en vergelijkbare technieken</h2>
            <p className="mb-4">
              CodeClinic gebruikt alleen technische, functionele en analytische cookies die geen inbreuk maken op uw privacy. 
              Een cookie is een klein tekstbestand dat bij het eerste bezoek aan deze website wordt opgeslagen op uw computer, tablet of smartphone. 
              De cookies die wij gebruiken zijn noodzakelijk voor de technische werking van de website en uw gebruiksgemak.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Gegevens inzien, aanpassen of verwijderen</h2>
            <p className="mb-4">
              U heeft het recht om uw persoonsgegevens in te zien, aan te passen of te verwijderen. 
              Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door CodeClinic.
            </p>
            <p className="mb-4">
              U kunt een verzoek tot inzage, correctie, verwijdering van uw persoonsgegevens of verzoek tot intrekking van uw toestemming of bezwaar op de verwerking van uw persoonsgegevens sturen naar info@codeclinic.nl.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Beveiliging</h2>
            <p className="mb-4">
              CodeClinic neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan. 
              Als u de indruk heeft dat uw gegevens niet goed beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan contact op via info@codeclinic.nl.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
            <p className="mb-4">
              Voor vragen over deze privacy policy of over de verwerking van uw persoonsgegevens kunt u contact opnemen met:
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p><strong>CodeClinic</strong></p>
              <p>E-mail: info@codeclinic.nl</p>
              <p>Website: www.codeclinic.nl</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Wijzigingen</h2>
            <p className="mb-4">
              CodeClinic behoudt zich het recht voor om wijzigingen aan te brengen in deze privacy policy. 
              Het is raadzaam om deze privacy policy regelmatig te raadplegen, zodat u van deze wijzigingen op de hoogte bent.
            </p>
            <p className="text-sm text-gray-300">
              Laatste update: {new Date().toLocaleDateString('nl-NL')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 