<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { numeros } from '@/config/site'
import { semMovimento } from '@/composables/rolagem'

/**
 * O contador só anima quando a faixa aparece e a pessoa já rolou, para não
 * disparar no carregamento.
 */
const faixa = ref(null)
const mostrado = ref(numeros.map((n) => n.valor))
let observador
// O `once` só desarma o listener de rolagem quando ele dispara; saindo da home
// antes de rolar, ele ficaria preso na window.
const ouvintes = new AbortController()

function contar() {
  const inicio = performance.now()
  const duracao = 2400
  const passo = (agora) => {
    const p = Math.min((agora - inicio) / duracao, 1)
    const suave = 1 - Math.pow(1 - p, 4)
    mostrado.value = numeros.map((n) => Math.round(n.valor * suave))
    if (p < 1) requestAnimationFrame(passo)
  }
  requestAnimationFrame(passo)
}

onMounted(() => {
  if (semMovimento() || !('IntersectionObserver' in window)) return
  let visivel = false
  let rolou = false
  let feito = false
  const tentar = () => {
    if (feito || !visivel || !rolou) return
    feito = true
    mostrado.value = numeros.map(() => 0)
    contar()
    observador.disconnect()
  }
  observador = new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting
    tentar()
  }, { threshold: 0.65 })
  observador.observe(faixa.value)
  window.addEventListener('scroll', () => ((rolou = true), tentar()), { passive: true, once: true, signal: ouvintes.signal })
})
onBeforeUnmount(() => {
  observador?.disconnect()
  ouvintes.abort()
})
</script>

<template>
  <section class="numeros" aria-label="Destaques">
    <div class="container">
      <div ref="faixa" class="numeros-card">
        <article v-for="(n, i) in numeros" :key="n.rotulo">
          <strong>{{ mostrado[i] }}{{ n.sufixo || '' }}</strong>
          <span>{{ n.rotulo }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.numeros {
  position: relative;
  z-index: 2;
  margin-top: -72px;
}

.numeros-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
  border-radius: var(--r-painel);
  background: var(--c-marfim);
  box-shadow: var(--s-flutuante);
  color: var(--on-marfim);
}

article {
  display: grid;
  align-content: center;
  justify-items: center;
  min-height: 154px;
  padding: 24px 30px;
  border-right: 1px solid var(--l-sobre-claro);
  text-align: center;
}
article:last-child {
  border-right: 0;
}

strong {
  display: block;
  font-family: var(--f-display);
  font-size: 56px;
  font-variant-numeric: lining-nums; /* a Cormorant desenha "1" como "I" */
  line-height: 0.9;
}

span {
  display: block;
  margin-top: 12px;
  color: var(--c-tinta-suave);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 980px) {
  .numeros-card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  article {
    min-height: 128px;
    padding: 28px 18px;
    border-bottom: 1px solid var(--l-sobre-claro);
  }
  article:nth-child(2n) {
    border-right: 0;
  }
  article:nth-child(n + 3) {
    border-bottom: 0;
  }
}

@media (max-width: 620px) {
  .numeros {
    margin-top: -48px;
  }
  article {
    min-height: 116px;
    padding: 22px 12px;
  }
  strong {
    font-size: 42px;
  }
  span {
    margin-top: 8px;
    font-size: 10px;
    line-height: 1.35;
  }
}
</style>
