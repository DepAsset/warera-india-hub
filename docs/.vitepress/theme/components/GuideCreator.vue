<template>

<div class="guide-creator">

  <h2>Create New Guide</h2>

  <form
    class="guide-form"
    @submit.prevent="submitGuide"
  >

    <div class="field">

      <label>
        Guide Title
      </label>

      <input
        v-model="title"
        class="title-input"
        placeholder="Enter guide title..."
      />

    </div>

    <div class="field">

      <label>
        Category
      </label>

      <select
        v-model="categoryId"
        class="category-select"
      >

        <option
          disabled
          value=""
        >
          Select category
        </option>

        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>

      </select>

    </div>

    <div class="field">

      <label>
        Short Description
      </label>

      <textarea
        v-model="excerpt"
        class="excerpt-input"
        placeholder="Brief summary shown in guide listings..."
        rows="4"
      />

    </div>

    <div class="field">

      <label>
        Guide Content
      </label>

      <TipTapEditor
        v-model="content"
      />

    </div>

    <button
      type="submit"
      class="submit-btn"
    >
      Publish Guide
    </button>

  </form>

</div>

</template>

<script setup>
import TipTapEditor
from "./TipTapEditor.vue"
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

<style scoped>

.guide-creator{

  max-width:none;

  margin:auto;

}

.guide-form{

  display:flex;

  flex-direction:column;

  gap:18px;

}

.guide-title{

  width:100%;

  padding:18px 20px;

  font-size:1.3rem;

  border-radius:14px;

  border:
  1px solid rgba(255,255,255,.08);

  background:
  rgba(8,25,60,.85);

  color:white;

}

.guide-select{

  width:100%;

  padding:14px;

  border-radius:14px;

  border:
  1px solid rgba(255,255,255,.08);

  background:
  rgba(8,25,60,.85);

  color:rgb(32, 25, 20, 0.8);

}

.guide-excerpt{

  width:100%;

  min-height:120px;

  padding:16px;

  border-radius:14px;

  border:
  1px solid rgba(255,255,255,.08);

  background:
  rgba(8,25,60,.85);

  color:white;

  resize:vertical;

}

.submit-btn{

  width:100%;

  padding:16px;

  border:none;

  border-radius:14px;

  font-size:1rem;

  font-weight:700;

  cursor:pointer;

  background:
  linear-gradient(
    90deg,
    #ff9933,
    #ffb347
  );

  color:black;

}

.submit-btn:hover{

  opacity:.9;

}

</style>
<style scoped>

.guide-form{

  width:100%;

  max-width:1700px;

}

.editor-wrapper{

  width:100%;
}

.field{

  margin-bottom:28px;

}

.field label{

  display:block;

  margin-bottom:10px;

  color:#ff9933;

  font-weight:600;

}

.title-input,
.category-select,
.excerpt-input{

  width:100%;

  background:
    rgba(255,255,255,.04);

  border:
    1px solid rgba(255,255,255,.08);

  color:white;

  border-radius:14px;

  padding:16px;

  font-size:1rem;

}

.title-input{

  font-size:1.4rem;

  font-weight:700;

}

.excerpt-input{

  resize:vertical;

}

.title-input:focus,
.category-select:focus,
.excerpt-input:focus{

  outline:none;

  border-color:#ff9933;

}

.submit-btn{

  margin-top:20px;

  background:
    linear-gradient(
      90deg,
      #ff9933,
      #ffb347
    );

  color:black;

  border:none;

  padding:16px 32px;

  border-radius:14px;

  font-size:1rem;

  font-weight:700;

  cursor:pointer;

  transition:.25s;

}

.submit-btn:hover{

  transform:
    translateY(-2px);

  box-shadow:
    0 10px 30px rgba(255,153,51,.3);

}

</style>