import { storeToRefs } from "pinia";
import { apiBaseURL } from "~~/constants";
import { useLayoutStore } from "./layout";
import { useStorage } from '@vueuse/core'

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
  const storedUserId = useStorage('aiim-user-id', '');
  const storedLoginInfo = useStorage<string>('aiim-login-info', '');
  const storedToken = useStorage('aiim-api-token', '');

  const userId = ref('');
  const loginInfo = ref<LoginInfo | null>(null);
  const token = ref('');

  const loadStoredIntoState = () => {
    if (storedUserId.value) {
      userId.value = storedUserId.value;
    }
    if (storedLoginInfo.value) {
      loginInfo.value = JSON.parse(storedLoginInfo.value || '{}') as LoginInfo;
    }
    if (storedToken.value) {
      token.value = storedToken.value;
    }
  }

  const authHeader = computed(() => ({
    'Authorization': `Bearer ${token.value || storedToken.value}`
  }));

  const fetchUser = async () => {
    const user = await $fetch<LoginInfo>('/api/users/me', { baseURL: apiBaseURL, headers: authHeader.value });
    console.log('Fetched current user:',user);
    return {...user, role: 'user'};
  }

  const login = async (email: string, password: string) => {
    const loginResponse = await $fetch<loginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      baseURL: apiBaseURL,
    });
    storedToken.value = loginResponse.token;
    storedLoginInfo.value = JSON.stringify(loginResponse.payload);
    storedUserId.value = loginResponse.payload.id;

    loadStoredIntoState();
    return loginInfo;
  };

  return {
    userId,
    loginInfo,
    token,
    authHeader,
    login,
    loadStoredIntoState,
    fetchUser,
  }
})