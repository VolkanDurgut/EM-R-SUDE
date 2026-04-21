import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import CustomCursor from '../components/CustomCursor';

// TypeScript tanımlamaları (table_number kaldırıldı)
interface MediaItem {
  id: string;
  uploader_name: string;
  file_name: string;
  file_path: string;
  file_type: 'image' | 'video';
  url?: string;
}

export default function AdminGallery() {
  // Yetkilendirme (Auth) State'leri
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Galeri State'leri
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Oturum Kontrolü
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchMedia();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchMedia();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Medyaları Getir
  async function fetchMedia() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('media_uploads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    // Her dosya için geçici (signed) URL üret
    const withUrls = await Promise.all(
      (data || []).map(async (item) => {
        const { data: urlData } = await supabase
          .storage
          .from('wedding-media')
          .createSignedUrl(item.file_path, 3600); // 1 saat geçerli link
        
        return { ...item, url: urlData?.signedUrl };
      })
    );
    
    setMedia(withUrls as MediaItem[]);
    setIsLoading(false);
  }

  // Giriş Yapma Fonksiyonu
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setAuthError('Giriş başarısız. Bilgilerinizi kontrol edin.');
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMedia([]);
  };

  // --------------------------------------------------------
  // GİRİŞ YAPILMAMIŞSA GÖSTERİLECEK EKRAN (LOGIN)
  // --------------------------------------------------------
  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <CustomCursor />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Admin Girişi</h1>
            <p className="text-neutral-500 font-light text-sm">Sadece yetkili kişiler görüntüleyebilir.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && <p className="text-rose-400 text-sm text-center bg-rose-400/10 py-2 rounded">{authError}</p>}
            
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="E-posta" 
              required
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-rose-400 text-white px-4 py-3 rounded-lg outline-none transition-colors"
            />
            
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Şifre" 
              required
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-rose-400 text-white px-4 py-3 rounded-lg outline-none transition-colors"
            />
            
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-white text-neutral-950 font-bold py-3 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50 mt-4"
            >
              {authLoading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------
  // GİRİŞ YAPILMIŞSA GÖSTERİLECEK EKRAN (GALERİ)
  // --------------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-10 relative">
      <CustomCursor />
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Üst Kısım & Çıkış Butonu */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-white">Misafir Anıları</h1>
          <button 
            onClick={handleLogout}
            className="text-neutral-500 hover:text-rose-400 text-sm font-mono tracking-widest uppercase transition-colors"
          >
            ÇIKIŞ YAP
          </button>
        </div>

        {/* Filtre */}
        <div className="flex gap-6 justify-center md:justify-start mb-10 overflow-x-auto pb-2">
          {['all', 'image', 'video'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f as any)}
              className={`font-mono text-xs tracking-[0.2em] uppercase pb-2 transition-colors whitespace-nowrap ${
                filter === f ? 'text-rose-400 border-b-2 border-rose-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {f === 'all' ? 'TÜMÜ' : f === 'image' ? 'FOTOĞRAFLAR' : 'VİDEOLAR'}
            </button>
          ))}
        </div>

        {/* İstatistik */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl mx-auto md:mx-0">
          <div className="text-center border-r border-neutral-800">
            <p className="text-3xl md:text-4xl font-serif text-white">{media.length}</p>
            <p className="text-neutral-500 text-[10px] font-mono tracking-widest mt-1">TOPLAM</p>
          </div>
          <div className="text-center border-r border-neutral-800">
            <p className="text-3xl md:text-4xl font-serif text-white">{media.filter(m => m.file_type === 'image').length}</p>
            <p className="text-neutral-500 text-[10px] font-mono tracking-widest mt-1">FOTOĞRAF</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-serif text-white">{media.filter(m => m.file_type === 'video').length}</p>
            <p className="text-neutral-500 text-[10px] font-mono tracking-widest mt-1">VİDEO</p>
          </div>
        </div>

        {/* Yükleniyor Durumu */}
        {isLoading && (
          <div className="text-center py-20 text-rose-300/60 font-mono tracking-widest animate-pulse">
            MEDYALAR YÜKLENİYOR...
          </div>
        )}

        {/* Masonry Grid (Asimetrik Pinterest Tarzı) */}
        {!isLoading && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {media
              .filter(m => filter === 'all' || m.file_type === filter)
              .map(m => (
                <div key={m.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                  
                  {m.file_type === 'image' ? (
                    <img src={m.url} alt={m.file_name} className="w-full h-auto object-cover block" loading="lazy" />
                  ) : (
                    <video src={m.url} controls className="w-full h-auto block bg-black" />
                  )}
                  
                  {/* Hover Bilgi Kartı - Masa numarası tamamen kaldırıldı */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
                    <p className="text-white font-medium text-sm drop-shadow-md tracking-wide">
                      {m.uploader_name}
                    </p>
                  </div>

                </div>
              ))}
          </div>
        )}

        {/* Boş Durum */}
        {!isLoading && media.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
            <p className="text-neutral-500 font-light">Henüz hiç anı yüklenmemiş.</p>
          </div>
        )}

      </div>
    </div>
  );
}