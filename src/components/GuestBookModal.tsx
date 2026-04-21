import { useState, useRef } from 'react';
import { X, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuestBookModal({ isOpen, onClose }: GuestBookModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    guest_name: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Textarea odaklanma durumunu takip edecek state
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  const handleClose = () => {
    setSubmitSuccess(false);
    setFormData({ guest_name: '', message: '' });
    setIsTextareaFocused(false); // Kapanırken cursor'ı da sıfırla
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('guest_messages').insert([formData]);

      if (error) throw error;

      setSubmitSuccess(true);
      
      setTimeout(() => {
        handleClose();
      }, 3000); 
    } catch (error: any) {
      console.error('Error submitting message:', error);
      
      // GÜNCELLEME: RLS violation (Rate limit) kontrolü
      if (error.code === '42501') { 
        alert('Çok hızlı mesaj gönderiyorsunuz. Lütfen bekleyin.');
        return;
      }
      
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnText = "ANIYI BIRAK".split("");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Arka Plan Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800/60 p-8 md:p-10 shadow-2xl shadow-black"
          >
            <button
              onClick={handleClose} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-all duration-300 z-20"
            >
              <X size={20} />
            </button>

            <div className="pt-2 h-full flex flex-col">
              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  /* MİNİMAL BAŞARI EKRANI (Büyüyen Daire) */
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center relative overflow-hidden"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="absolute w-32 h-32 bg-rose-400 rounded-full mix-blend-screen pointer-events-none"
                    />
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="relative z-10"
                    >
                      <CheckCircle2 className="text-rose-400 w-16 h-16 mb-4 mx-auto" strokeWidth={1} />
                      <p className="text-xl text-white font-serif tracking-wide mb-2">Teşekkürler!</p>
                      <p className="text-neutral-400 font-light text-sm">Güzel dilekleriniz kaydedildi.</p>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* MİNİMAL FORM (Sayfa/Kağıt Efekti) */
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-8 flex flex-col flex-grow"
                  >
                    <div className="text-center mb-6">
                      <MessageSquareHeart className="mx-auto text-rose-400/80 mb-4" strokeWidth={1.5} size={32} />
                      <h2 className="text-3xl font-serif text-white font-light">Anı Defteri</h2>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={formData.guest_name}
                        onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                        onKeyDown={(e) => { 
                          if (e.key === 'Enter' && formData.guest_name.trim()) {
                            e.preventDefault();
                            textareaRef.current?.focus();
                          }
                        }}
                        className="w-full bg-transparent border-b border-neutral-700 pb-3 text-lg md:text-xl text-neutral-100 focus:outline-none focus:border-rose-400 transition-all font-light placeholder:text-neutral-600 caret-rose-400"
                        placeholder="Adınız Soyadınız"
                        autoFocus
                      />
                    </div>

                    <div className="relative flex-grow">
                      <textarea
                        ref={textareaRef} 
                        onFocus={() => setIsTextareaFocused(true)}
                        onBlur={() => setIsTextareaFocused(false)}
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-transparent border-0 px-0 py-2 text-xl md:text-2xl text-neutral-100 focus:outline-none focus:ring-0 transition-all duration-300 resize-none font-serif leading-relaxed placeholder:text-neutral-800 caret-rose-400"
                        placeholder="Emir ve Sude'ye notunuz..."
                      />
                      
                      {/* Animasyonlu Cursor Noktası ve Sayaç */}
                      <div className="flex justify-between items-center mt-2 border-t border-neutral-800/50 pt-4">
                        <motion.div
                          animate={{ 
                            opacity: isTextareaFocused ? [1, 0, 1] : 0 
                          }}
                          transition={{ 
                            repeat: isTextareaFocused ? Infinity : 0, 
                            duration: 1 
                          }}
                          className="w-1.5 h-4 bg-rose-400/60 rounded-full"
                        />
                        <span className="text-neutral-600 font-mono text-xs tracking-widest">
                          {formData.message.length} / ∞
                        </span>
                      </div>
                    </div>

                    {/* Stagger Color Hover Butonu */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.message.trim()}
                      className="group relative w-full bg-neutral-950 border border-neutral-800 text-neutral-400 py-5 rounded-xl font-mono text-sm tracking-widest overflow-hidden transition-all duration-500 hover:border-rose-400/50 hover:shadow-[0_0_20px_rgba(251,113,133,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Arka plan hover dolgusu */}
                      <div className="absolute inset-0 bg-rose-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                      
                      <span className="relative z-10 flex justify-center items-center font-bold">
                        {isSubmitting ? (
                          'KAYDEDİLİYOR...'
                        ) : (
                          btnText.map((char, i) => (
                            <span
                              key={i}
                              className="transition-colors duration-300 group-hover:text-neutral-950"
                              style={{ transitionDelay: `${i * 20}ms` }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </span>
                          ))
                        )}
                      </span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}