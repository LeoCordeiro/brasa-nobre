/**
 * Fonte única do visual: alimenta o tema do Vuetify e as CSS custom properties
 * (aplicarTokens). Hex dentro de um .vue é bug; `npm run paleta` mede o contraste.
 */

export const cores = {
  fundo: '#050200',
  fundoRgb: '5 2 0', // canais soltos, para véu: rgb(var(--c-fundo-rgb) / .72)
  superficie: '#0d0905',
  superficie2: '#160e07',
  brasa: '#3d1407', // faixa "Quem somos"
  marfim: '#f0e9db',

  texto: '#faf7f0',
  suave: '#c9bfad',
  suave2: '#8f8577',

  ouro: '#e3a457',
  ouroRgb: '227 164 87',
  ouroVivo: '#eba95b', // hover
  ouroEscuro: '#b26b2f', // brilho de brasa, marcadores
  ouroTinta: '#7d5218', // dourado legível sobre o marfim

  tinta: '#120d08', // texto sobre ouro e sobre marfim
  tintaSuave: '#564838', // texto corrido no marfim

  erro: '#ff9a85',
}

/** Cor de texto que sobrevive em cada fundo. Consultar aqui, não decidir na hora. */
export const textoSobre = {
  fundo: cores.texto,
  ouro: cores.tinta,
  marfim: cores.tinta,
  brasa: cores.texto,
}

/** Fio translúcido: borda de card, divisor. */
export const linhas = {
  sobreEscuro: 'rgba(240, 233, 219, 0.18)',
  sobreEscuroForte: 'rgba(240, 233, 219, 0.32)',
  sobreClaro: 'rgba(18, 13, 8, 0.16)',
}

/**
 * O raio vai no CSS, não na prop `rounded` do Vuetify: ela gera
 * `border-radius: Npx !important` e venceria estes valores.
 */
export const raios = {
  card: '22px',
  foto: '18px',
  painel: '28px',
  campo: '14px',
  botao: '999px',
  selo: '999px',
}

export const sombras = {
  card: '0 24px 60px -32px rgba(0, 0, 0, 0.75)',
  ouro: '0 14px 34px -14px rgb(227 164 87 / 0.55)',
  flutuante: '0 30px 70px -30px rgba(0, 0, 0, 0.55)',
}

export const medidas = {
  larguraConteudo: '1280px',
  alturaHeader: '76px',
  alturaBotao: '52px',
}

export const fontes = {
  display: '"Cormorant Garamond", Georgia, serif',
  corpo: 'Inter, Arial, sans-serif',
}

export const movimento = {
  suave: 'cubic-bezier(.22,.8,.2,1)',
  micro: '180ms',
  entrada: '620ms',
  hero: '700ms',
  revelaDesloc: '24px',
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-z])([0-9])/g, '$1-$2').toLowerCase()

/**
 * Injeta os tokens num <style> no início do <head>. Não usar style.setProperty():
 * inline vence até media query, e um token redefinido no celular seria ignorado.
 */
export function aplicarTokens(doc = document) {
  const par = []
  const add = (k, v) => par.push(`${k}:${v};`)
  Object.entries(cores).forEach(([k, v]) => add(`--c-${kebab(k)}`, v))
  Object.entries(textoSobre).forEach(([k, v]) => add(`--on-${kebab(k)}`, v))
  Object.entries(linhas).forEach(([k, v]) => add(`--l-${kebab(k)}`, v))
  Object.entries(raios).forEach(([k, v]) => add(`--r-${kebab(k)}`, v))
  Object.entries(sombras).forEach(([k, v]) => add(`--s-${kebab(k)}`, v))
  Object.entries(medidas).forEach(([k, v]) => add(`--m-${kebab(k)}`, v))
  Object.entries(fontes).forEach(([k, v]) => add(`--f-${kebab(k)}`, v))
  Object.entries(movimento).forEach(([k, v]) => add(`--t-${kebab(k)}`, v))

  const el = doc.getElementById('tokens') || doc.createElement('style')
  el.id = 'tokens'
  el.textContent = `:root{${par.join('')}}`
  if (!el.isConnected) doc.head.prepend(el)
}
