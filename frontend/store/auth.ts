import { storeToRefs } from "pinia";
import { apiBaseURL } from "~~/constants";
import { useLayoutStore } from "./layout";

export type loginResponse = {
  token: string;
  payload: LoginInfo;
};

export type LoginInfo = {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export const useAuthStore = definePiniaStore('auth', () => {
  const userId = ref('');
  const loginInfo = ref<LoginInfo | null>(null);
  const layoutStore = useLayoutStore();
  const { backgroundCover } = storeToRefs(layoutStore);

  const token = ref('');
  const authHeader = computed(() => ({
    'Authorization': `Bearer ${token.value}`
  }));

  const login = async (email: string, password: string) => {
    const loginResponse = await $fetch<loginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      baseURL: apiBaseURL,
    });
    token.value = loginResponse.token;
    loginInfo.value = loginResponse.payload;
    backgroundCover.value = '';
    return loginInfo;
  };

  return {
    userId,
    loginInfo,
    token,
    authHeader,
    login,
  }
})