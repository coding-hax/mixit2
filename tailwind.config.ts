// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mixit-dark': '#0D4040',
        'mixit-green': '#3F8C85',
        'mixit-light-yellow': '#F2EDD0',
        'mixit-orange': '#F2B84B',
        'mixit-dark-orange': '#D9933D',
      },
    },
  },
  plugins: [],
}

export default config