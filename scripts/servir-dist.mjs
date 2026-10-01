/**
 * Serve o `dist/` como a Netlify serviria, com os cabeçalhos de `netlify.toml`.
 * O `vite preview` não aplica a CSP, e a violação só apareceria depois de publicado.
 *
 *   node scripts/servir-dist.mjs [porta]
 */
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(RAIZ, 'dist')
const PORTA = Number(process.argv[2] || 4230)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

/** Lê os blocos [[headers]] do netlify.toml (formato simples, o que o projeto usa). */
function lerCabecalhos() {
  const toml = readFileSync(path.join(RAIZ, 'netlify.toml'), 'utf8')
  const blocos = []
  for (const trecho of toml.split('[[headers]]').slice(1)) {
    const padrao = trecho.match(/for\s*=\s*"([^"]+)"/)?.[1]
    const valores = {}
    for (const m of trecho.matchAll(/^\s*([\w-]+)\s*=\s*"([^"]*)"\s*$/gm)) if (m[1] !== 'for') valores[m[1]] = m[2]
    if (padrao) blocos.push({ padrao, valores })
  }
  return blocos
}
const BLOCOS = lerCabecalhos()
const casa = (padrao, url) =>
  padrao.endsWith('*') ? url.startsWith(padrao.slice(0, -1)) : padrao.includes('*.') ? url.endsWith(padrao.split('*')[1]) : url === padrao

function cabecalhos(url) {
  const saida = {}
  for (const b of BLOCOS) if (casa(b.padrao, url)) for (const [k, v] of Object.entries(b.valores)) if (k.toLowerCase() !== 'cache-control') saida[k] = v
  return saida
}

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  let arquivo = path.join(DIST, url)
  if (!arquivo.startsWith(DIST)) return res.writeHead(403).end()
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = path.join(arquivo, 'index.html')
  // SPA com hash: o que não existe no disco cai no index, como no redirect do netlify.toml.
  if (!existsSync(arquivo)) arquivo = path.join(DIST, 'index.html')
  const ext = path.extname(arquivo).toLowerCase()
  res.writeHead(200, { ...cabecalhos(url), 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  res.end(readFileSync(arquivo))
}).listen(PORTA, '127.0.0.1', () => console.log(`http://127.0.0.1:${PORTA}  (dist, cabeçalhos do netlify.toml)`))
