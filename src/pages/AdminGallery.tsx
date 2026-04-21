import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import CustomCursor from '../components/CustomCursor';

interface MediaItem {
  id: string;
  uploader_name: string;
  file_name: string;
  file_path: string;
  file_type: 'image' | 'video';
  url?: string;
}

export default function AdminGallery() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  const [downloading, setDownloading] = useState<string | null>(null);

  const handleMediaError = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

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

  const downloadFile = async (
    url: string,
    fileName: string,
    id: string
  ) => {
    setDownloading(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('İndirme hatası:', err);
      alert('İndirme başarısız oldu.');
    } finally {
      setDownloading(null);
    }
  };

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

    // GÜNCELLEME: Linki oluşturulamayan (hata veren) dosyaları direkt null olarak döndürüyoruz
    const withUrls = await Promise.all(
      (data || []).map(async (item) => {
        const { data: urlData, error: urlError } = await supabase
          .storage
          .from('wedding-media')
          .createSignedUrl(item.file_path, 3600); 
        
        if (urlError || !urlData?.signedUrl) {
          return null; 
        }
        
        return { ...item, url: urlData.signedUrl };
      })
    );
    
    // GÜNCELLEME: Sadece geçerli url'si olanları (null olmayanları) filtreleyip state'e aktarıyoruz
    const validMedia = withUrls.filter(item => item !== null) as MediaItem[];
    setMedia(validMedia);
    setIsLoading(false);
  }

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

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-10 relative">
      <CustomCursor />
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-5xl font-serif text-white">Misafir Anıları</h1>
          <button 
            onClick={handleLogout}
            className="text-neutral-500 hover:text-rose-400 text-sm font-mono tracking-widest uppercase transition-colors"
          >
            ÇIKIŞ YAP
          </button>
        </div>

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

        {isLoading && (
          <div className="text-center py-20 text-rose-300/60 font-mono tracking-widest animate-pulse">
            MEDYALAR YÜKLENİYOR...
          </div>
        )}

        {!isLoading && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {media
              .filter(m => filter === 'all' || m.file_type === filter)
              .map(m => (
                <div 
                  key={m.id}
                  className="break-inside-avoid relative group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-rose-400/20 transition-colors"
                >
                  {m.file_type === 'image' ? (
                    <img
                      src={m.url}
                      alt={m.file_name}
                      loading="lazy"
                      className="w-full h-auto block cursor-pointer group-hover:scale-[1.02] transition-transform duration-500"
                      onClick={() => setLightbox(m)}
                      onError={() => handleMediaError(m.id)}
                    />
                  ) : (
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setLightbox(m)}
                    >
                      <video
                        src={m.url}
                        className="w-full h-auto block bg-neutral-950"
                        preload="metadata"
                        onError={() => handleMediaError(m.id)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <span className="text-white text-2xl ml-1">▶</span>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white/80 font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded">
                        VİDEO
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-xs font-mono truncate max-w-[70%]">
                        {m.uploader_name}
                      </p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          downloadFile(m.url!, m.file_name, m.id);
                        }}
                        disabled={downloading === m.id}
                        className="text-rose-300 hover:text-rose-200 font-mono text-[10px] tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded border border-rose-400/30 hover:border-rose-400/60 transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        {downloading === m.id ? '...' : '↓ İNDİR'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!isLoading && media.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl">
            <p className="text-neutral-500 font-light">Henüz hiç anı yüklenmemiş.</p>
          </div>
        )}

      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {lightbox.file_type === 'image' ? (
              <img
                src={lightbox.url}
                alt={lightbox.file_name}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />
            ) : (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-xl bg-black"
              />
            )}

            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent rounded-t-xl">
              <p className="text-white/70 font-mono text-xs tracking-widest truncate">
                {lightbox.uploader_name}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    downloadFile(
                      lightbox.url!,
                      lightbox.file_name,
                      lightbox.id
                    )
                  }
                  disabled={downloading === lightbox.id}
                  className="text-rose-300 hover:text-rose-200 font-mono text-[10px] tracking-widest uppercase bg-black/50 px-3 py-1.5 rounded border border-rose-400/30 transition-colors disabled:opacity-50"
                >
                  {downloading === lightbox.id ? 'İNDİRİLİYOR...' : '↓ İNDİR'}
                </button>
                <button
                  onClick={() => setLightbox(null)}
                  className="text-white/60 hover:text-white text-2xl leading-none transition-colors bg-black/40 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}