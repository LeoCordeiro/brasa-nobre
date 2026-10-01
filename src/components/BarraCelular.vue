<script setup>
import { mdiCalendarStarOutline, mdiWhatsapp, mdiFileDocumentEditOutline } from '@mdi/js'
import { linkWhatsAppSimples } from '@/utils/whatsapp'

</script>

<template>
  <nav aria-label="Ações rápidas" class="mobile-sticky">
    <RouterLink to="/eventos">
      <v-icon :icon="mdiCalendarStarOutline" size="20" /><span>Eventos</span>
    </RouterLink>
    <a :href="linkWhatsAppSimples()" target="_blank" rel="noopener">
      <v-icon :icon="mdiWhatsapp" size="20" /><span>WhatsApp</span>
    </a>
    <RouterLink to="/contato">
      <v-icon :icon="mdiFileDocumentEditOutline" size="20" /><span>Orçamento</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mobile-sticky {
  display: none;
}

@media (max-width: 620px) {
  .mobile-sticky {
    position: fixed;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: 12px;
    z-index: 20;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: hidden;
    border: 1px solid var(--l-sobre-escuro);
    border-radius: 24px;
    background: rgb(var(--c-fundo-rgb) / 0.9);
    box-shadow: var(--s-flutuante);
    backdrop-filter: blur(16px);
  }
  .mobile-sticky a {
    display: grid;
    min-height: 66px;
    align-content: center;
    justify-items: center;
    gap: 6px;
    color: var(--c-suave);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.06em;
    line-height: 1;
    text-transform: uppercase;
  }
  .mobile-sticky a:nth-child(2) {
    background: var(--c-ouro);
    color: var(--on-ouro);
  }
  /* Espaço para a barra não cobrir o fim da página. */
  :global(body) {
    padding-bottom: 96px;
  }
}
</style>
