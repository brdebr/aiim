import { Ref } from 'vue';
import { Samplers, modelHashesMap } from '~~/constants';
export const modelsAsPairs = Object.entries(modelHashesMap);

export type ImageSearchType = Partial<{
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfg: number;
  width: number;
  height: number;
  sampler: typeof Samplers[number];
  model: typeof modelsAsPairs[number][1];
}>;

export type ImageSearchResultType<T> = {
  result: T[];
  count: number;
};

export type SearchFnType<T> = (
  params: ImageSearchType,
  query?: URLSearchParams
) => Promise<ImageSearchResultType<T>>;

export type useSearchLogicConfig<T> = {
  pageSize: number;
  searchFn: SearchFnType<T>;
};

const filterObject = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null)
  );
};

export type classWithId = {
  id: string;
};

export const useSearchLogic = <Generic extends classWithId>(config: useSearchLogicConfig<Generic>) => {
  const searchObj = reactive<ImageSearchType>({});
  const totalSearchResults = ref(0);

  const foundImages = ref<Generic[] | null>(null) as Ref<Generic[] | null>;

  const searchFirstPage = async (queryExtras?: Record<string, string>) => {
    const searchObjFiltered = filterObject(searchObj);
    const query = queryExtras ? new URLSearchParams({
      ...queryExtras,
    }) : undefined;

    const images = await config.searchFn(searchObjFiltered, query)
    totalSearchResults.value = images.count;
    foundImages.value = images.result;
  };

  const searchNextPage = async (queryExtras?: Record<string, string>) => {
    const lastImageId = foundImages.value?.[foundImages.value.length - 1].id;
    if (!lastImageId) return;
    const queryObj = {
      page: lastImageId,
      size: config.pageSize.toString(),
      ...queryExtras,
    };
    const query = new URLSearchParams(queryObj);
    const searchObjFiltered = filterObject(searchObj);

    const images = await config.searchFn(searchObjFiltered, query)

    foundImages.value = (foundImages.value || []).concat(images.result);
  };

  const clearSearchObj = () => {
    searchObj.prompt = undefined;
    searchObj.negativePrompt = undefined;
    searchObj.steps = undefined;
    searchObj.cfg = undefined;
    searchObj.width = undefined;
    searchObj.height = undefined;
    searchObj.sampler = undefined;
    searchObj.model = undefined;
    totalSearchResults.value = 0;
  };

  const clearSearchResult = async () => {
    foundImages.value = null;
    clearSearchObj();
  };

  return {
    searchObj,
    totalSearchResults,
    foundImages,
    clearSearchObj,
    clearSearchResult,
    searchFirstPage,
    searchNextPage,
  };
};
