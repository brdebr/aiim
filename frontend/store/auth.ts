import { LOCAL_STORAGE_PREFIX as PREFIX } from '~~/constants';
import { CurrentLoginInfo, LoginInfo } from '~~/types';
import { getApiBaseURL } from '~~/utils/general';
import { skipHydrate } from 'pinia';

export type LoginResponse = {
  token: string;
  info: LoginInfo;
};

export type FetchOptionsType = {
  baseURL: string;
  headers: {
    Authorization: string;
  };
};

export const useAuthStore = definePiniaStore('auth', () => {
  const storedLoginInfo = useLocalStorage<Partial<CurrentLoginInfo>>(`${PREFIX}login-data`, {});
  const storedToken = useLocalStorage<string>(`${PREFIX}token`, '');

  const fetchOptions = computed<FetchOptionsType>(() => ({
    baseURL: apiBaseURL,
    headers: authHeader.value,
  }));
  const apiBaseURL = getApiBaseURL();
  const authHeader = computed(() => ({
    Authorization: `Bearer ${storedToken.value}`,
  }));

  const { sendLogin, fetchCurrentAuth } = useApi(fetchOptions.value);

  const login = async (email: string, password: string) => {
    const loginResponse = await sendLogin(email, password)
    storedToken.value = loginResponse.token;
    storedLoginInfo.value = loginResponse.info;
  };

  const cleanAuth = () => {
    storedToken.value = '';
    storedLoginInfo.value = {};
  };

  const refreshCurrentAuth = async () => {
    const auth = await fetchCurrentAuth();
    storedLoginInfo.value = auth;
  };

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
    refreshCurrentAuth,
    // Helpers
    fetchOptions,
    authHeader,
    minutesToExpire,
  };
});
