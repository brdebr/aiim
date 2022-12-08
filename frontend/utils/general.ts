import { ImageObject } from "~~/types";

export const scrollToTop = () => {
  window.scrollTo(0, 0);
}

export const getFetchOptions = () => {
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);
  return fetchOptions.value;
}


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
}
