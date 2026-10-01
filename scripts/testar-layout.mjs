/**
 * Layout em seis larguras: overflow, console, fontes, menu, imagens, contraste e texto
 * cortado. Exige a largura pedida: o Chrome móvel alarga o viewport quando algo estoura.
 *
 *   node scripts/testar-layout.mjs [urlBase]
 */
import { sessao, dorme } from './cdp.mjs'
import { hero, paginas } from '../src/config/site.js'

const BASE = process.argv[2] || 'http://127.0.0.1:4230'
// [rota, h1 esperado]: numa troca só de hash o DOM antigo fica na tela por um
// instante, e esperar pelo título certo garante medir a página nova.
const ROTAS = [
  ['/#/', hero.titulo],
  ...Object.entries(paginas).map(([nome, p]) => [`/#/${nome}`, p.titulo]),
  ['/#/privacidade', 'Política de privacidade'],
  ['/#/termos', 'Termos de uso'],
  ['/#/repasse', 'Política de repasse e parceiros'],
  ['/#/style-guide', 'Guia de estilo'],
]
// Teto de altura da home: metade do que seria com o conteúdo todo numa página só.
const ALTURA_MAX_HOME = { 1440: 4589, 390: 5192 }
const LARGURAS = [1440, 1180, 1024, 768, 390, 320]

let falhas = 0
const ok = (c, t, d = '') => {
  if (!c) falhas++
  console.log(`  ${c ? 'ok' : 'XX'}  ${t}${d ? ` | ${d}` : ''}`)
}

