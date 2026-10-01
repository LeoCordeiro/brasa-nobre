import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// Na Netlify o build recebe URL (endereço principal do site). A prévia de link
// no WhatsApp e no LinkedIn só monta com a imagem em endereço completo.
const enderecoSite = (process.env.URL || '').replace(/\/$/, '')
const enderecoAbsoluto = {
  name: 'endereco-absoluto',
  transformIndexHtml: (html) =>
    enderecoSite
      ? html
          .replace('content="/og.jpg"', `content="${enderecoSite}/og.jpg"`)
          .replace('<meta property="og:type"', `<meta property="og:url" content="${enderecoSite}/" />\n    <link rel="canonical" href="${enderecoSite}/" />\n    <meta property="og:type"`)
      : html,
}

// Com autoImport o Vite descobre os componentes do Vuetify aos poucos; sem o
// exclude, cada descoberta reotimiza e recarrega a página no primeiro render.
export default defineConfig({
  base: '/',
  plugins: [vue(), vuetify({ autoImport: true }), enderecoAbsoluto],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  optimizeDeps: { exclude: ['vuetify'] },
  server: { port: 5230 },
  preview: { port: 4230 },
})
