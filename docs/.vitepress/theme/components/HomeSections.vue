<template>

<div class="portal-section">

  <h2 class="section-heading">
    Explore What We Offer
  </h2>

  <div class="portal-grid">

    <a href="/guides/" class="portal-card reveal">
      <span class="portal-icon">📖</span>
      <h3>Citizen Guides</h3>
      <p>
        Learn politics, companies, warfare,
        economics and everything needed
        to become a successful citizen.
      </p>
    </a>

    <a href="/politics/" class="portal-card reveal">
      <span class="portal-icon">🏛️</span>
      <h3>Politics</h3>
      <p>
        Government records, elections,
        ministries and national leadership.
      </p>
    </a>

    <a href="/economy/" class="portal-card reveal">
      <span class="portal-icon">📈</span>
      <h3>Economy</h3>
      <p>
        Production data, economic intelligence,
        companies and financial resources.
      </p>
    </a>

    <a href="/diplomacy/" class="portal-card reveal">
      <span class="portal-icon">🌍</span>
      <h3>Diplomacy</h3>
      <p>
        Foreign relations, treaties,
        embassies and international affairs.
      </p>
    </a>

    <a href="/archives/" class="portal-card reveal">
      <span class="portal-icon">🗃️</span>
      <h3>National Archives</h3>
      <p>
        Historical records, legislation
        and preserved national documents.
      </p>
    </a>

    <a href="/tools/" class="portal-card reveal">
      <span class="portal-icon">🛠️</span>
      <h3>Tools</h3>
      <p>
        Community utilities and resources
        created for Indian citizens.
      </p>
    </a>

  </div>

</div>

</template>

<style scoped>

.portal-section{
  max-width:1400px;
  margin:0 auto;
  padding:80px 30px;
}

.portal-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:30px;
}

.portal-card{
  display:block;

  text-decoration:none;

  padding:35px;

  border-radius:24px;

  background:
  linear-gradient(
    180deg,
    rgba(8,25,60,.95),
    rgba(4,15,40,.95)
  );

  border:1px solid rgba(255,255,255,.08);

  transition:.25s;
}

.portal-card:hover{
  transform:translateY(-6px);

  border-color:#ff9933;

  box-shadow:
    0 20px 40px rgba(255,153,51,.15);
}

.portal-icon{
  font-size:2.4rem;
}

.portal-card h3{
  margin-top:15px;
  margin-bottom:15px;

  color:#ff9933;
}

.portal-card p{
  color:rgba(255,255,255,.75);

  line-height:1.7;
}

@media(max-width:1000px){

  .portal-grid{
    grid-template-columns:1fr;
  }

}

</style>