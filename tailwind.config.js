import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        coral: {
          DEFAULT: 'hsl(var(--coral))',
          soft: 'hsl(var(--coral-soft))',
        },
        sky: {
          DEFAULT: 'hsl(var(--sky))',
          soft: 'hsl(var(--sky-soft))',
        },
        mint: {
          DEFAULT: 'hsl(var(--mint))',
          soft: 'hsl(var(--mint-soft))',
        },
        butter: {
          DEFAULT: 'hsl(var(--butter))',
          soft: 'hsl(var(--butter-soft))',
        },
        lavender: {
          DEFAULT: 'hsl(var(--lavender))',
          soft: 'hsl(var(--lavender-soft))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(38, 34, 30, 0.08)',
        ticket: '0 18px 48px rgba(38, 34, 30, 0.12)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Pretendard',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [animate],
}
