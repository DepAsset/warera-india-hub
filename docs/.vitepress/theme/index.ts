import DefaultTheme from 'vitepress/theme'

import './custom.css'

import HomeSections from './components/HomeSections.vue'
import RepublicStats from './components/RepublicStats.vue'
import LoginButton from './components/LoginButton.vue'
import CategoryGrid from './components/CategoryGrid.vue'
import GuideList from './components/GuideList.vue'
import DashboardHome from './components/DashboardHome.vue'
import GuideCreator from "./components/GuideCreator.vue"
import ReviewGuides from "./components/ReviewGuides.vue"
import GuidePage from "./components/GuidePage.vue"
import MyGuides from "./components/MyGuides.vue"
import EditGuide
from "./components/EditGuide.vue"

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.component('HomeSections', HomeSections)
    app.component('RepublicStats', RepublicStats)
    app.component('LoginButton', LoginButton)
    app.component('CategoryGrid',CategoryGrid)
    app.component('GuideList',GuideList)
    app.component('DashboardHome', DashboardHome)
    app.component('GuideCreator', GuideCreator)
    app.component('ReviewGuides', ReviewGuides)
    app.component('GuidePage', GuidePage)
    app.component("MyGuides",  MyGuides)
    app.component(
  "EditGuide",
  EditGuide
)
  },

  setup() {
    if (typeof window === 'undefined') return

    setTimeout(() => {

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
            }
          })
        },
        {
          threshold: 0.15
        }
      )

      document
        .querySelectorAll('.reveal')
        .forEach((el) => observer.observe(el))

    }, 500)
  }
}