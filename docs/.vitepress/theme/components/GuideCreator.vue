<template>

<div>

  <h2>Create New Guide</h2>

  <form @submit.prevent="submitGuide">

    <input
      v-model="title"
      placeholder="Guide Title"
    />

    <br><br>

    <select v-model="categoryId">

      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </option>

    </select>

    <br><br>

    <textarea
      v-model="excerpt"
      placeholder="Short description"
      rows="3"
    />

    <br><br>

    <textarea
      v-model="content"
      placeholder="Guide content"
      rows="15"
    />

    <br><br>

    <button type="submit">
      Submit Guide
    </button>

  </form>

</div>

</template>

<script setup>

import { ref, onMounted }
from "vue"
import { API_URL }
from "../api"


const title = ref("")
const excerpt = ref("")
const content = ref("")
const categoryId = ref("")

const categories = ref([])

async function loadCategories() {

  const response =
    await fetch(
      `${API_URL}/api/categories`
    )

  categories.value =
    await response.json()

}

async function submitGuide() {

  try {

    const response =
      await fetch(
        `${API_URL}/api/guides`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            title:
              title.value,

            excerpt:
              excerpt.value,

            category_id:
              categoryId.value,

            content:
              content.value

          })
        }
      )

    const data =
      await response.json()

    console.log(data)

    alert(
      "Guide submitted!"
    )

  }

  catch(err) {

    console.error(err)

  }

}

onMounted(loadCategories)

</script>