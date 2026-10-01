<script setup>
import CabecalhoPagina from '@/components/CabecalhoPagina.vue'
import SecaoEventos from '@/components/SecaoEventos.vue'
import FaixaEventoCompleto from '@/components/FaixaEventoCompleto.vue'
import ChamadaFinal from '@/components/ChamadaFinal.vue'
</script>

<template>
  <CabecalhoPagina pagina="eventos" />
  <SecaoEventos sem-cabecalho />
  <FaixaEventoCompleto />
  <ChamadaFinal />
</template>
