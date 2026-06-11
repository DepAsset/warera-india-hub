---
layout: page
aside: false
---
<template>

<div class="dashboard">

  <div
    v-if="loading"
    class="loading"
  >
    Loading Dashboard...
  </div>

  <template v-else-if="user">

    <div class="hero-card">

      <div class="hero-content">

        <div>

          <div class="badge">
            {{ user.role.toUpperCase() }}
          </div>

          <h1>
            Welcome Back,
          </h1>

          <h2>
            {{ user.username }}
          </h2>

          <p>
            India Hub Command Center
          </p>

        </div>

        <img
          :src="avatarUrl"
          class="avatar"
        />

      </div>

    </div>

    <div class="status-bar">

      <div class="status-item">
        <span class="dot online"></span>
        Authentication Online
      </div>

      <div class="status-item">
        <span class="dot online"></span>
        Knowledge Archive Active
      </div>

      <div class="status-item">
        <span class="dot online"></span>
        Guide Submission Operational
      </div>

      <div class="status-item">
        <span class="dot online"></span>
        Warera Network Connected
      </div>

    </div>
    <div class="stats-grid">

      <div class="stat-card saffron">

        <span>
          Guides
        </span>

        <strong>
          --
        </strong>

      </div>

      <div class="stat-card white">

        <span>
          Pending
        </span>

        <strong>
          --
        </strong>

      </div>

      <div class="stat-card green">

        <span>
          Approved
        </span>

        <strong>
          --
        </strong>

      </div>

    </div>

    <div class="actions-grid">

      <a
        href="/dashboard/new-guide/"
        class="action-card"
      >
        ✍️
        <h3>Create Guide</h3>
      </a>

      <a
        href="/dashboard/my-guides/"
        class="action-card"
      >
        📚
        <h3>My Guides</h3>
      </a>

      <a
        v-if="
          user.role === 'admin' ||
          user.role === 'supervisor'
        "
        href="/dashboard/review-guides/"
        class="action-card review"
      >
        🛡️
        <h3>Review Queue</h3>
      </a>

    </div>
    
    <div class="intel-grid">

  <div class="intel-card">

    <h3>
      INDIA INTELLIGENCE
    </h3>

    <div class="intel-list">

      <div>
        <span>Citizens</span>
        <strong>195</strong>
      </div>

      <div>
        <span>Development Rank</span>
        <strong>#11</strong>
      </div>

      <div>
        <span>Production Bonus</span>
        <strong>30.5%</strong>
      </div>

      <div>
        <span>Allies</span>
        <strong>17</strong>
      </div>

      <div>
        <span>Current Wars</span>
        <strong>17</strong>
      </div>

    </div>

  </div>

  <div class="intel-card">

      <h3>
        LATEST ACTIVITY
      </h3>

      <div class="activity-feed">

        <div>
          🟢 Guide System Initialized
        </div>

        <div>
          🟢 Supervisor Access Verified
        </div>

        <div>
          🟢 Knowledge Archive Synced
        </div>

        <div>
          🟢 Dashboard Online
        </div>

      </div>

    </div>

  </div>

  <div class="recent-guides">

    <h3>
      RECENT OPERATIONS
    </h3>

    <div class="guide-placeholder">

      Guide activity feed will appear here.

    </div>

  </div>
  </template>

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

const user = ref(null)
const loading = ref(true)

const avatarUrl =
  computed(() => {

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

    console.log("API RESPONSE:", data)

    if (data.loggedIn) {

      console.log("SETTING USER")

      user.value = data.user

    }

  }

  catch(err) {

    console.error(err)

  }

  loading.value = false

}

onMounted(loadUser)

</script>

<style scoped>


.status-bar{

  display:grid;

  grid-template-columns:
  repeat(4,1fr);

  gap:15px;

  margin-bottom:30px;

}

.status-item{

  background:#090909;

  border:
  1px solid rgba(
    255,255,255,.06
  );

  border-radius:14px;

  padding:16px;

  font-size:.9rem;

  color:white;

}

.dot{

  display:inline-block;

  width:8px;

  height:8px;

  border-radius:50%;

  margin-right:8px;

}

.online{

  background:#00ff88;

  box-shadow:
  0 0 12px #00ff88;

}

.intel-grid{

  display:grid;

  grid-template-columns:
  1fr 1fr;

  gap:25px;

  margin-top:35px;

}

.intel-card{

  background:#090909;

  border:
  1px solid rgba(
    255,255,255,.06
  );

  border-radius:24px;

  padding:30px;

}

.intel-card h3{

  color:#ff9933;

  margin-bottom:25px;

}

.intel-list{

  display:flex;

  flex-direction:column;

  gap:15px;

}

