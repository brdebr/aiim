import { apiBaseURL } from "~~/constants";
import { ImageObject } from "~~/types";

export const useLogin = async () => {
  const router = useRouter();

  onUnmounted(() => {
    backgroundCover.value = '';
  });

  const layoutStore = useLayoutStore();
  const { backgroundCover } = storeToRefs(layoutStore);

  const authStore = useAuthStore();

  const loginEmail = ref("");
  const loginPassword = ref("mypassucu");

  const loading = ref(false);

  const { data: randomCovers } = await useAsyncData<ImageObject[]>('initial-login-cover-fetch', () => $fetch('/api/images/random-cover', { baseURL: apiBaseURL }))
  backgroundCover.value = randomCovers?.value?.[0].id || '';


  const executeLogin = async () => {
    loading.value = true;

    await authStore.login(loginEmail.value, loginPassword.value);

    loading.value = false;

    router.push("/gallery");
  };

  return {
    // Form
    loginEmail,
    loginPassword,
    loading,
    // Methods
    executeLogin,
  }
}