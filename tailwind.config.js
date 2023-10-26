/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        base: '#ffffff',
        background: '#ffffff',
        primary: '#f5f6fa',
        accent: 'var(--colors-accent)',
        medGrey: '#666666',
        grey: '#A9A9A9',
        'main-text': '#2b2b2b',
        'secondary-text': '#b1b0b4',
        'accent-text': '#3d5afe',
        green: '#2CB83A',
        danger: '#FF5A5A',
      },
      boxShadow: {
        '3xl': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      },
      position: ['responsive', 'sticky'],
      fontFamily: {
        ubuntu: ['var(--font-ubuntu)'],
        sans: ['var(--font-heebo)'],
      },
      dropShadow: {
        card: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        top: '0px -4px 4px rgba(0, 0, 0, 0.25)',
      },
      typography: ({ theme }) => ({
        gray: {
          css: {
            h1: {
              fontSize: theme('fontSize.2xl'),
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            h2: {
              fontSize: theme('fontSize.xl'),
              marginTop: theme('spacing.1'),
            },
            h3: {
              fontSize: theme('fontSize.lg'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
