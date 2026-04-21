import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

import CountdownTimer from '../components/CountdownTimer';
import GuestBookModal from '../components/GuestBookModal';
import RSVPModal from '../components/RSVPModal';
import GuestMessages from '../components/GuestMessages';
import CustomCursor from '../components/CustomCursor';
import MagneticCard from '../components/MagneticCard';
import ParticleButton from '../components/ParticleButton';

const EMIR_SUDE_CAR_PHOTO = "/2.jpeg"; 
const FOOTER_PHOTO = "/1.jpeg";

const GALLERY_IMAGES = [
  "/7.jpeg",
  "/4.jpeg",
  "/8.jpeg",
  "/3.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/9.jpeg",
  "/10.jpeg"
];

// Galeri fotoğraf kartı — masonry grid için
interface GalleryCardProps {
  src: string;
  index: number;
  onClick: (index: number) => void;
}

const GalleryCard = ({ src, index, onClick }: GalleryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(index)}
      className="break-inside-avoid mb-3 cursor-pointer rounded-2xl overflow-hidden group relative"
    >
      <img
        src={src}
        alt={`Anı ${index + 1}`}
        loading="lazy"
        decoding="async"
        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-all duration-400 flex items-center justify-center">
        <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-xl">
          ◯
        </span>
      </div>
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white/70 font-mono text-[10px] tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestBookOpen, setIsGuestBookOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 800], [1.1, 1]); 
  const heroY = useTransform(scrollY, [0, 800], [0, 150]);     

  const fadeInUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
  const scaleIn = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
  const nameContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const letterAnim = { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
  const dateContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 1.5 } } };
  const slotAnim = { hidden: { y: "100%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-rose-400/30 overflow-x-hidden">
      <CustomCursor />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
        <motion.div 
          className="absolute inset-0 z-0 overflow-hidden" 
          style={{ scale: heroScale, y: heroY }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-1000"
            style={{ backgroundImage: `url(${EMIR_SUDE_CAR_PHOTO})` }}
          />
        </motion.div>
        
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/60 to-neutral-950" />
        
        <div 
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.25] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        <div className="absolute -top-32 -left-20 z-10 -rotate-12 opacity-[0.04] pointer-events-none select-none">
          <span className="text-[120px] md:text-[200px] font-black text-white whitespace-nowrap tracking-tighter leading-none">
            SAVE THE DATE
          </span>
        </div>

        <div className="relative z-20 flex flex-col items-center mt-[-5%]">
          <motion.div variants={nameContainer} initial="hidden" animate="visible" className="flex items-center gap-4 md:gap-8 text-6xl md:text-9xl font-serif text-white font-light tracking-wide overflow-hidden">
            <div className="flex">
              {['E', 'm', 'i', 'r'].map((char, index) => <motion.span key={`emir-${index}`} variants={letterAnim} className="inline-block">{char}</motion.span>)}
            </div>
            <motion.span initial={{ opacity: 0, rotate: 0, scale: 0.5 }} animate={{ opacity: 1, rotate: 360, scale: 1 }} transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] as const }} className="text-rose-300 italic px-2 text-5xl md:text-8xl origin-center">&</motion.span>
            <div className="flex">
              {['S', 'u', 'd', 'e'].map((char, index) => <motion.span key={`sude-${index}`} variants={letterAnim} className="inline-block">{char}</motion.span>)}
            </div>
          </motion.div>

          <motion.div variants={dateContainer} initial="hidden" animate="visible" className="mt-8 flex items-center gap-3 text-white text-3xl md:text-5xl font-serif font-light tracking-widest border-t border-b border-rose-300/30 py-6">
            <div className="overflow-hidden relative h-[1.2em] flex items-center"><motion.span variants={slotAnim} className="inline-block relative">28</motion.span></div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="text-rose-300">•</motion.span>
            <div className="overflow-hidden relative h-[1.2em] flex items-center"><motion.span variants={slotAnim} className="inline-block relative">06</motion.span></div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-rose-300">•</motion.span>
            <div className="overflow-hidden relative h-[1.2em] flex items-center"><motion.span variants={slotAnim} className="inline-block relative">2026</motion.span></div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5, duration: 1 }} className="absolute bottom-10 right-6 md:right-12 z-20 text-neutral-500 font-mono text-[10px] md:text-xs tracking-[0.2em] text-right">
          40°56'N 27°28'E <br/> TEKİRDAĞ
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <span className="text-rose-300/80 text-[9px] md:text-[10px] tracking-[0.4em] font-light font-mono">SCROLL</span>
          <div className="w-[1px] h-12 bg-neutral-800 relative overflow-hidden">
            <motion.div initial={{ y: "-100%" }} animate={{ y: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-rose-400" />
          </div>
        </motion.div>
      </section>

      {/* 2. Countdown Section */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scaleIn} className="relative z-20 -mt-20 px-4 mb-24">
        <CountdownTimer />
      </motion.section>

      {/* 3. EVENT DETAILS */}
      <section className="py-24 relative overflow-hidden flex flex-col items-center">
        <div className="w-full overflow-hidden bg-rose-400 text-neutral-950 py-5 mb-32 shadow-lg shadow-rose-400/20">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8 pr-8 shrink-0">
                {[...Array(10)].map((_, j) => (
                  <span key={j} className="font-mono text-lg md:text-2xl tracking-[0.15em] uppercase font-bold whitespace-nowrap">
                    28 HAZİRAN 2026
                    <span className="mx-4 opacity-50">•</span>
                    TEKİRDAĞ
                    <span className="mx-4 opacity-50">•</span>
                    TEKİROBA
                    <span className="mx-4 opacity-50">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'DÜĞÜN', time: '19:00', icon: '◈' },
              { label: 'TARİH', time: '28.06.2026', icon: '◉' },
              { label: 'KONUM', time: 'TEKİRDAĞ', icon: '◎' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial="hidden" 
                whileInView="visible"
                variants={fadeInUp}
                className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl text-center hover:border-rose-400/30 transition-colors"
              >
                <span className="text-rose-400/60 text-lg mb-2 block">{item.icon}</span>
                <p className="text-neutral-500 font-mono text-[9px] tracking-[0.3em] uppercase mb-1">{item.label}</p>
                <p className="text-white font-serif text-xl font-light">{item.time}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <MagneticCard className="h-full overflow-hidden !p-0">
              <div className="relative h-72 w-full">
                <iframe
                  src="https://maps.google.com/maps?q=Tekiroba%20Düğün%20Salonu,%20Tekirdağ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-t-2xl"
                />
              </div>
              <div className="p-6">
                <p className="text-rose-300 font-mono text-xs tracking-[0.2em] uppercase mb-1">Tekiroba Düğün & Davet Salonu</p>
                <p className="text-neutral-400 font-light text-sm mb-4">Altınova, Bülbüllü Sk No:10, 59100 Süleymanpaşa/Tekirdağ</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Tekiroba+Düğün+Salonu+Tekirdağ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-rose-400 font-mono text-xs tracking-widest uppercase hover:text-rose-300 transition-colors group"
                >
                  <span>YOL TARİFİ AL</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </MagneticCard>

            <MagneticCard className="h-full flex flex-col justify-center items-center text-center p-12">
              <div className="space-y-6">
                <p className="text-neutral-300 font-serif text-xl md:text-2xl leading-relaxed italic">
                  "Hayatımızın en özel gününde, en sevdiklerimizle birlikte bu mutluluğu paylaşmak istiyoruz."
                </p>
                <div className="w-12 h-[1px] bg-rose-400/50 mx-auto mt-6" />
              </div>
            </MagneticCard>
          </div>
        </div>
      </section>

      {/* 4. MASONRY GALERİ + LIGHTBOX */}
      <section className="py-24 px-4 md:px-8 bg-neutral-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-rose-400/60 font-mono text-xs tracking-[0.4em] uppercase mb-3">Anılarımız</p>
          <h2 className="text-3xl md:text-4xl font-serif text-white font-light">Birlikte</h2>
          <div className="w-10 h-[1px] bg-rose-400/40 mx-auto mt-4" />
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 max-w-7xl mx-auto">
          {GALLERY_IMAGES.map((src, i) => (
            <GalleryCard
              key={src}
              src={src}
              index={i}
              onClick={setLightboxIndex}
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            {/* Fotoğraf */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={GALLERY_IMAGES[lightboxIndex]}
              alt={`Anı ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Kapat */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors text-3xl font-light leading-none"
            >
              ×
            </button>

            {/* Geri */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev === null ? 0 : prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1
                );
              }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors text-5xl font-light leading-none"
            >
              ‹
            </button>

            {/* İleri */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev === null ? 0 : prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors text-5xl font-light leading-none"
            >
              ›
            </button>

            {/* Sayaç */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <p className="text-white/40 font-mono text-xs tracking-[0.3em]">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(GALLERY_IMAGES.length).padStart(2, '0')}
              </p>
              <div className="flex gap-1.5">
                {GALLERY_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                    className={`h-[2px] rounded-full transition-all duration-300 ${
                      i === lightboxIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Mesajlar Bölümü */}
      <GuestMessages />

      {/* 6. INTERACTION PANELS */}
      <section className="py-24 px-6 max-w-4xl mx-auto relative">
        <style>{`
          @keyframes liquidBorder { 0% { border-radius: 8px; } 33% { border-radius: 20px 8px 15px 25px / 15px 25px 8px 20px; } 66% { border-radius: 8px 25px 8px 15px / 25px 15px 20px 8px; } 100% { border-radius: 8px; } }
          .liquid-btn { border-radius: 8px; }
          .liquid-btn:hover { animation: liquidBorder 2s ease-in-out infinite; }
          @keyframes gradientPan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .hover-bg-gradient { background: radial-gradient(circle at center, rgba(251,113,133,0.1) 0%, rgba(23,23,23,0) 70%); background-size: 200% 200%; }
          .group:hover .hover-bg-gradient { animation: gradientPan 5s ease infinite; opacity: 1; }
          .dash-rect { stroke-dashoffset: 1000; transition: stroke-dashoffset 3s linear; }
          .group:hover .dash-rect { stroke-dashoffset: 0; }
        `}</style>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scaleIn} className="relative bg-neutral-900 border border-neutral-800/50 p-10 rounded-2xl text-center group overflow-hidden">
            <div className="absolute inset-0 opacity-0 hover-bg-gradient transition-opacity duration-700 pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="none" stroke="rgba(251, 113, 133, 0.4)" strokeWidth="2" strokeDasharray="10 10" className="dash-rect rounded-2xl" rx="16" ry="16" />
            </svg>
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <span className="absolute top-6 left-8 text-2xl font-mono text-neutral-500 opacity-20 pointer-events-none">01</span>
            <div className="relative z-10 pt-4">
              <h3 className="text-2xl font-mono tracking-widest text-white mb-4">LCV FORMU</h3>
              <p className="text-neutral-400 font-light mb-8 h-12">Lütfen katılım durumunuzu 15 Haziran'a kadar bize bildirin.</p>
              <button onClick={() => setIsRSVPOpen(true)} className="w-full py-4 bg-white text-neutral-950 font-medium tracking-wide hover:bg-rose-50 transition-colors liquid-btn outline-none">
                KATILIM BİLDİR
              </button>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={scaleIn} transition={{ delay: 0.2 }} className="relative bg-neutral-900 border border-neutral-800/50 p-10 rounded-2xl text-center group overflow-hidden">
            <div className="absolute inset-0 opacity-0 hover-bg-gradient transition-opacity duration-700 pointer-events-none" />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="none" stroke="rgba(251, 113, 133, 0.4)" strokeWidth="2" strokeDasharray="10 10" className="dash-rect rounded-2xl" rx="16" ry="16" />
            </svg>
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-neutral-600 transition-colors duration-500 group-hover:border-rose-400" />
            <span className="absolute top-6 left-8 text-2xl font-mono text-neutral-500 opacity-20 pointer-events-none">02</span>
            <div className="relative z-10 pt-4">
              <h3 className="text-2xl font-mono tracking-widest text-white mb-4">ANI DEFTERİ</h3>
              <p className="text-neutral-400 font-light mb-8 h-12">Bizim için güzel dileklerinizi ve düşüncelerinizi paylaşın.</p>
              <ParticleButton onClick={() => setIsGuestBookOpen(true)} text="ANI BIRAK" />
            </div>
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