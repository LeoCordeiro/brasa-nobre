/**
 * Navegação e interação por clique real (Input.dispatchMouseEvent): clique de
 * script passa até com o botão fora da tela. Desktop e celular, todas as páginas.
 *
 *   node scripts/testar-navegacao.mjs [urlBase]
 */
import { sessao, dorme } from './cdp.mjs'
import { hero, paginas, navegacao, navegacaoRodape } from '../src/config/site.js'

const BASE = process.argv[2] || 'http://127.0.0.1:4230'
const DESCONTO = 88
let falhas = 0
const ok = (c, t, d = '') => {
  if (!c) falhas++
  console.log(`  ${c ? 'ok' : 'XX'}  ${t}${d ? ` | ${d}` : ''}`)
}
/** h1 esperado de cada rota: a página nova só conta quando o título dela está na tela. */
const tituloDe = (para) => (para === '/' ? hero.titulo : paginas[para.slice(1)]?.titulo)
/** Espera a rolagem parar em vez de adivinhar a duração. */
async function parar(s) {
  for (let y = -1, i = 0; i < 40; i++) {
    await dorme(100)
    const agora = await s.js('Math.round(scrollY)')
    if (agora === y) return
    y = agora
  }
}
async function naPagina(s, para) {
  const titulo = tituloDe(para)
  for (let i = 0; i < 50; i++) {
    if ((await s.js(`document.querySelector('h1')?.textContent.trim()`)) === titulo) break
    await dorme(100)
  }
  await parar(s)
  return JSON.parse(
    await s.js(`JSON.stringify({hash:location.hash,h1:document.querySelector('h1')?.textContent.trim(),y:Math.round(scrollY),
      atual:[...document.querySelectorAll('.nav-links a[aria-current=page]')].map(a=>a.getAttribute('href'))})`),
  )
}
// Depois de rolar, o cabeçalho condensa com transição: o clique espera ele assentar.
const rolar = async (s, y) => {
  await s.js(`window.scrollTo({top:${y},behavior:'instant'})`)
  await dorme(450)
}

/* ---------- desktop ---------- */
console.log('\n  DESKTOP 1440\n')
let s = await sessao({ porta: 9611, largura: 1440, altura: 900, flags: ['--force-prefers-reduced-motion'] })
await s.ir(BASE + '/#/', '#inicio')

for (const { nome, para } of navegacao) {
  await rolar(s, 600)
  await s.clicar(`.nav-links a[href="#${para}"]`)
  const r = await naPagina(s, para)
  ok(r.hash === `#${para}` && r.h1 === tituloDe(para) && r.y === 0 && r.atual.join() === `#${para}`, `menu "${nome}" abre ${para} no topo e marca o link`, JSON.stringify(r))
}

await rolar(s, 900)
await parar(s)
const condensado = JSON.parse(await s.js(`JSON.stringify({cls:document.querySelector('.cabecalho').className,h:Math.round(document.querySelector('.cabecalho').getBoundingClientRect().height)})`))
ok(/rolado/.test(condensado.cls) && condensado.h <= 80, 'cabeçalho condensa ao rolar (vidro, faixa superior recolhida)', JSON.stringify(condensado))
// Mesma página: para o router não há navegação; o site volta ao topo na mão.
await s.clicar('.nav-links a[href="#/parceiro"]')
await parar(s)
ok((await s.js('Math.round(scrollY)')) === 0, 'clicar no link da página atual depois de rolar volta ao topo')

await s.clicar('.brand')
ok((await naPagina(s, '/')).h1 === hero.titulo, 'a marca no menu volta à home')
await s.clicar('.nav-cta')
let r = await naPagina(s, '/contato')
ok(r.hash === '#/contato' && (await s.js(`!!document.querySelector('form[data-orcamento]')`)), 'botão "Orçamento" do menu abre o Contato com o formulário', r.hash)

