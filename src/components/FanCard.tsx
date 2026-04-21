import { useTransform, MotionValue } from 'framer-motion';
import TiltImage from './TiltImage';

interface FanCardProps {
  src: string;
  alt: string;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
  disableTilt?: boolean; 
}

const FanCard = ({ src, alt, index, total, scrollProgress, disableTilt = false }: FanCardProps) => {
  const offset = index - (total - 1) / 2;
  
  // Güncelleme — kartlar arasında yeterli boşluk
  const targetX = `${offset * 55}%`; 
  const targetY = `${Math.abs(offset) * 5}%`; 
  const targetRotate = offset * 6; 
  
  const x = useTransform(scrollProgress, [0, 1], ["0%", targetX]);
  const y = useTransform(scrollProgress, [0, 1], ["0%", targetY]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, targetRotate]);
  
  // Güncelleme — merkez kart (offset === 0) için öne çıkma efekti
  const centerBoost = Math.abs(offset) < 0.5 ? 1.08 : 1;
  const scale = useTransform(scrollProgress, [0, 0.5, 1], [1, centerBoost, 1]); 
  
  // Güncelleme — merkeze yakın kartlar daha önde olsun
  const zIndex = Math.round(50 - Math.abs(offset) * 8);

  return (
    <TiltImage 
      src={src} 
      alt={alt} 
      style={{ x, y, rotate, scale, zIndex }} 
      disableTilt={disableTilt} 
      className="absolute inset-0 w-full h-full shadow-[0_0_30px_rgba(0,0,0,0.8)]" 
    />
  );
};

export default FanCard;