import { useState, useRef } from 'react';
import { Heart, MapPin, Clock, Quote } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';

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

export default function Home() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isGuestBookOpen, setIsGuestBookOpen] = useState(false);
  
  const [activeCard, setActiveCard] = useState(1);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 800], [1.1, 1]); 
  const heroY = useTransform(scrollY, [0, 800], [0, 150]);     

  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryScroll } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  useMotionValueEvent(galleryScroll, "change", (latest) => {
    const active = Math.min(GALLERY_IMAGES.length, Math.max(1, Math.ceil(latest * GALLERY_IMAGES.length)));
    setActiveCard(active);
  });

  const stripX = useTransform(
    galleryScroll,
    [0, 1],
    ["0%", `-${(GALLERY_IMAGES.length - 1) * 22}vw`]
  );

  const heights = ['70vh', '55vh', '75vh', '60vh', '65vh', '50vh', '72vh', '58vh'];

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
            <div className="overflow-hidden relative h-[1.2em] flex items-center"><motion.span variants={slotAnim} className="inline-block relative">31</motion.span></div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="text-rose-300">•</motion.span>
            <div className="overflow-hidden relative h-[1.2em] flex items-center"><motion.span variants={slotAnim} className="inline-block relative">08</motion.span></div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-rose-300">•</motion.span>
            <div className="overflow-hidden relative h-[1.2em] flex items-center"><motion.span variants={slotAnim} className="inline-block relative">2025</motion.span></div>
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
                    31 AĞUSTOS 2025
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'DÜĞÜN', time: '19:30', icon: '◈' },
              { label: 'NİKAH', time: '20:30', icon: '◇' },
              { label: 'TARİH', time: '31.08.2025', icon: '◉' },
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
                  src="https://maps.google.com/maps?q=Alt%C4%B1nova%20Mah.%20B%C3%BClb%C3%BCll%C3%BC%20Sk.%20No:10,%20S%C3%BCleymanpa%C5%9Fa%20/%20Tekirda%C4%9F&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
                <p className="text-rose-300 font-mono text-xs tracking-[0.2em] uppercase mb-1">Tekiroba Düğün Salonu</p>
                <p className="text-neutral-400 font-light text-sm mb-4">Altınova Mah. Bülbüllü Sk. No:10, Süleymanpaşa / Tekirdağ</p>
                <a
                  href="https://www.google.com/maps/dir//Alt%C4%B1nova+Mah.+B%C3%BClb%C3%BCll%C3%BC+Sk.+No:10,+S%C3%BCleymanpa%C5%9Fa+%2F+Tekirda%C4%9F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-rose-400 font-mono text-xs tracking-widest uppercase hover:text-rose-300 transition-colors group"
                >
                  <span>YOL TARİFİ AL</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </MagneticCard>

            <MagneticCard className="h-full">
              <div className="space-y-6">
                <div>
                  <p className="text-neutral-600 font-mono text-[9px] tracking-[0.3em] uppercase mb-4">Aileler</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-neutral-400 font-light text-sm leading-relaxed">Sevda - Cengiz</p>
                      <p className="text-rose-300 font-serif text-lg">İpek</p>
                    </div>
                    <div className="text-right">
                      <p className="text-neutral-400 font-light text-sm leading-relaxed">Hülya - İsmet</p>
                      <p className="text-rose-300 font-serif text-lg">Çevik</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-neutral-800" />
                <div>
                  <p className="text-neutral-600 font-mono text-[9px] tracking-[0.3em] uppercase mb-3">Alay</p>
                  <p className="text-neutral-400 font-light text-sm leading-relaxed">Saat 11:00'de Yavuz Mah. Ihlamur Sk. No:2'den kalkacaktır.</p>
                </div>
                <div className="w-full h-[1px] bg-neutral-800" />
                <p className="text-neutral-300 font-serif text-lg leading-relaxed italic">
                  "Ömür boyu mutluluğa imzalarımızı atarken, sizlerin de yanımızda olmasından büyük mutluluk duyacağız."
                </p>
              </div>
            </MagneticCard>
          </div>
        </div>
      </section>

      {/* 4. SCROLL-DRIVEN HORIZONTAL STRIP GALLERY */}
      <section ref={galleryRef} className="relative h-[300vh] bg-neutral-950 w-full overflow-hidden">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden relative">
          <p style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }} className="text-neutral-600 font-mono text-xs tracking-[0.5em] uppercase absolute left-6 top-1/2 -translate-y-1/2 z-20">
            ANILAR
          </p>

          <div className="absolute right-6 md:right-12 bottom-12 z-20 flex items-center">
            <span className="text-neutral-500 font-mono text-xs md:text-sm tracking-widest flex items-center bg-neutral-950/50 backdrop-blur-md px-4 py-2 rounded-full">
              <AnimatePresence mode="popLayout">
                <motion.span key={activeCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="inline-block text-rose-300 font-bold">
                  {String(activeCard).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
              <span className="whitespace-pre"> / {String(GALLERY_IMAGES.length).padStart(2, '0')}</span>
            </span>
          </div>

          <motion.div style={{ x: stripX }} className="flex items-center gap-6 md:gap-10 px-[15vw] absolute top-1/2 -translate-y-1/2 will-change-transform">
            {GALLERY_IMAGES.map((src, i) => (
              <motion.div key={src} style={{ height: heights[i % heights.length] }} className="relative shrink-0 w-[50vw] md:w-[18vw] min-w-[220px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5">
                <img src={src} alt={`Anı ${i+1}`} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="absolute bottom-4 right-4 text-white/30 font-mono text-xs tracking-widest mix-blend-overlay">
                  {String(i+1).padStart(2,'0')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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