// Home
await s.ir(BASE + '/#/', '#inicio')
await s.clicar('.hero .acoes a[href="#/contato"]')
ok((r = await naPagina(s, '/contato')).hash === '#/contato' && r.h1 === tituloDe('/contato'), 'botão "Pedir orçamento" do hero abre o Contato')
await s.ir(BASE + '/#/', '#inicio')
await s.clicar('.hero .acoes a[href="#/eventos"]')
ok((r = await naPagina(s, '/eventos')).hash === '#/eventos' && r.h1 === tituloDe('/eventos'), 'botão "Planeje seu evento" do hero abre Eventos')

await s.ir(BASE + '/#/', '#inicio')
await s.clicar('.cartao[data-servico="decoracao"]')
await naPagina(s, '/servicos')
const abaAberta = JSON.parse(await s.js(`JSON.stringify({h:location.hash,sel:[...document.querySelectorAll('[role=tab][aria-selected=true]')].map(t=>t.id),titulo:document.querySelector('#menu-panel h2')?.textContent.trim()})`))
ok(abaAberta.h === '#/servicos?aba=decoracao' && abaAberta.sel.join() === 'tab-decoracao' && abaAberta.titulo === 'Decoração', 'cartão Decoração da home abre Serviços já na aba dele', JSON.stringify(abaAberta))

await s.ir(BASE + '/#/', '#inicio')
const naHome = await s.js(`document.querySelectorAll('#eventos .cartao').length`)
ok(naHome === 3, 'a home mostra 3 formatos de evento', `${naHome}`)
await s.clicar('#eventos .ver-todos')
await naPagina(s, '/eventos')
ok((await s.js(`document.querySelectorAll('#eventos .cartao').length`)) === 6, '"Ver os 6 formatos" abre Eventos com os 6')

await s.ir(BASE + '/#/', '#inicio')
await s.clicar('.cartao[data-evento="Happy hour"]')
await naPagina(s, '/contato')
const tipoHome = await s.js(`document.querySelector('.v-select .v-select__selection-text')?.textContent.trim()`)
ok(tipoHome === 'Happy hour', 'cartão Happy hours da home chega ao Contato com o tipo marcado', tipoHome)

// Serviços: abas
await s.ir(BASE + '/#/servicos', '#menu-panel')
const estado = () =>
  s.js(`JSON.stringify({
    titulo:document.querySelector('#menu-panel h2')?.textContent.trim(),
    sel:[...document.querySelectorAll('[role=tab]')].filter(t=>t.getAttribute('aria-selected')==='true').map(t=>t.id),
    rotulo:document.querySelector('#menu-panel').getAttribute('aria-labelledby'),
    foto:document.querySelector('.galeria-principal img').getAttribute('src'),
    legenda:document.querySelector('.galeria-principal figcaption').textContent.trim(),
    foco:document.activeElement.id})`).then(JSON.parse)
await s.clicar('#tab-decoracao')
let abas = await estado()
ok(abas.titulo === 'Decoração' && abas.sel.join() === 'tab-decoracao' && abas.rotulo === 'tab-decoracao' && /decoracao-salao/.test(abas.foto) && abas.legenda === 'Salão decorado', 'aba Decoração troca painel, aria, foto e legenda', JSON.stringify(abas))
await s.cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
await s.cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 })
await dorme(150)
abas = await estado()
ok(abas.foco === 'tab-apoio' && abas.titulo === 'Apoio ao evento', 'seta para a direita leva à aba seguinte', JSON.stringify(abas))
await s.clicar('#tab-decoracao')
await s.clicar('#menu-panel a[data-complemento]')
await naPagina(s, '/contato')
ok((await s.js(`document.querySelector('input[type=radio][value="Churrasco + decoração"]')?.checked`)) === true, '"Pedir orçamento" da aba Decoração chega ao Contato com a opção marcada')

