import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Düğün tarihi: 28 Haziran 2026, 19:00
    const targetDate = new Date('2026-06-28T19:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Framer Motion Animasyonları
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const timeBlocks = [
    { label: 'GÜN', value: timeLeft.days },
    { label: 'SAAT', value: timeLeft.hours },
    { label: 'DAKİKA', value: timeLeft.minutes },
    { label: 'SANİYE', value: timeLeft.seconds },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="max-w-3xl mx-auto bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/60 p-8 md:p-12 rounded-3xl shadow-2xl shadow-black/80"
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="text-xs md:text-sm tracking-[0.3em] text-rose-300/80 uppercase font-light mb-4">
          Düğünümüze Kalan Süre
        </h2>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent mx-auto" />
      </motion.div>

      <div className="grid grid-cols-4 gap-2 md:gap-8">
        {timeBlocks.map((block, index) => (
          <motion.div 
            key={block.label}
            variants={itemVariants}
            className="flex flex-col items-center justify-center relative group"
          >
            <div className="text-3xl md:text-6xl font-serif font-light text-white mb-3 tracking-wider group-hover:text-rose-100 transition-colors duration-500">
              {String(block.value).padStart(2, '0')}
            </div>
            <div className="text-[9px] md:text-xs text-neutral-500 tracking-[0.2em] font-light">
              {block.label}
            </div>
            
            {/* Ayraç çizgileri (Mobilde gizli, masaüstünde görünür) */}
            {index !== 3 && (
              <div className="absolute -right-1 md:-right-4 top-1/2 -translate-y-1/2 text-neutral-800 font-serif text-3xl md:text-5xl font-light hidden md:block">
                :
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}