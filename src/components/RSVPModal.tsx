import { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1: İleri, -1: Geri
  const [showParticles, setShowParticles] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0); // Progress bar state'i

  // Partikül koordinatlarını sadece bileşen yüklendiğinde bir kez hesapla
  const [particleCoords] = useState(() =>
    [...Array(12)].map(() => ({
      tx: `${(Math.random() - 0.5) * 120}px`,
      ty: `${(Math.random() - 0.5) * 120}px`,
    }))
  );

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    attending: null as boolean | null,
    plus_one: false,
    plus_one_name: '',
    dietary_requirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Kapatma işlemlerini sarmalayan temizlik fonksiyonu
  const handleClose = () => {
    setSubmitSuccess(false); // Başarı state'ini temizle
    setShowParticles(false);
    onClose();               // Parent'a bildir
  };

  // Modal kapandığında veya açıldığında state'leri sıfırla ve progress'i ayarla
  useEffect(() => {
    if (isOpen) {
      setProgressWidth(0); // Önce sıfırla (anlık)
      setStep(1);
      setDirection(1);
      setSubmitSuccess(false);
      setFormData({
        guest_name: '',
        guest_email: '',
        attending: null,
        plus_one: false,
        plus_one_name: '',
        dietary_requirements: '',
      });
      // Kısa gecikme sonra %33'e git (flash sorununu çözer)
      setTimeout(() => setProgressWidth(33.33), 50);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    // Güvenlik kontrolü (attending: false değilse ve e-posta yoksa çık)
    if ((formData.attending !== false && !formData.guest_email.trim()) || isSubmitting) return; 
    
    setIsSubmitting(true);
    try {
      // GÜNCELLEME: Boş string yerine veritabanına null gönderiyoruz
      const finalData = { 
        ...formData, 
        attending: formData.attending ?? false,
        guest_email: formData.guest_email.trim() || null, 
      };
      
      const { error } = await supabase
        .from('rsvp_responses')
        .upsert(
          [finalData], 
          { onConflict: 'guest_email' }
        );

      if (error) throw error;

      setSubmitSuccess(true);
      setProgressWidth(100); // Başarılı olunca barı tam doldur
      
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setStep(prev => {
      const next = prev + 1;
      setProgressWidth((next / 3) * 100);
      return next;
    });
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => {
      const next = prev - 1;
      setProgressWidth((next / 3) * 100);
      return next;
    });
  };

  const handleYesClick = () => {
    setFormData({ ...formData, attending: true });
    setShowParticles(false);
    setTimeout(() => setShowParticles(true), 10); // Partikül animasyonunu tetikle
  };

  // Sinematik Sağ/Sol Kayma Animasyonu
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  // Adım başlıkları katılım durumuna göre dinamik
  const stepTitles: Record<number, string> = {
    1: "Kimsiniz?",
    2: "Katılıyor musunuz?",
    3: formData.attending === false ? "Üzüldük..." : "Son Detaylar",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <style>{`
            @keyframes particleOut {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
            .particle {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 6px;
              height: 6px;
              background-color: #fb7185;
              border-radius: 50%;
              pointer-events: none;
              animation: particleOut 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800/60 shadow-2xl shadow-black overflow-hidden flex flex-col"
          >
            {/* Modal Üstü İnce Progress Bar */}
            <div 
              className="absolute top-0 left-0 h-1 bg-rose-400 transition-all duration-500 ease-out z-10" 
              style={{ width: `${progressWidth}%` }} 
            />

            <button
              onClick={handleClose} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-all duration-300 z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-12 flex flex-col h-full min-h-[420px]">
              
              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center flex-grow py-12 text-center"
                  >
                    <CheckCircle2 className="text-rose-400 w-16 h-16 mb-4" strokeWidth={1} />
                    <p className="text-xl text-white font-serif mb-2">Teşekkürler!</p>
                    <p className="text-neutral-400 font-light">Yanıtınız başarıyla kaydedildi.</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col flex-grow">
                    
                    {/* Dinamik Başlık */}
                    <div className="relative h-12 mb-8">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.h2
                          key={step}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="text-3xl font-serif text-rose-300 text-center font-light absolute w-full"
                        >
                          {stepTitles[step]}
                        </motion.h2>
                      </AnimatePresence>
                    </div>

                    {/* Form İçeriği */}
                    <div className="relative flex-grow overflow-hidden px-1">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={step}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full h-full flex flex-col justify-center"
                        >
                          
                          {/* ADIM 1: KİMSİNİZ? */}
                          {step === 1 && (
                            <div className="flex flex-col items-center justify-center py-6">
                              <input
                                type="text"
                                required
                                value={formData.guest_name}
                                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-600 focus:border-rose-400 text-center text-[2rem] font-light py-4 outline-none placeholder:text-neutral-700 transition-colors text-white"
                                placeholder="Adınız Soyadınız"
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter' && formData.guest_name.trim()) nextStep(); }}
                              />
                            </div>
                          )}

                          {/* ADIM 2: KATILIYOR MUSUNUZ? */}
                          {step === 2 && (
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <button
                                type="button"
                                onClick={handleYesClick}
                                className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-4 h-40 ${
                                  formData.attending === true 
                                  ? 'border-rose-400 bg-rose-400/10 scale-[1.02] shadow-[0_0_20px_rgba(251,113,133,0.2)]' 
                                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-500 hover:border-neutral-600'
                                }`}
                              >
                                <span className={`text-sm md:text-base font-medium text-center ${formData.attending === true ? 'text-rose-300' : 'text-neutral-400'}`}>
                                  EVET, GELİYORUM
                                </span>
                                {showParticles && formData.attending === true && (
                                  <>
                                    {particleCoords.map((p, i) => (
                                      <div 
                                        key={i} 
                                        className="particle" 
                                        style={{ 
                                          '--tx': p.tx, 
                                          '--ty': p.ty 
                                        } as React.CSSProperties} 
                                      />
                                    ))}
                                  </>
                                )}
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, attending: false })}
                                className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-4 h-40 ${
                                  formData.attending === false 
                                  ? 'border-rose-400 bg-rose-400/10 scale-[1.02] shadow-[0_0_20px_rgba(251,113,133,0.2)]' 
                                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-500 hover:border-neutral-600'
                                }`}
                              >
                                <span className={`text-sm md:text-base font-medium text-center ${formData.attending === false ? 'text-rose-300' : 'text-neutral-400'}`}>
                                  ÜZGÜNÜM, GELEMEM
                                </span>
                              </button>
                            </div>
                          )}

                          {/* ADIM 3: DETAYLAR */}
                          {step === 3 && (
                            <div className="space-y-5 py-2">
                              {/* Gelemeyenler için ekstra mesaj */}
                              {formData.attending === false && (
                                <p className="text-center text-neutral-400 font-light text-sm mb-4">
                                  Olmasan da kalbimizdesin.
                                </p>
                              )}

                              <div>
                                <label className="block text-neutral-400 text-xs mb-1.5 font-light tracking-wide">
                                  {formData.attending === false
                                    ? "E-posta Adresiniz (Opsiyonel)"
                                    : "E-posta Adresiniz *"}
                                </label>
                                <input
                                  type="email"
                                  required={formData.attending !== false}
                                  autoFocus 
                                  value={formData.guest_email}
                                  onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                                  onKeyDown={(e) => { 
                                    if (e.key === 'Enter' && (formData.attending === false || formData.guest_email.trim()) && !isSubmitting) {
                                      handleSubmit();
                                    }
                                  }} 
                                  className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-rose-400/50 transition-all"
                                  placeholder="İletişimde kalabilmemiz için"
                                />
                              </div>

                              {formData.attending === true && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                  <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.plus_one}
                                        onChange={(e) => setFormData({ ...formData, plus_one: e.target.checked })}
                                        className="peer appearance-none w-5 h-5 border border-neutral-700 rounded-md bg-neutral-950/50 checked:bg-rose-400/20 checked:border-rose-400/50 transition-all cursor-pointer"
                                      />
                                      <CheckCircle2 size={14} className="absolute text-rose-300 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                                    </div>
                                    <span className="text-neutral-300 text-sm font-light group-hover:text-white transition-colors">Yanımda biriyle katılacağım (+1)</span>
                                  </label>

                                  {formData.plus_one && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                      <label className="block text-neutral-400 text-xs mb-1.5 font-light">Eşlik Edecek Kişinin Adı Soyadı</label>
                                      <input
                                        type="text"
                                        required={formData.plus_one}
                                        value={formData.plus_one_name}
                                        onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-rose-400/50 transition-all"
                                      />
                                    </motion.div>
                                  )}

                                  <div>
                                    <label className="block text-neutral-400 text-xs mb-1.5 font-light">Özel Bir Beslenme İhtiyacınız Var mı? (Opsiyonel)</label>
                                    <input
                                      type="text"
                                      value={formData.dietary_requirements}
                                      onChange={(e) => setFormData({ ...formData, dietary_requirements: e.target.value })}
                                      placeholder="Örn: Vejetaryen, Gluten alerjisi vb."
                                      className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-rose-400/50 transition-all"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}

                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Alt Yönlendirme ve Noktalar */}
                    <div className="mt-8 flex items-center justify-between">
                      
                      {step > 1 ? (
                        <button type="button" onClick={prevStep} className="text-neutral-400 hover:text-white transition-colors text-xs font-medium tracking-widest px-2 py-2 uppercase">
                          Geri
                        </button>
                      ) : <div className="w-12" />}

                      {/* Noktalar */}
                      <div className="flex gap-3">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${step === i ? 'bg-rose-400 scale-150' : 'bg-neutral-700'}`} 
                          />
                        ))}
                      </div>

                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={(step === 1 && !formData.guest_name.trim()) || (step === 2 && formData.attending === null)}
                          className="text-white hover:text-rose-300 transition-colors text-xs font-medium tracking-widest px-2 py-2 uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          İleri
                        </button>
                      ) : (
                        <div className="relative flex flex-col items-end">
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || (formData.attending !== false && !formData.guest_email.trim())}
                            className="text-rose-300 hover:text-rose-400 transition-colors text-xs font-medium tracking-widest px-2 py-2 uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? '...' : 'Tamamla'}
                          </button>
                          {formData.attending !== false && !formData.guest_email.trim() && (
                            <span className="absolute -top-4 right-2 text-[9px] text-rose-400/60 lowercase tracking-widest whitespace-nowrap">
                              e-posta gerekli
                            </span>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}