// Sem crase dentro deste bloco: ele inteiro vive num template literal.
const MEDIDA = `(()=>{
  const vw=document.documentElement.clientWidth;
  const rolaveis=[...document.querySelectorAll('body *')].filter(e=>{const o=getComputedStyle(e).overflowX;return o==='auto'||o==='scroll'||o==='hidden'});
  const estouros=[];
  for(const el of document.querySelectorAll('body *')){
    const r=el.getBoundingClientRect();
    if(r.width===0&&r.height===0) continue;
    const cs=getComputedStyle(el);
    if(cs.position==='fixed'||cs.visibility==='hidden') continue;
    if(el.closest('dialog:not([open])')) continue;
    if(rolaveis.some(c=>c!==el&&c.contains(el))) continue;
    const excede=Math.round(r.right-vw);
    if(excede>1) estouros.push(el.tagName.toLowerCase()+'.'+String(el.className||'').slice(0,24)+' +'+excede);
  }
  const fontes=[...new Set([...document.querySelectorAll('h1,h2,h3,p,a,button,label,li,dd')].map(e=>getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,'').trim()))];
  const carregadas=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/"/g,''));
  const links=document.querySelector('.nav-links');
  const botao=document.querySelector('.menu-button');
  const visivel=el=>!!el&&el.getBoundingClientRect().height>0&&getComputedStyle(el).display!=='none';
  const imgs=[...document.querySelectorAll('img')];
  const marcaveis=[...document.querySelectorAll('input[type=radio],input[type=checkbox]')];
  const numeros=[...document.querySelectorAll('.numeros-card strong')].map(e=>getComputedStyle(e).fontVariantNumeric);
  const barra=document.querySelector('.mobile-sticky');
  const h1=document.querySelector('h1');
  /* Contraste da cor aplicada, nao do token: uma regra mais especifica pode trocar
     a cor. Fundo = primeira cor opaca subindo a arvore; com imagem ou gradiente, pula. */
  const rgb=s=>{const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(',').map(parseFloat);return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}};
  const lum=c=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)};
  const fundo=el=>{for(let e=el;e;e=e.parentElement){const cs=getComputedStyle(e);if(cs.backgroundImage!=='none')return null;const c=rgb(cs.backgroundColor);if(c&&c.a>=0.95)return c}return {r:255,g:255,b:255,a:1}};
  const baixos=[];
  for(const el of document.querySelectorAll('p,li,span,strong,small,em,a,label,legend,dt,dd,h1,h2,h3,button,figcaption')){
    if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) continue;
    const r=el.getBoundingClientRect(); if(!r.width||!r.height) continue;
    const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none') continue;
    const bg=fundo(el); const fg=rgb(cs.color); if(!bg||!fg) continue;
    const t={r:fg.r*fg.a+bg.r*(1-fg.a),g:fg.g*fg.a+bg.g*(1-fg.a),b:fg.b*fg.a+bg.b*(1-fg.a)};
    const a=lum(t),b=lum(bg); const c=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
    const px=parseFloat(cs.fontSize); const grande=px>=24||(px>=18.66&&parseInt(cs.fontWeight)>=700);
    if(c<(grande?3:4.5)) baixos.push(el.tagName.toLowerCase()+' "'+el.textContent.trim().slice(0,22)+'" '+c.toFixed(2)+':1');
  }
  /* Texto cortado sem aviso (o .v-label do Vuetify e nowrap + overflow hidden):
     elemento com texto proprio que corta e cujo conteudo passa da caixa. */
  const cortados=[];
  for(const el of document.querySelectorAll('body *')){
    if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) continue;
    const cs=getComputedStyle(el);
    if(cs.overflowX!=='hidden'&&cs.overflowX!=='clip') continue;
    if(cs.visibility==='hidden'||cs.display==='none'||el.clientWidth<=2) continue;
    if(el.scrollWidth>el.clientWidth+1) cortados.push(el.tagName.toLowerCase()+' "'+el.textContent.trim().slice(0,28)+'"');
  }
  return JSON.stringify({
    vw, iw:innerWidth, scrollW:document.documentElement.scrollWidth, estouros, fontes, carregadas,
    menuVisivel:visivel(links), botaoVisivel:visivel(botao),
    imgQuebrada:imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')),
    imgSemAlt:imgs.filter(i=>!i.hasAttribute('alt')).map(i=>i.getAttribute('src')),
    imgSemDim:imgs.filter(i=>!i.getAttribute('width')||!i.getAttribute('height')).map(i=>i.getAttribute('src')),
    marcaveisApagados:marcaveis.filter(i=>{const cs=getComputedStyle(i);const r=i.getBoundingClientRect();return cs.appearance==='none'||r.width<12||r.height<12}).map(i=>i.name),
    numerosAntigos:numeros.filter(v=>!/lining-nums/.test(v)).length,
    h1:h1?h1.textContent.trim():'',
    barraAltura:visivel(barra)?Math.round(barra.getBoundingClientRect().height):0,
    corpoFolga:parseFloat(getComputedStyle(document.body).paddingBottom),
    h1Right:h1?Math.round(h1.getBoundingClientRect().right):0,
    baixos:[...new Set(baixos)],
    cortados:[...new Set(cortados)],
    proibidos:[...new Set((document.body.innerText.match(/intermedia[a-zçãõáéíóú]*|comiss(?:ão|ões|ao)|(?<![a-z])(?:b2b|split|hub)(?![a-z])|marketplace/gi)||[]).map(t=>t.toLowerCase()))],
    titulo:h1?h1.innerText.trim().replace(/\\s+/g,' ').slice(0,34):'',
    altura:document.documentElement.scrollHeight,
    primeiroCampo:document.querySelector('form input')?Math.round(document.querySelector('form input').getBoundingClientRect().bottom+scrollY):0,
    areaUtil:Math.round(innerHeight-(visivel(barra)?barra.getBoundingClientRect().height+12:0)),
  })})()`

