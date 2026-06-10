<script setup>

import { ref, onMounted } from "vue"

const guides = ref([])

async function loadGuides() {

  const response =
    await fetch(
      "http://localhost:3000/api/review/pending"
    )

  guides.value =
    await response.json()

}

async function approveGuide(id) {

  await fetch(
    `http://localhost:3000/api/review/approve/${id}`,
    {
      method: "POST"
    }
  )

  loadGuides()

}

onMounted(loadGuides)

</script>

<template>

<div>

  <h2>
    Pending Guides
  </h2>

  <div
    v-for="guide in guides"
    :key="guide.id"
    class="review-card"
  >

    <h3>
      {{ guide.title }}
    </h3>

    <p>
      {{ guide.excerpt }}
    </p>

    <button
      @click="approveGuide(guide.id)"
    >
      Approve
    </button>

  </div>

</div>

</template>