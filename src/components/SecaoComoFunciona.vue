<script setup>
import { comoFunciona } from '@/config/site'
import { fotos, dimensoes } from '@/config/imagens'

const [principal, ...laterais] = comoFunciona.passos
</script>

<template>
  <section id="como-funciona" class="secao como">
    <div class="container">
      <div v-revela class="secao-cab">
        <div>
          <p class="rotulo-secao">{{ comoFunciona.selo }}</p>
          <h2>{{ comoFunciona.titulo }}</h2>
        </div>
      </div>

      <div class="grade">
        <RouterLink v-revela to="/contato" class="passo passo--principal">
          <img :src="fotos[principal.foto]" alt="" :width="dimensoes[principal.foto][0]" :height="dimensoes[principal.foto][1]" loading="lazy" decoding="async" />
          <span class="selo-passo">Passo {{ principal.n }} · {{ principal.rotulo }}</span>
          <strong>{{ principal.texto }}</strong>
        </RouterLink>

        <RouterLink
          v-for="(p, i) in laterais"
          :key="p.n"
          v-revela="(i + 1) * 100"
          to="/contato"
          class="passo passo--lateral"
        >
          <img :src="fotos[p.foto]" alt="" :width="dimensoes[p.foto][0]" :height="dimensoes[p.foto][1]" loading="lazy" decoding="async" />
          <span class="selo-passo">Passo {{ p.n }} · {{ p.rotulo }}</span>
          <strong>{{ p.texto }}</strong>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grade {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
}

.passo {
  display: grid;
  overflow: hidden;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-card);
  background: var(--c-superficie);
  color: var(--c-texto);
  transition:
    border-color var(--t-micro) ease,
    transform var(--t-micro) ease,
    opacity var(--t-entrada) ease var(--atraso, 0ms);
}
.passo:hover {
  border-color: var(--c-ouro);
  transform: translateY(-4px);
}

.selo-passo {
  justify-self: start;
  padding: 6px 12px;
  border: 1px solid rgb(var(--c-ouro-rgb) / 0.45);
  border-radius: var(--r-selo);
  color: var(--c-ouro);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.passo--principal {
  grid-row: span 2;
  align-content: start;
}
.passo--principal img {
  width: 100%;
  height: 360px;
  object-fit: cover;
}
.passo--principal .selo-passo {
  margin: 22px 24px 0;
}
.passo--principal strong {
  margin: 14px 24px 28px;
  font-family: var(--f-display);
  font-size: 42px;
  line-height: 1.02;
}

.passo--lateral {
  grid-template-columns: 220px 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 24px;
}
.passo--lateral img {
  grid-row: 1 / -1;
  width: 220px;
  height: 100%;
  min-height: 190px;
  object-fit: cover;
}
.passo--lateral .selo-passo {
  align-self: end;
  margin-right: 20px;
}
.passo--lateral strong {
  align-self: start;
  margin: 10px 20px 0 0;
  font-size: 20px;
  line-height: 1.25;
}

@media (max-width: 980px) {
  .grade {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .passo--principal {
    grid-row: auto;
  }
  .passo--lateral {
    grid-template-columns: 150px 1fr;
  }
  .passo--lateral img {
    width: 150px;
    min-height: 150px;
  }
}

@media (max-width: 620px) {
  .grade {
    gap: 16px;
  }
  .passo--principal img {
    height: 220px;
  }
  .passo--principal .selo-passo {
    margin: 16px 18px 0;
  }
  .passo--principal strong {
    margin: 12px 18px 22px;
    font-size: 30px;
  }
  .passo--lateral {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .passo--lateral img {
    grid-row: auto;
    width: 100%;
    height: 180px;
  }
  .passo--lateral .selo-passo {
    margin: 16px 18px 0;
  }
  .passo--lateral strong {
    margin: 10px 18px 22px;
  }
}
</style>
