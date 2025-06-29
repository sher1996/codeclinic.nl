import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy & Cookies - CodeClinic Computerhulp Rotterdam',
  description: 'Lees hoe CodeClinic uw persoonlijke gegevens beschermt en gebruikt. Transparante privacyverklaring voor computerhulp diensten in Rotterdam.',
  keywords: 'privacy computerhulp, cookies computer reparatie, gegevensbescherming computerhulp Rotterdam, privacyverklaring computer ondersteuning',
  openGraph: {
    title: 'Privacy & Cookies - CodeClinic Computerhulp Rotterdam',
    description: 'Lees hoe CodeClinic uw persoonlijke gegevens beschermt en gebruikt. Transparante privacyverklaring voor computerhulp diensten in Rotterdam.',
    url: 'https://codeclinic.nl/privacy',
  },
  twitter: {
    title: 'Privacy & Cookies - CodeClinic Computerhulp Rotterdam',
    description: 'Lees hoe CodeClinic uw persoonlijke gegevens beschermt en gebruikt. Transparante privacyverklaring voor computerhulp diensten in Rotterdam.',
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Privacy & Cookies
          </h1>
          
          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Uw Privacy is Belangrijk voor Ons
              </h2>
              <p className="text-white/90">
                Bij CodeClinic.nl nemen we uw privacy zeer serieus. Deze pagina legt uit hoe we uw persoonlijke gegevens verzamelen, gebruiken en beschermen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Welke Gegevens Verzamelen We?
              </h2>
              <div className="space-y-3 text-white/90">
                <p>We verzamelen alleen de gegevens die nodig zijn om u te helpen:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Contactgegevens:</strong> Uw naam, telefoonnummer en e-mailadres</li>
                  <li><strong>Afspraakgegevens:</strong> Datum, tijd en locatie van uw afspraak</li>
                  <li><strong>Computerproblemen:</strong> Beschrijving van het probleem dat u ervaart</li>
                  <li><strong>Technische informatie:</strong> Type computer en besturingssysteem (alleen als nodig)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Hoe Beschermen We Uw Gegevens?
              </h2>
              <div className="space-y-3 text-white/90">
                <p>We nemen uitgebreide maatregelen om uw gegevens veilig te houden:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Versleutelde verbindingen:</strong> Alle gegevens worden versleuteld verzonden</li>
                  <li><strong>Veilige servers:</strong> Uw gegevens worden op beveiligde servers opgeslagen</li>
                  <li><strong>Toegangscontrole:</strong> Alleen geautoriseerd personeel heeft toegang tot uw gegevens</li>
                  <li><strong>Regelmatige updates:</strong> We houden onze beveiliging up-to-date</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Hoe Gebruiken We Uw Gegevens?
              </h2>
              <div className="space-y-3 text-white/90">
                <p>Uw gegevens worden alleen gebruikt voor:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Het maken en beheren van uw afspraken</li>
                  <li>Het leveren van computerhulp en ondersteuning</li>
                  <li>Het sturen van belangrijke informatie over uw afspraak</li>
                  <li>Het verbeteren van onze dienstverlening</li>
                </ul>
                <p className="mt-4">
                  <strong>We verkopen of delen uw gegevens nooit met derden</strong> voor marketingdoeleinden.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Cookies
              </h2>
              <div className="space-y-3 text-white/90">
                <p>Onze website gebruikt cookies om uw ervaring te verbeteren:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Noodzakelijke cookies:</strong> Voor het correct functioneren van de website</li>
                  <li><strong>Voorkeuren cookies:</strong> Om uw instellingen te onthouden</li>
                  <li><strong>Analytische cookies:</strong> Om te begrijpen hoe de website wordt gebruikt (anoniem)</li>
                </ul>
                <p className="mt-4">
                  U kunt cookies altijd uitschakelen via uw browserinstellingen, maar dit kan de functionaliteit van de website beïnvloeden.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Uw Rechten
              </h2>
              <div className="space-y-3 text-white/90">
                <p>U heeft het recht om:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Uw gegevens in te zien en te wijzigen</li>
                  <li>Uw gegevens te laten verwijderen</li>
                  <li>Bezwaar te maken tegen het gebruik van uw gegevens</li>
                  <li>Uw gegevens te laten overdragen</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Contact
              </h2>
              <div className="space-y-3 text-white/90">
                <p>
                  Heeft u vragen over uw privacy of wilt u uw gegevens inzien? Neem dan contact met ons op:
                </p>
                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <p><strong>E-mail:</strong> <a href="mailto:info@codeclinic.nl" className="text-blue-200 hover:text-blue-100">info@codeclinic.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31624837889" className="text-blue-200 hover:text-blue-100">+31 6 24837889</a></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Wijzigingen
              </h2>
              <p className="text-white/90">
                We kunnen deze privacyverklaring af en toe aanpassen. Belangrijke wijzigingen zullen we altijd duidelijk communiceren via onze website.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Terug naar Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 