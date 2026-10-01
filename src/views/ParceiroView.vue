<script setup>
import { mdiArrowDown } from '@mdi/js'
import CabecalhoPagina from '@/components/CabecalhoPagina.vue'
import SecaoParceria from '@/components/SecaoParceria.vue'
import FormParceiro from '@/components/FormParceiro.vue'

/** Seja um parceiro: para fornecedor de evento, não para quem contrata. */
</script>

<template>
  <CabecalhoPagina pagina="parceiro">
    <RouterLink :to="{ path: '/parceiro', hash: '#cadastro' }" class="btn btn-ouro">
      Cadastrar o meu serviço <v-icon :icon="mdiArrowDown" />
    </RouterLink>
  </CabecalhoPagina>
  <SecaoParceria />
  <section id="cadastro" class="cadastro">
    <div class="container cadastro-caixa">
      <FormParceiro />
    </div>
  </section>
</template>

<style scoped>
.cadastro {
  padding: 0 0 120px;
}
.cadastro-caixa {
  max-width: 820px;
}

@media (max-width: 980px) {
  .cadastro {
    padding-bottom: 82px;
  }
}

@media (max-width: 620px) {
  .cadastro {
    padding-bottom: 64px;
  }
}
</style>
