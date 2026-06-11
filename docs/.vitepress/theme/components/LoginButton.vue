<template>

<div class="nav-user">

  <button
    v-if="!loggedIn"
    class="login-btn"
    type="button"
    @click="login"
  >
    Login
  </button>

  <div
    v-else
    class="dropdown"
  >

    <button
      class="user-btn"
      @click="open = !open"
    >

      {{ displayName }}
      ▼

    </button>

    <div
      v-if="open"
      class="dropdown-menu"
    >

      <a
        href="/dashboard/"
      >
        Dashboard
      </a>

      <a
        href="/dashboard/my-guides/"
      >
        My Guides
      </a>

      <a
        href="/dashboard/new-guide/"
      >
        Create Guide
      </a>

      <a
        v-if="
          role === 'admin' ||
          role === 'supervisor'
        "
        href="/dashboard/review-guides/"
      >
        Review Queue
      </a>

      <hr>

      <button
        class="logout-btn"
        type="button"
        @click="logout"
      >
        Logout
      </button>

    </div>

  </div>

</div>

</template>

<script setup>

import {
  ref,
  computed,
  onMounted
}
from "vue"

import { API_URL }
from "../api"

const loggedIn =
  ref(false)

const username =
  ref("")

const role =
  ref("author")

const open =
  ref(false)

function login() {

  window.location.assign(
    `${API_URL}/auth/discord`
  )

}

function logout() {

  window.location.assign(
    `${API_URL}/auth/logout`
  )

}

const displayName =
  computed(() => {

    if (
      username.value.length > 18
    ) {

      return (
        username.value
        .slice(0,18)
        + "..."
      )

    }

    return username.value

  })

onMounted(async () => {

  try {

    const response =
      await fetch(
        `${API_URL}/api/me`,
        {
          credentials: "include"
        }
      )

    console.log(
      "LOGINBUTTON API:",
      await response.clone().json()
    )

    const data =
      await response.json()

    if (
      data.loggedIn
    ) {

      loggedIn.value =
        true

      username.value =
        data.user.username

      role.value =
        data.user.role

    }

  }

  catch(err) {

    console.error(err)

  }

})

</script>

<style scoped>

.login-btn{

  border:none;

  background:#ff9933;

  color:black;

  padding:10px 18px;

  border-radius:12px;

  text-decoration:none;

  font-weight:700;

  font:inherit;

  cursor:pointer;

}

.dropdown{

  position:relative;

}

.user-btn{

  background:none;

  border:none;

  color:white;

  cursor:pointer;

  font-weight:700;

  font-size:.95rem;

}

.dropdown-menu{

  position:absolute;

  right:0;

  top:120%;

  min-width:220px;

  border-radius:16px;

  background:
  rgba(8,25,60,.98);

  border:
  1px solid rgba(
    255,255,255,.08
  );

  backdrop-filter:
  blur(16px);

  overflow:hidden;

  z-index:99999;

}

.dropdown-menu a,
.logout-btn{

  display:block;

  width:100%;

  padding:14px 18px;

  color:white;

  text-decoration:none;

  text-align:left;

}

.logout-btn{

  border:none;

  background:none;

  font:inherit;

  cursor:pointer;

}

.dropdown-menu a:hover,
.logout-btn:hover{

  background:
  rgba(
    255,153,51,.12
  );

}

.dropdown-menu hr{

  border:none;

  border-top:
  1px solid rgba(
    255,255,255,.08
  );

  margin:0;

}

</style>