// Eventos
await s.ir(BASE + '/#/eventos', '#eventos')
await s.clicar('.cartao[data-evento="Treinamento"]')
await naPagina(s, '/contato')
const tipo = await s.js(`document.querySelector('.v-select .v-select__selection-text')?.textContent.trim()`)
ok(tipo === 'Treinamento', 'cartão Treinamentos chega ao Contato com o tipo escolhido', tipo)

// Sobre: a logo é quadrada; num cartão retangular o fundo aparece nas laterais.
await s.ir(BASE + '/#/sobre', '.cartao-logo')
await s.js(`document.querySelector('.cartao-logo').scrollIntoView({block:'center',behavior:'instant'})`)
await dorme(300)
const logo = JSON.parse(await s.js(`(()=>{const f=document.querySelector('.cartao-logo').getBoundingClientRect();const i=document.querySelector('.cartao-logo img');const r=i.getBoundingClientRect();
  return JSON.stringify({fw:Math.round(f.width),fh:Math.round(f.height),iw:Math.round(r.width),ih:Math.round(r.height),nat:i.naturalWidth+'x'+i.naturalHeight})})()`))
ok(Math.abs(logo.fw - logo.fh) <= 2 && Math.abs(logo.iw - logo.fw) <= 2 && Math.abs(logo.ih - logo.fh) <= 2, 'logo do Sobre em cartão quadrado, a imagem ocupando o cartão inteiro', JSON.stringify(logo))
await s.clicar('.chamada--parceiro .btn-ouro')
ok((r = await naPagina(s, '/parceiro')).hash === '#/parceiro' && r.h1 === tituloDe('/parceiro'), 'chamada "Seja um parceiro" do Sobre abre a página de parceiro')

// Seja um parceiro
await s.clicar('.pagina-cab .acoes a')
await parar(s)
const cadastro = await s.js(`Math.round(document.querySelector('#cadastro').getBoundingClientRect().top)`)
ok(Math.abs(cadastro - DESCONTO) <= 30, '"Fazer o cadastro" leva ao formulário de parceiro', `topo em ${cadastro}px`)

// Rodapé
for (const { nome, para } of navegacaoRodape) {
  await s.ir(BASE + '/#/', '#inicio')
  await s.clicar(`.rodape nav a[href="#${para}"]`)
  r = await naPagina(s, para)
  ok(r.hash === `#${para}` && r.y === 0, `rodapé "${nome}" abre ${para} no topo`, JSON.stringify(r))
}

await s.ir(BASE + '/#/', '#inicio')
const externos = JSON.parse(await s.js(`JSON.stringify([...document.querySelectorAll('a[href^="https://wa.me"]')].map(a=>a.target==='_blank'&&/noopener/.test(a.rel)))`))
ok(externos.length >= 3 && externos.every(Boolean), `links do WhatsApp em nova aba com noopener (${externos.length})`)
const heroParado = await s.js(`(()=>{const v=document.querySelector('.hero-video');return v?getComputedStyle(v).display==='none':getComputedStyle(document.querySelector('.hero-bg')).animationName==='none'})()`)
ok(heroParado, 'reduced-motion para o movimento do hero (vídeo ou zoom da foto)')
ok(s.errosSessao().length === 0, 'sem erro de console em nenhuma página visitada', s.errosSessao()[0] || '')

await s.ir(`${BASE}/#/privacidade`, '.doc')
await s.clicar('.nav-links a[href="#/servicos"]')
ok((r = await naPagina(s, '/servicos')).hash === '#/servicos' && r.h1 === tituloDe('/servicos'), 'das páginas legais o menu leva às páginas do site')
await s.ir(`${BASE}/#/nao-existe`, 'main')
await dorme(400)
ok((await s.js('location.hash')) === '#/', 'rota desconhecida volta para a home')
const direto = await fetch(`${BASE}/qualquer/caminho`)
ok(direto.status === 200 && /id="app"/.test(await direto.text()), 'caminho desconhecido no servidor entrega o app (como o redirect da Netlify)')
await s.fechar()

