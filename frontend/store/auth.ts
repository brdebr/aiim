import { LOCAL_STORAGE_PREFIX as PREFIX } from '~~/constants';
import { CurrentLoginInfo, LoginInfo } from '~~/types';
import { getApiBaseURL } from '~~/utils/general';
import { skipHydrate } from 'pinia';

export type LoginResponse = {
  token: string;
  info: LoginInfo;
};

export const useAuthStore = definePiniaStore('auth', () => {
  const apiBaseURL = getApiBaseURL();

  const storedLoginInfo = useLocalStorage<Partial<CurrentLoginInfo>>(`${PREFIX}login-data`, {});
  const storedToken = useLocalStorage<string>(`${PREFIX}token`, '');

  const login = async (email: string, password: string) => {
    const loginResponse = await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      ...fetchOptions.value,
    });
    storedToken.value = loginResponse.token;
    storedLoginInfo.value = loginResponse.info;
  };

  const cleanAuth = () => {
    storedToken.value = '';
    storedLoginInfo.value = {};
  };

  const fetchCurrentAuth = async () => {
    const auth = await $fetch<CurrentLoginInfo>('/api/auth/current', fetchOptions.value);
    storedLoginInfo.value = auth;
  };

  const authHeader = computed(() => ({
    Authorization: `Bearer ${storedToken.value}`,
  }));

  const fetchOptions = computed(() => ({
    baseURL: apiBaseURL,
    headers: authHeader.value,
  }));

  const minutesToExpire = () => {
    const nowDate = new Date().getTime();
    const expDate = new Date(storedLoginInfo.value.exp || 0).getTime();

    return (Math.round((expDate - nowDate) / 1000)) / 60;
  };

  return {
    // Auth state
    token: skipHydrate(storedToken),
    loginInfo: skipHydrate(storedLoginInfo),
    // Methods
    login,
    cleanAuth,
    fetchCurrentAuth,
    // Helpers
    fetchOptions,
    authHeader,
    minutesToExpire,
  };
});
