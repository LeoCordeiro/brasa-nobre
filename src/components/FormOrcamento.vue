<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { mdiWhatsapp, mdiEmailOutline } from '@mdi/js'
import { opcoes, mensagens } from '@/config/site'
import { pedido } from '@/composables/pedido'
import { montarMensagem, linkWhatsApp, abrirWhatsApp, linkEmail, abrirEmail } from '@/utils/whatsapp'
import { obrigatorio, email, telefone, dataFutura, convidados, aceite, formatarTelefone, dataBR, hojeISO } from '@/utils/validadores'

/**
 * Sem backend: o pedido termina no WhatsApp ou no e-mail com a mensagem montada.
 * O estado fica em composables/pedido.js; cartões e abas mandam a escolha pela URL.
 */
const formulario = ref(null)
const route = useRoute()
watch(
  () => [route.query.tipo, route.query.complemento],
  ([tipo, complemento]) => {
    if (opcoes.tipoEvento.includes(tipo)) pedido.tipo = tipo
    if (opcoes.complementos.some((c) => c.valor === complemento)) pedido.complementos = complemento
  },
  { immediate: true },
)
const status = ref({ tipo: '', texto: '' })
const dataIncompleta = ref(false)
// Renovado a cada foco: com a aba aberta na virada do dia, o calendário
// deixaria escolher "ontem" e a validação (que recalcula) recusaria.
const hoje = ref(hojeISO())

/**
 * Data digitada pela metade vem vazia do navegador; só o validity.badInput
 * denuncia. Sem isso, "13/__/____" passaria como "sem data".
 */
function conferirData(e) {
  dataIncompleta.value = Boolean(e?.target?.validity?.badInput)
}

async function validar() {
  conferirData({ target: document.getElementById('o-data') })
  const { valid } = await formulario.value.validate()
  if (!valid || dataIncompleta.value) {
    status.value = { tipo: 'erro', texto: 'Confira os campos destacados antes de enviar.' }
    requestAnimationFrame(() => document.querySelector('.form-orcamento .v-input--error input')?.focus())
    return null
  }
  return montarMensagem(mensagens.tituloPedido, [
    ['Nome', pedido.nome],
    ['Empresa', pedido.empresa],
    ['E-mail', pedido.email],
    ['WhatsApp', formatarTelefone(pedido.telefone)],
    ['Tipo de evento', pedido.tipo],
    ['Data prevista', dataBR(pedido.data)],
    ['Convidados', pedido.convidados],
    ['Local do evento', pedido.local],
    ['Decoração e complementares', pedido.complementos],
    ['Detalhes', pedido.detalhes],
  ])
}

async function enviarWhatsApp() {
  const texto = await validar()
  if (!texto) return
  status.value = { tipo: 'ok', texto: 'Abrindo o WhatsApp com o pedido pronto. É só enviar a mensagem.' }
  abrirWhatsApp(linkWhatsApp(texto))
}

async function enviarEmail() {
  const texto = await validar()
  if (!texto) return
  const assunto = pedido.empresa.trim() ? `${mensagens.assuntoEmail} | ${pedido.empresa.trim()}` : mensagens.assuntoEmail
  status.value = { tipo: 'ok', texto: 'Abrindo o seu e-mail com o pedido pronto. É só enviar.' }
  abrirEmail(linkEmail(assunto, texto))
}
</script>

