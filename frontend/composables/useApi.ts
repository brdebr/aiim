import { GenerationJob } from "~~/composables/useQueue";
import { CurrentLoginInfo, ImageObject } from "~~/types";
import { VoteType } from '~~/composables/pages/useCardGame';
import { FetchOptionsType, LoginResponse } from "~~/store/auth";
import { SdModel } from "./useSdConfig";
import { ImageObjectsPageResponse } from "./pages/useGallery";
import { ImageSearchResultType, ImageSearchType } from "./useSearchLogic";
import { Vote, VoteCountsByUserResponse, VotedImageObjectsPageResponse } from "./pages/useVotesGallery";

export type GenerateBodyType = {
  prompt: string;
  negativePrompt: string,
  sampler: string,
  steps: number,
  cfg: number,
  width: number,
  height: number,
  seed: string | undefined,
  faceRestoration: boolean,
  tiling: boolean,
  batchesToGenerate: number,
  imagesPerBatch: number,
}

export const useApi = (providedFetchOptions?: FetchOptionsType) => {
  const apiBaseURL = getApiBaseURL();
  const fetchOptions = providedFetchOptions || getFetchOptions();

  // Login
  const sendLogin = async (email: string, password: string) => {
    const endpoint = `${apiBaseURL}/api/auth/login`;

    const response = await $fetch<LoginResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      ...fetchOptions,
    });
    return response;
  };
  const fetchCurrentAuth = async () => {
    const endpoint = `/api/auth/current`;
    const response = await $fetch<CurrentLoginInfo>(endpoint, fetchOptions);
    return response;
  };

  // Cards game
  const fetchCardsPage = async () => {
    const endpoint = `/api/images/card-game`;
    const response = await $fetch<ImageObject[]>(endpoint, fetchOptions);
    return response;
  };

  // Gallery
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

  const fetchImagesSearchPage = async (params: ImageSearchType, query?: URLSearchParams) => {
    const queryString = query ? `?${query.toString()}` : '';
    const endpoint = `/api/images/search${queryString}`;

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
  const fetchTotalImages = async () => {
    const endpoint = `/api/images/total`;
    const response = await $fetch<number>(endpoint, fetchOptions);
    return response;
  };

  // Queue
  const fetchQueue = async () => {
    const endpoint = `/api/generate/queue`;
    return await $fetch<GenerationJob[]>(endpoint, fetchOptions);
  };

  // Generate
  const sendTxt2ImageGenerate = async (body: GenerateBodyType) => {
    const response = await $fetch<{ queuePosition: number }>(
      '/api/generate/txt2img',
      {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    return response;
  };

  // SD Engine - Status
  const sendStartSdEngine = async () => {
    const endpoint = '/api/sd-config/engine-start';
    const response = await $fetch<string>(endpoint, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        ...fetchOptions.headers
      },
    });
    return response;
  }
  const sendStopSdEngine = async () => {
    const endpoint = '/api/sd-config/engine-stop';
    const response = await $fetch<string>(endpoint, {
      ...fetchOptions,
      method: 'POST',
    });
    return response;
  }
  const fetchSdStatus = async () => {
    const endpoint = '/api/sd-config/engine-status';
    const response = await $fetch<{status: string, statusTxt: string}>(endpoint, fetchOptions);
    return response;
  }
  const fetchSdLogs = async () => {
    const endpoint = '/api/sd-config/engine-logs';
    const response = await $fetch<string>(endpoint, fetchOptions);
    // replacing everything that is not a letter, number, space, or punctuation with empty
    const responseParsedAsValidText = response.replaceAll(/[^a-zA-Z0-9\s\.,?!-_]/g, '');
    return responseParsedAsValidText;
  }

  // SD Engine - Configs
  const fetchSdModels = async () => {
    const endpoint = '/api/sd-config/sd-models';
    const response = await $fetch<SdModel[]>(endpoint, fetchOptions);
    return response;
  }
  const fetchEmbeddings = async () => {
    const endpoint = '/api/sd-config/embeddings';
    const response = await $fetch<string[]>(endpoint, fetchOptions);
    return response;
  }
  const fetchConfigs = async () => {
    const endpoint = '/api/sd-config/configs';
    const response = await $fetch<Record<string, string>>(endpoint, fetchOptions);
    return response;
  }
  const fetchSdVariables = async () => {
    const [sdModels, embeddings, sdConfigs] = await Promise.all([
      fetchSdModels(),
      fetchEmbeddings(),
      fetchConfigs(),
    ]);
    return {
      sdModels,
      embeddings,
      sdConfigs,
    };
  }
  const sendSetSdModel = async (modelTitle: string) => {
    const endpoint = '/api/sd-config/sd-model';
    const response = await $fetch<string>(endpoint, {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ modelTitle }),
    });
    return response;
  }

  // Vote
  const sendVoteImage = async (
    image: ImageObject,
    type: VoteType = VoteType.UPVOTE
  ) => {
    const endpoint = `${apiBaseURL}/api/vote/image`;
    const query = new URLSearchParams({
      type,
    });
    await $fetch(`${endpoint}/${image.id}?${query}`, {
      ...fetchOptions,
      method: 'POST',
    });
  };
  const fetchVotedImageIds = async () => {
    const endpoint = `/api/vote/voted-image-ids`;
    const response = await $fetch<string[]>(endpoint, fetchOptions);
    return response;
  };
  const fetchVotedImages = async (filterType?: VoteType, page?: string) => {
    const queryObj: Record<string, string> = {};
    if (filterType) {
      queryObj['type'] = filterType;
    }
    if (page) {
      queryObj['page'] = page;
    }

    const query = new URLSearchParams(queryObj);
    const endpoint = `/api/vote/my-votes?${query.toString()}`;
    const response = await $fetch<VotedImageObjectsPageResponse>(
      endpoint,
      fetchOptions
    );
    return response.results;
  };
  const fetchVotedImagesSearch = async (params: ImageSearchType, query?: URLSearchParams) => {
    const queryString = query ? `?${query.toString()}` : '';
    const endpoint = `/api/vote/search-my-votes${queryString}`;

    const searchImagesResult = await $fetch<ImageSearchResultType<Vote>>(
      endpoint,
      {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    return searchImagesResult;
  }
  const fetchVoteCounts = async () => {
    const endpoint = `/api/vote/my-vote-counts`;
    const response = await $fetch<VoteCountsByUserResponse>(
      endpoint,
      fetchOptions
    );
    return response;
  };

  return {
    // TODO: organize these
    fetchVoteCounts,
    fetchVotedImagesSearch,
    fetchVotedImages,
    fetchImagesPage,
    fetchImagesSearchPage,
    fetchTotalImages,
    fetchSdVariables,
    sendStopSdEngine,
    sendStartSdEngine,
    fetchSdStatus,
    fetchSdLogs,
    fetchSdModels,
    fetchEmbeddings,
    fetchConfigs,
    sendSetSdModel,
    sendLogin,
    sendTxt2ImageGenerate,
    fetchCurrentAuth,
    fetchCardsPage,
    fetchQueue,
    sendVoteImage,
    fetchVotedImageIds,
  };
}