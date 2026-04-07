import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    attending: true,
    plus_one: false,
    plus_one_name: '',
    dietary_requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('rsvp_responses').insert([formData]);

      if (error) throw error;

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          guest_name: '',
          guest_email: '',
          attending: true,
          plus_one: false,
          plus_one_name: '',
          dietary_requirements: '',
        });
      }, 2500); // Kapanma süresini mesajı okumaları için biraz uzattım
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Arka Plan Blur Efekti */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal İçeriği */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800/60 p-8 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>

            <div className="pt-2">
              <h2 className="text-3xl font-serif text-rose-300 mb-2 text-center font-light">
                LCV Formu
              </h2>
              <p className="text-center text-neutral-400 font-light text-sm mb-8">
                Lütfen katılım durumunuzu bizimle paylaşın
              </p>

              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <CheckCircle2 className="text-rose-400 w-16 h-16 mb-4" strokeWidth={1} />
                    <p className="text-xl text-white font-serif mb-2">Teşekkürler!</p>
                    <p className="text-neutral-400 font-light">Yanıtınız başarıyla kaydedildi.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-300 text-sm mb-2 font-light tracking-wide">
                          Adınız Soyadınız *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.guest_name}
                          onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                          className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/50 transition-all duration-300"
                          placeholder="Örn: Volkan Durgut"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 text-sm mb-2 font-light tracking-wide">
                          E-posta Adresiniz *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.guest_email}
                          onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                          className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/50 transition-all duration-300"
                          placeholder="İletişimde kalabilmemiz için"
                        />
                      </div>

                      <div className="pt-2">
                        <label className="block text-neutral-300 text-sm mb-3 font-light tracking-wide">
                          Katılım Durumunuz *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, attending: true })}
                            className={`py-3.5 rounded-xl border transition-all duration-300 ${
                              formData.attending
                                ? 'bg-rose-400/10 border-rose-400/50 text-rose-300'
                                : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            Katılıyorum
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, attending: false })}
                            className={`py-3.5 rounded-xl border transition-all duration-300 ${
                              !formData.attending
                                ? 'bg-rose-400/10 border-rose-400/50 text-rose-300'
                                : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            }`}
                          >
                            Katılamayacağım
                          </button>
                        </div>
                      </div>

                      {formData.attending && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pt-2 overflow-hidden"
                        >
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
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <label className="block text-neutral-400 text-xs mb-2 font-light">
                                Eşlik Edecek Kişinin Adı Soyadı
                              </label>
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
                            <label className="block text-neutral-400 text-xs mb-2 font-light">
                              Özel Bir Beslenme İhtiyacınız Var mı? (Opsiyonel)
                            </label>
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

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-neutral-950 py-4 rounded-xl font-medium tracking-wide hover:bg-rose-50 hover:text-rose-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    >
                      {isSubmitting ? 'GÖNDERİLİYOR...' : 'BİLDİRİMİ TAMAMLA'}
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