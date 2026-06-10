<template>
  <section class="stats-section">

    <div class="stats-grid">

      <div class="stat-card">
        <div class="stat-value">{{ stats.population }}</div>
        <div class="stat-label">Active Citizens</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">#{{ stats.devRank }}</div>
        <div class="stat-label">Development Rank</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.productionBonus }}%</div>
        <div class="stat-label">Production Bonus</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.allies }}</div>
        <div class="stat-label">Allies</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.wars }}</div>
        <div class="stat-label">Current Wars</div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  population: '...',
  devRank: '...',
  productionBonus: '...',
  allies: '...',
  wars: '...'
})

async function loadStats() {

  try {

    const response = await fetch(
      'https://api3.warera.io/trpc/country.getCountryById',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          countryId: '6813b6d546e731854c7ac862'
        })
      }
    )

    const json = await response.json()

    const country = json.result.data

    stats.value = {
      population:
        country.rankings.countryActivePopulation.value,

      devRank:
        country.rankings.countryDevelopment.rank,

      productionBonus:
        country.rankings.countryProductionBonus.value,

      allies:
        country.allies.length,

      wars:
        country.warsWith.length
    }

  } catch (err) {

    console.error(err)

  }
}

onMounted(loadStats)
</script>