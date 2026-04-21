import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2 } from 'lucide-react';

// TypeScript arayüzleri
interface PreviewData {
  url: string;
  type: 'image' | 'video';
  name: string;
  size: string;
}

export default function UploadPage() {
  const [uploaderName, setUploaderName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maksimum dosya boyutu (50 MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  // Dosya seçimi — önizleme oluştur ve boyut kontrolü yap
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selected = Array.from(e.target.files);
    const validFiles: File[] = [];
    const previewUrls: PreviewData[] = [];

    let hasOversizedFiles = false;

    selected.forEach((f) => {
      if (f.size > MAX_FILE_SIZE) {
        hasOversizedFiles = true;
      } else {
        validFiles.push(f);
        previewUrls.push({
          url: URL.createObjectURL(f),
          type: f.type.startsWith('video') ? 'video' : 'image',
          name: f.name,
          size: (f.size / 1024 / 1024).toFixed(1) + ' MB'
        });
      }
    });

    if (hasOversizedFiles) {
      alert('Bazı dosyalar 50MB sınırını aştığı için listeye eklenmedi. Lütfen daha kısa videolar seçin.');
    }

    setFiles(validFiles);
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (!uploaderName.trim() || files.length === 0) return;
    setIsUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop();
        const filePath = `${Date.now()}-${i}.${ext}`;

        // Storage'a yükle (wedding-media bucket)
        const { error: storageError } = await supabase
          .storage
          .from('wedding-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (storageError) throw storageError;

        // Veritabanına kaydet (Masa bilgisi kaldırıldı)
        await supabase.from('media_uploads').insert([{
          uploader_name: uploaderName.trim(),
          file_name: file.name,
          file_path: filePath,
          file_type: file.type.startsWith('video') ? 'video' : 'image',
          file_size: file.size
        }]);

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Yükleme sırasında hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Film grain (Ana sayfadaki doku) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {uploadSuccess ? (
            // BAŞARI EKRANI
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 2 }}
                className="absolute w-24 h-24 bg-rose-400 rounded-full mix-blend-screen pointer-events-none"
              />
              <CheckCircle2 className="text-rose-400 w-20 h-20 mx-auto mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-3 font-light">
                Teşekkürler!
              </h2>
              <p className="text-neutral-400 font-light text-lg">
                Anılarınız güvenle kaydedildi.
              </p>
            </motion.div>
          ) : (
            // FORM EKRANI
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg space-y-6"
            >
              <div className="text-center mb-10">
                <p className="text-rose-300/60 font-mono text-xs tracking-[0.4em] uppercase mb-3">
                  EMİR & SUDE
                </p>
                <h1 className="text-4xl md:text-5xl font-serif text-white font-light mb-4">
                  Anılarını Paylaş
                </h1>
                <p className="text-neutral-500 font-light text-sm">
                  Çektiğin fotoğraf ve kısa videoları bizimle paylaş.
                </p>
              </div>

              {/* İsim input */}
              <input 
                type="text"
                value={uploaderName}
                onChange={e => setUploaderName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className="w-full bg-transparent border-b border-neutral-700 focus:border-rose-400 text-xl font-light py-3 outline-none placeholder:text-neutral-700 caret-rose-400 text-center transition-colors"
              />

              {/* Dosya yükleme alanı */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-800 rounded-3xl p-10 text-center cursor-pointer hover:border-rose-400/40 hover:bg-rose-400/5 transition-all duration-300"
              >
                <Upload className="mx-auto text-neutral-600 mb-4" size={36} strokeWidth={1.5} />
                <p className="text-neutral-400 font-light mb-2">
                  Fotoğraf veya video seç
                </p>
                <p className="text-neutral-600 font-mono text-[10px] tracking-widest uppercase">
                  JPG, PNG, MP4, MOV • Max 50MB
                </p>
              </div>

              <input 
                ref={fileInputRef} 
                type="file"
                multiple 
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden" 
              />

              {/* Önizlemeler */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((p, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden relative bg-neutral-900 border border-neutral-800"
                    >
                      {p.type === 'image' ? (
                        <img src={p.url} className="w-full h-full object-cover" alt="Önizleme" />
                      ) : (
                        <video src={p.url} className="w-full h-full object-cover" />
                      )}
                      <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 backdrop-blur-md text-white/90 px-1.5 py-0.5 rounded font-mono tracking-wider">
                        {p.size}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {isUploading && (
                <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-rose-400 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              )}

              {/* Submit butonu */}
              <button 
                onClick={handleUpload}
                disabled={isUploading || !uploaderName.trim() || files.length === 0}
                className="w-full py-5 bg-white text-neutral-950 font-mono text-sm tracking-[0.2em] uppercase rounded-xl font-bold hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {isUploading ? `YÜKLENİYOR... ${progress}%` : `${files.length > 0 ? files.length + ' ' : ''}DOSYA GÖNDER`}
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}