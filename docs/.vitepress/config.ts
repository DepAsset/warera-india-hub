import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Warera India Hub',

  description: 'Guides, Politics, Economy and Archives for Warera India',

  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
        '/auth': 'http://localhost:3000',
        '/uploads': 'http://localhost:3000',
        '/debug-session': 'http://localhost:3000',
        '/session-test': 'http://localhost:3000',
        '/session-read': 'http://localhost:3000'
      }
    }
  },

  themeConfig: {
    logo: "/img/india-logo.png",
    nav: [
      { text: 'Guides', link: '/guides/' },
      { text: 'Politics', link: '/politics/' },
      { text: 'Economy', link: '/economy/' },
      { text: 'Diplomacy', link: '/diplomacy/' },
      { text: 'Archives', link: '/archives/' },
      { text: 'Tools', link: '/tools/' }
    ],

    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/g3jm8aGGMv'
      },
      {
        icon: 'instagram',
        link: '#'
      }
    ],

    footer: {
      message: 'Official Knowledge Repository of the Republic of India',
      copyright: '© 2026 Warera India'
    }
  }
})
