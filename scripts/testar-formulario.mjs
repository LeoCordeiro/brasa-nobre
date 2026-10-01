/**
 * Formulários de orçamento e de parceiro de ponta a ponta. O menu do v-select é
 * teleportado, então o item é escolhido por clique real; window.open é interceptado
 * para o teste não mandar mensagem de verdade.
 *
 *   node scripts/testar-formulario.mjs [urlBase]
 */
import { sessao, dorme } from './cdp.mjs'

const BASE = process.argv[2] || 'http://127.0.0.1:4230'
let falhas = 0
const ok = (c, t, d = '') => {
  if (!c) falhas++
  console.log(`  ${c ? 'ok' : 'XX'}  ${t}${d ? ` | ${d}` : ''}`)
}

const futura = new Date(Date.now() + 60 * 864e5)
const iso = `${futura.getFullYear()}-${String(futura.getMonth() + 1).padStart(2, '0')}-${String(futura.getDate()).padStart(2, '0')}`
const br = iso.split('-').reverse().join('/')
const TEXTOS = {
  '#o-nome': 'Joana Teste',
  '#o-empresa': 'Acme Ltda',
  '#o-email': 'joana@acme.com.br',
  '#o-tel': '11988887777',
  '#o-data': iso,
  '#o-convidados': '80',
  '#o-local': 'Vila Olímpia, São Paulo',
  '#o-detalhes': 'Duas pessoas vegetarianas.',
}

const s = await sessao({ porta: 9411, largura: 1280, altura: 1000, flags: ['--force-prefers-reduced-motion'] })
await s.ir(BASE + '/#/contato', 'form[data-orcamento]')
const interceptar = () =>
  s.js(`(window.__abriu=[], window.__args=[], window.open=function(u,alvo,rec){window.__abriu.push(u);window.__args.push([alvo||'',rec||'']);return null}, true)`)
await interceptar()
const abertos = () => s.js('JSON.stringify(window.__abriu)').then(JSON.parse)
const argumentos = () => s.js('JSON.stringify(window.__args)').then(JSON.parse)
const enviar = async () => {
  await s.clicar('form[data-orcamento] button[type=submit]')
  await dorme(250)
}
const comErro = (sel) => s.js(`document.querySelector(${JSON.stringify(sel)}).closest('.v-input').classList.contains('v-input--error')`)

async function escolher(texto) {
  await s.clicar('.v-select .v-field')
  await dorme(300)
  const i = await s.js(`[...document.querySelectorAll('.v-overlay--active .v-list-item')].findIndex(e=>e.textContent.trim()===${JSON.stringify(texto)})`)
  if (i < 0) throw new Error(`item do select não encontrado: ${texto}`)
  await s.clicar('.v-overlay--active .v-list-item', i)
  await dorme(300)
}

// 1. vazio
await enviar()
const vazio = JSON.parse(await s.js(`JSON.stringify({n:document.querySelectorAll('form[data-orcamento] .v-input--error').length,status:document.querySelector('.form-status').textContent,foco:document.activeElement.id})`))
ok((await abertos()).length === 0 && vazio.n === 7 && /Confira/.test(vazio.status), 'vazio não envia e destaca os 7 obrigatórios', `${vazio.n} destacados, status "${vazio.status}"`)
ok(vazio.foco === 'o-nome', 'o foco vai para o primeiro campo com erro', vazio.foco)

// preenche tudo
for (const [sel, v] of Object.entries(TEXTOS)) await s.digitar(sel, v)
await escolher('Evento de fim de ano')
await s.clicar('input[type=radio][value="Churrasco + decoração"]')
await s.clicar('.consentimento input[type=checkbox]')

// 2. um defeito por vez
for (const [sel, ruim, nome] of [
  ['#o-tel', '11812345678', 'celular com 11 dígitos sem o 9'],
  ['#o-email', 'joana@acme', 'e-mail sem domínio'],
  ['#o-data', '2020-01-10', 'data no passado'],
  ['#o-convidados', '0', 'zero convidado'],
]) {
  await s.digitar(sel, ruim)
  await enviar()
  ok((await abertos()).length === 0 && (await comErro(sel)), `${nome} é recusado no próprio campo`)
  await s.digitar(sel, TEXTOS[sel])
}

// Data pela metade: o navegador devolve valor vazio e só o badInput denuncia.
await s.digitar('#o-data', '')
await s.js(`document.querySelector('#o-data').focus()`)
for (const ch of ['1', '3']) {
  await s.cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, text: ch })
  await s.cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: ch })
}
const parcial = await s.js(`document.querySelector('#o-data').validity.badInput`)
await enviar()
ok(parcial && (await abertos()).length === 0 && (await comErro('#o-data')), 'data digitada pela metade é recusada no próprio campo')
await s.digitar('#o-data', TEXTOS['#o-data'])

// 3. sem consentimento
await s.clicar('.consentimento input[type=checkbox]')
await enviar()
ok((await abertos()).length === 0 && (await comErro('.consentimento input[type=checkbox]')), 'sem a caixa da política marcada nada sai')
await s.clicar('.consentimento input[type=checkbox]')

