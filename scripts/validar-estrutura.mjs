/**
 * Validação estática do build (dist/): index.html, arquivos pedidos e públicos,
 * imagens sem metadado e peso do site. Texto, links e rotas ficam nos testes de navegador.
 *
 *   node scripts/validar-estrutura.mjs   (depois de npm run build)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(RAIZ, 'dist')
let falhas = 0
const ok = (c, t, d = '') => {
  if (!c) falhas++
  console.log(`  ${c ? 'ok' : 'XX'}  ${t}${d ? ` | ${d}` : ''}`)
}
const listar = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? listar(path.join(dir, e.name)) : [path.join(dir, e.name)]))
const rel = (f) => path.relative(DIST, f).replace(/\\/g, '/')

if (!existsSync(path.join(DIST, 'index.html'))) {
  ok(false, 'dist/index.html existe', 'rode npm run build antes')
  process.exit(1)
}
const arquivos = listar(DIST)
const index = readFileSync(path.join(DIST, 'index.html'), 'utf8')

console.log('\n  INDEX\n')
ok(/<html lang="pt-BR">/.test(index), 'idioma pt-BR')
ok(/<title>[^<]{20,}<\/title>/.test(index), 'título')
const desc = index.match(/name="description"\s+content="([^"]*)"/)?.[1] || ''
ok(desc.length >= 50 && desc.length <= 170, 'descrição entre 50 e 170 caracteres', `${desc.length}`)
ok(/application\/ld\+json/.test(index) && /"taxID": "38\.485\.925\/0001-42"/.test(index), 'dados estruturados com o CNPJ')
ok(/rel="icon"/.test(index) && /rel="manifest"/.test(index) && /og:image/.test(index), 'ícone, manifesto e imagem de compartilhamento declarados')
const pedidos = [...index.matchAll(/\s(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1])
const faltando = pedidos.filter((u) => !existsSync(path.join(DIST, u)))
ok(faltando.length === 0, `todo arquivo pedido pelo index existe (${pedidos.length})`, faltando.join(', '))
// No build da Netlify o og:image vira endereço completo do próprio site (vite.config.js).
const proprio = (process.env.URL || '').replace(/\/$/, '')
const semProprio = (proprio ? index.replaceAll(proprio, '') : index).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
ok(!/https?:\/\/(?!schema\.org)/.test(semProprio), 'index sem recurso de domínio de terceiro')

console.log('\n  PÚBLICOS\n')
for (const f of ['favicon.ico', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icone-192.png', 'icone-512.png', 'site.webmanifest', 'og.jpg', 'robots.txt']) {
  ok(existsSync(path.join(DIST, f)), `${f}`)
}

console.log('\n  NETLIFY\n')
const toml = readFileSync(path.join(RAIZ, 'netlify.toml'), 'utf8')
ok(/command = "npm run build"/.test(toml) && /publish = "dist"/.test(toml), 'build e pasta publicada configurados')
ok(/\[\[redirects\]\]\s*from = "\/\*"\s*to = "\/index\.html"\s*status = 200/.test(toml), 'qualquer caminho entrega o index (link direto não dá 404)')
ok(/Content-Security-Policy = "default-src 'self'/.test(toml), 'CSP só com o próprio site')

console.log('\n  CONTEÚDO DO BUILD\n')
const doRepositorio = ['marca', 'docs'].map((p) => path.join(RAIZ, p)).filter(existsSync).flatMap(listar)
const metadado = [...arquivos, ...doRepositorio]
  .filter((a) => /\.(webp|png|jpe?g|ico)$/i.test(a))
  .filter((a) => /Exif\0\0|http:\/\/ns\.adobe\.com\/xap|c2pa|jumb|photoshop:/i.test(readFileSync(a).toString('latin1')))
ok(metadado.length === 0, 'imagens sem EXIF, XMP ou credencial C2PA', metadado.map(rel).join(', '))

const video = arquivos.filter((a) => a.endsWith('.mp4'))
const peso = arquivos.filter((a) => !a.endsWith('.mp4')).reduce((t, a) => t + statSync(a).size, 0)
ok(peso < 3 * 1024 * 1024, 'site sem o vídeo abaixo de 3 MB', `${(peso / 1024).toFixed(0)} KB em ${arquivos.length - video.length} arquivos`)
for (const v of video) ok(statSync(v).size < 4 * 1024 * 1024, 'vídeo abaixo de 4 MB', `${rel(v)} ${(statSync(v).size / 1048576).toFixed(1)} MB`)

if (process.env.FORCAR_FALHA) ok(false, 'falha forçada por FORCAR_FALHA')
console.log(falhas ? `\n  ${falhas} FALHA(S).\n` : '\n  Estrutura ok.\n')
process.exitCode = falhas ? 1 : 0
