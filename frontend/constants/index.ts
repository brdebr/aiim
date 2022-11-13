export const apiBaseURL = import.meta.env.DEV ? 'http://192.168.1.132:3005' : 'https://ai.home.bryan-web.dev';
export const LOCAL_STORAGE_PREFIX = 'aiim-';

export const useApiBaseURL = () => {
  const config = useRuntimeConfig();
  return config.public.apiBaseURL || apiBaseURL;
}