<script setup>
/**
 * Coluna estreita: texto corrido com mais de ~70 caracteres por linha faz o
 * olho perder a volta.
 */
defineProps({
  titulo: { type: String, required: true },
})
</script>

<template>
  <article class="doc">
    <div class="container">
      <p class="eyebrow">Documento</p>
      <h1>{{ titulo }}</h1>
      <p class="doc-intro"><slot name="intro" /></p>
      <div class="prosa">
        <slot />
      </div>
    </div>
  </article>
</template>

<style scoped>
/* O cabeçalho é fixo e fica por cima: o documento começa abaixo dele. */
.doc {
  padding: 240px 0 120px;
}
h1 {
  max-width: 820px;
}
.doc-intro {
  max-width: 760px;
  margin: 28px 0 0;
  color: var(--c-suave);
  font-size: 19px;
  line-height: 1.65;
}

.prosa {
  max-width: 760px;
  overflow-wrap: anywhere;
  margin-top: 40px;
  padding: 48px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-painel);
  background: var(--c-superficie);
  color: var(--c-suave);
  font-size: 17px;
  line-height: 1.75;
}
.prosa :deep(h2) {
  margin: 48px 0 16px;
  color: var(--c-texto);
  font-size: 32px;
  font-variant-numeric: lining-nums;
  line-height: 1.1;
}
.prosa :deep(h2:first-child) {
  margin-top: 0;
}
.prosa :deep(h3) {
  margin: 28px 0 10px;
  color: var(--c-texto);
  font-size: 24px;
  line-height: 1.2;
}
.prosa :deep(p),
.prosa :deep(ul) {
  margin: 0 0 18px;
}
.prosa :deep(ul) {
  padding-left: 22px;
}
.prosa :deep(li) {
  margin-bottom: 8px;
}
.prosa :deep(li::marker) {
  color: var(--c-ouro);
}
.prosa :deep(strong) {
  color: var(--c-texto);
}
.prosa :deep(a) {
  color: var(--c-ouro);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 980px) {
  .doc {
    padding-top: 170px;
  }
}

@media (max-width: 620px) {
  .doc {
    padding: 140px 0 80px;
  }
  .doc-intro {
    font-size: 16px;
  }
  .prosa {
    padding: 26px 20px;
    font-size: 16px;
  }
  .prosa :deep(h2) {
    font-size: 28px;
  }
}
</style>
