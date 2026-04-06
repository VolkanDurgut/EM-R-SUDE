import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    message: '',
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
          message: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl border border-neutral-800 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-serif text-rose-300 mb-6 text-center">
            Katılım Formu
          </h2>

          {submitSuccess ? (
            <div className="text-center py-8">
              <p className="text-rose-300 text-lg mb-2">Teşekkürler!</p>
              <p className="text-neutral-400">Yanıtınız kaydedildi.</p>
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
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  required
                  value={formData.guest_email}
                  onChange={(e) =>
                    setFormData({ ...formData, guest_email: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-300 text-sm mb-3">
                  Katılım Durumu *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      checked={formData.attending}
                      onChange={() =>
                        setFormData({ ...formData, attending: true })
                      }
                      className="mr-2 accent-rose-400"
                    />
                    <span className="text-neutral-300">Katılacağım</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="attending"
                      checked={!formData.attending}
                      onChange={() =>
                        setFormData({ ...formData, attending: false })
                      }
                      className="mr-2 accent-rose-400"
                    />
                    <span className="text-neutral-300">Katılamayacağım</span>
                  </label>
                </div>
              </div>

              {formData.attending && (
                <>
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.plus_one}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            plus_one: e.target.checked,
                          })
                        }
                        className="mr-2 accent-rose-400"
                      />
                      <span className="text-neutral-300">
                        Yanımda birini getireceğim
                      </span>
                    </label>
                  </div>

                  {formData.plus_one && (
                    <div>
                      <label className="block text-neutral-300 text-sm mb-2">
                        Eşlik Eden Kişinin Adı
                      </label>
                      <input
                        type="text"
                        value={formData.plus_one_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            plus_one_name: e.target.value,
                          })
                        }
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-400 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-300 text-sm mb-2">
                      Diyet Kısıtlamaları
                    </label>
                    <input
                      type="text"
                      value={formData.dietary_requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dietary_requirements: e.target.value,
                        })
                      }
                      placeholder="Örn: Vejetaryen, alerjiler..."
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-400 transition-colors placeholder:text-neutral-600"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-neutral-300 text-sm mb-2">
                  Mesajınız
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-400 to-rose-500 text-white py-3 rounded-lg font-medium hover:from-rose-500 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
