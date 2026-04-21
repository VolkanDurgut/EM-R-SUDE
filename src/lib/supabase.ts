import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase env değişkenleri eksik.\n' +
    'VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ' +
    'tanımlı olmalı.\n' +
    'Netlify: Site settings > Environment variables'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Saniyede max event sayısı (aşırı yükü önler)
    },
  },
  global: {
    headers: {
      'x-application-name': 'emir-sude-wedding', // Supabase Dashboard / Debug için tanımlayıcı
    },
  },
  auth: {
    persistSession: false,     // Düğün sitesi auth gerektirmiyor, LocalStorage kullanılmaz
    autoRefreshToken: false,   // Token yenileme gereksiz
    detectSessionInUrl: false, // URL'den session okuma kapalı
  },
});