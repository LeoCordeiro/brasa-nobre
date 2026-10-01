<script setup>
import { mdiArrowRight } from '@mdi/js'
import { hero } from '@/config/site'
import { videoHero } from '@/config/imagens'

</script>

<template>
  <section id="inicio" class="hero" aria-labelledby="hero-titulo">
    <div class="hero-bg" :class="{ 'hero-bg--foto': !videoHero.mp4 }" data-fundo-medido aria-hidden="true" :style="{ backgroundImage: `url(${videoHero.poster})` }">
      <video v-if="videoHero.mp4" class="hero-video" autoplay loop muted playsinline preload="metadata" :poster="videoHero.poster">
        <source :src="videoHero.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="container hero-conteudo">
      <div class="hero-copy">
        <p class="hero-selo"><span class="ponto" aria-hidden="true"></span>{{ hero.selo }}</p>
        <h1 id="hero-titulo">{{ hero.titulo }}</h1>
        <p class="hero-texto">{{ hero.texto }}</p>
        <div class="acoes">
          <RouterLink to="/contato" class="btn btn-ouro">
            Pedir orçamento <v-icon :icon="mdiArrowRight" />
          </RouterLink>
          <RouterLink to="/eventos" class="btn btn-contorno">
            Planeje seu evento
          </RouterLink>
        </div>
      </div>
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

.hero {
  position: relative;
  isolation: isolate;
  min-height: 900px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background-position: center;
  background-size: cover;
}
.hero-bg::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: '';
  /* O primeiro degradê dá contraste ao cabeçalho transparente sobre o vídeo. */
  background:
    linear-gradient(180deg, rgb(var(--c-fundo-rgb) / 0.62), rgb(var(--c-fundo-rgb) / 0.45) 110px, rgb(var(--c-fundo-rgb) / 0) 240px),
    linear-gradient(90deg, rgb(var(--c-fundo-rgb) / 0.94), rgb(var(--c-fundo-rgb) / 0.55) 48%, rgb(var(--c-fundo-rgb) / 0.25)),
    linear-gradient(0deg, var(--c-fundo), rgb(var(--c-fundo-rgb) / 0) 28%);
  pointer-events: none;
}
.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* Sem vídeo, a foto aproxima devagar. */
@media (prefers-reduced-motion: no-preference) {
  .hero-bg--foto {
    animation: hero-zoom 24s ease-in-out infinite alternate;
  }
}
@keyframes hero-zoom {
  to {
    transform: scale(1.08);
  }
}

/* O cabeçalho fixo (faixa + menu, ~163px) fica por cima; o texto centraliza no
   espaço abaixo dele. */
.hero-conteudo {
  display: flex;
  min-height: 900px;
  align-items: center;
  /* 150 embaixo: o cartão de números sobe 72px por cima do hero e precisa de
     respiro até a última linha do texto. */
  padding: 163px 0 150px;
}

.hero-copy {
  width: min(660px, 100%);
  animation: chegada var(--t-hero) 130ms both var(--t-suave);
}

.hero-selo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 24px;
  padding: 9px 16px;
  border: 1px solid var(--l-sobre-escuro-forte);
  border-radius: var(--r-selo);
  background: rgb(var(--c-fundo-rgb) / 0.45);
  color: var(--c-ouro);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}
.ponto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-ouro);
  box-shadow: 0 0 0 0 rgb(var(--c-ouro-rgb) / 0.6);
  animation: brasa 2.4s ease-out infinite;
}

h1 {
  max-width: 760px;
}

.hero-texto {
  max-width: 580px;
  margin: 32px 0 0;
  color: var(--c-suave);
  font-size: 19px;
  line-height: 1.65;
}

.acoes .btn {
  animation: chegada 560ms 380ms both var(--t-suave);
}

@keyframes chegada {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes brasa {
  70% {
    box-shadow: 0 0 0 10px rgb(var(--c-ouro-rgb) / 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(var(--c-ouro-rgb) / 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-video {
    display: none;
  }
  .hero-copy,
  .acoes .btn,
  .ponto {
    animation: none;
  }
}

@media (max-width: 980px) {
  .hero,
  .hero-conteudo {
    min-height: 720px;
  }
  .hero-conteudo {
    align-items: flex-start;
    padding: 172px 0 88px;
  }
  .hero-texto {
    font-size: 17px;
  }
}

@media (max-width: 620px) {
  .hero,
  .hero-conteudo {
    min-height: min(780px, 100svh);
  }
  .hero-conteudo {
    padding: calc(84px + clamp(40px, 8vh, 80px)) 0 72px;
  }
  .hero-selo {
    margin-bottom: 16px;
    font-size: 10px;
  }
  h1 {
    max-width: 330px;
    font-size: clamp(52px, 15vw, 68px);
    line-height: 0.92;
  }
  .hero-texto {
    margin-top: 22px;
    font-size: 16px;
    line-height: 1.58;
  }
}
</style>
