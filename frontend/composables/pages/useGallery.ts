import { ImageObject } from '~~/types';
import { getFetchOptions, getRouteQry, scrollToTop } from '~~/utils/general';
import { ImageSearchResultType, ImageSearchType, useSearchLogic } from '~~/composables/useSearchLogic';

export type ImageObjectsPageResponse = ImageObject[];

export type useGalleryConfig = Partial<{
  pageId: string;
  pageSize: number;
}>;


export const DEFAULT_GALLERY_PAGE_SIZE = 25;
const DEFAULT_GALLERY_FIRST_PAGE_SIZE = 55;

export const useGallery = async (
  pageSize = DEFAULT_GALLERY_PAGE_SIZE,
  firstPageSize = DEFAULT_GALLERY_FIRST_PAGE_SIZE
) => {
  const router = useRouter();
  const fetchOptions = getFetchOptions();

  onMounted(async () => {
    Promise.all([fetchInitialImages()]);
  });

  const pageIdFromQuery = getRouteQry('page');
  watch(pageIdFromQuery, async (newPageQuery) => {
    if (newPageQuery) {
      return;
    }
    await fetchInitialImages();
  });

  const allImages = ref<ImageObject[]>([]);

  const loadingInitialImages = ref(false);

  const fetchImagesPage = async (
    pageId: string,
    pageSize: number = DEFAULT_GALLERY_PAGE_SIZE
  ) => {
    const query = new URLSearchParams({
      page: pageId,
      size: pageSize.toString(),
    });
    const endpoint = `/api/images?${query.toString()}`;
    const response = await $fetch<ImageObjectsPageResponse>(
      endpoint,
      fetchOptions
    );
    return response;
  };

  const fetchInitialImages = async (forceInitial?: boolean) => {
    loadingInitialImages.value = true;
    const images = await fetchImagesPage(
      forceInitial ? '' : pageIdFromQuery.value,
      firstPageSize
    );
    allImages.value = images;
    loadingInitialImages.value = false;
  };

  const fetchNextImages = async () => {
    if (allImages.value.length === 0) {
      return;
    }
    const lastImageId = allImages.value[allImages.value.length - 1].id;
    const newPage = await fetchImagesPage(lastImageId, pageSize);
    allImages.value = allImages.value.concat(newPage);
    return lastImageId;
  };

  // Search
  const searchFn = async (params: ImageSearchType, query?: URLSearchParams) => {
    const endpoint = `/api/images/search${query ? `?${query.toString()}` : ''}`;

    const searchImagesResult = await $fetch<ImageSearchResultType<ImageObject>>(
      endpoint,
      {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return searchImagesResult;
  }

  const { foundImages, searchFirstPage, searchNextPage, searchObj, totalSearchResults, clearSearchObj, clearSearchResult } = useSearchLogic<ImageObject>({
    pageSize: DEFAULT_GALLERY_PAGE_SIZE,
    searchFn,
  })

  const performSearch = async () => {
    scrollToTop();
    await searchFirstPage();
    allImages.value = foundImages.value || [];
  };
  const performSearchNextPage = async () => {
    await searchNextPage();
    allImages.value = foundImages.value || [];
  };

  const clearSearch = async () => {
    clearSearchObj();
    scrollToTop();
    fetchInitialImages(true);
  };

  const refresh = () => {
    scrollToTop();
    clearSearchResult();
    router.push('/gallery');
  };

  // Total Images
  const fetchTotalImages = async () => {
    const endpoint = `/api/images/total`;
    const response = await $fetch<number>(endpoint, fetchOptions);
    return response;
  };
  const { data: imagesCount } = await useAsyncData<number>(
    'initial-gallery-image-count-fetch',
    fetchTotalImages
  );

  return {
    allImages,
    fetchNextImages,
    imagesCount,
    pageIdFromQuery,
    loadingInitialImages,
    fetchInitialImages,
    refresh,
    searchObj,
    totalSearchResults,
    clearSearch,
    performSearch,
    performSearchNextPage,
    foundImages,
  };
};
