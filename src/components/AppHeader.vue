<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { mdiWhatsapp } from '@mdi/js'
import { navegacao, navegacaoCelular, topbar } from '@/config/site'
import { marca } from '@/config/imagens'
import { linkWhatsAppSimples } from '@/utils/whatsapp'
import { useRoute, useRouter } from 'vue-router'

/**
 * Cabeçalho próprio, não <v-app-bar>, que empurra padding no v-main e abre
 * costura com o hero. Ao rolar, a faixa superior recolhe e vira barra de vidro.
 */
const rolado = ref(false)
const progresso = ref(0)
const menu = ref(null)
const botaoMenu = ref(null)
const aberto = ref(false)
const router = useRouter()
const route = useRoute()

function aoRolar() {
  rolado.value = window.scrollY > 8
  const total = document.documentElement.scrollHeight - window.innerHeight
  progresso.value = total > 0 ? Math.min(window.scrollY / total, 1) : 0
}

/**
 * Pular para o conteúdo precisa ser programático: com hash history,
 * href="#conteudo" seria lido como ROTA pelo router.
 */
function pularParaConteudo(e) {
  e.preventDefault()
  // O foco vai para o título da página, não para o contêiner inteiro.
  const alvo = document.querySelector('#conteudo h1') || document.getElementById('conteudo')
  if (!alvo) return
  alvo.setAttribute('tabindex', '-1')
  alvo.focus()
}

function abrirMenu() {
  menu.value.showModal()
  aberto.value = true
}
function fecharMenu() {
  menu.value.close()
}
function aoFechar() {
  aberto.value = false
  botaoMenu.value?.focus({ preventScroll: true })
}
function irDoMenu(para) {
  fecharMenu()
  router.push(para)
}

onMounted(() => {
  aoRolar()
  window.addEventListener('scroll', aoRolar, { passive: true })
  window.addEventListener('resize', aoRolar, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', aoRolar)
  window.removeEventListener('resize', aoRolar)
})
</script>

<template>
  <header class="cabecalho" :class="{ 'cabecalho--rolado': rolado }">
    <a class="pular" href="#conteudo" @click="pularParaConteudo">Pular para o conteúdo principal</a>
    <div class="progresso" aria-hidden="true" :style="{ transform: `scaleX(${progresso})` }"></div>

    <div class="container">
      <div class="topbar">
        <span>{{ topbar.esquerda }}</span>
        <span>{{ topbar.direita }}</span>
      </div>

      <nav aria-label="Navegação principal" class="main-nav">
        <RouterLink to="/" class="brand" aria-label="Brasa Nobre Espetaria, início">
          <img :src="marca.palavra" alt="Brasa Nobre" width="280" height="40" />
        </RouterLink>

        <div class="nav-links">
          <RouterLink v-for="l in navegacao" :key="l.para" :to="l.para">
            {{ l.nome }}
          </RouterLink>
        </div>

        <RouterLink to="/contato" class="btn btn-ouro nav-cta">Orçamento</RouterLink>

        <button
          ref="botaoMenu"
          class="menu-button"
          type="button"
          aria-controls="mobile-menu"
          :aria-expanded="aberto"
          aria-label="Abrir menu"
          @click="abrirMenu"
        >
          <span></span><span></span>
        </button>
      </nav>
    </div>

    <dialog id="mobile-menu" ref="menu" class="mobile-menu" aria-label="Menu principal" @close="aoFechar" @click.self="fecharMenu">
      <div class="mobile-menu-head">
        <img :src="marca.palavra" alt="Brasa Nobre" width="280" height="40" />
        <button type="button" data-close-menu aria-label="Fechar menu" @click="fecharMenu">×</button>
      </div>
      <nav aria-label="Seções do site">
        <a
          v-for="l in navegacaoCelular"
          :key="l.para"
          :href="`#${l.para}`"
          :aria-current="route.path === l.para ? 'page' : undefined"
          @click.prevent="irDoMenu(l.para)"
          >{{ l.nome }}</a
        >
      </nav>
      <div class="mobile-menu-actions">
        <a class="btn btn-ouro" href="#/contato" @click.prevent="irDoMenu('/contato')">Pedir orçamento</a>
        <a class="btn btn-contorno" :href="linkWhatsAppSimples()" target="_blank" rel="noopener">
          <v-icon :icon="mdiWhatsapp" /> Falar no WhatsApp
        </a>
      </div>
    </dialog>
  </header>
</template>

<style scoped>
.cabecalho {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  border-bottom: 1px solid transparent;
  transition:
    background-color 260ms var(--t-suave),
    border-color 260ms var(--t-suave),
    backdrop-filter 260ms var(--t-suave);
}
.cabecalho--rolado {
  border-bottom-color: var(--l-sobre-escuro);
  background: rgb(var(--c-fundo-rgb) / 0.78);
  backdrop-filter: blur(14px) saturate(1.2);
}

.progresso {
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--c-ouro-escuro), var(--c-ouro-vivo));
  transform-origin: left;
}

