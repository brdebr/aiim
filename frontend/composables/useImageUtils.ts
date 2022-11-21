import { ImageObject } from '~~/types';


export const useImageUtils = () => {
  // TODO: move to utils folder

  const getDimensions = (image: ImageObject) => {
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

  return {
    getDimensions,
  }
}