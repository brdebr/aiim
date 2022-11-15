import { apiBaseUrlDev } from "~~/constants";

export const useApiBaseURL = () => {
  const config = useRuntimeConfig();
  const apiBaseUrlEnv = config?.public?.apiBaseUrl;
  return apiBaseUrlDev || apiBaseUrlEnv;
}