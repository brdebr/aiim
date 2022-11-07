import { ImageObject } from "~~/types";

export type ImageObjectsPageResponse = ImageObject[]

export type useGalleryConfig = Partial<{
  pageId: string;
  pageSize: number;
}>

export const DEFAULT_GALLERY_PAGE_SIZE = 25;
const DEFAULT_GALLERY_FIRST_PAGE_SIZE = DEFAULT_GALLERY_PAGE_SIZE + 35;

export const useGallery = (config?: useGalleryConfig) => {
  const fetchOptions = useFetchOptions();
  const route = useRoute();

  const pageFromRouteOrEmpty = computed<string>(() => ([route.query.page].flat().join("")));

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
    const images = await getImagesPage(pageFromRouteOrEmpty.value, DEFAULT_GALLERY_FIRST_PAGE_SIZE);
    allImages.value = images;
  };

  const fetchNextImages = async () => {
    if (allImages.value.length === 0) {
      return;
    }
    const lastImageId = allImages.value[allImages.value.length - 1].id;
    const newPage = await getImagesPage(lastImageId);
    allImages.value = allImages.value.concat(newPage);
    return lastImageId;
  };

  // Total Images
  const imagesCount = ref('');
  const fetchTotalImages = async () => {
    const endpoint = `/api/images/total`;
    const response = await $fetch<number>(endpoint, fetchOptions.value);
    imagesCount.value = response.toString();
    return response;
  };


  onMounted(async () => {
    Promise.all([
      fetchTotalImages(),
      fetchInitialImages(),
    ]);
  });

  return {
    allImages,
    fetchNextImages,
    imagesCount,
    pageFromRouteOrEmpty,
  }
}