<template>

<div class="dashboard">

  <h2>Contributor Dashboard</h2>

  <p v-if="loading">
    Loading...
  </p>

  <div v-else-if="user">

    <div class="user-card">

      <img
        :src="avatarUrl"
        class="avatar"
      />

      <div>

        <h3>
          {{ user.username }}
        </h3>

        <p>
          Logged in
        </p>

      </div>

    </div>

    <div class="actions">

      <a
        href="/dashboard/new-guide/"
        class="action-btn"
      >
        Create Guide
      </a>

    </div>

  </div>

  <div v-else>

    <a
      :href="`${API_URL}/auth/discord`"
      class="login-btn"
    >
      Login with Discord
    </a>

  </div>

</div>

</template>

<script setup>

import { ref, computed, onMounted }
from "vue"
import { API_URL }
from "../api"

const user = ref(null)

const loading = ref(true)

const avatarUrl = computed(() => {

  if (!user.value)
    return ""

  return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png`

})

async function loadUser() {

  try {

    const response =
      await fetch(
        `${API_URL}/api/me`,
        {
          credentials: "include"
        }
      )

    const data =
      await response.json()

    if (data.loggedIn) {

      user.value =
        data.user

    }

  }

  catch(err) {

    console.error(err)

  }

  loading.value = false

}

onMounted(loadUser)

</script>