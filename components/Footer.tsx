import WhatsAppIcon from './WhatsAppIcon';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/logo-cc.png" 
                    alt="Code Clinic Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Code Clinic</h3>
                  <p className="text-blue-300 text-sm font-medium">Professionele Computerhulp</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed max-w-md">
                Professionele computerhulp in Rotterdam en omstreken. Hulp op afstand en bij u thuis.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <a 
                    href="https://wa.me/31624837889" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-green-400 transition-colors font-medium"
                  >
                    +31 6 24837889
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📧</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">E-mail</p>
                  <a 
                    href="mailto:codeclinic.nl@gmail.com" 
                    className="text-white hover:text-blue-400 transition-colors font-medium"
                  >
                    codeclinic.nl@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-6 relative">
              Onze Diensten
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                'Virus verwijdering',
                'Computer opschonen', 
                'Wifi verbeteren',
                'Hulp op afstand',
                'Hulp bij u thuis'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#diensten" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white mb-6 relative">
              Informatie
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Afspraak maken', href: '#contact' },
                { name: 'Prijzen', href: '#tarieven' },
                { name: 'Veelgestelde vragen', href: '/faq' },
                { name: 'Privacy & Cookies', href: '/privacy' },
                { name: 'Algemene voorwaarden', href: '/terms' }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-lg">
                © {new Date().getFullYear()} CodeClinic.nl
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Professionele computerhulp in Rotterdam en omstreken
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online beschikbaar</span>
              </div>
              <div className="text-sm text-gray-500">
                Geen voorrijkosten in Rotterdam
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
  