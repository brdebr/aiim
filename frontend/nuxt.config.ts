import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  imports: {
    dirs: ['store'],
  },
  css: ['vuetify/styles'],
  vite: {
    ssr: {
        noExternal: ['vuetify'], // add the vuetify vite plugin
    },
  },
  modules: [
    // this adds the vuetify vite plugin
    // also produces type errors in the current beta release
    async (options, nuxt) => {
        // @ts-ignore
        nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
            vuetify()
        ))
    },
    'nuxt-windicss',
    ['@pinia/nuxt', {
        autoImports: [
          // automatically imports `defineStore`
          'defineStore', // import { defineStore } from 'pinia'
          'storeToRefs', // import { storeToRefs } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      }
    ],
    '@vueuse/nuxt',
    '@kevinmarrec/nuxt-pwa',
  ],
  devServer: {
    host: '0.0.0.0'
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: '', // Overritten by environment variable => NUXT_PUBLIC_API_BASE_URL
    }
  },
  pwa: {
    meta: {
      name: 'AI Image Manager',
      description: 'Application to manage images, vote on them and generate new images calling an API',
      theme_color: '#1a237e',
      lang: 'en',
    },
    manifest: {
      name: 'AI Image Manager',
      short_name: 'AI-IM',
      theme_color: '#1a237e',

    },
    // workbox: {
    //   enabled: true, // <-- for DEV
    // },
  },
})
