import { useState } from 'react';
import { Menu, Heart } from 'lucide-react';
import CountdownTimer from './components/CountdownTimer';
import RSVPModal from './components/RSVPModal';
import GuestBookModal from './components/GuestBookModal';

function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestBookOpen, setIsGuestBookOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-neutral-300 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-rose-300"></div>
              <div className="w-6 h-6 rounded-full border-2 border-rose-300 -ml-3"></div>
            </div>
            <span className="font-serif text-rose-300 text-lg">Emir & Sude</span>
          </div>

          <div className="w-6"></div>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 border-b border-neutral-800 py-4">
            <nav className="max-w-7xl mx-auto px-6 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left text-neutral-300 hover:text-rose-300 transition-colors"
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => scrollToSection('countdown')}
                className="text-left text-neutral-300 hover:text-rose-300 transition-colors"
              >
                Geri Sayım
              </button>
              <button
                onClick={() => scrollToSection('story')}
                className="text-left text-neutral-300 hover:text-rose-300 transition-colors"
              >
                Hikayemiz
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-left text-neutral-300 hover:text-rose-300 transition-colors"
              >
                Fotoğraflar
              </button>
              <button
                onClick={() => scrollToSection('rsvp')}
                className="text-left text-neutral-300 hover:text-rose-300 transition-colors"
              >
                Katılım
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-16">
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900/50 to-black z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            }}
          ></div>
          <div className="relative z-20 text-center px-6">
            <div className="writing-mode-vertical text-6xl md:text-7xl font-serif text-rose-300 mb-8 mx-auto" style={{ writingMode: 'vertical-rl' }}>
              Save The Date
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
              Emir & Sude
            </h1>
            <p className="text-2xl md:text-3xl text-neutral-300 font-light">
              28 Haziran 2026
            </p>
          </div>
        </section>

        <section id="countdown" className="py-20 bg-black">
          <CountdownTimer />
        </section>

        <section id="story" className="py-20 px-6 bg-neutral-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-rose-300 mb-8">
              Etkinlik Bilgileri
            </h2>
            <div className="mb-8">
              <Heart size={48} className="mx-auto text-rose-300" />
            </div>
            <p className="text-neutral-300 text-lg leading-relaxed font-light mb-6">
              Hayatımızın en özel gününde sizlerle birlikte olmak, sevincimizi paylaşmak bizim için çok değerli.
            </p>
            <p className="text-neutral-300 text-lg leading-relaxed font-light mb-6">
              İki kalbin birleştiği, iki ailenin kaynaştığı bu özel günde yanımızda olmanızı istiyoruz.
            </p>
            <p className="text-neutral-300 text-lg leading-relaxed font-light">
              28 Haziran 2026 tarihinde, sevgimize tanıklık etmek için sizleri düğünümüze davet ediyoruz.
            </p>
          </div>
        </section>

        <section id="gallery" className="py-20 px-6 bg-black">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-rose-300 mb-12 text-center">
              Fotoğraflarımız
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'https://images.pexels.com/photos/2072179/pexels-photo-2072179.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/1445696/pexels-photo-1445696.jpeg?auto=compress&cs=tinysrgb&w=600',
                'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=600',
              ].map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden border-4 border-neutral-800 shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '-2' : '2'}deg)`,
                  }}
                >
                  <img
                    src={src}
                    alt={`Wedding photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="rsvp" className="py-20 px-6 bg-neutral-900">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black border border-neutral-800 rounded-2xl p-8 text-center hover:border-rose-400 transition-colors">
                <h3 className="text-2xl font-serif text-rose-300 mb-4">
                  Katılım Durumunuzu Bildirin
                </h3>
                <p className="text-neutral-400 mb-6 font-light">
                  Düğünümüze katılıp katılamayacağınızı lütfen bize bildirin
                </p>
                <button
                  onClick={() => setIsRSVPOpen(true)}
                  className="bg-gradient-to-r from-rose-400 to-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:from-rose-500 hover:to-rose-600 transition-all"
                >
                  LCV Formu
                </button>
              </div>

              <div className="bg-black border border-neutral-800 rounded-2xl p-8 text-center hover:border-neutral-600 transition-colors">
                <h3 className="text-2xl font-serif text-white mb-4">
                  Hediye ve Teşekkür
                </h3>
                <p className="text-neutral-400 mb-6 font-light">
                  Bizim için bir anı veya dilek bırakın
                </p>
                <button
                  onClick={() => setIsGuestBookOpen(true)}
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-all"
                >
                  Anı Bırak
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="relative py-20 px-6 bg-black">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            }}
          ></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-rose-300"></div>
                <div className="w-12 h-12 rounded-full border-2 border-rose-300 -ml-6"></div>
              </div>
              <h2 className="text-4xl font-serif text-rose-300 mb-2">
                Emir & Sude
              </h2>
              <p className="text-neutral-400 text-lg">28 Haziran 2026</p>
            </div>
            <div className="border-t border-neutral-800 pt-8">
              <p className="text-neutral-500 text-sm mb-2">ALLEVENTY</p>
              <p className="text-neutral-600 text-xs">
                Bu site 'ALLEVENTY' ile hazırlanmıştır
              </p>
            </div>
          </div>
        </footer>
      </main>

      <RSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
      <GuestBookModal
        isOpen={isGuestBookOpen}
        onClose={() => setIsGuestBookOpen(false)}
      />
    </div>
  );
}

export default App;
