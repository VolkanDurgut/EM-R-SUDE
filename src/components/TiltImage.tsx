import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltImageProps {
  src: string;
  alt: string;
  style?: any;
  className?: string;
  disableTilt?: boolean;
}

const TiltImage = ({ src, alt, style, className, disableTilt = false }: TiltImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableTilt) return; 
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`group relative overflow-hidden rounded-2xl shadow-2xl shadow-black/90 border border-white/5 cursor-pointer ${className}`}
    >
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      
      <div className="absolute inset-0 bg-neutral-950/50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
        <span className="text-white text-5xl font-light opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          ◯
        </span>
      </div>
    </motion.div>
  );
};

export default TiltImage;