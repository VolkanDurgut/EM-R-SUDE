/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      // YENİ EKLENEN MARQUEE ANİMASYONLARI
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      // YENİ: Perspective utility'leri
      perspective: {
        'none': 'none',
        '500': '500px',
        '1000': '1000px',
        '1200': '1200px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'perspective': (value) => ({
            perspective: value,
          }),
        },
        { values: theme('perspective') }
      );
    },
  ],
};