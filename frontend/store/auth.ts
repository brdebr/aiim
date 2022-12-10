import { LOCAL_STORAGE_PREFIX as PREFIX } from '~~/constants';
import { LoginInfo } from '~~/types';
import { getApiBaseURL } from '~~/utils/general';

export type LoginResponse = {
  token: string;
  payload: LoginInfo;
};

export const useAuthStore = definePiniaStore('auth', () => {
  const apiBaseURL = getApiBaseURL();

  // Auth state
  const userId = ref('');
  const loginInfo = ref<LoginInfo | null>(null);
  const token = ref('');

  // Local storage state
  const storedUserId = useLocalStorage(`${PREFIX}user-id`, '');
  const storedLoginInfo = useLocalStorage<string>(`${PREFIX}login-info`, '');
  const storedToken = useLocalStorage(`${PREFIX}api-token`, '');

  const loadStorageIntoState = () => {
    if (storedUserId.value) userId.value = storedUserId.value;
    if (storedLoginInfo.value)
      loginInfo.value = JSON.parse(storedLoginInfo.value || '{}') as LoginInfo;
    if (storedToken.value) token.value = storedToken.value;
  };
  const tokenOrStored = computed(() => token.value || storedToken.value);

  const login = async (email: string, password: string) => {
    const loginResponse = await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      ...fetchOptions.value,
    });
    storedToken.value = loginResponse.token;
    storedLoginInfo.value = JSON.stringify(loginResponse.payload);
    storedUserId.value = loginResponse.payload.id;
    loadStorageIntoState();
  };

  const fetchCurrentAuth = async () => {
    const auth = await $fetch<LoginInfo>('/api/auth/current', fetchOptions.value);
    console.log('Fetched current auth:', auth);
    return auth;
  };

  const authHeader = computed(() => ({
    Authorization: `Bearer ${tokenOrStored.value}`,
  }));

  const fetchOptions = computed(() => ({
    baseURL: apiBaseURL,
    headers: authHeader.value,
  }));

  return {
    // Auth state
    userId,
    loginInfo,
    token,
    // Local storage state
    loadStorageIntoState,
    // Methods
    login,
    fetchCurrentAuth,
    // Helpers
    fetchOptions,
    authHeader,
  };
});
