export const useLayoutStore = definePiniaStore('layout', () => {
  const drawerActive = ref(false)
  const showingDrawerButton = ref(false);

  const backgroundCover = ref('');

  return {
    drawerActive,
    showingDrawerButton,
    backgroundCover
  }
})