// 4. válido pelo WhatsApp
await s.js(`(()=>{const t=document.querySelector('#o-tel');t.focus();t.blur();return true})()`)
await dorme(150)
ok((await s.js(`document.querySelector('#o-tel').value`)) === '(11) 98888-7777', 'o telefone se formata ao sair do campo')
await enviar()
const [zap] = await abertos()
const texto = zap ? decodeURIComponent(zap.split('?text=')[1] || '') : ''
ok(/^https:\/\/wa\.me\/[^?]+\?text=/.test(zap || ''), 'preenchido abre o WhatsApp da Brasa Nobre', (zap || 'nada').slice(0, 40))
const [[alvoZap, recZap] = []] = await argumentos()
ok(alvoZap === '_blank' && /noopener/.test(recZap), 'o WhatsApp abre em nova aba com noopener', `${alvoZap} ${recZap}`)
ok(texto.startsWith('*Pedido de orçamento, site Brasa Nobre*'), 'a mensagem começa pelo título do pedido', texto.split('\n')[0])
for (const e of [
  'Nome: Joana Teste',
  'Empresa: Acme Ltda',
  'E-mail: joana@acme.com.br',
  'WhatsApp: (11) 98888-7777',
  'Tipo de evento: Evento de fim de ano',
  `Data prevista: ${br}`,
  'Convidados: 80',
  'Local do evento: Vila Olímpia, São Paulo',
  'Decoração e complementares: Churrasco + decoração',
  'Detalhes: Duas pessoas vegetarianas.',
]) ok(texto.includes(e), `contém "${e}"`)
ok(!/consentimento|Política/i.test(texto), 'o consentimento não vai no texto (é condição, não dado)')
ok(/ok/.test(await s.js(`document.querySelector('.form-status').className`)), 'o status confirma a abertura do WhatsApp')

// 5. e-mail
await s.clicar('form[data-orcamento] [data-enviar-email]')
await dorme(250)
const lista = await abertos()
const mail = lista[lista.length - 1] || ''
const q = new URLSearchParams(mail.split('?')[1] || '')
ok(/^mailto:[^?]+@[^?]+\?/.test(mail), 'o botão de e-mail abre o mailto da Brasa Nobre', mail.slice(0, 45))
const args = await argumentos()
ok(args[args.length - 1]?.[0] === '_self', 'o e-mail abre na própria aba', args[args.length - 1]?.[0])
ok(q.get('subject') === 'Orçamento de evento corporativo | Acme Ltda', 'o assunto leva a empresa', q.get('subject'))
ok((q.get('body') || '').includes('Tipo de evento: Evento de fim de ano') && !(q.get('body') || '').includes('*'), 'o corpo leva o pedido, sem asteriscos')

/* ---------- 6. cadastro de parceiro ---------- */
console.log('\n  CADASTRO DE PARCEIRO\n')
await s.ir(BASE + '/#/parceiro', 'form[data-parceiro]')
await interceptar()
const enviarCadastro = async () => {
  await s.clicar('form[data-parceiro] button[type=submit]')
  await dorme(250)
}
await enviarCadastro()
const vazioP = JSON.parse(await s.js(`JSON.stringify({n:document.querySelectorAll('form[data-parceiro] .v-input--error').length,status:document.querySelector('form[data-parceiro] .form-status').textContent})`))
ok((await abertos()).length === 0 && vazioP.n === 7 && /Confira/.test(vazioP.status), 'cadastro vazio não envia e destaca os 7 obrigatórios', `${vazioP.n} destacados, status "${vazioP.status}"`)
const CADASTRO = {
  '#p-nome': 'Rafa Teste',
  '#p-empresa': 'Som & Luz Eventos',
  '#p-tel': '11977776666',
  '#p-email': 'rafa@someluz.com.br',
  '#p-regiao': 'Zona Sul',
  '#p-portfolio': '@someluz',
  '#p-detalhes': 'Atendo eventos desde 2015.',
}
for (const [sel, v] of Object.entries(CADASTRO)) await s.digitar(sel, v)
await escolher('Som e iluminação')
await s.clicar('form[data-parceiro] .consentimento input[type=checkbox]')
await s.digitar('#p-tel', '1197777')
await enviarCadastro()
ok((await abertos()).length === 0 && (await comErro('#p-tel')), 'cadastro: WhatsApp incompleto é recusado no próprio campo')
await s.digitar('#p-tel', CADASTRO['#p-tel'])
await enviarCadastro()
const [zapP] = await abertos()
const textoP = zapP ? decodeURIComponent(zapP.split('?text=')[1] || '') : ''
ok(/^https:\/\/wa\.me\/[^?]+\?text=/.test(zapP || ''), 'cadastro preenchido abre o WhatsApp da Brasa Nobre', (zapP || 'nada').slice(0, 40))
ok(textoP.startsWith('*Cadastro de parceiro, site Brasa Nobre*'), 'a mensagem começa pelo título da parceria', textoP.split('\n')[0])
for (const e of [
  'Nome: Rafa Teste',
  'Empresa: Som & Luz Eventos',
  'WhatsApp: (11) 97777-6666',
  'E-mail: rafa@someluz.com.br',
  'Serviço: Som e iluminação',
  'Região que atende: Zona Sul',
  'Instagram ou site: @someluz',
  'Sobre o trabalho: Atendo eventos desde 2015.',
]) ok(textoP.includes(e), `cadastro contém "${e}"`)
await s.clicar('form[data-parceiro] [data-enviar-email]')
await dorme(250)
const listaP = await abertos()
const qP = new URLSearchParams((listaP[listaP.length - 1] || '').split('?')[1] || '')
ok(qP.get('subject') === 'Cadastro de parceiro | Som & Luz Eventos', 'o e-mail do cadastro leva a empresa no assunto', qP.get('subject'))

ok(s.errosSessao().length === 0, 'sem erro de console nos dois formulários', s.errosSessao()[0] || '')
await s.fechar()

if (process.env.FORCAR_FALHA) ok(false, 'falha forçada por FORCAR_FALHA')
console.log(falhas ? `\n  ${falhas} FALHA(S).\n` : '\n  Formulário ok.\n')
process.exitCode = falhas ? 1 : 0
