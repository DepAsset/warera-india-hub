<template>

  <div class="category-grid">

    <a
      v-for="category in categories"
      :key="category.id"
      class="category-card"
      :href="`/guides/${category.slug}/`"
    >

      <h3>
        {{ category.name }}
      </h3>

      <p>
        {{ category.description }}
      </p>

    </a>

  </div>

</template>

<script setup>

import { ref, onMounted } from "vue"

const categories = ref([])

async function loadCategories() {

  try {

    const response =
      await fetch(
        "http://localhost:3000/api/categories"
      )

    categories.value =
      await response.json()

  }

  catch(err) {

    console.error(err)

  }

}

onMounted(() => {

  loadCategories()

})

</script>

<style scoped>

.category-grid{

  display:grid;

  grid-template-columns:
    repeat(3,1fr);

  gap:30px;

  margin-top:40px;
}

.category-card{

  display:block;

  padding:30px;

  border-radius:20px;

  text-decoration:none;

  color:white;

  background:
  linear-gradient(
    180deg,
    rgba(8,25,60,.95),
    rgba(4,15,40,.95)
  );

  border:
  1px solid rgba(255,255,255,.08);

  transition:.25s;
}

.category-card:hover{

  transform:
  translateY(-6px);

  border-color:#ff9933;
}

.category-card h3{

  color:#ff9933;

  margin-bottom:10px;
}

.category-card p{

  color:
  rgba(255,255,255,.75);
}

@media(max-width:900px){

  .category-grid{
    grid-template-columns:1fr;
  }

}

</style>