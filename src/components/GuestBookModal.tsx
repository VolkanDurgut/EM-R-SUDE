import { useState } from 'react';
import { X, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuestBookModal({ isOpen, onClose }: GuestBookModalProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('guest_messages').insert([formData]);

      if (error) throw error;

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({ guest_name: '', message: '' });
      }, 2500); // Başarı mesajını okumaları için bekleme süresi
    } catch (error) {
      console.error('Error submitting message:', error);
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
            className="relative w-full max-w-lg bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-800/60 p-8 shadow-2xl shadow-black"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white hover:bg-neutral-800 p-2 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>

            <div className="pt-2">
              <div className="flex justify-center mb-4">
                <MessageSquareHeart className="text-rose-400/80" strokeWidth={1.5} size={36} />
              </div>
              <h2 className="text-3xl font-serif text-white mb-2 text-center font-light">
                Anı Defteri
              </h2>
              <p className="text-center text-neutral-400 font-light text-sm mb-8">
                Bu özel günümüz için güzel dileklerinizi paylaşın
              </p>

              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <CheckCircle2 className="text-rose-400 w-16 h-16 mb-4" strokeWidth={1} />
                    <p className="text-xl text-white font-serif mb-2">Çok Teşekkür Ederiz!</p>
                    <p className="text-neutral-400 font-light">Güzel dilekleriniz anı defterimize eklendi.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
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
                        Mesajınız *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-neutral-200 focus:outline-none focus:border-rose-400/50 focus:ring-1 focus:ring-rose-400/50 transition-all duration-300 resize-none"
                        placeholder="Emir ve Sude'ye iletmek istediğiniz not..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-transparent border border-rose-400/50 text-rose-300 py-4 rounded-xl font-medium tracking-wide hover:bg-rose-400 hover:text-neutral-950 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      {isSubmitting ? 'KAYDEDİLİYOR...' : 'ANIYI BIRAK'}
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