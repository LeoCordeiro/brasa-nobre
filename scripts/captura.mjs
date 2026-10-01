/**
 * Captura de página inteira por Chrome headless (CDP). Rola até o fim antes,
 * porque o que depende de IntersectionObserver precisa entrar na tela uma vez.
 *
 *   node scripts/captura.mjs [rota] [largura] [saida.png] [urlBase]
 */
import { writeFileSync } from 'node:fs'
import { sessao, dorme } from './cdp.mjs'

const [rota = '/', largura = '1440', saida = 'captura.png', base = 'http://localhost:5230'] = process.argv.slice(2)
const w = Number(largura)
const s = await sessao({ porta: 9700 + (w % 97), largura: w, altura: w < 768 ? 844 : 900 })
await s.ir(base + rota)
const altura = await s.js('document.documentElement.scrollHeight')
for (let y = 0; y < altura; y += 500) {
  await s.js(`window.scrollTo({top:${y},behavior:'instant'})`)
  await dorme(60)
}
await s.js(`window.scrollTo({top:0,behavior:'instant'})`)
await dorme(900)
const total = await s.js('document.documentElement.scrollHeight')
await s.cdp('Emulation.setDeviceMetricsOverride', { width: w, height: total, deviceScaleFactor: 1, mobile: w < 768 })
await dorme(500)
const r = await s.cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
writeFileSync(saida, Buffer.from(r.result.data, 'base64'))
console.log(`${saida}: ${w}x${total}`)
await s.fechar()
