<script setup>
import { mdiCheckCircle } from '@mdi/js'
import { parceiros } from '@/config/site'
import { fotos, dimensoes } from '@/config/imagens'

</script>

<template>
  <section id="parceiros" class="secao parceiros">
    <div class="container parceiros-layout">
      <figure v-revela class="parceiros-foto">
        <img :src="fotos.parceirosAmbiente" alt="Salão decorado para receber convidados" :width="dimensoes.parceirosAmbiente[0]" :height="dimensoes.parceirosAmbiente[1]" loading="lazy" />
        <figcaption>
          <strong>{{ parceiros.legenda.titulo }}</strong>
          <span>{{ parceiros.legenda.sub }}</span>
        </figcaption>
      </figure>

      <div v-revela="120">
        <p class="rotulo-secao">{{ parceiros.selo }}</p>
        <h2>{{ parceiros.titulo }}</h2>
        <p class="texto-lead">{{ parceiros.texto }}</p>
        <ul class="lista">
          <li v-for="item in parceiros.lista" :key="item"><v-icon :icon="mdiCheckCircle" size="18" />{{ item }}</li>
        </ul>
        <RouterLink to="/contato" class="btn btn-ouro">Pedir orçamento</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.parceiros {
  background: var(--c-superficie);
}

.parceiros-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 80px;
  align-items: center;
}

.parceiros-foto {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-painel);
}
.parceiros-foto img {
  width: 100%;
  height: 520px;
  object-fit: cover;
}
.parceiros-foto figcaption {
  position: absolute;
  right: 16px;
  bottom: 16px;
  left: 16px;
  display: grid;
  gap: 8px;
  padding: 18px 20px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: 18px;
  background: rgb(var(--c-fundo-rgb) / 0.6);
  backdrop-filter: blur(12px);
}
figcaption strong {
  color: var(--c-texto);
  font-size: 18px;
}
figcaption span {
  color: var(--c-suave);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lista {
  display: grid;
  gap: 14px;
  margin: 32px 0;
  padding: 0;
  color: var(--c-suave);
  list-style: none;
}
.lista li {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lista .v-icon {
  color: var(--c-ouro);
}

@media (max-width: 980px) {
  .parceiros-layout {
    grid-template-columns: 1fr;
    gap: 44px;
  }
  .parceiros-foto img {
    height: 430px;
  }
}

@media (max-width: 620px) {
  .parceiros-foto img {
    height: 300px;
  }
  .parceiros-foto figcaption {
    right: 12px;
    bottom: 12px;
    left: 12px;
    padding: 14px 16px;
  }
  .lista {
    gap: 12px;
    margin: 26px 0;
  }
}
</style>