<template>
  <!-- invalid-input lazy: sem erro ao abrir; valida ao sair do campo ou ao enviar
       e, depois de errado, revalida a cada tecla. -->
  <v-form ref="formulario" class="form-painel form-orcamento" validate-on="invalid-input lazy" data-orcamento @submit.prevent="enviarWhatsApp">
    <div class="form-cab">
      <h2>Pedido de orçamento</h2>
      <p>Campos com <b>*</b> são obrigatórios.</p>
    </div>

    <div class="campos">
      <v-text-field id="o-nome" v-model="pedido.nome" label="Seu nome *" required autocomplete="name" :rules="[obrigatorio('O nome')]" />
      <v-text-field id="o-empresa" v-model="pedido.empresa" label="Empresa *" required autocomplete="organization" :rules="[obrigatorio('A empresa')]" />
      <v-text-field id="o-email" v-model="pedido.email" label="E-mail corporativo *" required type="email" autocomplete="email" inputmode="email" :rules="[obrigatorio('O e-mail'), email]" />
      <!-- Sem máscara no v-model: ela reescreve o valor a cada tecla e o v-form
           revalida o valor intermediário. Formata no blur e na mensagem. -->
      <v-text-field
        id="o-tel"
        v-model="pedido.telefone"
        label="WhatsApp *"
        required
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        placeholder="(11) 90000-0000"
        :rules="[obrigatorio('O WhatsApp'), telefone]"
        @blur="telefone(pedido.telefone) === true && (pedido.telefone = formatarTelefone(pedido.telefone))"
      />
      <v-select id="o-tipo" v-model="pedido.tipo" :items="opcoes.tipoEvento" label="Tipo de evento *" :rules="[obrigatorio('O tipo de evento')]" class="largo" />
      <v-text-field
        id="o-data"
        v-model="pedido.data"
        label="Data prevista"
        type="date"
        :min="hoje"
        :rules="[dataFutura]"
        :error-messages="dataIncompleta ? ['Complete a data ou apague'] : []"
        @blur="conferirData"
        @update:focused="hoje = hojeISO()"
        @update:model-value="dataIncompleta = false"
      />
      <v-text-field id="o-convidados" v-model="pedido.convidados" label="Nº de convidados" type="number" min="1" step="1" inputmode="numeric" placeholder="Aproximado" :rules="[convidados]" />
      <v-text-field id="o-local" v-model="pedido.local" label="Local do evento" placeholder="Bairro e cidade" autocomplete="off" class="largo" />

      <v-radio-group v-model="pedido.complementos" :rules="[obrigatorio('Uma opção')]" class="largo grupo" label="Precisa de decoração ou outros serviços? *">
        <v-radio v-for="o in opcoes.complementos" :key="o.valor" :label="o.rotulo" :value="o.valor" />
      </v-radio-group>

      <v-textarea id="o-detalhes" v-model="pedido.detalhes" label="Detalhes do evento" rows="3" auto-grow placeholder="Horário, restrições alimentares, serviços de que o evento precisa." hint="Restrição alimentar por saúde ou crença: informe só o necessário para o cardápio." persistent-hint class="largo" />
    </div>

    <v-checkbox v-model="pedido.consentimento" :rules="[aceite]" class="consentimento">
      <template #label>
        <span>Li a <RouterLink to="/privacidade">Política de privacidade</RouterLink> e autorizo o contato para este orçamento. <b>*</b></span>
      </template>
    </v-checkbox>

    <div class="form-acoes">
      <v-btn type="submit" class="btn-enviar" :prepend-icon="mdiWhatsapp">Enviar pelo WhatsApp</v-btn>
      <v-btn type="button" class="btn-email" variant="outlined" :prepend-icon="mdiEmailOutline" data-enviar-email @click="enviarEmail">Enviar por e-mail</v-btn>
    </div>
    <p class="form-status" :class="status.tipo" role="status" aria-live="polite">{{ status.texto }}</p>
  </v-form>
</template>

<style scoped>
/* O resto do formulário vem de .form-painel em styles/global.css. */
.grupo :deep(.v-selection-control-group) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
/* O Vuetify dá `grid-area: control` a todo .v-selection-control: dentro desta
   grade os quatro rádios cairiam na mesma área, um por cima do outro. */
.grupo :deep(.v-radio) {
  grid-area: auto;
  min-height: 52px;
  padding-right: 12px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-campo);
  transition: border-color var(--t-micro) ease;
}
.grupo :deep(.v-radio:has(input:checked)) {
  border-color: var(--c-ouro);
  background: rgb(var(--c-ouro-rgb) / 0.08);
}
.grupo :deep(.v-label) {
  color: var(--c-texto);
  opacity: 1;
}
/* O .v-label do Vuetify é nowrap + overflow hidden: no celular a pergunta seria cortada. */
.grupo :deep(> .v-input__control > .v-label) {
  margin-bottom: 10px;
  white-space: normal;
  line-height: 1.45;
  color: var(--c-suave);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 620px) {
  .grupo :deep(.v-selection-control-group) {
    grid-template-columns: 1fr;
  }
}
</style>
