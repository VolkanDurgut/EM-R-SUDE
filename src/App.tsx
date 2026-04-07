import { useState } from 'react';
import { Heart, CalendarDays, MapPin, Camera, Clock, ChevronDown, Quote } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountdownTimer from './components/CountdownTimer';
import GuestBookModal from './components/GuestBookModal';
import RSVPModal from './components/RSVPModal';
import GuestMessages from './components/GuestMessages';

// GÖRSEL YAPILANDIRMASI (src/assets/ klasöründe olmalı)
const EMIR_SUDE_CAR_PHOTO = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"; 
const GALLERY_PHOTO_1 = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop";   
const GALLERY_PHOTO_2 = "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop";   
const GALLERY_PHOTO_3 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop";   
const FOOTER_PHOTO = "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2000&auto=format&fit=crop";        

function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestBookOpen, setIsGuestBookOpen] = useState(false);

  // Kaydırma Kontrollü Paralaks Efektleri (Framer Motion)
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 800], [1.1, 1]); 
  const heroY = useTransform(scrollY, [0, 800], [0, 150]);     

  // Tarih Paralaksı
  const dateY = useTransform(scrollY, [0, 800], [0, -100]);   

  // Animasyon Varyasyonları 
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  // Stacked Gallery Animasyonları 
  const galleryItemVariants = {
    hiddenLeft: { opacity: 0, x: -100, rotate: -5 },
    hiddenRight: { opacity: 0, x: 100, rotate: 5 },
    visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-rose-400/30 overflow-x-hidden">
      {/* 1. Header / Hero Section (Araba ve Tarih) */}
      <section className="relative h-screen flex flex-col items-center overflow-hidden">
        {/* Paralaks Zoom Arka Plan Görseli */}
        <motion.div 
          style={{ 
            scale: heroScale, 
            y: heroY,
            backgroundImage: `url(${EMIR_SUDE_CAR_PHOTO})` 
          }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/70 to-neutral-950" />
        </motion.div>

        {/* Üst Kısım: İsimler */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 w-full px-6 pt-16 md:pt-24 text-center"
        >
          <p className="text-neutral-300 tracking-[0.3em] uppercase text-xs mb-3 font-light">
            Save The Date
          </p>
          <h1 className="text-4xl md:text-7xl font-serif text-white font-light tracking-wide">
            Emir <span className="text-rose-300 italic">&</span> Sude
          </h1>
        </motion.div>

        {/* Orta Kısım: Bütünleşik Tarih */}
        <motion.div 
          style={{ y: dateY }}
          className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4"
        >
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center gap-4 text-white text-5xl md:text-9xl font-serif font-light tracking-widest border-t border-b border-rose-300/30 py-6 md:py-10"
          >
            <span>28</span>
            <span className="text-rose-300">•</span>
            <span>06</span>
            <span className="text-rose-300">•</span>
            <span>2026</span>
          </motion.div>
        </motion.div>

        {/* Kaydır İşareti */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-rose-300/50 z-10"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* 2. Countdown Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scaleIn}
        className="relative z-20 -mt-20 px-4 mb-24"
      >
        <CountdownTimer />
      </motion.section>

      {/* 3. Event Details */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-16">
          <Heart className="mx-auto text-rose-400 mb-6" strokeWidth={1} size={32} />
          <h2 className="text-3xl font-serif text-white mb-4">Etkinlik Bilgileri</h2>
          <div className="w-12 h-[1px] bg-rose-400/50 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-rose-300 mb-6">
              <CalendarDays strokeWidth={1.5} />
              <h3 className="text-xl font-light tracking-wide">Düğün Merasimi</h3>
            </div>
            <div className="space-y-4 text-neutral-400 font-light">
              <p className="flex items-center gap-3"><Clock size={18} className="text-neutral-500" />28 Haziran 2026, Pazar • 19:00</p>
              <p className="flex items-start gap-3"><MapPin size={18} className="text-neutral-500 shrink-0 mt-1" /><span><strong className="text-neutral-200 font-normal">Wyndham Grand Istanbul</strong><br />Kalamış Marina, Kadıköy/İstanbul</span></p>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm flex flex-col justify-center text-center italic text-neutral-300 font-light leading-relaxed">
            "Hayatımızın en özel gününde, en sevdiklerimizle birlikte bu mutluluğu paylaşmak istiyoruz. Sizleri de aramızda görmekten onur duyacağız."
          </motion.div>
        </div>
      </section>

      {/* 4. Story / Stacked Gallery */}
      <section className="py-32 px-6 bg-neutral-900/30 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="text-center mb-24">
            <Camera className="mx-auto text-rose-400 mb-6" strokeWidth={1} size={32} />
            <h2 className="text-3xl font-serif text-white mb-4">Anılarımız</h2>
            <div className="w-12 h-[1px] bg-rose-400/50 mx-auto" />
          </motion.div>

          <div className="relative h-[110vh] md:h-[90vh]">
            <motion.div 
              className="absolute left-[5%] md:left-[10%] top-[10%] w-[85%] md:w-[45%] aspect-[4/5] z-10 rounded-2xl overflow-hidden shadow-2xl shadow-black/80"
              initial="hiddenLeft" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={galleryItemVariants}
            >
              <img src={GALLERY_PHOTO_1} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"/>
            </motion.div>

            <motion.div 
              className="absolute right-[5%] md:right-[5%] top-[5%] md:top-0 w-[90%] md:w-[60%] aspect-[3/4] z-20 rounded-2xl overflow-hidden shadow-2xl shadow-black/80"
              initial="hiddenRight" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={galleryItemVariants}
              transition={{ delay: 0.2 }}
            >
              <img src={GALLERY_PHOTO_2} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"/>
            </motion.div>

            <motion.div 
              className="absolute left-[15%] md:left-[25%] bottom-[10%] w-[75%] md:w-[50%] aspect-[4/5] z-30 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-rose-400/10"
              initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}} viewport={{ once: true, margin: "-100px" }}
            >
              <img src={GALLERY_PHOTO_3} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"/>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Mesajlar Bölümü */}
      <GuestMessages />

      {/* 6. Interaction Panels */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scaleIn} className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl text-center hover:border-rose-400/30 transition-colors">
            <h3 className="text-2xl font-serif text-white mb-4">LCV Formu</h3>
            <p className="text-neutral-400 font-light mb-8 h-12">Lütfen katılım durumunuzu 15 Haziran'a kadar bize bildirin.</p>
            <button onClick={() => setIsRSVPOpen(true)} className="w-full py-4 bg-white text-neutral-950 rounded-lg font-medium hover:bg-rose-50 hover:text-rose-900 transition-all">KATILIM BİLDİR</button>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scaleIn} transition={{ delay: 0.2 }} className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl text-center hover:border-rose-400/30 transition-colors">
            <h3 className="text-2xl font-serif text-white mb-4">Anı Defteri</h3>
            <p className="text-neutral-400 font-light mb-8 h-12">Bizim için güzel dileklerinizi ve düşüncelerinizi paylaşın.</p>
            <button onClick={() => setIsGuestBookOpen(true)} className="w-full py-4 bg-transparent border border-neutral-600 text-white rounded-lg font-medium hover:border-rose-400 hover:text-rose-300 transition-all">ANI BIRAK</button>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${FOOTER_PHOTO})` }}
        >
          <div className="absolute inset-0 bg-neutral-950/80" />
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="relative z-10 text-center flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-2xl font-serif font-light text-rose-300/80"><span>E</span><div className="w-1 h-1 rounded-full bg-rose-400/50" /><span>S</span></div>
          <p className="text-neutral-500 text-sm tracking-widest uppercase">Bu site ALLEVENTY ile hazırlanmıştır</p>
        </motion.div>
      </footer>

      {/* Modals */}
      <RSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
      <GuestBookModal isOpen={isGuestBookOpen} onClose={() => setIsGuestBookOpen(false)} />
    </div>
  );
}

export default App;