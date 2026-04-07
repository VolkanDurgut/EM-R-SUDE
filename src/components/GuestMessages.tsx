import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Mesajları çekme fonksiyonu
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('guest_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Mesajlar çekilirken hata:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    }

    fetchMessages();

    // Yeni mesaj geldiğinde anlık güncelleme (Real-time)
    const channel = supabase
      .channel('guest_messages_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guest_messages' }, 
      (payload) => {
        setMessages((prev) => [payload.new as Message, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading || messages.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-neutral-950/20">
      <div className="max-w-6xl mx-auto">
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

        {/* Mesaj Kartları Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-8 rounded-3xl flex flex-col justify-between hover:border-rose-400/20 transition-colors"
            >
              <p className="text-neutral-300 font-light italic leading-relaxed mb-6">
                "{msg.message}"
              </p>
              <div>
                <div className="w-8 h-[1px] bg-rose-400/30 mb-3" />
                <p className="text-rose-300 font-serif tracking-wide">{msg.guest_name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}