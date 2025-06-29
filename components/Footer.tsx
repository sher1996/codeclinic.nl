export default function Footer() {
    return (
      <footer className="bg-transparent text-white py-16 border-t-2 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">CodeClinic.nl</h3>
              <p className="text-lg text-white/80 leading-relaxed senior-description">
                Professionele computerhulp voor senioren. Hulp op afstand en bij u thuis.
              </p>
              <div className="space-y-3 text-lg">
                <p className="text-white/90">
                  <span role="img" aria-label="Telefoon icoon">📞</span> 
                  <a href="tel:+31624837889" className="footer-link">+31 6 24837889</a>
                </p>
                <p className="text-white/90">
                  <span role="img" aria-label="E-mail icoon">📧</span> 
                  <a href="mailto:info@codeclinic.nl" className="footer-link">info@codeclinic.nl</a>
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">Onze Diensten</h3>
              <ul className="space-y-3 text-lg">
                <li><a href="#diensten" className="footer-link">Virus verwijdering</a></li>
                <li><a href="#diensten" className="footer-link">Computer opschonen</a></li>
                <li><a href="#diensten" className="footer-link">Wifi verbeteren</a></li>
                <li><a href="#diensten" className="footer-link">Hulp op afstand</a></li>
                <li><a href="#diensten" className="footer-link">Hulp bij u thuis</a></li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">Informatie</h3>
              <ul className="space-y-3 text-lg">
                <li><a href="#contact" className="footer-link">Afspraak maken</a></li>
                <li><a href="#tarieven" className="footer-link">Prijzen</a></li>
                <li><a href="/faq" className="footer-link">Veelgestelde vragen</a></li>
                <li><a href="/privacy" className="footer-link">Privacy & Cookies</a></li>
                <li><a href="/terms" className="footer-link">Algemene voorwaarden</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-12 border-t border-white/10 text-center">
            <p className="text-lg text-white/70">
              © {new Date().getFullYear()} CodeClinic.nl · KvK 86438948 · BTW NL004247935B44
            </p>
            <p className="text-base text-white/60 mt-3 senior-description">
              Professionele computerhulp voor senioren in heel Nederland
            </p>
          </div>
        </div>
      </footer>
    );
  }
  