import { useState } from 'react';
import { Heart, CalendarDays, MapPin, Camera, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import CountdownTimer from './components/CountdownTimer';
import GuestBookModal from './components/GuestBookModal';
import RSVPModal from './components/RSVPModal';

function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestBookOpen, setIsGuestBookOpen] = useState(false);

  // Framer Motion Animasyon Varyasyonları (Premium Hissiyat İçin)
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-rose-400/30">
      {/* Header / Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Arka plan görseline hafif bir "zoom out" açılış efekti */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/60 to-neutral-950" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center px-4 flex flex-col items-center"
        >
          <motion.p variants={fadeInUp} className="text-rose-300 tracking-[0.3em] uppercase text-sm mb-6 font-light">
            Save The Date
          </motion.p>
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-serif mb-6 text-white font-light tracking-wide">
            Emir <span className="text-rose-300 italic">&</span> Sude
          </motion.h1>
          <motion.div variants={fadeInUp} className="flex items-center gap-4 text-neutral-300 text-lg md:text-xl font-light tracking-widest border-t border-b border-rose-300/30 py-4">
            <span>28</span>
            <span className="text-rose-300">•</span>
            <span>06</span>
            <span className="text-rose-300">•</span>
            <span>2026</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-rose-300/50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Countdown Section - Animasyon bileşenin kendi içinde eklenecek ama dış sargıyı hazırlayalım */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="relative z-20 -mt-20 px-4"
      >
        <CountdownTimer />
      </motion.section>

      {/* Event Details */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 max-w-4xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <Heart className="mx-auto text-rose-400 mb-6" strokeWidth={1} size={32} />
          <h2 className="text-3xl font-serif text-white mb-4">Etkinlik Bilgileri</h2>
          <div className="w-12 h-[1px] bg-rose-400/50 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div variants={scaleIn} className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-rose-300 mb-6">
              <CalendarDays strokeWidth={1.5} />
              <h3 className="text-xl font-light tracking-wide">Düğün Merasimi</h3>
            </div>
            <div className="space-y-4 text-neutral-400 font-light">
              <p className="flex items-center gap-3">
                <Clock size={18} className="text-neutral-500" />
                28 Haziran 2026, Pazar • 19:00
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={18} className="text-neutral-500 shrink-0 mt-1" />
                <span>
                  <strong className="text-neutral-200 font-normal">Wyndham Grand Istanbul</strong>
                  <br />Kalamış Marina, Kadıköy/İstanbul
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div variants={scaleIn} className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm flex flex-col justify-center text-center">
            <p className="text-neutral-300 font-light leading-relaxed italic">
              "Hayatımızın en özel gününde, en sevdiklerimizle birlikte bu mutluluğu paylaşmak istiyoruz. 
              Sizleri de aramızda görmekten onur duyacağız."
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Story / Gallery */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 bg-neutral-900/30"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Camera className="mx-auto text-rose-400 mb-6" strokeWidth={1} size={32} />
            <h2 className="text-3xl font-serif text-white mb-4">Anılarımız</h2>
            <div className="w-12 h-[1px] bg-rose-400/50 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={scaleIn} className="aspect-[4/5] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop" 
                alt="Couple 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <motion.div variants={scaleIn} className="aspect-[4/5] rounded-xl overflow-hidden group md:-translate-y-8">
              <img 
                src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop" 
                alt="Couple 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
            <motion.div variants={scaleIn} className="aspect-[4/5] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop" 
                alt="Couple 3"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Interaction Panels */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 px-6 max-w-4xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeInUp} className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl text-center group hover:border-rose-400/30 transition-colors duration-500">
            <h3 className="text-2xl font-serif text-white mb-4">LCV Formu</h3>
            <p className="text-neutral-400 font-light mb-8 h-12">
              Lütfen katılım durumunuzu 15 Haziran'a kadar bize bildirin.
            </p>
            <button 
              onClick={() => setIsRSVPOpen(true)}
              className="w-full py-4 bg-white text-neutral-950 rounded-lg font-medium tracking-wide hover:bg-rose-50 hover:text-rose-900 transition-all duration-300"
            >
              KATILIM BİLDİR
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl text-center group hover:border-rose-400/30 transition-colors duration-500">
            <h3 className="text-2xl font-serif text-white mb-4">Anı Defteri</h3>
            <p className="text-neutral-400 font-light mb-8 h-12">
              Bizim için güzel dileklerinizi ve düşüncelerinizi paylaşın.
            </p>
            <button 
              onClick={() => setIsGuestBookOpen(true)}
              className="w-full py-4 bg-transparent border border-neutral-600 text-white rounded-lg font-medium tracking-wide hover:border-rose-400 hover:text-rose-300 transition-all duration-300"
            >
              ANI BIRAK
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative py-24 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"
        />
        <div className="absolute inset-0 bg-neutral-950/80" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 text-center flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-4 text-2xl font-serif font-light text-rose-300/80">
            <span>E</span>
            <div className="w-1 h-1 rounded-full bg-rose-400/50" />
            <span>S</span>
          </div>
          <p className="text-neutral-500 text-sm tracking-widest uppercase">
            Bu site ALLEVENTY ile hazırlanmıştır
          </p>
        </motion.div>
      </footer>

      {/* Modals */}
      <RSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
      <GuestBookModal isOpen={isGuestBookOpen} onClose={() => setIsGuestBookOpen(false)} />
    </div>
  );
}

export default App;