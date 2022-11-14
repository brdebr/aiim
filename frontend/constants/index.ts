const apiBaseUrlDev = import.meta.env.DEV ? 'http://192.168.1.132:3005' : '';
export const LOCAL_STORAGE_PREFIX = 'aiim-';

export const useApiBaseURL = () => {
  const config = useRuntimeConfig();
  const apiBaseUrlEnv = config?.public?.apiBaseUrl;
  return apiBaseUrlDev || apiBaseUrlEnv;
}