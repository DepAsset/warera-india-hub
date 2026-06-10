<template>

  <div>
    <div
      v-if="guides.length"
      class="guide-grid"
    >

      <div
        v-for="guide in guides"
        :key="guide.id"
        class="guide-card"
      >

        <h3>
          {{ guide.title }}
        </h3>

        <p>
          Status:
          {{ guide.status }}
        </p>

        <p>
          {{ guide.excerpt }}
        </p>

        <a
          :href="`/dashboard/edit-guide?id=${guide.id}`"
        >
          Edit Guide
        </a>

      </div>

    </div>

    <div v-else>

      No guides found.

    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from "vue"
import { API_URL }
from "../api"

const guides = ref([])

onMounted(async () => {

  try {

    const response =
      await fetch(
        `${API_URL}/api/my-guides`,
        {
          credentials: "include"
        }
      )

    if (!response.ok)
      return

    guides.value =
      await response.json()

  } catch (err) {

    console.error(err)

  }

})

</script>

<style scoped>

.guide-grid{
  display:grid;
  gap:20px;
}

.guide-card{

  background:
  rgba(8,25,60,.85);

  border:
  1px solid rgba(255,255,255,.08);

  padding:20px;

  border-radius:16px;

}

.guide-card h3{
  color:#ff9933;
}

</style>