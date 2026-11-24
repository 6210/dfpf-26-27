import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://dfpf-26-27.pages.dev',
  trailingSlash: 'always',
  // Font files come from pinned npm packages and are served from this site; nothing is fetched from a CDN.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Lexend Deca',
      cssVariable: '--font-heading',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource/lexend-deca/files/lexend-deca-latin-700-normal.woff2'],
            weight: 700,
            style: 'normal',
          },
        ],
      },
    },
  ],
});
