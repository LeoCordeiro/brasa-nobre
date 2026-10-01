<script setup>
import CabecalhoPagina from '@/components/CabecalhoPagina.vue'
import SecaoSobre from '@/components/SecaoSobre.vue'
import SecaoParceiros from '@/components/SecaoParceiros.vue'
import ChamadaFinal from '@/components/ChamadaFinal.vue'

/** Quem é a Brasa Nobre, como trabalha com parceiros, e o convite a fornecedor. */
</script>

<template>
  <CabecalhoPagina pagina="sobre" />
  <SecaoSobre />
  <SecaoParceiros />
  <ChamadaFinal tipo="parceiro" />
</template>
