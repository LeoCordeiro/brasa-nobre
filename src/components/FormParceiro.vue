<script setup>
import { ref } from 'vue'
import { mdiWhatsapp, mdiEmailOutline } from '@mdi/js'
import { opcoes, mensagens } from '@/config/site'
import { montarMensagem, linkWhatsApp, abrirWhatsApp, linkEmail, abrirEmail } from '@/utils/whatsapp'
import { cadastro } from '@/composables/cadastro'
import { obrigatorio, preencher, email, telefone, aceite, formatarTelefone } from '@/utils/validadores'

/**
 * Sem backend: o cadastro termina no WhatsApp ou no e-mail com os dados montados.
 * Os campos coletados estão descritos na política de privacidade (item 2).
 */
const formulario = ref(null)
const status = ref({ tipo: '', texto: '' })

async function validar() {
  const { valid } = await formulario.value.validate()
  if (!valid) {
    status.value = { tipo: 'erro', texto: 'Confira os campos destacados antes de enviar.' }
    requestAnimationFrame(() => document.querySelector('.form-parceiro .v-input--error input')?.focus())
    return null
  }
  return montarMensagem(mensagens.tituloParceria, [
    ['Nome', cadastro.nome],
    ['Empresa', cadastro.empresa],
    ['WhatsApp', formatarTelefone(cadastro.telefone)],
    ['E-mail', cadastro.email],
    ['Serviço', cadastro.servico],
    ['Região que atende', cadastro.regiao],
    ['Instagram ou site', cadastro.portfolio],
    ['Sobre o trabalho', cadastro.detalhes],
  ])
}

async function enviarWhatsApp() {
  const texto = await validar()
  if (!texto) return
  status.value = { tipo: 'ok', texto: 'Abrindo o WhatsApp com o cadastro pronto. É só enviar a mensagem.' }
  abrirWhatsApp(linkWhatsApp(texto))
}

async function enviarEmail() {
  const texto = await validar()
  if (!texto) return
  const assunto = `${mensagens.assuntoParceria} | ${cadastro.empresa.trim()}`
  status.value = { tipo: 'ok', texto: 'Abrindo o seu e-mail com o cadastro pronto. É só enviar.' }
  abrirEmail(linkEmail(assunto, texto))
}
</script>

<template>
  <v-form ref="formulario" class="form-painel form-parceiro" validate-on="invalid-input lazy" data-parceiro @submit.prevent="enviarWhatsApp">
    <div class="form-cab">
      <h2>Cadastro de parceiro</h2>
      <p>Campos com <b>*</b> são obrigatórios.</p>
    </div>
    <p class="form-aviso">
      Usamos estes dados só para avaliar o cadastro e falar com você sobre eventos em que o seu serviço possa entrar. O
      cadastro é uma apresentação: não garante convite nem cria vínculo de emprego, sociedade ou exclusividade, e é só
      para maiores de 18 anos. Ao enviar, o texto passa pelo WhatsApp (Meta) ou pelo seu e-mail; o site não guarda nada.
    </p>

    <div class="campos">
      <v-text-field id="p-nome" v-model="cadastro.nome" label="Seu nome *" required autocomplete="name" :rules="[obrigatorio('O nome')]" />
      <v-text-field id="p-empresa" v-model="cadastro.empresa" label="Empresa *" required placeholder="Ou o seu nome profissional" autocomplete="organization" :rules="[preencher('Informe a empresa ou o seu nome profissional')]" />
      <v-text-field
        id="p-tel"
        v-model="cadastro.telefone"
        label="WhatsApp *"
        required
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        placeholder="(11) 90000-0000"
        :rules="[obrigatorio('O WhatsApp'), telefone]"
        @blur="telefone(cadastro.telefone) === true && (cadastro.telefone = formatarTelefone(cadastro.telefone))"
      />
      <v-text-field id="p-email" v-model="cadastro.email" label="E-mail *" required type="email" autocomplete="email" inputmode="email" :rules="[obrigatorio('O e-mail'), email]" />
      <v-select id="p-servico" v-model="cadastro.servico" :items="opcoes.servicoParceiro" label="Serviço que oferece *" :rules="[obrigatorio('O serviço')]" />
      <v-text-field id="p-regiao" v-model="cadastro.regiao" label="Região que atende *" required placeholder="Zona Sul, toda a Grande São Paulo…" autocomplete="off" :rules="[obrigatorio('A região')]" />
      <v-text-field id="p-portfolio" v-model="cadastro.portfolio" label="Instagram ou site" placeholder="@seuperfil ou endereço do site" autocomplete="url" class="largo" />
      <v-textarea id="p-detalhes" v-model="cadastro.detalhes" label="Sobre o seu trabalho" rows="3" auto-grow placeholder="Tempo de atuação em eventos, tamanho da equipe e tipos de evento que atende." class="largo" />
    </div>

    <v-checkbox v-model="cadastro.consentimento" :rules="[aceite]" class="consentimento">
      <template #label>
        <span>Li a <RouterLink to="/privacidade">Política de privacidade</RouterLink> e os <RouterLink to="/termos">Termos de uso</RouterLink> e quero que a Brasa Nobre entre em contato sobre a parceria. <b>*</b></span>
      </template>
    </v-checkbox>

    <div class="form-acoes">
      <v-btn type="submit" class="btn-enviar" :prepend-icon="mdiWhatsapp">Enviar pelo WhatsApp</v-btn>
      <v-btn type="button" class="btn-email" variant="outlined" :prepend-icon="mdiEmailOutline" data-enviar-email @click="enviarEmail">Enviar por e-mail</v-btn>
    </div>
    <p class="form-status" :class="status.tipo" role="status" aria-live="polite">{{ status.texto }}</p>
  </v-form>
</template>
