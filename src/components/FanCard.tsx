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
  
  const targetX = `${offset * 28}%`; 
  const targetY = `${Math.abs(offset) * 6}%`; 
  const targetRotate = offset * 4; 
  
  const x = useTransform(scrollProgress, [0, 1], ["0%", targetX]);
  const y = useTransform(scrollProgress, [0, 1], ["0%", targetY]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, targetRotate]);
  const scale = useTransform(scrollProgress, [0, 0.5, 1], [1, 1.05, 1]); 
  
  const zIndex = Math.floor(30 - Math.abs(offset) * 10);

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