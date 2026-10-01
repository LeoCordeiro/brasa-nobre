<script setup>
import { mdiArrowRight } from '@mdi/js'
import { servicos } from '@/config/site'
import { fotos, dimensoes } from '@/config/imagens'
</script>

<template>
  <section id="servicos" class="secao servicos-resumo">
    <div class="container">
      <div v-revela class="secao-cab">
        <div>
          <p class="rotulo-secao">{{ servicos.selo }}</p>
          <h2>{{ servicos.titulo }}</h2>
          <p class="texto-lead">{{ servicos.texto }}</p>
        </div>
      </div>

      <div class="grade">
        <RouterLink
          v-for="(a, i) in servicos.abas"
          :key="a.id"
          v-revela="i * 90"
          :to="{ path: '/servicos', query: { aba: a.id } }"
          class="cartao"
          :data-servico="a.id"
        >
          <div class="cartao-foto">
            <img :src="fotos[a.fotos[0]]" alt="" :width="dimensoes[a.fotos[0]][0]" :height="dimensoes[a.fotos[0]][1]" loading="lazy" decoding="async" />
          </div>
          <div class="cartao-texto">
            <h3>{{ a.nome }}</h3>
            <p>{{ a.resumo }}</p>
            <em>{{ a.cta }} <v-icon :icon="mdiArrowRight" size="15" /></em>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grade {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.cartao {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-card);
  background: var(--c-superficie);
  color: var(--c-texto);
  transition:
    border-color var(--t-micro) ease,
    transform var(--t-micro) ease,
    box-shadow var(--t-micro) ease,
    opacity var(--t-entrada) ease var(--atraso, 0ms);
}
.cartao:hover,
.cartao:focus-visible {
  border-color: var(--c-ouro);
  box-shadow: var(--s-ouro);
  transform: translateY(-5px);
}

.cartao-foto {
  overflow: hidden;
}
.cartao-foto img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  transition: transform 500ms var(--t-suave);
}
.cartao:hover .cartao-foto img {
  transform: scale(1.045);
}

.cartao-texto {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 24px 22px;
}
h3 {
  font-size: 30px;
}
p {
  margin: 10px 0 0;
  color: var(--c-suave);
  font-size: 15px;
  line-height: 1.55;
}
em {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 20px;
  color: var(--c-ouro);
  font-size: 11px;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
em .v-icon {
  transition: transform var(--t-micro) var(--t-suave);
}
.cartao:hover em .v-icon {
  transform: translateX(4px);
}

@media (max-width: 980px) {
  .cartao-foto img {
    height: 200px;
  }
  .cartao-texto {
    padding: 20px 18px 18px;
  }
  h3 {
    font-size: 26px;
  }
}

@media (max-width: 620px) {
  .grade {
    display: flex;
    gap: 14px;
    margin-right: -20px;
    padding: 2px 20px 10px 0;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-snap-type: x mandatory;
    scrollbar-width: thin;
  }
  .cartao {
    flex: 0 0 calc(100% - 62px);
    scroll-snap-align: start;
  }
  .cartao:hover {
    transform: none;
  }
  .cartao-foto img {
    height: 188px;
  }
}
</style>
