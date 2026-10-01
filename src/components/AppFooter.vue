<script setup>
import { mdiWhatsapp, mdiEmailOutline, mdiInstagram } from '@mdi/js'
import { empresa, navegacaoRodape } from '@/config/site'
import { marca } from '@/config/imagens'
import { linkWhatsAppSimples } from '@/utils/whatsapp'

const ano = new Date().getFullYear()
</script>

<template>
  <footer class="rodape">
    <div class="container rodape-layout">
      <img :src="marca.palavra" alt="Brasa Nobre" width="280" height="40" class="rodape-marca" />

      <nav aria-label="Links do rodapé">
        <RouterLink v-for="l in navegacaoRodape" :key="l.para" :to="l.para">
          {{ l.nome }}
        </RouterLink>
      </nav>

      <div class="redes">
        <a :href="linkWhatsAppSimples('Olá! Vim pelo site da Brasa Nobre.')" target="_blank" rel="noopener" aria-label="WhatsApp da Brasa Nobre">
          <v-icon :icon="mdiWhatsapp" size="20" />
        </a>
        <a :href="`mailto:${empresa.email}`" aria-label="E-mail da Brasa Nobre">
          <v-icon :icon="mdiEmailOutline" size="20" />
        </a>
        <a :href="empresa.instagramUrl" target="_blank" rel="noopener" aria-label="Instagram da Brasa Nobre">
          <v-icon :icon="mdiInstagram" size="20" />
        </a>
      </div>

      <small>
        © {{ ano }} {{ empresa.fantasia }} · {{ empresa.tagline }}.<br />
        {{ empresa.razaoSocial }} · CNPJ {{ empresa.cnpj }} · {{ empresa.bairro }}, {{ empresa.cidade }}/{{ empresa.uf }} ·
        <RouterLink to="/privacidade">Política de privacidade</RouterLink> ·
        <RouterLink to="/termos">Termos de uso</RouterLink> ·
        <RouterLink to="/repasse">Política de repasse</RouterLink> ·
        <a :href="empresa.reclameAquiUrl" target="_blank" rel="noopener">Reclame Aqui</a>
      </small>
    </div>
  </footer>
</template>

<style scoped>
.rodape {
  padding: 42px 0 52px;
  border-top: 1px solid var(--l-sobre-escuro);
  background: var(--c-fundo);
}

.rodape-layout {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 34px;
  align-items: center;
}

.rodape-marca {
  width: 220px;
  height: auto;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  color: var(--c-suave);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
nav a:hover {
  color: var(--c-ouro);
}

.redes {
  display: flex;
  gap: 12px;
}
.redes a {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: 50%;
  color: var(--c-ouro);
  transition:
    border-color var(--t-micro) ease,
    background var(--t-micro) ease;
}
.redes a:hover {
  border-color: var(--c-ouro);
  background: rgb(var(--c-ouro-rgb) / 0.1);
}

small {
  grid-column: 1 / -1;
  color: var(--c-suave-2);
  font-size: 12px;
  line-height: 1.8;
}
small a {
  color: var(--c-suave);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 980px) {
  .rodape-layout {
    grid-template-columns: 1fr;
    justify-items: start;
  }
  nav {
    justify-content: start;
  }
}

@media (max-width: 620px) {
  .rodape {
    padding: 42px 0 30px;
  }
  .rodape-marca {
    width: 190px;
  }
  nav {
    gap: 16px;
    line-height: 1.8;
  }
}
</style>
