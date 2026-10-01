<script setup>
import { mdiArrowRight } from '@mdi/js'
import { cores, raios } from '@/config/tokens'

/** Guia interno: tokens e componentes em uso. Não aparece no menu. */
const amostras = Object.entries(cores).filter(([, v]) => v.startsWith('#'))
</script>

<template>
  <article class="doc">
    <div class="container">
      <p class="eyebrow">Uso interno</p>
      <h1>Guia de estilo</h1>
      <p class="intro">Tokens de config/tokens.js e os componentes-base. Direção em specs/design.md.</p>

      <h2>Cores</h2>
      <ul class="cores">
        <li v-for="[nome, valor] in amostras" :key="nome">
          <span :style="{ background: valor }"></span>{{ nome }} <code>{{ valor }}</code>
        </li>
      </ul>

      <h2>Raios</h2>
      <ul class="raios">
        <li v-for="(valor, nome) in raios" :key="nome"><span :style="{ borderRadius: valor }"></span>{{ nome }} <code>{{ valor }}</code></li>
      </ul>

      <h2>Componentes</h2>
      <div class="acoes">
        <a class="btn btn-ouro" href="#/style-guide">Botão dourado <v-icon :icon="mdiArrowRight" /></a>
        <a class="btn btn-contorno" href="#/style-guide">Botão contorno</a>
        <span class="selo">Selo em pílula</span>
      </div>
      <p class="rotulo-secao">Rótulo de seção</p>
      <p class="texto-lead">Texto de abertura de seção, em Inter 19px, tom suave, até 590px de largura.</p>
    </div>
  </article>
</template>

<style scoped>
.doc {
  padding: 240px 0 120px;
}
.intro {
  color: var(--c-suave);
}
h2 {
  margin: 56px 0 20px;
  font-size: 40px;
}
.cores,
.raios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  color: var(--c-suave);
  font-size: 13px;
  list-style: none;
}
.cores li,
.raios li {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-campo);
}
.cores span {
  height: 56px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: 10px;
}
.raios span {
  height: 56px;
  border: 2px solid var(--c-ouro);
}
code {
  color: var(--c-texto);
}
@media (max-width: 620px) {
  .doc {
    padding-top: 140px;
  }
}
</style>
