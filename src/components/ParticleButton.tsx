import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleButton = ({ onClick, text }: { onClick: () => void, text: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const [particles] = useState(() =>
    [...Array(12)].map(() => ({
      x: (Math.random() - 0.5) * 250,
      y: (Math.random() - 0.5) * 100,
      scale: Math.random() * 2 + 0.5,
    }))
  );

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative w-full py-4 bg-transparent border border-neutral-600 text-white rounded-lg font-medium tracking-wide hover:border-rose-400 hover:text-rose-300 transition-colors z-10 overflow-hidden"
    >
      <span className="relative z-10">{text}</span>
      <AnimatePresence>
        {isHovered && particles.map((p, i) => (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: p.scale,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-rose-400 rounded-full pointer-events-none"
            style={{ translateX: "-50%", translateY: "-50%" }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};

export default ParticleButton;