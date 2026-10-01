<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import BarraCelular from '@/components/BarraCelular.vue'
import BotaoWhatsapp from '@/components/BotaoWhatsapp.vue'
</script>

<template>
  <v-app>
    <AppHeader />

    <v-main>
      <!-- Sem <transition> entre rotas: em aba que não compõe frames o elemento
           trava em leave-from e a página fica em branco, sem erro. -->
      <div id="conteudo">
        <RouterView />
      </div>
    </v-main>

    <AppFooter />
    <BarraCelular />
    <BotaoWhatsapp />
  </v-app>
</template>

<style>
/* Sem scoped: precisa alcançar o .v-application que o Vuetify cria. */
.v-application {
  background: var(--c-fundo);
  color: var(--c-texto);
}
/* O cabeçalho é próprio e fica por cima do hero: o v-main não pode impor padding-top. */
.v-main {
  --v-layout-top: 0px;
  padding-top: 0 !important;
}
</style>
