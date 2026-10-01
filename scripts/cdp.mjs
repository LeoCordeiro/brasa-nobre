/**
 * Driver mínimo do Chrome via protocolo de depuração, sem dependência. Perfil
 * descartável por porta, para nunca reaproveitar cache de um asset já editado.
 */
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

export const CHROME =
  process.env.CHROME_BIN ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : process.platform === 'win32'
      ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      : 'google-chrome')

export const dorme = (ms) => new Promise((r) => setTimeout(r, ms))

/** Texto do erro, se o evento do CDP for um: log do navegador, console.error do app ou exceção. */
function textoDeErro(m) {
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') return m.params.entry.text
  if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'assert'))
    return m.params.args.map((a) => a.value ?? a.description ?? '').join(' ') || 'console.error'
  if (m.method === 'Runtime.exceptionThrown') return m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text
  return null
}

export async function sessao({ porta, largura = 1440, altura = 900, flags = [] }) {
  const perfil = await mkdtemp(path.join(tmpdir(), `brasanobre-cdp-${porta}-`))
  const proc = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${porta}`,
      `--user-data-dir=${perfil}`,
      `--window-size=${largura},${altura}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      ...flags,
    ],
    { stdio: 'ignore' },
  )
  let url
  for (let i = 0; i < 60 && !url; i++) {
    try {
      const abas = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json()
      url = abas.find((a) => a.type === 'page')?.webSocketDebuggerUrl
    } catch {
      /* ainda subindo */
    }
    if (!url) await dorme(150)
  }
  if (!url) throw new Error('Chrome nao abriu a porta de depuracao')
  const ws = new WebSocket(url)
  await new Promise((r) => (ws.onopen = r))
  let id = 0
  const pend = new Map()
  const eventos = []
  const errosDaSessao = []
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pend.has(m.id)) {
      pend.get(m.id)(m)
      pend.delete(m.id)
    } else if (m.method) {
      eventos.push(m)
      const erro = textoDeErro(m)
      if (erro) errosDaSessao.push(erro)
    }
  }
  const cdp = (method, params = {}) =>
    new Promise((res) => {
      const meu = ++id
      pend.set(meu, res)
      ws.send(JSON.stringify({ id: meu, method, params }))
    })
  const js = async (expr) => {
    const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'erro no JS da pagina')
    return r.result?.result?.value
  }
  await cdp('Page.enable')
  await cdp('Runtime.enable')
  await cdp('Log.enable')
  await cdp('Network.enable')
  await cdp('Emulation.setDeviceMetricsOverride', {
    width: largura,
    height: altura,
    deviceScaleFactor: 1,
    mobile: largura < 768,
  })
  /** Espera o seletor existir, em vez de dormir tempo fixo. */
  const esperarPor = async (seletor, ms = 15000) => {
    const ate = Date.now() + ms
    while (Date.now() < ate) {
      if (await js(`!!document.querySelector(${JSON.stringify(seletor)})`)) return true
      await dorme(100)
    }
    throw new Error(`esperei ${ms}ms e ${seletor} nao apareceu`)
  }
  const ir = async (url, pronto = 'main') => {
    eventos.length = 0
    await cdp('Page.navigate', { url })
    await esperarPor(pronto)
    await js('document.fonts ? document.fonts.ready.then(()=>true) : true')
    await dorme(250)
  }
  /** Clique real nas coordenadas do centro do elemento. */
  const clicar = async (sel, i = 0) => {
    const b = await js(`(()=>{const e=document.querySelectorAll(${JSON.stringify(sel)})[${i}];
      if(!e) return null; e.scrollIntoView({block:'center',behavior:'instant'});
      const r=e.getBoundingClientRect();
      return JSON.stringify({x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height})})()`)
    if (!b) throw new Error(`elemento nao encontrado: ${sel}[${i}]`)
    const { x, y } = JSON.parse(b)
    for (const type of ['mousePressed', 'mouseReleased']) {
      await cdp('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 })
    }
    await dorme(280)
    return JSON.parse(b)
  }
  const digitar = (sel, valor, i = 0) =>
    js(`(()=>{const e=document.querySelectorAll(${JSON.stringify(sel)})[${i}];
      e.value=${JSON.stringify(valor)};
      e.dispatchEvent(new Event('input',{bubbles:true}));
      e.dispatchEvent(new Event('change',{bubbles:true}));return true})()`)
  /** Erros desde a última navegação. */
  const errosConsole = () => eventos.map(textoDeErro).filter(Boolean)
  /** Erros da sessão inteira, de todas as páginas visitadas. */
  const errosSessao = () => [...errosDaSessao]
  /**
   * URLs pedidas desde a última navegação. Confere que nada vem de servidor de
   * terceiro, como afirma a política de privacidade.
   */
  const requisicoes = () =>
    eventos.filter((e) => e.method === 'Network.requestWillBeSent').map((e) => e.params.request.url)
  const fechar = async () => {
    ws.close()
    proc.kill()
    await dorme(200)
    await rm(perfil, { recursive: true, force: true }).catch(() => {})
  }
  return { cdp, js, ir, clicar, digitar, esperarPor, errosConsole, errosSessao, requisicoes, fechar }
}
