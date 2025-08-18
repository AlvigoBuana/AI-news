/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Pastikan ini 'class'
  theme: {
    extend: {
      // --- TAMBAHKAN KONFIGURASI DI BAWAH INI ---
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
      }
    },
  },
  plugins: [],
}