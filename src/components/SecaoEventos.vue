<script setup>
import { computed } from 'vue'
import { mdiArrowRight, mdiFire, mdiStarFourPointsOutline, mdiCheckCircleOutline } from '@mdi/js'
import { eventos } from '@/config/site'
import { fotos, dimensoes } from '@/config/imagens'

/**
 * Cada cartão leva ao Contato com o tipo de evento já escolhido. Na home entra
 * só o começo da lista (limite); em /eventos o título vem do cabeçalho da página.
 */
const props = defineProps({
  limite: { type: Number, default: 0 },
  semCabecalho: Boolean,
})
const itens = computed(() => (props.limite ? eventos.itens.slice(0, props.limite) : eventos.itens))
const icones = { churrasco: mdiFire, decoracao: mdiStarFourPointsOutline, apoio: mdiCheckCircleOutline }
</script>

<template>
  <section id="eventos" class="secao eventos">
    <div class="container">
      <div v-if="!semCabecalho" v-revela class="secao-cab">
        <div>
          <p class="rotulo-secao">{{ eventos.selo }}</p>
          <h2>{{ eventos.titulo }}</h2>
          <p class="texto-lead">{{ eventos.texto }}</p>
        </div>
        <RouterLink v-if="limite" to="/eventos" class="text-link ver-todos">
          Ver todos os formatos <v-icon :icon="mdiArrowRight" size="16" />
        </RouterLink>
      </div>

      <div class="grade">
        <RouterLink
          v-for="(item, i) in itens"
          :key="item.id"
          v-revela="(i % 3) * 90"
          :to="{ path: '/contato', query: { tipo: item.tipo } }"
          class="cartao"
          :data-evento="item.tipo"
          :aria-label="`Pedir orçamento para ${item.nome.toLowerCase()}`"
        >
          <div class="cartao-foto">
            <img :src="fotos[item.foto]" alt="" :width="dimensoes[item.foto][0]" :height="dimensoes[item.foto][1]" loading="lazy" decoding="async" />
          </div>
          <div class="cartao-texto">
            <strong>{{ item.nome }}</strong>
            <span>{{ item.tag }}</span>
          </div>
          <ul class="inclui" aria-label="Inclui churrasco, decoração e apoio">
            <li v-for="s in eventos.inclui" :key="s.id"><v-icon :icon="icones[s.id]" size="15" />{{ s.nome }}</li>
          </ul>
          <em>Pedir orçamento <v-icon :icon="mdiArrowRight" size="15" /></em>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ver-todos {
  flex-shrink: 0;
}

.grade {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.cartao {
  display: flex;
  min-height: 392px;
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
  height: 208px;
  object-fit: cover;
  transition: transform 500ms var(--t-suave);
}
.cartao:hover .cartao-foto img {
  transform: scale(1.045);
}

.cartao-texto {
  padding: 20px 20px 0;
}
.cartao-texto strong {
  display: block;
  font-size: 19px;
}
.cartao-texto span {
  display: block;
  margin-top: 7px;
  color: var(--c-suave);
  font-size: 13px;
  line-height: 1.45;
}

.inclui {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 20px 0;
  padding: 0;
  list-style: none;
}
.inclui li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-selo);
  color: var(--c-suave);
  font-size: 11px;
  font-weight: 700;
}
.inclui .v-icon {
  color: var(--c-ouro);
}

em {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: auto 20px 20px;
  padding-top: 18px;
  color: var(--c-ouro);
  font-size: 10px;
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
  .grade {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
    min-height: 352px;
    scroll-snap-align: start;
  }
  .cartao:hover {
    transform: none;
  }
  .cartao-foto img {
    height: 188px;
  }
  .cartao-texto {
    padding: 17px 16px 0;
  }
  .inclui {
    margin: 12px 16px 0;
  }
  em {
    margin: auto 16px 18px;
  }
}
</style>
