import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Message {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
}

export default function GuestMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMsgIds, setNewMsgIds] = useState<Set<string>>(new Set());
  
  // GÜNCELLEME: İlk yüklenen mesajların ID'lerini takip etmek için state
  const [initialMsgIds, setInitialMsgIds] = useState<Set<string>>(new Set());
  
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Kartlara rastgele ama sabit bir rotasyon (-1 ile 1 derece arası)
  const rotations = [-0.8, 1, -0.5, 0.5, -1, 0.8, 0, -0.2, 1.2, -1.2];

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Mesajlar çekilirken hata:', error);
      } else {
        const fetchedMessages = data || [];
        setMessages(fetchedMessages);
        // GÜNCELLEME: İlk yüklenenlerin ID'lerini Set olarak kaydet
        setInitialMsgIds(new Set(fetchedMessages.map(m => m.id)));
      }
      setLoading(false);
    }

    fetchMessages();

    const channel = supabase
      .channel('guest_messages_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guest_messages' }, 
      (payload) => {
        const newMsg = payload.new as Message;
        setMessages((prev) => [newMsg, ...prev]);
        
        setNewMsgIds(prev => new Set(prev).add(newMsg.id));
        
        const t = setTimeout(() => {
          setNewMsgIds(prev => {
            const updated = new Set(prev);
            updated.delete(newMsg.id);
            return updated;
          });
        }, 5000);

        timeoutRefs.current.push(t);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  if (loading || messages.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-neutral-950/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Quote className="mx-auto text-rose-400 mb-6 rotate-180" strokeWidth={1} size={32} />
          <h2 className="text-3xl font-serif text-white mb-4">Sizden Gelenler</h2>
          <div className="w-12 h-[1px] bg-rose-400/50 mx-auto" />
        </motion.div>

        <div style={{ columnGap: '1.5rem' }} className="columns-1 md:columns-2 lg:columns-3">
          {messages.map((msg, index) => {
            const rotateDeg = rotations[index % rotations.length];
            const isNew = newMsgIds.has(msg.id);
            
            // GÜNCELLEME: Animasyon delay hesaplama mantığı
            const isInitial = initialMsgIds.has(msg.id);
            const initialIndex = isInitial 
              ? Array.from(initialMsgIds).indexOf(msg.id) 
              : -1;

            return (
              <motion.div
                key={msg.id}
                // GÜNCELLEME: Realtime mesaj soldan, ilk yüklenenler aşağıdan gelir
                initial={isNew ? { opacity: 0, x: -20 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                // GÜNCELLEME: Sadece ilk yüklenen ilk 9 mesaja kademeli delay ver
                transition={{ 
                  delay: isInitial && initialIndex < 9 ? initialIndex * 0.1 : 0, 
                  duration: 0.6 
                }}
                style={{ rotate: `${rotateDeg}deg` }}
                className={`mb-6 break-inside-avoid relative overflow-hidden bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-8 rounded-3xl flex flex-col group hover:border-rose-400/20 transition-all ${
                  isNew ? 'ring-1 ring-rose-400/50 shadow-[0_0_20px_rgba(251,113,133,0.3)]' : ''
                }`}
              >
                {/* Realtime Rose Pulse Edge */}
                {isNew && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-400 animate-pulse" />
                )}

                {/* Dev Ghost Tırnak İşareti Arka Planı */}
                <Quote className="absolute -top-4 -left-4 w-32 h-32 text-white opacity-[0.03] -z-10 rotate-180 pointer-events-none" />

                {/* Üst Kısım: Monospace İsim */}
                <div className="mb-6 relative z-10">
                  <p className="text-rose-300 font-mono text-xs tracking-[0.2em] uppercase font-bold">
                    {msg.guest_name}
                  </p>
                  <div className="w-6 h-[1px] bg-rose-400/30 mt-3 transition-all duration-500 group-hover:w-12" />
                </div>

                {/* Doğal Yükseklikte Mesaj İçeriği */}
                <p className="text-neutral-300 font-serif text-lg leading-relaxed italic relative z-10">
                  {msg.message}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}