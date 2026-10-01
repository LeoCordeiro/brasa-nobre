<script setup>
import HeroHome from '@/components/HeroHome.vue'
import ServicosResumo from '@/components/ServicosResumo.vue'
import SecaoDiferencial from '@/components/SecaoDiferencial.vue'
import SecaoEventos from '@/components/SecaoEventos.vue'
import ChamadaFinal from '@/components/ChamadaFinal.vue'

/** Home enxuta: o detalhe de cada assunto fica na página dele. */
</script>

<template>
  <HeroHome />
  <ServicosResumo />
  <SecaoDiferencial />
  <SecaoEventos :limite="3" />
  <ChamadaFinal />
</template>
