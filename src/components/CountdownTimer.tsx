import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- FlipDigit Bileşeni (Her Bir Rakam İçin 3D Split-Flap) ---
const FlipDigit = ({ digit, isSecondsOnes = false }: { digit: string, isSecondsOnes?: boolean }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);
      
      const timeout = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 300); // 300ms dramatik flap efekti

      return () => clearTimeout(timeout);
    }
  }, [digit, currentDigit]);

  return (
    <div 
      className={`relative perspective-[1000px] w-[2.2rem] md:w-[3.5rem] h-[3.2rem] md:h-[5.2rem] bg-neutral-800 rounded-md shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] border border-neutral-700/50 flex flex-col font-serif text-[2.8rem] md:text-[4.8rem] font-light tracking-tighter text-neutral-100 select-none
      ${isSecondsOnes && isFlipping ? 'animate-pulse-glow' : ''}`}
    >
      {/* Statik Üst Kısım (Yeni Rakamı Gösterir) */}
      <div className="relative w-full h-1/2 overflow-hidden rounded-t-md bg-neutral-800/90">
        <div className="absolute top-0 w-full h-[200%] flex items-center justify-center text-neutral-300">{nextDigit}</div>
      </div>

      {/* Statik Alt Kısım (Mevcut Rakamı Gösterir) */}
      <div className="relative w-full h-1/2 overflow-hidden rounded-b-md bg-neutral-800">
        <div className="absolute top-0 w-full h-[200%] flex items-center justify-center -translate-y-1/2">{currentDigit}</div>
      </div>

      {/* Dönen (Flipping) Kart Katmanı */}
      {isFlipping && (
        <div className="absolute inset-0 w-full h-full preserve-3d pointer-events-none">
          {/* Üst Yarı - 0'dan -90 dereceye aşağı katlanır */}
          <div 
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-neutral-800 rounded-t-md origin-bottom backface-hidden z-20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border-b border-black/30"
            style={{ animation: 'flipTop 150ms ease-in forwards' }}
          >
            <div className="absolute top-0 w-full h-[200%] flex items-center justify-center">{currentDigit}</div>
          </div>
          
          {/* Alt Yarı - 90 dereceden 0'a yukarıdan aşağı iner */}
          <div 
            className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-neutral-800/90 rounded-b-md origin-top backface-hidden z-20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            style={{ transform: 'rotateX(90deg)', animation: 'flipBottom 150ms ease-out 150ms forwards' }}
          >
            <div className="absolute top-0 w-full h-[200%] flex items-center justify-center -translate-y-1/2 text-neutral-300">{nextDigit}</div>
          </div>
        </div>
      )}

      {/* Ortadaki Metalik Menteşe Çizgisi */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-950 shadow-[0_1px_1px_rgba(255,255,255,0.15)] -translate-y-1/2 z-30"></div>
    </div>
  );
};

// Hesaplama fonksiyonu bileşen dışına alındı (Tarih güncellendi)
const calculateTimeLeft = () => {
  const targetDate = new Date('2025-08-31T19:30:00').getTime();
  const distance = targetDate - new Date().getTime();
  
  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
};

// --- Ana Zamanlayıcı Bileşeni ---
export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  
  const [isWeddingDay, setIsWeddingDay] = useState(() => {
    // İlk yüklemede hedef tarihin geçip geçmediğini kontrol ediyoruz (Tarih güncellendi)
    return new Date('2025-08-31T19:30:00').getTime() - new Date().getTime() < 0;
  });

  useEffect(() => {
    const targetDate = new Date('2025-08-31T19:30:00').getTime(); // Tarih güncellendi

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsWeddingDay(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const timeBlocks = [
    { label: 'GÜN', value: timeLeft.days, isSeconds: false },
    { label: 'SAAT', value: timeLeft.hours, isSeconds: false },
    { label: 'DAKİKA', value: timeLeft.minutes, isSeconds: false },
    { label: 'SANİYE', value: timeLeft.seconds, isSeconds: true },
  ];

  if (isWeddingDay) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-neutral-950 border border-rose-400/30 p-6 md:p-10 relative rounded-sm text-center"
      >
        <div className="absolute top-0 left-0 w-6 h-6 border-t-[2px] border-l-[2px] border-rose-400/80" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-[2px] border-r-[2px] border-rose-400/80" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[2px] border-l-[2px] border-rose-400/80" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[2px] border-r-[2px] border-rose-400/80" />
        <p className="text-rose-300/60 font-mono text-xs tracking-[0.4em] uppercase mb-6">
          31 Ağustos 2025 {/* Metin güncellendi */}
        </p>
        <h2 className="text-4xl md:text-6xl font-serif text-white font-light mb-4">
          Bugün Evleniyoruz
        </h2>
        <div className="w-12 h-[1px] bg-rose-400/50 mx-auto" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="max-w-4xl mx-auto bg-neutral-950 border border-rose-400/30 p-6 md:p-10 relative shadow-[0_0_50px_rgba(0,0,0,0.6)] rounded-sm"
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-[2px] border-l-[2px] border-rose-400/80"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-[2px] border-r-[2px] border-rose-400/80"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[2px] border-l-[2px] border-rose-400/80"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[2px] border-r-[2px] border-rose-400/80"></div>

      <div className="flex flex-nowrap justify-center gap-3 md:gap-8 overflow-x-auto scrollbar-none px-2">
        {timeBlocks.map((block) => {
          // Rakamları string'e çevirip basamaklara ayırıyoruz (Örn: 9 -> ['0', '9'])
          const digits = String(block.value).padStart(2, '0').split('');
          
          return (
            <div key={block.label} className="flex flex-col items-center">
              <div className="flex gap-1 md:gap-2 mb-6">
                {digits.map((d, i) => (
                  <FlipDigit 
                    key={`${block.label}-${i}`} 
                    digit={d} 
                    isSecondsOnes={block.isSeconds && i === digits.length - 1} 
                  />
                ))}
              </div>
              <span className="text-[8px] md:text-[10px] text-neutral-500 tracking-[0.3em] font-mono font-bold">
                {block.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}