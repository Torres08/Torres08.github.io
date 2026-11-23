/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        canvas: 'var(--bg-canvas)',
        panel: 'var(--bg-panel)',
        hairline: 'var(--border-hairline)',
        primary: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        promptUser: 'var(--prompt-user)',
        promptPath: 'var(--prompt-path)',
        invertBg: 'var(--accent-invert-bg)',
        invertFg: 'var(--accent-invert-fg)',
      },
    },
  },
  plugins: [],
};
