import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        mistral: {
          red: '#E10500',
          orange: '#FA500F',
          'bright-orange': '#FF8205',
          yellow: '#FFAF00',
          'bright-yellow': '#FFD700',
          // Extended scale from the right column
          ramp: {
            100: '#FFD700',
            200: '#FFC300',
            300: '#FFAF00',
            400: '#FF9900',
            500: '#FF8205',
            600: '#FF6600',
            700: '#FA500F',
            800: '#F13C00',
            900: '#E92700',
          }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--text-base--line-height)',
            letterSpacing: 'var(--text-base--letter-spacing)',
          },
        },
        sm: {
          css: {
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm--line-height)',
            letterSpacing: 'var(--text-sm--letter-spacing)',
          },
        },
      },
    },
  },
};
