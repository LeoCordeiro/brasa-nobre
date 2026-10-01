<script setup>
import { mdiWhatsapp, mdiEmailOutline } from '@mdi/js'
import { empresa, mensagens } from '@/config/site'
import { linkWhatsAppSimples, linkEmail } from '@/utils/whatsapp'
import CabecalhoPagina from '@/components/CabecalhoPagina.vue'
import FormOrcamento from '@/components/FormOrcamento.vue'

/**
 * O formulário tem que aparecer na primeira tela do celular: por isso o
 * cabeçalho é curto e os dois botões ficam lado a lado; o Instagram vem depois.
 */
</script>

<template>
  <CabecalhoPagina pagina="contato">
    <a class="btn btn-contorno" :href="linkWhatsAppSimples()" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><v-icon :icon="mdiWhatsapp" />WhatsApp</a>
    <a class="btn btn-contorno" :href="linkEmail(mensagens.assuntoEmail)" aria-label="Escrever por e-mail"><v-icon :icon="mdiEmailOutline" />E-mail</a>
  </CabecalhoPagina>
  <section class="orcamento">
    <div class="container orcamento-caixa">
      <FormOrcamento />
      <p class="instagram">
        Também no Instagram: <a :href="empresa.instagramUrl" target="_blank" rel="noopener">@{{ empresa.instagram }}</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.orcamento {
  padding: 0 0 120px;
}
.orcamento-caixa {
  max-width: 820px;
}
.instagram {
  margin: 24px 0 0;
  color: var(--c-suave);
  font-size: 15px;
  text-align: center;
}
.instagram a {
  color: var(--c-ouro);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 980px) {
  .orcamento {
    padding-bottom: 82px;
  }
}

@media (max-width: 620px) {
  .orcamento {
    padding-bottom: 64px;
  }
}
</style>
