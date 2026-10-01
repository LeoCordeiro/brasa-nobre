import { reactive } from 'vue'

/**
 * Fora do FormOrcamento porque o cartão de evento e as abas de serviço, em
 * outras seções, chegam ao formulário com a escolha feita.
 */
export const pedido = reactive({
  nome: '',
  empresa: '',
  email: '',
  telefone: '',
  tipo: null,
  data: '',
  convidados: '',
  local: '',
  complementos: null,
  detalhes: '',
  consentimento: false,
})

