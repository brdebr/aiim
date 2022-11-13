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
  ],
  devServer: {
    host: '0.0.0.0'
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      apiBaseURL: process.env.NUXT_API_BASE_URL
    }
  }
})
