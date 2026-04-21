import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const MagneticCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    setMousePosition({ x: mouseX, y: mouseY });
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ 
        rotateX: isTouchDevice ? 0 : rotateX, 
        rotateY: isTouchDevice ? 0 : rotateY, 
        transformStyle: isTouchDevice ? "flat" : "preserve-3d" 
      }}
      className={`group relative rounded-2xl bg-neutral-900 border border-neutral-800/80 p-8 shadow-2xl transition-shadow hover:shadow-rose-400/10 ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 mix-blend-screen"
        style={{ background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251,113,133,0.3), transparent 40%)` }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default MagneticCard;