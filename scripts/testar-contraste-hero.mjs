/**
 * Contraste do texto sobre foto e vídeo, com os degradês do ::after compostos por
 * cima. O fundo de cada texto é o percentil 95 de luminância da caixa dele.
 *
 *   node scripts/testar-contraste-hero.mjs [urlBase]
 */
import { sessao, dorme } from './cdp.mjs'
import { hero, paginas } from '../src/config/site.js'

const BASE = process.argv[2] || 'http://127.0.0.1:4230'
const ROTAS = ['/', ...Object.keys(paginas).map((p) => `/${p}`)]
const LARGURAS = [1440, 1024, 390]
let falhas = 0
const ok = (c, t, d = '') => {
  if (!c) falhas++
  console.log(`  ${c ? 'ok' : 'XX'}  ${t}${d ? ` | ${d}` : ''}`)
}

/** Roda no navegador (vai por toString): nada de fora do escopo dela. */
async function medirNoNavegador(quadros) {
  window.scrollTo({ top: 0, behavior: 'instant' })
  // Zoom do hero cancelado: mede a foto na escala em que ela é desenhada parada.
  document.getAnimations().forEach((an) => an.cancel())
  await new Promise((r) => setTimeout(r, 400))
  const bg = document.querySelector('[data-fundo-medido]')
  const cab = document.querySelector('.cabecalho')
  if (!bg || !cab) return { erro: 'fundo medido ou cabeçalho não encontrado' }
  const conteudo = bg.parentElement
  const v = bg.querySelector('video')
  const br = bg.getBoundingClientRect()

  const cs = getComputedStyle(bg)
  if (cs.backgroundSize !== 'cover' || cs.backgroundPosition !== '50% 50%') return { erro: `fundo com background ${cs.backgroundSize} ${cs.backgroundPosition}: o teste só mapeia cover centralizado` }
  if (v) {
    if (v.readyState < 2) await Promise.race([new Promise((r) => v.addEventListener('loadeddata', r, { once: true })), new Promise((r) => setTimeout(r, 8000))])
    if (v.readyState < 2) return { erro: `vídeo não carregou (readyState ${v.readyState})` }
    const vcs = getComputedStyle(v)
    if (vcs.objectFit !== 'cover' || vcs.objectPosition !== '50% 50%') return { erro: `vídeo com object-fit ${vcs.objectFit} ${vcs.objectPosition}: o teste só mapeia cover centralizado` }
    v.pause()
  }

  // Degradês do ::after como o navegador os aplicou. Todos lineares em 0/90/180/270deg.
  const camadas = []
  for (const m of getComputedStyle(bg, '::after').backgroundImage.matchAll(/linear-gradient\(((?:[^()]|\([^()]*\))*)\)/g)) {
    const partes = m[1].split(/,(?![^()]*\))/).map((p) => p.trim())
    let ang = 180
    if (/deg$/.test(partes[0])) ang = parseFloat(partes.shift())
    else if (/^to /.test(partes[0])) ang = { 'to top': 0, 'to right': 90, 'to bottom': 180, 'to left': 270 }[partes.shift()]
    if (![0, 90, 180, 270].includes(ang)) return { erro: `degradê em ${ang}deg: o teste só lê 0/90/180/270` }
    const comprimento = ang % 180 === 0 ? br.height : br.width
    const paradas = partes.map((p) => {
      const c = p.match(/rgba?\(([^)]*)\)/)[1].split(',').map(Number)
      const pos = p.replace(/rgba?\([^)]*\)/, '').trim()
      const a = c.length > 3 ? c[3] : 1
      return { a, p: c.slice(0, 3).map((k) => k * a), t: pos.endsWith('px') ? parseFloat(pos) / comprimento : pos.endsWith('%') ? parseFloat(pos) / 100 : null }
    })
    paradas[0].t ??= 0
    paradas[paradas.length - 1].t ??= 1
    for (let i = 1; i < paradas.length - 1; i++) {
      if (paradas[i].t !== null) continue
      const j = paradas.findIndex((q, k) => k > i && q.t !== null)
      paradas[i].t = paradas[i - 1].t + (paradas[j].t - paradas[i - 1].t) / (j - i + 1)
    }
    camadas.push({ ang, paradas })
  }
  if (!camadas.length) return { erro: 'nenhum degradê no ::after do fundo' }
  const noPonto = ({ ang, paradas }, x, y) => {
    const rx = (x - br.left) / br.width
    const ry = (y - br.top) / br.height
    const t = { 0: 1 - ry, 90: rx, 180: ry, 270: 1 - rx }[ang]
    if (t <= paradas[0].t) return paradas[0]
    for (let i = 1; i < paradas.length; i++) {
      const a = paradas[i - 1]
      const b = paradas[i]
      if (t <= b.t) {
        const f = b.t === a.t ? 1 : (t - a.t) / (b.t - a.t)
        return { a: a.a + (b.a - a.a) * f, p: a.p.map((k, n) => k + (b.p[n] - k) * f) }
      }
    }
    return paradas[paradas.length - 1]
  }

  const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
  const opaco = (el, ate) => {
    for (let e = el; e && e !== ate; e = e.parentElement) {
      const m = getComputedStyle(e).backgroundColor.match(/[0-9.]+/g)
      if (m && (m.length < 4 || +m[3] > 0.9)) return true
    }
    return false
  }
  const dentro = (r, c) => r.top >= c.top - 1 && r.bottom <= c.bottom + 1
  const textosDe = (raiz, caixa) =>
    [...raiz.querySelectorAll('*')]
      .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .filter((e) => {
        const r = e.getBoundingClientRect()
        const s = getComputedStyle(e)
        return r.width > 2 && r.height > 2 && dentro(r, caixa) && r.top < br.bottom && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'
      })
      .filter((e) => !opaco(e, raiz))
  // Véus: fundo semitransparente entre a foto e o texto, compostos de fora para
  // dentro por cima dos degradês. O backdrop-filter fica de fora (conservador).
  const veus = (el, raiz) => {
    const lista = []
    for (let e = el; e && e !== raiz; e = e.parentElement) {
      const m = getComputedStyle(e).backgroundColor.match(/[0-9.]+/g)
      if (m && m.length === 4 && +m[3] > 0) lista.unshift({ a: +m[3], rgb: m.slice(0, 3).map(Number) })
    }
    return lista
  }
  const textos = [...textosDe(cab, cab.getBoundingClientRect()).map((e) => [e, cab]), ...textosDe(conteudo, br).map((e) => [e, conteudo])].map(([e, raiz]) => {
    const s = getComputedStyle(e)
    const px = parseFloat(s.fontSize)
    const grande = px >= 24 || (px >= 18.66 && parseInt(s.fontWeight) >= 700)
    return { t: e.textContent.trim().slice(0, 26), r: e.getBoundingClientRect(), L: lum(s.color.match(/[0-9.]+/g).map(Number)), veus: veus(e, raiz), minimo: grande ? 3 : 4.5, piores: [] }
  })
  if (!textos.length) return { erro: 'nenhum texto sobre o fundo para medir' }

  const medir = (fonte, W, H, rotulo) => {
    const cv = document.createElement('canvas')
    cv.width = W
    cv.height = H
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(fonte, 0, 0, W, H)
    const d = ctx.getImageData(0, 0, W, H).data
    const esc = Math.max(br.width / W, br.height / H)
    const ox = br.left + (br.width - W * esc) / 2
    const oy = br.top + (br.height - H * esc) / 2
    for (const a of textos) {
      const ls = []
      // Texto grande: amostra a cada 2px (a caixa de um h1 tem centenas de milhares de pixels).
      const passo = a.r.width * a.r.height > 60000 ? 2 : 1
      for (let y = a.r.top; y < a.r.bottom; y += passo) {
        for (let x = a.r.left; x < a.r.right; x += passo) {
          const vx = Math.floor((x - ox) / esc)
          const vy = Math.floor((y - oy) / esc)
          if (vx < 0 || vy < 0 || vx >= W || vy >= H) continue
          const i = (vy * W + vx) * 4
          let c = [d[i], d[i + 1], d[i + 2]]
          // A primeira camada listada é a de cima: compor da última para a primeira.
          for (let k = camadas.length - 1; k >= 0; k--) {
            const g = noPonto(camadas[k], x, y)
            c = c.map((v0, n) => g.p[n] + (1 - g.a) * v0)
          }
          for (const v1 of a.veus) c = c.map((v0, n) => v1.a * v1.rgb[n] + (1 - v1.a) * v0)
          ls.push(lum(c))
        }
      }
      if (!ls.length) continue
      ls.sort((p, q) => p - q)
      const fundo = ls[Math.floor(ls.length * 0.95)]
      a.piores.push({ c: (Math.max(a.L, fundo) + 0.05) / (Math.min(a.L, fundo) + 0.05), rotulo })
    }
  }

  let amostras = 0
  if (v) {
    for (let i = 0; i < quadros; i++) {
      v.currentTime = (v.duration * (i + 0.5)) / quadros
      await Promise.race([new Promise((r) => v.addEventListener('seeked', r, { once: true })), new Promise((r) => setTimeout(r, 3000))])
      medir(v, v.videoWidth, v.videoHeight, `quadro ${v.currentTime.toFixed(1)}s`)
      amostras++
    }
  }
  const img = new Image()
  img.src = cs.backgroundImage.slice(5, -2)
  await img.decode()
  medir(img, img.naturalWidth, img.naturalHeight, v ? 'pôster' : 'foto')
  amostras++
  v?.play()
  return {
    amostras,
    textos: textos.map((a) => {
      const pior = a.piores.reduce((m, p) => (p.c < m.c ? p : m), { c: Infinity })
      return { t: a.t, amostras: a.piores.length, minimo: a.minimo, pior: +pior.c.toFixed(2), onde: pior.rotulo }
    }),
  }
}

