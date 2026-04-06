import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
        setFormData({
          guest_name: '',
          message: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl border border-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-serif text-rose-300 mb-6 text-center">
            Anı Bırak
          </h2>

          {submitSuccess ? (
            <div className="text-center py-8">
              <p className="text-rose-300 text-lg mb-2">Teşekkürler!</p>
              <p className="text-neutral-400">Mesajınız kaydedildi.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-neutral-300 text-sm mb-2">
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guest_name}
                  onChange={(e) =>
                    setFormData({ ...formData, guest_name: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-300 text-sm mb-2">
                  Mesajınız *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  placeholder="Düşüncelerinizi, dileklerinizi veya güzel anılarınızı bizimle paylaşın..."
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-400 transition-colors resize-none placeholder:text-neutral-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-neutral-900 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
