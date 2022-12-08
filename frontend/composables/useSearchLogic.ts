import { ImageObject } from '~~/types';
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

export type ImageSearchResultType = {
  result: ImageObject[];
  count: number;
};

export type SearchFnType = (
  params: ImageSearchType,
  query?: URLSearchParams
) => Promise<ImageSearchResultType>;

export type useSearchLogicConfig = {
  pageSize: number;
  searchFn: SearchFnType;
};

const filterObject = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null)
  );
};

export const useSearchLogic = (config: useSearchLogicConfig) => {
  const searchObj = reactive<ImageSearchType>({});
  const totalSearchResults = ref(0);

  const foundImages = ref<ImageObject[] | null>(null);

  const searchFirstPage = async () => {
    const searchObjFiltered = filterObject(searchObj);

    const images = await config.searchFn(searchObjFiltered)
    totalSearchResults.value = images.count;
    foundImages.value = images.result;
  };

  const searchNextPage = async () => {
    const lastImageId = foundImages.value?.[foundImages.value.length - 1].id;
    if (!lastImageId) return;
    const query = new URLSearchParams({
      page: lastImageId,
      size: config.pageSize.toString(),
    });
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

  const clearSearch = async () => {
    foundImages.value = null;
    clearSearchObj();
  };

  return {
    searchObj,
    totalSearchResults,
    foundImages,
    clearSearchObj,
    clearSearch,
    searchFirstPage,
    searchNextPage,
  };
};
