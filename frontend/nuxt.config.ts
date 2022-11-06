import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
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
    }
  ]
})
