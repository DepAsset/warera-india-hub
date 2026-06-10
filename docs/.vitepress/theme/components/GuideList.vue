<template>

  <div v-if="category">

    <h1>
      {{ category.name }}
    </h1>

    <p class="category-description">
      {{ category.description }}
    </p>

    <div class="guide-list">

      <a
        v-for="guide in guides"
        :key="guide.id"
        class="guide-card"
        :href="`/guide?slug=${guide.slug}`"
      >

        <h3>
          {{ guide.title }}
        </h3>

        <p>
          {{ guide.excerpt || "Open guide" }}
        </p>

      </a>

    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from "vue"

const category = ref(null)
const guides = ref([])

async function loadGuides() {

  const slug =
    window.location.pathname
      .split("/")
      .filter(Boolean)
      .pop()

  const response =
    await fetch(
      `http://localhost:3000/api/guides/category/${slug}`
    )

  const data =
    await response.json()

  category.value = data.category
  guides.value = data.guides

}

onMounted(loadGuides)

</script>

<style scoped>

.category-description{
  opacity:.8;
  margin-bottom:30px;
}

.guide-list{
  display:grid;
  gap:20px;
}

.guide-card{

  display:block;

  padding:20px;

  border-radius:16px;

  text-decoration:none;

  background:
  rgba(8,25,60,.85);

  border:
  1px solid rgba(255,255,255,.08);

  color:white;
}

.guide-card:hover{
  border-color:#ff9933;
}

.guide-card h3{
  color:#ff9933;
}

</style>