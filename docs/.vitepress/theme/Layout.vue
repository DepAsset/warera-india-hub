<script setup>

import DefaultTheme
from "vitepress/theme"

import LoginButton
from "./components/LoginButton.vue"

const { Layout } =
  DefaultTheme

</script>

<template>

  <Layout>

    <template #nav-bar-content-after>

      <LoginButton />

    </template>

  </Layout>

</template>