import { apiBaseURL } from "~~/constants";

export const useFetchOptions = () => {
  const authStore = useAuthStore();
  const { authHeader } = storeToRefs(authStore);
  const fetchOptions = computed(() => ({
    baseURL: apiBaseURL,
    headers: authHeader.value,
  }));
  return fetchOptions;
}