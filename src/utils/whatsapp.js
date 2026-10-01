import { empresa, mensagens } from '@/config/site'

/**
 * Título em negrito e uma linha por campo preenchido, ex.:
 * "*Pedido de orçamento*\nNome: Ana". Campo vazio fica de fora.
 */
export function montarMensagem(titulo, linhas = []) {
  const corpo = linhas
    .filter(([, valor]) => valor !== undefined && valor !== null && String(valor).trim() !== '')
    .map(([rotulo, valor]) => `${rotulo}: ${String(valor).trim()}`)
    .join('\n')
  return corpo ? `*${titulo}*\n${corpo}` : `*${titulo}*`
}

export const linkWhatsApp = (texto) => `https://wa.me/${empresa.whatsapp}?text=${encodeURIComponent(texto)}`

/** Link de "fale conosco" sem formulário (botões, menu, rodapé). */
export const linkWhatsAppSimples = (texto = mensagens.zapPadrao) => linkWhatsApp(texto)

/** O e-mail leva o mesmo texto, sem os asteriscos de negrito do WhatsApp. */
export const linkEmail = (assunto, texto = '') =>
  `mailto:${empresa.email}?subject=${encodeURIComponent(assunto)}` + (texto ? `&body=${encodeURIComponent(texto.replace(/\*/g, ''))}` : '')

/** Sem `noopener` a aba aberta recebe `window.opener` e pode redirecionar a nossa. */
export function abrirWhatsApp(url) {
  window.open(url, '_blank', 'noopener')
}

/** mailto na própria aba: abre o programa de e-mail sem deixar aba vazia para trás. */
export function abrirEmail(url) {
  window.open(url, '_self')
}
