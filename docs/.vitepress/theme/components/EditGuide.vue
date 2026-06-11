<template>

<div class="edit-guide">

  <h2>Edit Guide</h2>

  <div v-if="loading">

    Loading guide...

  </div>

  <template v-else>

    <div class="field">

      <label>Guide Title</label>

      <input
        v-model="title"
        class="title-input"
      />

    </div>

    <div class="field">

      <label>Short Description</label>

      <textarea
        v-model="excerpt"
        class="excerpt-input"
        rows="4"
      />

    </div>

    <div class="field">

      <label>Guide Content</label>

      <TipTapEditor
        v-model="content"
      />

    </div>

    <button
      class="save-btn"
      @click="saveGuide"
    >

      Save Changes

    </button>

  </template>

</div>

</template>

<script setup>

import { ref, onMounted }
from "vue"

import TipTapEditor
from "./TipTapEditor.vue"

import { API_URL }
from "../api"

const loading =
  ref(true)

const guideId =
  ref(null)

const title =
  ref("")

const excerpt =
  ref("")

const content =
  ref("")

async function loadGuide() {

  try {

    const params =
      new URLSearchParams(
        window.location.search
      )

    guideId.value =
      params.get("id")

    const response =
      await fetch(
        `${API_URL}/api/guides/edit/${guideId.value}`
      )

    const guide =
      await response.json()

    title.value =
      guide.title || ""

    excerpt.value =
      guide.excerpt || ""

    content.value =
      guide.content || ""

  }

  catch(err) {

    console.error(err)

  }

  finally {

    loading.value =
      false

  }

}

async function saveGuide() {

  try {

    const response =
      await fetch(
        `${API_URL}/api/guides/${guideId.value}`,
        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({

              title:
                title.value,

              excerpt:
                excerpt.value,

              content:
                content.value

            })

        }
      )

    if (!response.ok)
      throw new Error()

    alert(
      "Guide updated and sent for review."
    )

  }

  catch(err) {

    console.error(err)

    alert(
      "Failed to save guide."
    )

  }

}

onMounted(
  loadGuide
)

</script>

<style scoped>

.edit-guide{

  max-width:1200px;

  margin:auto;

}

.field{

  display:flex;

  flex-direction:column;

  gap:8px;

  margin-bottom:20px;

}

.field label{

  font-weight:600;

}

.title-input{

  width:100%;

  padding:16px;

  border-radius:14px;

  border:
  1px solid rgba(255,255,255,.08);

  background:
  rgba(8,25,60,.85);

  color:white;

}

.excerpt-input{

  width:100%;

  padding:16px;

  border-radius:14px;

  border:
  1px solid rgba(255,255,255,.08);

  background:
  rgba(8,25,60,.85);

  color:white;

  resize:vertical;

}

.save-btn{

  width:100%;

  margin-top:20px;

  padding:18px;

  border:none;

  border-radius:14px;

  cursor:pointer;

  font-size:1rem;

  font-weight:700;

  background:
  linear-gradient(
    90deg,
    #ff9933,
    #ffb347
  );

  color:black;

}

.save-btn:hover{

  opacity:.9;

}

</style>