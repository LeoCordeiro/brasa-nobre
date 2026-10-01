import { reactive } from 'vue'

/**
 * Cadastro de parceiro. Fica fora do componente para o preenchimento não se
 * perder se a pessoa abrir a política de privacidade e voltar.
 */
export const cadastro = reactive({
  nome: '',
  empresa: '',
  telefone: '',
  email: '',
  servico: null,
  regiao: '',
  portfolio: '',
  detalhes: '',
  consentimento: false,
})
