export const useLayoutStore = definePiniaStore('layout', () => {

  const rightDrawerIsTemporary = ref(false)
  const rightDrawerVisible = ref(false)
  const rightDrawerActive = ref(false)

  const breakpoints = useBreakpoints({
    mobile: 915,
    wide: 1080,
  })
  
  const drawerWidth = computed(() => {
    if(breakpoints.isSmallerOrEqual('mobile')) return 325;
    if(breakpoints.isSmallerOrEqual('wide')) return 400;
    return 500;
  })

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
      icon: 'mdi-account-cog',
      route: '/profile'
    },
  ])

  return {
    rightDrawerIsTemporary,
    rightDrawerActive,
    rightDrawerVisible,
    drawerWidth,
    breakpoints,
    bottomNavigationItems,
  }
})