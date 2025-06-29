import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden - CodeClinic Computerhulp Rotterdam',
  description: 'Lees de algemene voorwaarden van CodeClinic voor computerhulp diensten in Rotterdam. Duidelijke afspraken over service, betaling en garanties.',
  keywords: 'algemene voorwaarden computerhulp, voorwaarden computer reparatie, service voorwaarden computerhulp Rotterdam, computer ondersteuning voorwaarden',
  openGraph: {
    title: 'Algemene Voorwaarden - CodeClinic Computerhulp Rotterdam',
    description: 'Lees de algemene voorwaarden van CodeClinic voor computerhulp diensten in Rotterdam. Duidelijke afspraken over service, betaling en garanties.',
    url: 'https://codeclinic.nl/terms',
  },
  twitter: {
    title: 'Algemene Voorwaarden - CodeClinic Computerhulp Rotterdam',
    description: 'Lees de algemene voorwaarden van CodeClinic voor computerhulp diensten in Rotterdam. Duidelijke afspraken over service, betaling en garanties.',
  },
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">
            Algemene Voorwaarden
          </h1>
          
          <div className="space-y-8 text-lg leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Welkom bij CodeClinic.nl
              </h2>
              <p className="text-white/90">
                Deze algemene voorwaarden gelden voor alle diensten van CodeClinic.nl. Door gebruik te maken van onze diensten gaat u akkoord met deze voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Onze Diensten
              </h2>
              <div className="space-y-3 text-white/90">
                <p>CodeClinic.nl biedt professionele computerhulp aan senioren:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Virus verwijdering en beveiliging</li>
                  <li>Computer opschonen en optimalisatie</li>
                  <li>Wifi en internetverbinding verbeteren</li>
                  <li>Hulp op afstand via TeamViewer</li>
                  <li>Hulp bij u thuis</li>
                  <li>Uitleg en instructie over computergebruik</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                "No Cure No Pay" - Onze Belofte
              </h2>
              <div className="bg-blue-600/20 border-l-4 border-blue-400 p-6 rounded-lg">
                <p className="text-white font-semibold mb-3">
                  <strong>Wat betekent "No Cure No Pay"?</strong>
                </p>
                <p className="text-white/90 mb-4">
                  Als wij uw computerprobleem niet kunnen oplossen, betaalt u niets. Dit is onze garantie aan u.
                </p>
                <div className="space-y-2 text-white/90">
                  <p><strong>Wanneer betaalt u wel:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Als we het probleem succesvol hebben opgelost</li>
                    <li>Als we een duidelijke diagnose hebben gesteld en u heeft besloten om het probleem niet te laten oplossen</li>
                    <li>Voor preventieve onderhoudsdiensten (zoals computer opschonen)</li>
                  </ul>
                  <p className="mt-3"><strong>Wanneer betaalt u niet:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Als we het probleem niet kunnen oplossen</li>
                    <li>Als het probleem te complex is voor onze expertise</li>
                    <li>Als er hardware vervanging nodig is die u niet wilt</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Afspraken en Betaling
              </h2>
              <div className="space-y-3 text-white/90">
                <p><strong>Afspraken:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Afspraken kunnen telefonisch of via de website worden gemaakt</li>
                  <li>We streven ernaar om binnen 24 uur te reageren</li>
                  <li>Voor spoedgevallen zijn we beschikbaar op +31 6 24837889</li>
                </ul>
                
                <p className="mt-4"><strong>Betaling:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Betaling vindt plaats na de geleverde dienst</li>
                  <li>We accepteren contante betaling, PIN en bankoverschrijving</li>
                  <li>U ontvangt altijd een factuur voor uw administratie</li>
                  <li>Onze tarieven zijn transparant en worden vooraf besproken</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Privacy en Gegevensbescherming
              </h2>
              <div className="space-y-3 text-white/90">
                <p>
                  We behandelen uw persoonlijke gegevens met de grootste zorg. Zie onze 
                  <Link href="/privacy" className="text-blue-200 hover:text-blue-100 underline"> Privacy & Cookies pagina</Link> 
                  voor meer informatie.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Uw gegevens worden alleen gebruikt voor het leveren van onze diensten</li>
                  <li>We delen uw gegevens nooit met derden zonder uw toestemming</li>
                  <li>U heeft altijd het recht om uw gegevens in te zien of te laten verwijderen</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Aansprakelijkheid
              </h2>
              <div className="space-y-3 text-white/90">
                <p><strong>Onze verantwoordelijkheid:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We werken zorgvuldig en professioneel</li>
                  <li>We maken altijd een backup voordat we wijzigingen maken</li>
                  <li>We zijn verzekerd voor eventuele schade tijdens onze werkzaamheden</li>
                </ul>
                
                <p className="mt-4"><strong>Uw verantwoordelijkheid:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Het verstrekken van correcte informatie over het probleem</li>
                  <li>Het beschikbaar stellen van de benodigde toegang tot uw computer</li>
                  <li>Het volgen van onze veiligheidsadviezen</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Klachten en Geschillen
              </h2>
              <div className="space-y-3 text-white/90">
                <p>
                  Heeft u een klacht over onze dienstverlening? Neem dan direct contact met ons op:
                </p>
                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <p><strong>E-mail:</strong> <a href="mailto:info@codeclinic.nl" className="text-blue-200 hover:text-blue-100">info@codeclinic.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31624837889" className="text-blue-200 hover:text-blue-100">+31 6 24837889</a></p>
                </div>
                <p className="mt-4">
                  We streven ernaar om alle klachten binnen 5 werkdagen te behandelen. Als we er samen niet uitkomen, kunnen we een onafhankelijke mediator inschakelen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Wijzigingen van Voorwaarden
              </h2>
              <p className="text-white/90">
                We kunnen deze voorwaarden af en toe aanpassen. Belangrijke wijzigingen zullen we altijd duidelijk communiceren via onze website. Door gebruik te blijven maken van onze diensten gaat u akkoord met de gewijzigde voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-200">
                Contact
              </h2>
              <div className="space-y-3 text-white/90">
                <p>Heeft u vragen over deze voorwaarden? Neem dan contact met ons op:</p>
                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <p><strong>CodeClinic.nl</strong></p>
                  <p><strong>E-mail:</strong> <a href="mailto:info@codeclinic.nl" className="text-blue-200 hover:text-blue-100">info@codeclinic.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31624837889" className="text-blue-200 hover:text-blue-100">+31 6 24837889</a></p>
                  <p><strong>KvK:</strong> 86438948</p>
                  <p><strong>BTW:</strong> NL004247935B44</p>
                </div>
              </div>
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