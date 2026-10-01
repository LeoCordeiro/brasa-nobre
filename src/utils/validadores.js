/**
 * Regras no formato que o `:rules` do Vuetify espera: `true` ou a mensagem de erro.
 * O telefone é validado pelos dígitos; a formatação fica para a saída.
 */
const digitos = (v) => String(v || '').replace(/\D/g, '')

/** Campo obrigatório com mensagem própria. */
export const preencher = (mensagem) => (v) => (v !== null && v !== undefined && String(v).trim() !== '') || mensagem

/** O gênero sai do artigo do rótulo: "A empresa é obrigatória", "Uma opção é obrigatória", "O nome é obrigatório". */
export const obrigatorio = (rotulo = 'Campo') => (v) => {
  const feminino = /^(A|As|Uma|Umas)\s/.test(rotulo)
  return preencher(`${rotulo} é obrigatóri${feminino ? 'a' : 'o'}`)(v)
}

export const email = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()) || 'Informe um e-mail válido'

/** Telefone brasileiro: 10 dígitos (fixo com DDD) ou 11 (celular com o 9). */
export const telefone = (v) => {
  const d = digitos(v)
  if (d.length < 10) return 'Informe DDD e número'
  if (d.length > 11) return 'Número longo demais'
  if (d.length === 11 && d[2] !== '9') return 'Celular com 11 dígitos começa com 9 após o DDD'
  return true
}

export const hojeISO = () => {
  const h = new Date()
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`
}

/** Data é opcional; se vier, não pode estar no passado. */
export const dataFutura = (v) => !v || v >= hojeISO() || 'A data não pode estar no passado'

/** Convidados é opcional; se vier, inteiro a partir de 1. */
export const convidados = (v) => v === '' || v === null || v === undefined || (/^\d+$/.test(String(v)) && Number(v) >= 1) || 'Use um número a partir de 1'

export const aceite = (v) => v === true || 'Marque para enviar'

export function formatarTelefone(v) {
  const d = digitos(v)
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return String(v || '')
}

export const dataBR = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
