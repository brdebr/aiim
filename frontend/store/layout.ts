export const useLayoutStore = definePiniaStore('layout', () => {
  const bottomNavigationItems = ref([
    {
      label: 'Card game',
      icon: 'mdi-cards-outline',
      route: '/play'
    },
    {
      label: 'Gallery',
      icon: 'mdi-image-search',
      route: '/gallery'
    },
    {
      label: 'Generate',
      icon: 'mdi-brain',
      route: '/generate'
    },
    {
      label: 'Votes',
      icon: 'mdi-thumbs-up-down',
      route: '/votes'
    },
    {
      label: 'Profile',
      icon: 'mdi-account',
      route: '/profile'
    },
  ])

  return {
    bottomNavigationItems,
  }
})