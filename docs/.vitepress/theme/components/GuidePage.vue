<template>

  <div class="breadcrumb">
    Guides / Beginner Guides
  </div>
  <br>
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

import { API_URL }
from "../api"

const guide = ref(null)

const renderedContent = computed(() => {

  if (!guide.value)
    return ""

  return guide.value.content || ""

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

<style scoped>

.guide-container{
  width:100%;
  max-width:1500px;
  padding:100px 30px;
}

.guide-header{
  margin-bottom:40px;
}

.guide-header h1{
  font-size:3rem;
  color:#ff9933;
  margin-bottom:10px;
}

.guide-meta{
  display:flex;
  gap:20px;
  color:rgba(255,255,255,.6);
}

.guide-content{
  line-height:1.9;
  font-size:1.1rem;
}

.guide-content :deep(h1){
  color:white;
  font-size:2.5rem;
  margin-top:40px;
}

.guide-content :deep(h2){
  font-size:1.8rem;
  color:white;
  margin-top:30px;
}

.guide-content :deep(p){
  margin:16px 0;
}

.guide-content :deep(ul){
  margin:20px 0;
  padding-left:30px;
}

.guide-content :deep(li){
  margin:1px 0;
}

.guide-content :deep(blockquote){
  border-left:4px solid #ff9933;
  padding-left:20px;
  opacity:.85;
}

.guide-content :deep(code){
  background:rgba(255,255,255,.08);
  padding:3px 6px;
  border-radius:6px;
}

.guide-content :deep(img){
  max-width:100%;
  border-radius:12px;
}

.guide-page{

  background:
  linear-gradient(
    180deg,
    rgba(10,30,70,.95),
    rgba(5,18,45,.95)
  );

  backdrop-filter: blur(10px);

  box-shadow:
  0 20px 60px rgba(0,0,0,.35);

  border:
    1px solid rgba(255,255,255,.08);

  border-radius:24px;

  padding:40px;
}

.guide-container{
  max-width:900px;
}

.guide-meta{
  display:flex;
  gap:10px;
  margin-top:15px;
}

.guide-meta span{
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.08);
  padding:6px 12px;
  border-radius:999px;
  font-size:.85rem;
}

.guide-header{
  padding-bottom:25px;
  border-bottom:1px solid rgba(255,255,255,.08);
  margin-bottom:35px;
}
.breadcrumb{
  color:rgba(255,255,255,.55);
  font-size:.9rem;
  margin-bottom:15px;
}
</style>
