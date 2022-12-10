import { ImageObject } from "~~/types";

export const useClipboardStore = definePiniaStore('clipboard', () => {

  const clipboard = ref<ImageObject[]>([]);

  const addImage = (image: ImageObject) => {
    clipboard.value.push(image);
  }

  const removeImage = (image: ImageObject) => {
    clipboard.value = clipboard.value.filter((img) => img.id !== image.id);
  }

  const clearClipboard = () => {
    clipboard.value = [];
  }

  return {
    clipboard,
    addImage,
    removeImage,
    clearClipboard
  }
});
