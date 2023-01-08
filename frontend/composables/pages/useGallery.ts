import { ImageObject } from '~~/types';
import { getRouteQry, scrollToTop } from '~~/utils/general';
import { ImageSearchType, useSearchLogic } from '~~/composables/useSearchLogic';

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
  const { fetchImagesPage, fetchImagesSearchPage, fetchTotalImages } = useApi();

  onMounted(async () => {
    [ totalImages.value ] = await Promise.all([
      fetchTotalImages(),
      fetchInitialImages(),
    ]);
  });

  const pageIdFromQuery = getRouteQry('page');
  watch(pageIdFromQuery, async (newPageQuery) => {
    if (newPageQuery) {
      return;
    }
    await fetchInitialImages();
  });

  const allImages = ref<ImageObject[]>([]);
  const totalImages = ref(0);
  const loadingInitialImages = ref(false);

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
  const {
    foundImages,
    searchFirstPage,
    searchNextPage,
    searchObj,
    totalSearchResults,
    clearSearchObj,
    clearSearchResult
  } = useSearchLogic<ImageObject>({
    pageSize: DEFAULT_GALLERY_PAGE_SIZE,
    searchFn: async (params: ImageSearchType, query?: URLSearchParams) => {
      const searchImagesResult = await fetchImagesSearchPage(params, query);
      return searchImagesResult;
    }
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


  return {
    allImages,
    fetchNextImages,
    totalImages,
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
