<script setup>
import { mdiWhatsapp } from '@mdi/js'
import { linkWhatsAppSimples } from '@/utils/whatsapp'

/** Só no desktop: no celular a barra de ações rápidas já tem o WhatsApp. */
</script>

<template>
  <a class="zap" :href="linkWhatsAppSimples()" target="_blank" rel="noopener" aria-label="Falar com a Brasa Nobre no WhatsApp">
    <v-icon :icon="mdiWhatsapp" size="26" />
  </a>
</template>

<style scoped>
.zap {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 20;
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  background: var(--c-ouro);
  box-shadow: var(--s-ouro);
  color: var(--on-ouro);
  transition: transform var(--t-micro) ease;
}
.zap:hover {
  transform: translateY(-3px) scale(1.04);
}

@media (max-width: 620px) {
  .zap {
    display: none;
  }
}
</style>
