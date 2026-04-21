import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Görünürlük State'i
  
  // İç Daire (Anında takip eder)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dış Daire (Spring fiziği ile lerp/gecikmeli takip eder)
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const outlineX = useSpring(mouseX, springConfig);
  const outlineY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Fare hareket ettiğinde görünür olmasını garantiye al
      // Stale closure olmaması için doğrudan true set ediyoruz (React aynı değerde render'ı atlar)
      setIsVisible(true);

      // Her mouse hareketi sırasında hedefi (target) anlık kontrol et
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'textarea' ||
        target.tagName.toLowerCase() === 'select' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        !!target.closest('[role="button"]');

      setIsHovered(isInteractive);
    };

    // Fare pencere dışına çıkınca/girince çalışacak fonksiyonlar
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Sadece mousemove dinleyicisi ekleniyor, mouseover kaldırıldı
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      // Olay dinleyicilerini temizleme
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece mount/unmount durumunda çalışır

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          translateX: "-50%", 
          translateY: "-50%",
          opacity: isVisible ? 1 : 0 
        }}
      />
      <motion.div
        className={`custom-cursor-outline ${isHovered ? 'hover' : ''}`}
        style={{ 
          x: outlineX, 
          y: outlineY, 
          translateX: "-50%", 
          translateY: "-50%",
          opacity: isVisible ? 1 : 0 
        }}
      />
    </>
  );
}