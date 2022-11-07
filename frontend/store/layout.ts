export type DrawerItem = {
  label: string;
  icon: string;
  route: string;
};

export const useLayoutStore = definePiniaStore('layout', () => {
  const drawerActive = ref(false)
  const showingDrawerButton = ref(false);

  const backgroundCover = ref('');

  const drawerItems = ref<DrawerItem[]>([
    {
      label: 'Home',
      icon: 'mdi-home',
      route: '/',
    },
    {
      label: 'Gallery',
      icon: 'mdi-image',
      route: '/gallery',
    },
    {
      label: 'Votes',
      icon: 'mdi-vote',
      route: '/votes',
    },
    {
      label: 'Profile',
      icon: 'mdi-account',
      route: '/profile',
    },
  ]);

  return {
    drawerActive,
    drawerItems,
    showingDrawerButton,
    backgroundCover
  }
})