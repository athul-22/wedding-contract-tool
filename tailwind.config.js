/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Consolas', 'monospace'],
        signature: ['cursive'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#fef7f4',
          100: '#fdeee8',
          200: '#fad9ce',
          300: '#f6bfa5',
          400: '#f09971',
          500: '#f87659', // Main primary color
          600: '#e55a3d',
          700: '#c1452e',
          800: '#a0392a',
          900: '#843128',
        },
        coral: {
          50: '#fff8f6',
          100: '#ffefeb',
          200: '#ffddd2',
          300: '#ffc0aa',
          400: '#ff9675',
          500: '#f87659',
          600: '#ed5837',
          700: '#d8421d',
          800: '#b53718',
          900: '#96321b',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        warm: {
          50: '#fefdfb',
          100: '#fdf8f3',
          200: '#f9f0e7',
          300: '#f3e6d7',
          400: '#ebd5c1',
          500: '#e1c4a8',
          600: '#d4af8d',
          700: '#c19771',
          800: '#a07c5e',
          900: '#846650',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient': 'gradient 20s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        glow: {
          '0%': {
            'box-shadow': '0 0 20px rgba(248, 118, 89, 0.3)',
          },
          '100%': {
            'box-shadow': '0 0 30px rgba(248, 118, 89, 0.5)',
          },
        }
      },
      boxShadow: {
        'soft': '0 2px 25px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 25px rgba(0, 0, 0, 0.08)',
        'large': '0 15px 35px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(248, 118, 89, 0.3)',
        'glow-lg': '0 0 40px rgba(248, 118, 89, 0.2)',
      },
    },
  },
  plugins: [],
}