/* ---------- celular ---------- */
console.log('\n  CELULAR 390\n')
s = await sessao({ porta: 9612, largura: 390, altura: 844 })
await s.ir(BASE + '/#/', '#inicio')
await s.clicar('.menu-button')
await dorme(200)
const aberto = JSON.parse(await s.js(`(()=>{const d=document.getElementById('mobile-menu');const b=d.querySelector('[data-close-menu]');const r=b.getBoundingClientRect();
  const alvo=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
  return JSON.stringify({open:d.open,exp:document.querySelector('.menu-button').getAttribute('aria-expanded'),alcance:alvo===b,w:Math.round(r.width)})})()`))
ok(aberto.open && aberto.exp === 'true', 'menu do celular abre e marca aria-expanded', JSON.stringify(aberto))
ok(aberto.alcance && aberto.w >= 44, 'botão Fechar é o elemento no ponto do clique e tem 44px ou mais')
await s.clicar('#mobile-menu [data-close-menu]')
const fechado = JSON.parse(await s.js(`JSON.stringify({open:document.getElementById('mobile-menu').open,exp:document.querySelector('.menu-button').getAttribute('aria-expanded'),foco:document.activeElement.className})`))
ok(!fechado.open && fechado.exp === 'false' && /menu-button/.test(fechado.foco), 'Fechar fecha, desmarca e devolve o foco ao botão', JSON.stringify(fechado))
await s.clicar('.menu-button')
await dorme(200)
await s.clicar('#mobile-menu nav a[href="#/sobre"]')
r = await naPagina(s, '/sobre')
const menuFechou = await s.js(`!document.getElementById('mobile-menu').open`)
ok(menuFechou && r.hash === '#/sobre' && r.h1 === tituloDe('/sobre') && r.y === 0, 'link do menu do celular fecha o menu e abre a página no topo', JSON.stringify(r))
await s.clicar('.menu-button')
await dorme(200)
ok((await s.js(`document.querySelector('#mobile-menu nav a[aria-current=page]')?.getAttribute('href')`)) === '#/sobre', 'o menu do celular marca a página atual')
await s.clicar('#mobile-menu .mobile-menu-actions .btn-ouro')
ok((r = await naPagina(s, '/contato')).hash === '#/contato' && r.h1 === tituloDe('/contato'), '"Pedir orçamento" do menu do celular abre o Contato')

const barra = JSON.parse(await s.js(`JSON.stringify([...document.querySelectorAll('.mobile-sticky a')].map(a=>({t:a.textContent.trim(),h:Math.round(a.getBoundingClientRect().height)})))`))
ok(barra.length === 3 && barra.every((b) => b.h >= 44), 'barra do celular com 3 ações de 44px ou mais', barra.map((b) => `${b.t} ${b.h}px`).join(', '))
await s.clicar('.mobile-sticky a[href="#/eventos"]')
ok((r = await naPagina(s, '/eventos')).hash === '#/eventos' && r.h1 === tituloDe('/eventos'), 'barra do celular: Eventos abre a página de eventos')
await s.clicar('.mobile-sticky a[href="#/contato"]')
ok((r = await naPagina(s, '/contato')).hash === '#/contato' && r.h1 === tituloDe('/contato'), 'barra do celular: Orçamento abre o Contato')
ok((await s.js(`getComputedStyle(document.querySelector('.zap')).display`)) === 'none', 'botão flutuante some no celular (a barra já tem WhatsApp)')
ok(s.errosSessao().length === 0, 'sem erro de console no celular', s.errosSessao()[0] || '')
await s.fechar()

if (process.env.FORCAR_FALHA) ok(false, 'falha forçada por FORCAR_FALHA')
console.log(falhas ? `\n  ${falhas} FALHA(S).\n` : '\n  Navegação ok.\n')
process.exitCode = falhas ? 1 : 0
