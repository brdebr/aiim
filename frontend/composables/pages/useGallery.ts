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
  const galleryStore = useGalleryStore();
  const { galleryImages } = storeToRefs(galleryStore);

  onMounted(() => {
    Promise.all([
      fetchInitialTotalImages(),
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

  const totalImages = ref(0);
  const fetchInitialTotalImages = async () => {
    totalImages.value = await fetchTotalImages();
  };

  const fetchInitialImages = async (forceInitial?: boolean) => {
    const images = await fetchImagesPage(
      forceInitial ? '' : pageIdFromQuery.value,
      firstPageSize
    );
    galleryImages.value = images;
  };

  const fetchNextImages = async () => {
    if (galleryImages.value.length === 0) {
      return;
    }
    const lastImageId = galleryImages.value[galleryImages.value.length - 1].id;
    const newPage = await fetchImagesPage(lastImageId, pageSize);
    galleryImages.value = galleryImages.value.concat(newPage);
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
    galleryImages.value = foundImages.value || [];
  };
  const performSearchNextPage = async () => {
    await searchNextPage();
    galleryImages.value = foundImages.value || [];
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
    allImages: galleryImages,
    fetchNextImages,
    totalImages,
    pageIdFromQuery,
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
