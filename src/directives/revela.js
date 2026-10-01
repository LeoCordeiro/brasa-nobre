/**
 * v-revela: o bloco entra ao aparecer; v-revela="120" atrasa 120ms. O CSS mora em
 * global.css sob prefers-reduced-motion: no-preference, então sem JS nada some.
 */
const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Se o IntersectionObserver não disparar (aba sem frames, extensão, navegador
 * exótico), na primeira rolagem com bloco visível ainda oculto revela tudo.
 */
let redeArmada = false
function armarRede() {
  if (redeArmada) return
  redeArmada = true
  const conferir = () => {
    window.removeEventListener('scroll', conferir)
    setTimeout(() => {
      const presos = Array.from(document.querySelectorAll('.revela:not(.dentro)')).filter((el) => {
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight && r.bottom > 0
      })
      if (!presos.length) return
      document.querySelectorAll('.revela').forEach((el) => el.classList.add('dentro'))
    }, 400)
  }
  window.addEventListener('scroll', conferir, { passive: true, once: true })
}

let observador
function pegarObservador() {
  if (!observador) {
    observador = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('dentro')
          observador.unobserve(e.target)
        }),
      /**
       * threshold 0: bloco mais alto que a viewport pode nunca atingir um limiar maior.
       * Margem em px: em %, o fim do scroll vira zona morta e o rodapé não revela.
       */
      { threshold: 0, rootMargin: '0px 0px -40px 0px' },
    )
  }
  return observador
}

export default {
  mounted(el, binding) {
    el.classList.add('revela')
    if (semMovimento()) {
      el.classList.add('dentro')
      return
    }
    if (binding.value) el.style.setProperty('--atraso', `${binding.value}ms`)
    pegarObservador().observe(el)
    armarRede()

    // Rede por elemento: se em 3s o bloco não entrou e já está na tela,
    // revela na mão. Nada pode ficar invisível por falha de observação.
    setTimeout(() => {
      if (el.classList.contains('dentro')) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('dentro')
    }, 3000)
  },
  unmounted(el) {
    observador?.unobserve(el)
  },
}
