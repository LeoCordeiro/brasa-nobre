<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mdiArrowRight, mdiCheckCircleOutline } from '@mdi/js'
import { servicos } from '@/config/site'
import { fotos, dimensoes } from '@/config/imagens'

/**
 * Abas com um painel só, redesenhado a cada troca; setas, Home e End navegam.
 * A aba inicial pode vir da rota (?aba=decoracao).
 */
const route = useRoute()
const router = useRouter()
const abaDaRota = () => servicos.abas.find((a) => a.id === route.query.aba)?.id
const ativa = ref(abaDaRota() ?? servicos.abas[0].id)
watch(
  () => route.query.aba,
  () => (ativa.value = abaDaRota() ?? ativa.value),
)
const aba = computed(() => servicos.abas.find((a) => a.id === ativa.value))
// A aba aberta fica na URL: voltar do Contato reabre a mesma.
watch(ativa, (id) => route.query.aba !== id && router.replace({ query: { ...route.query, aba: id } }))
const abas = ref([])

function teclado(e, i) {
  const n = servicos.abas.length
  const alvo = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
  if (alvo === undefined) return
  e.preventDefault()
  ativa.value = servicos.abas[alvo].id
  abas.value[alvo]?.focus()
}
</script>

<template>
  <section id="servicos" class="secao servicos">
    <div class="container servicos-layout">
      <div v-revela class="servicos-copy">

        <div class="abas" role="tablist" aria-label="Frentes do serviço">
          <button
            v-for="(a, i) in servicos.abas"
            :id="`tab-${a.id}`"
            :key="a.id"
            ref="abas"
            class="aba"
            :class="{ 'aba--ativa': ativa === a.id }"
            type="button"
            role="tab"
            aria-controls="menu-panel"
            :aria-selected="ativa === a.id"
            :tabindex="ativa === a.id ? 0 : -1"
            @click="ativa = a.id"
            @keydown="teclado($event, i)"
          >
            {{ a.nome }}
          </button>
        </div>

        <div id="menu-panel" class="painel" role="tabpanel" :aria-labelledby="`tab-${ativa}`" aria-live="polite" tabindex="-1">
          <h2>{{ aba.nome }}</h2>
          <ul>
            <li v-for="p in aba.pontos" :key="p"><v-icon :icon="mdiCheckCircleOutline" size="20" />{{ p }}</li>
          </ul>
          <RouterLink
            :to="{ path: '/contato', query: { complemento: aba.complemento } }"
            class="text-link"
            :data-complemento="aba.complemento"
          >
            Pedir orçamento <v-icon :icon="mdiArrowRight" size="16" />
          </RouterLink>
        </div>
      </div>

      <div v-revela="120" class="galeria" aria-label="Fotos dos serviços">
        <figure v-for="(f, i) in aba.fotos" :key="i" class="galeria-item" :class="{ 'galeria-principal': i === 0 }">
          <img :src="fotos[f]" :alt="aba.legendas[i]" :width="dimensoes[f][0]" :height="dimensoes[f][1]" />
          <figcaption class="selo">{{ aba.legendas[i] }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.servicos-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 80px;
  align-items: start;
}

.abas {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 34px;
  padding: 6px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: 26px;
  background: var(--c-superficie);
}
.aba {
  min-height: 42px;
  padding: 0 20px;
  border: 0;
  border-radius: var(--r-botao);
  background: transparent;
  color: var(--c-suave);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background var(--t-micro) ease,
    color var(--t-micro) ease;
}
.aba:hover {
  color: var(--c-texto);
}
.aba--ativa,
.aba--ativa:hover {
  background: var(--c-ouro);
  color: var(--on-ouro);
}

.painel {
  min-height: 300px;
  color: var(--c-suave);
  animation: painel 320ms ease both;
}
.painel h2 {
  margin-bottom: 22px;
  color: var(--c-texto);
  font-size: 34px;
}
.painel ul {
  display: grid;
  gap: 16px;
  margin: 0 0 30px;
  padding: 0;
  list-style: none;
}
.painel li {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 12px;
  font-size: 17px;
  line-height: 1.5;
}
.painel li .v-icon {
  margin-top: 3px;
  color: var(--c-ouro);
}

.galeria {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 22px;
}
.galeria-item {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-card);
  background: var(--c-superficie);
}
.galeria-item img {
  width: 100%;
  height: 309px;
  object-fit: cover;
  transition: transform 600ms var(--t-suave);
}
.galeria-item:hover img {
  transform: scale(1.04);
}
.galeria-principal {
  grid-row: span 2;
}
.galeria-principal img {
  height: 640px;
}
.galeria-item figcaption {
  position: absolute;
  bottom: 14px;
  left: 14px;
}

@keyframes painel {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 980px) {
  /* minmax(0, …): em 1fr a coluna cresce até a largura mínima do conteúdo e o
     trilho de abas sem quebra alarga a página. */
  .servicos-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 44px;
  }
  .painel {
    min-height: 0;
  }
  .galeria {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .galeria-principal {
    grid-column: 1 / -1;
    grid-row: auto;
  }
  .galeria-principal img,
  .galeria-item img {
    height: 250px;
  }
}

@media (max-width: 620px) {
  /* No celular o trilho rola de lado em vez de quebrar a terceira aba numa
     segunda linha. */
  .abas {
    display: flex;
    max-width: 100%;
    flex-wrap: nowrap;
    margin: 0 0 24px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .abas::-webkit-scrollbar {
    display: none;
  }
  .aba {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0 16px;
    font-size: 11px;
  }
  .painel h2 {
    margin-bottom: 18px;
    font-size: 30px;
  }
  .painel li {
    font-size: 16px;
    line-height: 1.45;
  }
  .galeria {
    display: flex;
    gap: 12px;
    margin-right: -20px;
    padding-right: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }
  .galeria::-webkit-scrollbar {
    display: none;
  }
  .galeria-item {
    flex: 0 0 min(82vw, 310px);
    scroll-snap-align: start;
  }
  .galeria-principal img,
  .galeria-item img {
    height: 245px;
  }
}
</style>
