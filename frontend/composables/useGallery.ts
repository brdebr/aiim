import { ImageObject } from "~~/types";
import { Samplers, modelHashesMap } from '~~/constants';
import { scrollToTop } from "~~/utils/general";

export type ImageObjectsPageResponse = ImageObject[]

export type useGalleryConfig = Partial<{
  pageId: string;
  pageSize: number;
}>

const modelsAsPairs = Object.entries(modelHashesMap);

export type ImageSearchType = {
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfg: number;
  width: number;
  height: number;
  sampler: typeof Samplers[number];
  model: typeof modelsAsPairs[number][1];
}

export const DEFAULT_GALLERY_PAGE_SIZE = 25;
const DEFAULT_GALLERY_FIRST_PAGE_SIZE = 55;

export const useGallery = async (pageSize = DEFAULT_GALLERY_PAGE_SIZE, firstPageSize = DEFAULT_GALLERY_FIRST_PAGE_SIZE) => {
  const router = useRouter();
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);

  onMounted(async () => {
    Promise.all([
      fetchInitialImages(),
    ]);
  });

  const pageIdFromQuery = useRouteQry('page');
  watch(pageIdFromQuery, async (newPageQuery) => {
    if (newPageQuery){
      return;
    }
    await fetchInitialImages();
  });

  const allImages = ref<ImageObject[]>([]);

  const loadingInitialImages = ref(false);

  const isSearchMode = ref(false);
  const searchObj = reactive<Partial<ImageSearchType>>({});
  const totalSearchResults = ref(0);

  const getImagesPage = async (pageId: string, pageSize: number = DEFAULT_GALLERY_PAGE_SIZE) => {
    const query = new URLSearchParams({
      page: pageId,
      size: pageSize.toString(),
    });
    const endpoint = `/api/images?${query.toString()}`;
    const response = await $fetch<ImageObjectsPageResponse>(endpoint, fetchOptions.value);
    return response;
  };

  const fetchInitialImages = async (forceInitial?: boolean) => {
    loadingInitialImages.value = true;
    const images = await getImagesPage(forceInitial ? '' : pageIdFromQuery.value, firstPageSize);
    allImages.value = images;
    loadingInitialImages.value = false;
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

  const search = async (search: Partial<ImageSearchType>) => {
    isSearchMode.value = true;
    const endpoint = '/api/images/search';

    const searchObjFiltered = Object.fromEntries(Object.entries(search).filter(([_, v]) => v !== null));

    const images = await $fetch<{result: ImageObject[], count: number}>(endpoint, {
      ...fetchOptions.value,
      method: 'POST',
      body: JSON.stringify(searchObjFiltered),
    });
    totalSearchResults.value = images.count;
    return images.result;
  }

  const searchNextPage = async () => {
    const lastImageId = allImages.value[allImages.value.length - 1].id;
    const query = new URLSearchParams({
      page: lastImageId,
      size: pageSize.toString(),
    });
    const endpoint = `/api/images/search?${query.toString()}`;

    const searchObjFiltered = Object.fromEntries(Object.entries(searchObj).filter(([_, v]) => v !== null));
    
    const images = await $fetch<{result: ImageObject[], count: number}>(endpoint, {
      ...fetchOptions.value,
      method: 'POST',
      body: JSON.stringify(searchObjFiltered),
    });
    allImages.value = allImages.value.concat(images.result);
  }

  // Total Images
  const fetchTotalImages = async () => {
    const endpoint = `/api/images/total`;
    const response = await $fetch<number>(endpoint, fetchOptions.value);
    return response;
  };
  const { data: imagesCount } = await useAsyncData<number>('initial-gallery-image-count-fetch',fetchTotalImages);

  const refresh = () => {
    isSearchMode.value = false;
    scrollToTop();
    router.push('/gallery');
  }

  const performSearch = async () => {
    scrollToTop();
    await router.push('/gallery');
    allImages.value = await search(searchObj);
  };
  
  const clearSearch = async () => {
    searchObj.prompt = undefined;
    searchObj.negativePrompt = undefined;
    searchObj.steps = undefined;
    searchObj.cfg = undefined;
    searchObj.width = undefined;
    searchObj.height = undefined;
    searchObj.sampler = undefined;
    searchObj.model = undefined;
    isSearchMode.value = false;
    totalSearchResults.value = 0;
  
    await nextTick();
  
    scrollToTop();
    fetchInitialImages(true);
  }

  return {
    allImages,
    fetchNextImages,
    imagesCount,
    pageIdFromQuery,
    loadingInitialImages,
    fetchInitialImages,
    search,
    searchNextPage,
    isSearchMode,
    searchObj,
    totalSearchResults,
    clearSearch,
    performSearch,
    refresh,
  }
}