.intel-list div{

  display:flex;

  justify-content:space-between;

}

.intel-list strong{

  color:white;

}

.activity-feed{

  display:flex;

  flex-direction:column;

  gap:16px;

  color:white;

}

.recent-guides{

  margin-top:35px;

  background:#090909;

  border:
  1px solid rgba(
    255,255,255,.06
  );

  border-radius:24px;

  padding:30px;

}

.recent-guides h3{

  color:#ff9933;

  margin-bottom:20px;

}

.guide-placeholder{

  color:
  rgba(255,255,255,.65);

}

@media(max-width:1000px){

  .status-bar{

    grid-template-columns:
    1fr 1fr;

  }

  .intel-grid{

    grid-template-columns:
    1fr;

  }

}

.dashboard{

  width:100%;

  max-width:1800px;

  margin:0 auto;

  padding:90px 40px 40px;

  box-sizing:border-box;

}
.loading{

  color:white;

}

.hero-card{

  position:relative;

  overflow:hidden;

  padding:55px;

  border-radius:32px;

  background:
  linear-gradient(
    145deg,
    rgba(0,0,0,.95),
    rgba(10,10,10,.95)
  );

  border:
  1px solid rgba(
    255,255,255,.06
  );

  margin-bottom:40px;

  min-height:260px;
  
  width:100%;

  box-sizing:border-box;

}

.hero-card::after{

  content:"☸";

  position:absolute;

  right:-40px;

  top:-50px;

  font-size:420px;

  color:
  rgba(255,255,255,.025);

  line-height:1;

  pointer-events:none;

}

.hero-card::before{

  content:"";

  position:absolute;

  left:0;
  top:0;
  bottom:0;

  width:6px;

  background:
  linear-gradient(
    180deg,
    #ff9933,
    #ffffff,
    #138808
  );

}

.hero-content{

  position:relative;

  z-index:2;

  display:flex;

  justify-content:space-between;

  align-items:center;

  min-height:160px;

}

.badge{

  display:inline-block;

  padding:8px 16px;

  border-radius:999px;

  margin-bottom:15px;

  background:
  rgba(255,153,51,.12);

  color:#ff9933;

  font-weight:700;

}

.hero-content h1{

  color:white;

  margin:0;

}

.hero-content h2{

  color:#ff9933;

  font-size:2.4rem;

  margin:10px 0;

}

.hero-content p{

  color:
  rgba(255,255,255,.7);

}

.avatar{

  width:140px;

  height:140px;

  border-radius:50%;

  border:
  2px solid #ff9933;

  box-shadow:

  0 0 15px rgba(
    255,153,51,.35
  ),

  0 0 45px rgba(
    255,153,51,.25
  );

}

.badge{

  letter-spacing:1px;

}

.stats-grid{

  display:grid;

  grid-template-columns:
  repeat(3,1fr);

  gap:20px;

  margin-bottom:40px;

}

.stat-card{

  padding:40px;

  border-radius:20px;

  background:#0f0f0f;

  text-align:center;

}

.stat-card span{

  display:block;

  color:
  rgba(255,255,255,.7);

}

.stat-card strong{

  display:block;

  margin-top:10px;

  font-size:2rem;

  color:white;

}

.saffron{

  border:
  1px solid rgba(
    255,153,51,.25
  );

}

.white{

  border:
  1px solid rgba(
    255,255,255,.15
  );

}

.green{

  border:
  1px solid rgba(
    19,136,8,.35
  );

}

.actions-grid{

  display:grid;

  grid-template-columns:
  repeat(3,1fr);

  gap:25px;

}

.action-card{

  text-decoration:none;

  background:#101010;

  border:
  1px solid rgba(
    255,255,255,.08
  );

  border-radius:24px;

  padding:35px;

  color:white;

  transition:.25s;

}

.action-card:hover{

  transform:
  translateY(-5px);

  border-color:#ff9933;

  box-shadow:
  0 0 30px rgba(
    255,153,51,.18
  );

}

.action-card h3{

  margin-top:15px;

  color:white;

}

.review:hover{

  border-color:#138808;

  box-shadow:
  0 0 30px rgba(
    19,136,8,.22
  );

}

@media(max-width:900px){

  .hero-content{

    flex-direction:column;

    gap:25px;

    text-align:center;

  }

  .stats-grid{

    grid-template-columns:1fr;

  }

}

.dashboard{

  background:

  radial-gradient(
    circle at left,
    rgba(255,153,51,.08),
    transparent 30%
  ),

  radial-gradient(
    circle at right,
    rgba(19,136,8,.08),
    transparent 30%
  );

}

</style>