// Estilos base: o autoImport só traz o CSS de cada componente e, sem eles, o
// v-select ganha uma caixa interna. A Roboto que vem junto o global.css desfaz.
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { cores, textoSobre } from '@/config/tokens'

/**
 * Sem `dark: true` o Vuetify pinta os campos com texto escuro sobre o fundo escuro.
 * As cores vêm todas de config/tokens.js.
 */
const brasa = {
  dark: true,
  colors: {
    primary: cores.ouro,
    'on-primary': textoSobre.ouro, // tinta sobre ouro, 8,9:1
    secondary: cores.marfim,
    'on-secondary': cores.tinta,
    background: cores.fundo,
    'on-background': cores.texto,
    surface: cores.superficie2,
    'on-surface': cores.texto,
    error: cores.erro,
    'on-error': cores.tinta,
    /**
     * Cor de foco e de rótulo ativo dos campos. Não é o primary: onze campos
     * com rótulo dourado competiriam com o botão de envio pela atenção.
     */
    campo: cores.texto,
    ouro: cores.ouro,
  },
}

export default createVuetify({
  theme: { defaultTheme: 'brasa', themes: { brasa } },
  // mdi-svg e não @mdi/font: ícone inexistente quebra o build em vez de sumir
  // calado, e não carrega uma fonte inteira para meia dúzia de glifos.
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  defaults: {
    // Sem `rounded` em lugar nenhum: a classe do Vuetify traz
    // border-radius !important e venceria o contrato de config/tokens.js.
    VBtn: { elevation: 0, height: 52 },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'campo' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'campo' },
    VTextarea: { variant: 'outlined', density: 'comfortable', color: 'campo' },
    VRadioGroup: { color: 'ouro' },
    VCheckbox: { color: 'ouro', density: 'comfortable' },
  },
})
