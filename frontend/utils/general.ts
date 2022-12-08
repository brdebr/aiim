export const scrollToTop = () => {
  window.scrollTo(0, 0);
}

export const getFetchOptions = () => {
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);
  return fetchOptions.value;
}
