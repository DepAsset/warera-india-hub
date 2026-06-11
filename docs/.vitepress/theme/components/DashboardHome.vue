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
            {{ user && user.role ? user.role.toUpperCase() : "AUTHOR" }}
          </div>

          <h1>
            Welcome Back,
          </h1>

          <h2>
            {{ user?.username || "Guest" }}
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
        <span
          class="dot"
          :class="country ? 'online' : 'offline'"
        ></span>
        Warera Network
        {{ country ? "Connected" : "Unavailable" }}
      </div>

    </div>
    <div class="stats-grid">

      <div class="stat-card saffron">

        <span>
          Guides
        </span>

        <strong>
          {{ stats.total }}
        </strong>

      </div>

      <div class="stat-card white">

        <span>
          Pending
        </span>

        <strong>
          {{ stats.pending }}
        </strong>

      </div>

      <div class="stat-card green">

        <span>
          Approved
        </span>

        <strong>
          {{ stats.approved }}
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
          user &&
          (
            user.role === 'admin' ||
            user.role === 'supervisor'
          )
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
        <strong>{{ displayValue(country?.citizens) }}</strong>
      </div>

      <div>
        <span>Development Rank</span>
        <strong>
          {{ country?.developmentRank
            ? `#${country.developmentRank}`
            : "--" }}
        </strong>
      </div>

      <div>
        <span>Production Bonus</span>
        <strong>
          {{ country?.productionBonus != null
            ? `${country.productionBonus}%`
            : "--" }}
        </strong>
      </div>

      <div>
        <span>Allies</span>
        <strong>{{ displayValue(country?.allies) }}</strong>
      </div>

      <div>
        <span>Current Wars</span>
        <strong>{{ displayValue(country?.currentWars) }}</strong>
      </div>

    </div>

  </div>

  <div class="intel-card">

      <h3>
        LATEST ACTIVITY
      </h3>

      <div class="activity-feed">

        <div
          v-for="guide in recentGuides.slice(0, 4)"
          :key="guide.id"
          class="activity-entry"
        >
          <span
            class="activity-dot"
            :class="guide.status"
          ></span>

          <span>
            {{ guide.title }}
            <small>
              {{ statusLabel(guide.status) }}
            </small>
          </span>
        </div>

        <div
          v-if="!recentGuides.length"
          class="empty-state"
        >
          No guide activity yet.
        </div>

      </div>

    </div>

  </div>

  <div class="recent-guides">

    <h3>
      RECENT OPERATIONS
    </h3>

    <div
      v-if="recentGuides.length"
      class="operations-list"
    >

      <a
        v-for="guide in recentGuides"
        :key="guide.id"
        :href="guideUrl(guide)"
        class="operation-row"
      >

        <div>
          <strong>{{ guide.title }}</strong>
          <span>{{ formatDate(guide.created_at) }}</span>
        </div>

        <span
          class="status-pill"
          :class="guide.status"
        >
          {{ statusLabel(guide.status) }}
        </span>

      </a>

    </div>

    <div
      v-else
      class="guide-placeholder"
    >

      Your guide activity will appear here.

    </div>

  </div>
  </template>

  <div
    v-else
    class="error-state"
  >
    {{ errorMessage }}
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

const user = ref(null)
const loading = ref(true)
const errorMessage =
  ref("Please log in to view the dashboard.")
const stats =
  ref({
    total: 0,
    pending: 0,
    approved: 0
  })
const country = ref(null)
const recentGuides = ref([])

const avatarUrl =
  computed(() => {

    if (!user.value)
      return ""

    return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png`

  })

function displayValue(value) {

  return value ?? "--"

}

function statusLabel(status) {

  const labels = {
    pending: "Pending review",
    approved: "Approved",
    rejected: "Needs changes"
  }

  return labels[status] || status

}

function formatDate(value) {

  if (!value)
    return "Date unavailable"

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(new Date(value))

}

function guideUrl(guide) {

  if (
    guide.status === "approved" &&
    guide.slug
  ) {
    return `/guide?slug=${guide.slug}`
  }

  if (
    user.value?.role === "admin" ||
    user.value?.role === "supervisor"
  ) {
    return "/dashboard/review-guides/"
  }

  return `/dashboard/edit-guide?id=${guide.id}`

}

async function loadDashboard() {

  try {

    const [userResponse, dashboardResponse] =
      await Promise.all([
        fetch(
          `${API_URL}/api/me`,
          {
            credentials: "include"
          }
        ),
        fetch(
          `${API_URL}/api/dashboard`,
          {
            credentials: "include"
          }
        )
      ])

    const userData =
      await userResponse.json()

    if (!userData.loggedIn) {
      return
    }

    user.value = userData.user

    if (!dashboardResponse.ok) {
      throw new Error(
        "Dashboard data is currently unavailable."
      )
    }

    const dashboardData =
      await dashboardResponse.json()

    stats.value = dashboardData.stats
    country.value = dashboardData.country
    recentGuides.value =
      dashboardData.recentGuides || []

  } catch(err) {

    console.error(err)

    errorMessage.value =
      err.message ||
      "Dashboard data is currently unavailable."

  } finally {

    loading.value = false

  }

}

onMounted(loadDashboard)

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

.offline{

  background:#ff5f57;

  box-shadow:
  0 0 12px rgba(255,95,87,.7);

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

.activity-entry{

  display:flex;

  align-items:flex-start;

  gap:12px;

}

.activity-entry small{

  display:block;

  margin-top:3px;

  color:rgba(255,255,255,.55);

}

.activity-dot{

  flex:0 0 auto;

  width:9px;

  height:9px;

  margin-top:6px;

  border-radius:50%;

  background:#ff9933;

}

.activity-dot.approved{

  background:#20d96b;

}

.activity-dot.rejected{

  background:#ff5f57;

}

.empty-state,
.error-state{

  color:rgba(255,255,255,.65);

}

.error-state{

  padding:90px 48px;

  text-align:center;

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

.operations-list{

  display:flex;

  flex-direction:column;

}

.operation-row{

  display:flex;

  align-items:center;

  justify-content:space-between;

  gap:20px;

  padding:16px 0;

  border-bottom:
  1px solid rgba(255,255,255,.07);

  color:white;

  text-decoration:none;

}

.operation-row:last-child{

  border-bottom:none;

}

.operation-row strong,
.operation-row span{

  display:block;

}

.operation-row div > span{

  margin-top:5px;

  color:rgba(255,255,255,.55);

  font-size:.85rem;

}

.status-pill{

  flex:0 0 auto;

  padding:7px 11px;

  border-radius:999px;

  background:rgba(255,153,51,.12);

  color:#ffb15c;

  font-size:.8rem;

  font-weight:700;

}

.status-pill.approved{

  background:rgba(32,217,107,.12);

  color:#62e99a;

}

.status-pill.rejected{

  background:rgba(255,95,87,.12);

  color:#ff8b85;

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

  max-width:1600px;

  margin:0 auto;

  padding:90px 48px 40px;

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

  .dashboard{

    padding:
    70px 20px 32px;

  }

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
