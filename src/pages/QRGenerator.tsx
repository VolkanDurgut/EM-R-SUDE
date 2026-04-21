import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRGenerator() {
  // Artık URL'de table parametresi yok, doğrudan upload sayfası
  const BASE_URL = 'https://emirsude.netlify.app/upload';
  
  const [qrImage, setQrImage] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tek bir yüksek çözünürlüklü QR üret
    async function generateQR() {
      try {
        const qrUrl = await QRCode.toDataURL(BASE_URL, {
          width: 800, // Baskıda bulanık olmaması için yüksek çözünürlük
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        setQrImage(qrUrl);
      } catch (err) {
        console.error('QR üretilirken hata oluştu:', err);
      }
    }
    generateQR();
  }, []);

  return (
    <div className="p-8 bg-neutral-50 min-h-screen text-black flex flex-col items-center justify-center">
      
      {/* Ekranda görünen ama yazdırırken (print:hidden) gizlenen üst kısım */}
      <div className="print:hidden text-center mb-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-neutral-800">
          Genel QR Kod
        </h1>
        <p className="text-neutral-500 mb-8 font-light leading-relaxed">
          Bu tekil QR kodu dilediğiniz boyutta bastırıp düğün mekanının girişine, masalara veya ortak alanlara yerleştirebilirsiniz.
        </p>
        <button 
          onClick={() => window.print()}
          className="px-8 py-4 bg-rose-400 text-white font-medium rounded-xl hover:bg-rose-500 transition-colors shadow-lg shadow-rose-400/30 tracking-wide"
        >
          PDF Olarak Kaydet / Yazdır
        </button>
      </div>

      {/* Yazdırılabilir Tekil Kart */}
      <div 
        ref={printRef}
        className="w-full max-w-md border border-neutral-200 rounded-3xl p-12 text-center print:border-none print:shadow-none flex flex-col items-center justify-center bg-white shadow-2xl"
      >
        <p className="font-serif text-4xl mb-8 text-neutral-800 tracking-wide">
          Emir & Sude
        </p>
        
        {qrImage && (
          <img 
            src={qrImage} 
            alt="Anılarını Paylaş QR Kod"
            className="w-full h-auto mb-8 mix-blend-multiply" 
          />
        )}
        
        <p className="mt-2 font-bold text-2xl text-neutral-900 tracking-[0.2em] uppercase">
          ANILARINI PAYLAŞ
        </p>
        
        <p className="text-sm text-neutral-400 mt-4 tracking-widest uppercase font-mono">
          Kameranı okut ve bize gönder
        </p>
      </div>
    </div>
  );
}