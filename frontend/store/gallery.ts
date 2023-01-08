import { ImageObject } from "~~/types";

export const useGalleryStore = definePiniaStore('gallery', () => {
  const { sendDeleteImage } = useApi();
  const socketStore = useSocketStore();

  const galleryImages = ref<ImageObject[]>([]);

  socketStore.imageFinishedHook.on((imageResponse) => {
    addImage(imageResponse.image);
  });

  const addImage = (image: ImageObject) => {
    galleryImages.value = [image, ...galleryImages.value];
  }

  const removeImage = async (image: ImageObject, callback?: () => Promise<void>) => {
    await sendDeleteImage(image);
    await callback?.();
    galleryImages.value = galleryImages.value.filter((img) => img.id !== image.id);
  }

  return {
    galleryImages,
    addImage,
    removeImage,
  }
});
