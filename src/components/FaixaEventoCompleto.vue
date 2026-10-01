<script setup>
import { faixa } from '@/config/site'
</script>

<template>
  <section class="faixa" aria-labelledby="faixa-titulo">
    <div class="container faixa-layout">
      <div v-revela>
        <p class="eyebrow">{{ faixa.selo }}</p>
        <h2 id="faixa-titulo">{{ faixa.titulo }}</h2>
      </div>
      <div class="trilho" role="group" aria-label="O que a Brasa Nobre resolve">
        <div class="esteira">
          <div v-for="copia in 2" :key="copia" class="grupo" :aria-hidden="copia === 2 ? 'true' : undefined">
            <span v-for="item in faixa.itens" :key="item" class="tag">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faixa {
  padding: 78px 0;
  background: var(--c-marfim);
  color: var(--on-marfim);
}

.faixa-layout {
  display: grid;
  justify-items: center;
  gap: 28px;
  text-align: center;
}
.eyebrow {
  color: var(--c-ouro-tinta);
}
h2 {
  max-width: 760px;
  margin-inline: auto;
  font-size: clamp(36px, 4vw, 58px);
  text-wrap: balance;
}

.trilho {
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
}
.esteira {
  display: flex;
  width: max-content;
  animation: esteira 60s linear infinite;
}
.faixa:hover .esteira,
.faixa:focus-within .esteira {
  animation-play-state: paused;
}
.grupo {
  display: flex;
  gap: 12px;
  padding-right: 12px;
}

.tag {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  border: 1px solid var(--l-sobre-claro);
  border-radius: var(--r-selo);
  background: rgb(255 255 255 / 0.35);
  font-family: var(--f-display);
  font-size: 28px;
  font-weight: 700;
  white-space: nowrap;
}
.tag::before {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-ouro-escuro);
  content: '';
}

@keyframes esteira {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .trilho {
    overflow-x: auto;
    scrollbar-width: none;
  }
  .esteira {
    animation: none;
  }
}

@media (max-width: 620px) {
  .faixa {
    padding: 58px 0;
  }
  .tag {
    padding: 8px 18px;
    font-size: 23px;
  }
}
</style>
