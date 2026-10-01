<script setup>
import { paginas } from '@/config/site'
import { fotos } from '@/config/imagens'

/**
 * Abertura das páginas internas. O degradê do topo dá contraste ao cabeçalho
 * transparente sobre a foto (conferido em scripts/testar-contraste-hero.mjs).
 */
const props = defineProps({
  pagina: { type: String, required: true },
})
const p = paginas[props.pagina]
</script>

<template>
  <section class="pagina-cab" aria-labelledby="pagina-titulo">
    <div class="pagina-bg" data-fundo-medido aria-hidden="true" :style="{ backgroundImage: `url(${fotos[p.imagem]})` }"></div>
    <div class="container pagina-cab-conteudo">
      <p class="rotulo-secao">{{ p.selo }}</p>
      <h1 id="pagina-titulo">{{ p.titulo }}</h1>
      <p class="texto-lead">{{ p.texto }}</p>
      <div v-if="$slots.default" class="acoes"><slot /></div>
    </div>
  </section>
</template>

<style scoped>
/* Sobre a foto o botão de contorno ganha fundo próprio: a chama clara passa por trás. */
.btn-contorno {
  background: rgb(var(--c-fundo-rgb) / 0.5);
  backdrop-filter: blur(8px);
}
.btn-contorno:hover {
  background: rgb(var(--c-fundo-rgb) / 0.68);
}

.pagina-cab {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--c-fundo);
}
.pagina-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-position: center;
  background-size: cover;
}
.pagina-bg::after {
  position: absolute;
  inset: 0;
  content: '';
  background:
    linear-gradient(180deg, rgb(var(--c-fundo-rgb) / 0.62), rgb(var(--c-fundo-rgb) / 0.45) 110px, rgb(var(--c-fundo-rgb) / 0) 240px),
    linear-gradient(90deg, rgb(var(--c-fundo-rgb) / 0.94), rgb(var(--c-fundo-rgb) / 0.72) 50%, rgb(var(--c-fundo-rgb) / 0.4)),
    linear-gradient(0deg, var(--c-fundo), rgb(var(--c-fundo-rgb) / 0) 45%);
}

/* O cabeçalho fixo (faixa + menu, ~163px) fica por cima. */
.pagina-cab-conteudo {
  padding: 212px 0 96px;
}
h1 {
  max-width: 860px;
  font-size: clamp(48px, 6vw, 80px);
}
.texto-lead {
  max-width: 640px;
  margin-top: 22px;
}
.acoes {
  margin-top: 34px;
}

@media (max-width: 980px) {
  .pagina-cab-conteudo {
    padding: 160px 0 72px;
  }
}

@media (max-width: 620px) {
  .pagina-cab-conteudo {
    padding: 122px 0 44px;
  }
  h1 {
    font-size: clamp(38px, 11vw, 50px);
  }
  .texto-lead {
    margin-top: 16px;
  }
  /* Dois botões lado a lado: no Contato o formulário tem que aparecer na
     primeira tela do celular. */
  .acoes {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    margin-top: 24px;
  }
}
</style>
