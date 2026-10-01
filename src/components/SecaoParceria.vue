<script setup>
import { parceiro } from '@/config/site'

/** Página Seja um parceiro: como a parceria funciona e quem a Brasa Nobre procura. */
</script>

<template>
  <section class="secao parceria">
    <div class="container">
      <div v-revela class="secao-cab">
        <div>
          <p class="rotulo-secao">{{ parceiro.selo }}</p>
          <h2>{{ parceiro.titulo }}</h2>
        </div>
      </div>

      <ol class="itens">
        <li v-for="(it, i) in parceiro.itens" :key="it.n" v-revela="i * 90">
          <span class="num" aria-hidden="true">{{ it.n }}</span>
          <h3>{{ it.titulo }}</h3>
          <p>{{ it.desc }}</p>
        </li>
      </ol>

      <div v-revela class="procura">
        <div>
          <p class="rotulo-secao">{{ parceiro.procura.selo }}</p>
          <p class="procura-texto">{{ parceiro.procura.texto }}</p>
        </div>
        <ul class="categorias">
          <li v-for="c in parceiro.categorias" :key="c">{{ c }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.itens {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.itens li {
  padding: 32px 30px 34px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-card);
  background: var(--c-superficie);
}
.num {
  display: inline-grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid rgb(var(--c-ouro-rgb) / 0.5);
  border-radius: 50%;
  color: var(--c-ouro);
  font-size: 13px;
  font-variant-numeric: lining-nums;
  font-weight: 800;
}
.itens h3 {
  margin-top: 22px;
  font-size: 28px;
}
.itens p {
  margin: 10px 0 0;
  color: var(--c-suave);
  font-size: 16px;
  line-height: 1.55;
}

.procura {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 24px 56px;
  align-items: center;
  margin-top: 40px;
  padding: 36px 40px;
  border: 1px solid var(--l-sobre-escuro);
  border-radius: var(--r-painel);
}
.procura-texto {
  margin: 12px 0 0;
  color: var(--c-suave);
  font-size: 16px;
  line-height: 1.55;
}
.categorias {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.categorias li {
  padding: 10px 16px;
  border: 1px solid rgb(var(--c-ouro-rgb) / 0.4);
  border-radius: var(--r-selo);
  color: var(--c-texto);
  font-size: 14px;
  font-weight: 700;
}

@media (max-width: 980px) {
  .itens {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  .procura {
    grid-template-columns: minmax(0, 1fr);
    padding: 28px 24px;
  }
}

@media (max-width: 620px) {
  .itens li {
    padding: 24px 20px 26px;
  }
  .itens h3 {
    margin-top: 16px;
    font-size: 25px;
  }
  .categorias li {
    padding: 9px 13px;
    font-size: 13px;
  }
}
</style>