for (const [i, largura] of LARGURAS.entries()) {
  console.log(`\n  ${largura}px\n`)
  const s = await sessao({ porta: 9670 + i, largura, altura: largura < 768 ? 844 : 900, flags: ['--autoplay-policy=no-user-gesture-required'] })
  for (const rota of ROTAS) {
    await s.ir(`${BASE}/#${rota}`, '[data-fundo-medido]')
    // Troca só de hash não recarrega: espera o h1 da página nova antes de medir.
    const titulo = rota === '/' ? hero.titulo : paginas[rota.slice(1)].titulo
    for (let t = 0; t < 60 && (await s.js(`document.querySelector('h1')?.textContent.trim()`)) !== titulo; t++) await dorme(100)
    if ((await s.js(`document.querySelector('h1')?.textContent.trim()`)) !== titulo) {
      ok(false, `${rota}: a página não carregou`, `h1 esperado "${titulo}"`)
      continue
    }
    const r = JSON.parse(await s.js(`(${medirNoNavegador.toString()})(24).then(JSON.stringify)`))
    if (r.erro) {
      ok(false, `${rota} | medição`, r.erro)
      continue
    }
    const ruins = r.textos.filter((t) => t.amostras < r.amostras || t.pior < t.minimo)
    const pior = r.textos.reduce((m, t) => (t.pior / t.minimo < m.pior / m.minimo ? t : m))
    ok(
      ruins.length === 0,
      `${rota.padEnd(10)} ${r.textos.length} textos sobre ${r.amostras > 1 ? `${r.amostras} amostras do vídeo` : 'a foto'}, pior "${pior.t}" ${pior.pior}:1 (mín. ${pior.minimo})`,
      ruins.map((t) => `"${t.t}" ${t.pior}:1 em ${t.onde}${t.amostras < r.amostras ? ` (só ${t.amostras} amostras)` : ''}`).join(' | '),
    )
  }
  await s.fechar()
}

if (process.env.FORCAR_FALHA) ok(false, 'falha forçada por FORCAR_FALHA')
console.log(falhas ? `\n  ${falhas} FALHA(S).\n` : '\n  Contraste sobre foto e vídeo ok.\n')
process.exitCode = falhas ? 1 : 0
