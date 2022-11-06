export const useLayoutStore = definePiniaStore('layout', () => {
  const drawerActive = ref(false)
  const showingDrawerButton = ref(false);

  return {
    drawerActive,
    showingDrawerButton,
  }
})