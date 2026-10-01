/**
 * Contraste WCAG 2.1 dos tokens de src/config/tokens.js e checagem de publicação:
 * contatos com formato válido, nada de PREENCHER e nenhuma foto provisória (prefixo ref-) no build.
 *
 *   npm run paleta   (rodar depois de npm run build)
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { cores } = await import(pathToFileURL(path.join(RAIZ, 'src/config/tokens.js')).href)
const { empresa } = await import(pathToFileURL(path.join(RAIZ, 'src/config/site.js')).href)

const lum = (hex) => {
  const n = hex.replace('#', '')
  const v = [0, 2, 4]
    .map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
}
const contraste = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** [texto, fundo, mínimo, máximo (falha esperada), onde é usado] */
const pares = [
  ['texto', 'fundo', 7, null, 'títulos e texto no preto'],
  ['suave', 'fundo', 4.5, null, 'texto corrido no preto'],
  ['suave2', 'fundo', 4.5, null, 'rodapé e secundário'],
  ['ouro', 'fundo', 4.5, null, 'rótulo, link e ícone no preto'],
  ['ouro', 'superficie', 4.5, null, 'chamada dos cartões'],
  ['suave', 'superficie2', 4.5, null, 'rótulos do formulário'],
  ['tinta', 'ouro', 4.5, null, 'rótulo do botão dourado'],
  ['tinta', 'ouroVivo', 4.5, null, 'rótulo do botão dourado no hover'],
  ['suave', 'brasa', 4.5, null, 'texto da faixa Quem somos'],
  ['tinta', 'marfim', 7, null, 'títulos no marfim'],
  ['tintaSuave', 'marfim', 4.5, null, 'texto corrido no marfim'],
  ['ouroTinta', 'marfim', 4.5, null, 'rótulo e numeração no marfim'],
  ['erro', 'superficie2', 4.5, null, 'erro de campo'],
  // Falha esperada: justifica o ouroTinta no marfim.
  ['ouro', 'marfim', null, 3, 'dourado sobre marfim: por isso o marfim usa ouroTinta'],
]

let falhas = 0
const ok = (c, t, d = '') => {
  if (!c) falhas++
  console.log(`  ${c ? 'ok' : 'XX'}  ${t}${d ? ` | ${d}` : ''}`)
}

console.log('\n  CONTRASTE (WCAG 2.1) | calculado de src/config/tokens.js\n')
for (const [a, b, min, max, nota] of pares) {
  if (!cores[a] || !cores[b]) {
    ok(false, `token inexistente: ${!cores[a] ? a : b}`)
    continue
  }
  const c = contraste(cores[a], cores[b])
  ok(min ? c >= min : c < max, `${a} sobre ${b}`.padEnd(26), `${c.toFixed(2)}:1 ${min ? `(mín. ${min})` : `(falha esperada, < ${max})`} · ${nota}`)
}

console.log('\n  PORTÃO DE PUBLICAÇÃO\n')
// Número plausível mas errado não dá erro nenhum: leva o cliente à conversa de um estranho.
ok(/^55\d{10,11}$/.test(empresa.whatsapp), 'WhatsApp no formato do wa.me (55 + DDD + número)', empresa.whatsapp)
ok(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(empresa.email) && !/PREENCHER/i.test(empresa.email), 'e-mail de contato válido', empresa.email)

const listar = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? listar(path.join(dir, e.name)) : [path.join(dir, e.name)]))
    : []
const dist = listar(path.join(RAIZ, 'dist'))
if (!dist.length) ok(false, 'dist/ existe para a varredura', 'rode npm run build antes')
else {
  // O texto do site mora no JS do build: é ali que a pessoa "lê" o sentinela.
  const comSentinela = dist.filter((f) => /\.(js|html)$/.test(f) && /PREENCHER|\[a preencher/.test(readFileSync(f, 'utf8')))
  ok(comSentinela.length === 0, 'build sem PREENCHER no texto', comSentinela.map((f) => path.basename(f)).join(', '))
  /** Foto provisória (prefixo ref-, que o Vite preserva no nome com hash) não vai para o ar. */
  const ref = dist.filter((f) => path.basename(f).startsWith('ref-')).map((f) => path.basename(f).replace(/-[\w-]{8}\./, '.'))
  ok(ref.length === 0, 'nenhuma foto provisória (ref-) no build', ref.length ? `trocar: ${[...new Set(ref)].join(', ')}` : '')
}

if (process.env.FORCAR_FALHA) ok(false, 'falha forçada por FORCAR_FALHA')
console.log(falhas ? `\n  ${falhas} FALHA(S).\n` : '\n  Paleta e portão ok.\n')
process.exitCode = falhas ? 1 : 0
