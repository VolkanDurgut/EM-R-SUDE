import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const weddingDate = new Date('2026-06-28T00:00:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-16 px-6">
      <div className="max-w-2xl mx-auto bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800">
        <h2 className="text-center text-neutral-300 text-lg mb-8 tracking-wide font-light">
          Düğünümüze Kalan Süre
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-light text-rose-300 mb-2">
              {timeLeft.days}
            </div>
            <div className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest">
              Gün
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-light text-rose-300 mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest">
              Saat
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-light text-rose-300 mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest">
              Dakika
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-light text-rose-300 mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest">
              Saniye
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