for (const [i, largura] of LARGURAS.entries()) {
  const altura = largura < 768 ? 844 : 900
  const s = await sessao({ porta: 9500 + i, largura, altura, flags: ['--force-prefers-reduced-motion'] })
  console.log(`\n  ${largura}×${altura}\n`)
  for (const [rota, titulo] of ROTAS) {
    await s.ir(BASE + rota, 'main')
    for (let t = 0; t < 60 && (await s.js(`document.querySelector('h1')?.textContent.trim()`)) !== titulo; t++) await dorme(100)
    await s.js('document.fonts.ready.then(()=>true)')
    await dorme(300)
    const m = JSON.parse(await s.js(MEDIDA))
    const erros = s.errosConsole()
    // Toda requisição tem que vir do próprio site, como diz a política de privacidade.
    const origem = new URL(BASE).origin
    // Só http(s): a aba nova do Chrome headless pede chrome://new-tab-page antes
    // da primeira navegação, e isso não é o site.
    const externos = s.requisicoes().filter((u) => /^https?:/.test(u) && !u.startsWith(origem))
    const p = []
    if (m.iw !== largura) p.push(`janela ${m.iw}px, pedida ${largura}px (algo alargou o viewport)`)
    if (m.scrollW > m.vw || m.estouros.length) p.push(`overflow ${m.scrollW}>${m.vw} ${m.estouros.slice(0, 3).join(' | ')}`)
    if (erros.length) p.push(`console: ${erros[0].slice(0, 90)}`)
    if (!m.carregadas.includes('Cormorant Garamond') || !m.carregadas.includes('Inter')) p.push(`fontes carregadas: ${m.carregadas.join(', ') || 'nenhuma'}`)
    const estranhas = m.fontes.filter((f) => !/^(Cormorant Garamond|Inter)$/.test(f))
    if (estranhas.length) p.push(`fonte fora do sistema: ${estranhas.join(', ')}`)
    if (largura > 980 && (!m.menuVisivel || m.botaoVisivel)) p.push(`menu desktop: links=${m.menuVisivel} botão=${m.botaoVisivel}`)
    if (largura <= 980 && (m.menuVisivel || !m.botaoVisivel)) p.push(`menu celular: links=${m.menuVisivel} botão=${m.botaoVisivel}`)
    if (m.h1Right > m.vw + 1) p.push(`h1 passa da borda (${m.h1Right}>${m.vw})`)
    if (m.imgQuebrada.length) p.push(`imagem que não carregou: ${m.imgQuebrada.slice(0, 2).join(', ')}`)
    if (m.imgSemAlt.length) p.push(`imagem sem alt: ${m.imgSemAlt.slice(0, 2).join(', ')}`)
    if (m.imgSemDim.length) p.push(`imagem sem width/height: ${m.imgSemDim.slice(0, 2).join(', ')}`)
    if (m.marcaveisApagados.length) p.push(`rádio/caixa sem controle visível: ${[...new Set(m.marcaveisApagados)].join(', ')}`)
    if (m.barraAltura && m.corpoFolga < m.barraAltura) p.push(`barra fixa (${m.barraAltura}px) cobre o fim da página (folga ${m.corpoFolga}px)`)
    if (m.baixos.length) p.push(`contraste abaixo do mínimo na cor aplicada: ${m.baixos.slice(0, 3).join(' | ')}`)
    if (m.h1 !== titulo) p.push(`h1 esperado "${titulo}", veio "${m.h1}"`)
    if (m.numerosAntigos) p.push(`${m.numerosAntigos} número(s) da faixa sem algarismo alinhado`)
    if (m.cortados.length) p.push(`texto cortado: ${m.cortados.slice(0, 3).join(' | ')}`)
    if (externos.length) p.push(`requisição para fora do site: ${[...new Set(externos)].slice(0, 2).join(', ')}`)
    if (m.proibidos.length) p.push(`vocabulário proibido no texto: ${m.proibidos.join(', ')}`)
    if (rota === '/#/' && ALTURA_MAX_HOME[largura] && m.altura > ALTURA_MAX_HOME[largura]) p.push(`home com ${m.altura}px (máx. ${ALTURA_MAX_HOME[largura]})`)
    // Contato: o 1º campo aparece inteiro na primeira tela, acima da barra flutuante do celular.
    if (rota === '/#/contato' && !(m.primeiroCampo > 0 && m.primeiroCampo <= m.areaUtil)) p.push(`formulário fora da primeira tela: 1º campo termina em ${m.primeiroCampo}px, área útil ${m.areaUtil}px`)
    ok(p.length === 0, `${rota.padEnd(15)} ${m.titulo.padEnd(34)}`, p.join(' · '))
  }
  await s.fechar()
}

if (process.env.FORCAR_FALHA) ok(false, 'falha forçada por FORCAR_FALHA')
console.log(falhas ? `\n  ${falhas} FALHA(S).\n` : '\n  Layout ok em todas as larguras.\n')
process.exitCode = falhas ? 1 : 0