.pular {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 100;
  padding: 14px 18px;
  border-radius: var(--r-campo);
  background: var(--c-marfim);
  color: var(--on-marfim);
  font-weight: 800;
  transform: translateY(-180%);
  transition: transform 160ms ease;
}
.pular:focus {
  transform: translateY(0);
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  max-height: 60px;
  padding: 20px 0 18px;
  overflow: hidden;
  border-bottom: 1px solid var(--l-sobre-escuro);
  color: var(--c-suave);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    max-height 260ms var(--t-suave),
    padding 260ms var(--t-suave),
    opacity 200ms ease,
    border-color 200ms ease;
}
.cabecalho--rolado .topbar {
  max-height: 0;
  padding-block: 0;
  border-bottom-color: transparent;
  opacity: 0;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 38px;
  padding: 28px 0;
  transition: padding 260ms var(--t-suave);
}
.cabecalho--rolado .main-nav {
  padding: 12px 0;
}

.brand img {
  width: 258px;
  height: auto;
  transition: width 260ms var(--t-suave);
}
.cabecalho--rolado .brand img {
  width: 210px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: auto;
  color: var(--c-suave);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.nav-links a {
  position: relative;
  padding: 6px 0;
  transition: color var(--t-micro) ease;
}
.nav-links a::after {
  position: absolute;
  inset: auto 0 0;
  height: 2px;
  border-radius: 2px;
  background: var(--c-ouro);
  content: '';
  transform: scaleX(0);
  transition: transform var(--t-micro) var(--t-suave);
}
.nav-links a:hover {
  color: var(--c-ouro);
}
.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  transform: scaleX(1);
}
.nav-links a.router-link-active {
  color: var(--c-texto);
}

.menu-button {
  display: none;
  width: 48px;
  height: 48px;
  margin-left: auto;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: 14px;
  background: rgb(var(--c-fundo-rgb) / 0.35);
  color: var(--c-texto);
  cursor: pointer;
}
.menu-button span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 5px auto;
  border-radius: 2px;
  background: currentColor;
}

.mobile-menu {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 28px 24px;
  border: 0;
  background: var(--c-fundo);
  color: var(--c-texto);
}
.mobile-menu::backdrop {
  background: rgba(0, 0, 0, 0.65);
}
.mobile-menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--l-sobre-escuro);
}
.mobile-menu-head img {
  width: 215px;
  height: auto;
}
.mobile-menu-head button {
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: 50%;
  background: transparent;
  color: var(--c-texto);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}
.mobile-menu nav {
  display: grid;
  gap: 20px;
  padding: 44px 0;
  font-family: var(--f-display);
  font-size: 42px;
  font-weight: 700;
}
.mobile-menu-actions {
  display: grid;
  gap: 14px;
}

@media (max-width: 980px) {
  .topbar,
  .nav-links,
  .nav-cta {
    display: none;
  }
  .main-nav {
    justify-content: space-between;
    padding: 22px 0;
  }
  .brand img {
    width: 215px;
  }
  .menu-button {
    display: block;
  }
}

@media (max-width: 620px) {
  .main-nav {
    padding: 18px 0;
  }
  .brand img,
  .cabecalho--rolado .brand img {
    width: 184px;
  }
}
</style>
