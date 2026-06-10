<template>
  <div>

    <a
      v-if="!loggedIn"
      href="`${API_URL}/auth/discord`"
      class="login-btn"
    >
      Login
    </a>

    <div
      v-else
      class="user-box"
    >
      {{ username }}
    </div>

  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { API_URL }
from "../api"

const loggedIn = ref(false)
const username = ref('')

onMounted(async () => {

  try {

    const response = await fetch(
      '`${API_URL}`/api/me',
      {
        credentials: 'include'
      }
    )

    const data = await response.json()

    if (data.loggedIn) {

      loggedIn.value = true

      username.value =
        data.user.username

    }

  } catch (err) {

    console.error(err)

  }

})

</script>

<style scoped>

.login-btn{

  background:#ff9933;

  color:black;

  padding:10px 18px;

  border-radius:10px;

  text-decoration:none;

  font-weight:600;
}

.user-box{

  color:white;

  font-weight:600;
}

</style>