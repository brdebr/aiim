import { ImageObject } from '~~/types';
import { apiBaseUrlDev } from '~~/constants';

type SoundsPaths = 'notification-pretty-good.mp3';

const baseSoundsPath = '/sound';

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const getFetchOptions = () => {
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);
  return fetchOptions.value;
};

export const getApiBaseURL = () => {
  const config = useRuntimeConfig();
  const apiBaseUrlEnv = config?.public?.apiBaseUrl;
  return apiBaseUrlDev || apiBaseUrlEnv;
};

export const getRouteQry = (prop: string) => {
  const route = useRoute();
  return computed<string>(() => {
    return [route.query[prop]].flat().join('');
  });
};

export const playSound = async (soundUrl: SoundsPaths) => {
  const audio = new Audio(`${baseSoundsPath}/${soundUrl}`);
  await audio.play();
};

export const getImageDimensions = (image: ImageObject) => {
  const { width, height } = image;
  const ratio = width / height;
  const isLandscape = ratio > 1.05;
  const isPortrait = ratio < 0.95;
  return {
    width,
    height,
    isTall: isPortrait,
    isWide: isLandscape,
  };
};
