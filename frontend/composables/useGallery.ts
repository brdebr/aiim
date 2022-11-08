import { useRouteQuery } from "@vueuse/router";
import { ImageObject } from "~~/types";

export type ImageObjectsPageResponse = ImageObject[]

export type useGalleryConfig = Partial<{
  pageId: string;
  pageSize: number;
}>

export const DEFAULT_GALLERY_PAGE_SIZE = 25;
const DEFAULT_GALLERY_FIRST_PAGE_SIZE = 55;

export const useGallery = async (pageSize = DEFAULT_GALLERY_PAGE_SIZE, firstPageSize = DEFAULT_GALLERY_FIRST_PAGE_SIZE) => {
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);

  onMounted(async () => {
    Promise.all([
      fetchInitialImages(),
    ]);
  });

  const pageIdFromQuery = useRouteQuery("pageId", '');
  watch(pageIdFromQuery, async (newPageQuery) => {
    if (newPageQuery){
      return;
    }
    await fetchInitialImages();
  });

  const allImages = ref<ImageObject[]>([]);

  const getImagesPage = async (pageId: string, pageSize: number = DEFAULT_GALLERY_PAGE_SIZE) => {
    const query = new URLSearchParams({
      page: pageId,
      size: pageSize.toString(),
    });
    const endpoint = `/api/images?${query.toString()}`;
    const response = await $fetch<ImageObjectsPageResponse>(endpoint, fetchOptions.value);
    return response;
  };

  const fetchInitialImages = async () => {
    const images = await getImagesPage(pageIdFromQuery.value, firstPageSize);
    allImages.value = images;
  };

  const fetchNextImages = async () => {
    if (allImages.value.length === 0) {
      return;
    }
    const lastImageId = allImages.value[allImages.value.length - 1].id;
    const newPage = await getImagesPage(lastImageId, pageSize);
    allImages.value = allImages.value.concat(newPage);
    return lastImageId;
  };

  // Total Images
  const fetchTotalImages = async () => {
    const endpoint = `/api/images/total`;
    const response = await $fetch<number>(endpoint, fetchOptions.value);
    return response;
  };
  const { data: imagesCount } = await useAsyncData<number>('initial-gallery-image-count-fetch',fetchTotalImages);

  return {
    allImages,
    fetchNextImages,
    imagesCount,
    pageIdFromQuery,
  }
}