<script setup>
import { diferencial } from '@/config/site'
import { fotos, dimensoes } from '@/config/imagens'
</script>

<template>
  <section id="diferencial" class="secao diferencial">
    <div v-revela class="diferencial-foto">
      <img :src="fotos.eventoMontado" alt="Mesas e estação de serviço montadas para um evento" :width="dimensoes.eventoMontado[0]" :height="dimensoes.eventoMontado[1]" loading="lazy" />
    </div>
    <div v-revela="120" class="diferencial-copy">
      <p class="rotulo-secao">{{ diferencial.selo }}</p>
      <h2>{{ diferencial.titulo[0] }}<br />{{ diferencial.titulo[1] }}</h2>
      <ol class="lista">
        <li v-for="item in diferencial.itens" :key="item.n">
          <span class="numero">{{ item.n }}</span>
          <strong>{{ item.titulo }}</strong>
          <small>{{ item.desc }}</small>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
/* Faixa marfim de ponta a ponta; o conteúdo alinha com o container. */
.diferencial {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding-right: max(24px, calc((100vw - var(--m-largura-conteudo)) / 2));
  padding-left: max(24px, calc((100vw - var(--m-largura-conteudo)) / 2));
  background: var(--c-marfim);
  color: var(--on-marfim);
}

.diferencial-foto img {
  width: 100%;
  height: 660px;
  border-radius: var(--r-painel);
  box-shadow: var(--s-card);
  object-fit: cover;
}

.diferencial-copy {
  max-width: 620px;
}
.diferencial-copy .rotulo-secao {
  color: var(--c-ouro-tinta);
}

.lista {
  display: grid;
  margin: 48px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--l-sobre-claro);
}
.lista li {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 4px 18px;
  padding: 22px 0;
  border-bottom: 1px solid var(--l-sobre-claro);
}
.numero {
  display: grid;
  grid-row: span 2;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid var(--c-ouro-tinta);
  border-radius: 50%;
  color: var(--c-ouro-tinta);
  font-size: 13px;
  font-weight: 800;
}
.lista strong {
  font-size: 19px;
}
.lista small {
  color: var(--c-tinta-suave);
  font-size: 15px;
  line-height: 1.5;
}

@media (max-width: 980px) {
  .diferencial {
    grid-template-columns: 1fr;
    gap: 38px;
    padding-right: 16px;
    padding-left: 16px;
  }
  .diferencial-foto img {
    height: 430px;
  }
}

@media (max-width: 620px) {
  .diferencial {
    gap: 30px;
    padding: 20px 20px 64px;
  }
  .diferencial-foto img {
    height: 300px;
    border-radius: var(--r-card);
  }
  .lista li {
    grid-template-columns: 48px 1fr;
  }
}
</style>
