/**
 * Roda todos os testes contra o build, servido como a Netlify serviria
 * (scripts/servir-dist.mjs). Cada etapa roda até o fim mesmo que a anterior falhe.
 *
 *   npm run testar
 */
import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORTA = 4230
const BASE = `http://127.0.0.1:${PORTA}`
const VITE = path.join(RAIZ, 'node_modules', 'vite', 'bin', 'vite.js')
const dorme = (ms) => new Promise((r) => setTimeout(r, ms))

const passos = [
  ['build', [VITE, 'build', '--logLevel', 'warn']],
  ['estrutura', ['scripts/validar-estrutura.mjs']],
  ['paleta + portão de publicação', ['scripts/paleta.mjs']],
  ['layout', ['scripts/testar-layout.mjs', BASE]],
  ['contraste sobre foto e vídeo', ['scripts/testar-contraste-hero.mjs', BASE]],
  ['navegação', ['scripts/testar-navegacao.mjs', BASE]],
  ['formulário', ['scripts/testar-formulario.mjs', BASE]],
]

let servidor
const resultados = []
for (const [nome, args] of passos) {
  console.log(`\n══════ ${nome} ══════`)
  if (nome === 'layout' && !servidor) {
    servidor = spawn(process.execPath, ['scripts/servir-dist.mjs', String(PORTA)], { cwd: RAIZ, stdio: 'ignore' })
    for (let i = 0; i < 40; i++) {
      try {
        if ((await fetch(BASE + '/')).ok) break
      } catch {
        /* subindo */
      }
      await dorme(150)
    }
  }
  const r = spawnSync(process.execPath, args, { cwd: RAIZ, stdio: 'inherit', env: process.env })
  resultados.push([nome, r.status])
  // Cada etapa sobe e mata um Chrome headless; emendar a próxima na hora pode
  // pegar a porta de depuração ainda ocupada.
  await dorme(1500)
}
servidor?.kill()

console.log('\n══════ RESUMO ══════\n')
for (const [nome, status] of resultados) console.log(`  ${status === 0 ? 'ok ' : 'XX '} ${nome}${status === 0 ? '' : ` (código ${status})`}`)
const ruins = resultados.filter(([, s]) => s !== 0)
console.log(ruins.length ? `\n  ${ruins.length} etapa(s) com falha.\n` : '\n  Tudo verde.\n')
process.exitCode = ruins.length ? 1 : 0
