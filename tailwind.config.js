import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [typography],
  theme: {
    extend: {
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
