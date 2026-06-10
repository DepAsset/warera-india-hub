<template>

<div v-if="guide" class="guide-page">

  <div class="guide-header">

    <h1>{{ guide.title }}</h1>

    <div class="guide-meta">

      <span>
        Last Updated:
        {{ formatDate(guide.updated_at) }}
      </span>

      <span>
        Views:
        {{ guide.views || 0 }}
      </span>

    </div>

  </div>

  <div
    class="guide-content"
    v-html="renderedContent"
  />

</div>

<div v-else>

  Loading Guide...

</div>

</template>

<script setup>

import { ref, computed, onMounted }
from "vue"

import MarkdownIt
from "markdown-it"

import { API_URL }
from "../api"

const md = new MarkdownIt()

const guide = ref(null)

const renderedContent = computed(() => {

  if (!guide.value)
    return ""

  return md.render(
    guide.value.content || ""
  )

})

function formatDate(date) {

  if (!date)
    return "Unknown"

  return new Date(date)
    .toLocaleDateString()

}

onMounted(async () => {

  const params =
    new URLSearchParams(
        window.location.search
    )

  const slug =
    params.get("slug")

  const response =
    await fetch(
      `${API_URL}/api/guide/${slug}`
    )

  guide.value =
    await response.json()

})

</script>