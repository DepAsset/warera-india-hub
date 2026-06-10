<template>

  <div>

    <h2>Edit Guide</h2>

    <input
      v-model="title"
      placeholder="Guide Title"
    >

    <textarea
      v-model="content"
      rows="20"
      placeholder="Guide Content"
    />

    <button @click="saveGuide">

      Save Guide

    </button>

  </div>

</template>

<script setup>

import { ref } from "vue"

const title = ref("")
const content = ref("")

async function saveGuide() {

  console.log(
    title.value,
    content.value
  )

}

</script>