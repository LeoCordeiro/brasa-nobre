import { createRouter, createWebHashHistory } from 'vue-router'
import { empresa, paginas } from '@/config/site'
import { DESCONTO_CABECALHO, semMovimento } from '@/composables/rolagem'

/**
 * Hash history: o site é estático e o hash evita depender de rewrite do servidor
 * para link direto funcionar. O título da aba sai de config/site.js (paginas).
 */
const pagina = (nome, carregar) => ({
  path: `/${nome}`,
  name: nome,
  component: carregar,
  meta: { titulo: `${paginas[nome].aba} | ${empresa.fantasia}` },
})

const rotas = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { titulo: `${empresa.fantasia} | Churrasco premium para eventos corporativos` },
  },
  pagina('servicos', () => import('@/views/ServicosView.vue')),
  pagina('eventos', () => import('@/views/EventosView.vue')),
  pagina('sobre', () => import('@/views/SobreView.vue')),
  pagina('parceiro', () => import('@/views/ParceiroView.vue')),
  pagina('contato', () => import('@/views/ContatoView.vue')),
  {
    path: '/privacidade',
    name: 'privacidade',
    component: () => import('@/views/legal/PrivacidadeView.vue'),
    meta: { titulo: `Política de privacidade | ${empresa.fantasia}` },
  },
  {
    path: '/termos',
    name: 'termos',
    component: () => import('@/views/legal/TermosView.vue'),
    meta: { titulo: `Termos de uso | ${empresa.fantasia}` },
  },
  {
    path: '/repasse',
    name: 'repasse',
    component: () => import('@/views/legal/RepasseView.vue'),
    meta: { titulo: `Política de repasse | ${empresa.fantasia}` },
  },
  {
    path: '/style-guide',
    name: 'style-guide',
    component: () => import('@/views/StyleGuideView.vue'),
    meta: { titulo: `Guia de estilo | ${empresa.fantasia}` },
  },
  // Rota desconhecida volta para a home em vez de tela branca.
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: rotas,
  scrollBehavior(to, from, salvo) {
    if (salvo) return salvo
    // Só a query mudou (aba de Serviços): a página fica onde está.
    if (to.path === from.path && to.hash === from.hash && to.fullPath !== from.fullPath) return false
    const suave = semMovimento() ? 'instant' : 'smooth'
    if (to.hash) return { el: to.hash, top: DESCONTO_CABECALHO, behavior: suave }
    // Página nova abre já no topo; na mesma página, a volta ao topo desliza.
    return { top: 0, behavior: to.fullPath === from.fullPath ? suave : 'instant' }
  },
})

// Aba aberta antes de um deploy pede um arquivo JS que não existe mais: recarrega
// uma vez na rota pedida, em vez de deixar o menu sem resposta.
router.onError((erro, to) => {
  if (!/dynamically imported module|module script|Importing a module/i.test(erro?.message || '')) return
  try {
    if (sessionStorage.getItem('recarga-rota') === to.fullPath) return
    sessionStorage.setItem('recarga-rota', to.fullPath)
  } catch {
    return
  }
  window.location.hash = to.fullPath
  window.location.reload()
})

router.afterEach((to) => {
  if (to.meta?.titulo) document.title = to.meta.titulo
})

export default router
