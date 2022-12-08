import { getFetchOptions } from '~~/utils/general';

export type GenerationJob = {
  id: string;
  name: string;
  data: GenerationJobData;
  opts: {
    timeout: number;
    attempts: number;
    delay: number;
    timestamp: number;
  };
  progress: number;
  delay: number;
  timestamp: number;
  attemptsMade: number;
  stacktrace: any[];
  returnvalue?: any;
  finishedOn?: any;
  processedOn?: number;
};

export type GenerationJobData = {
  params: {
    prompt: string;
    negativePrompt: string;
    sampler: string;
    steps: number;
    cfg: number;
    width: number;
    height: number;
  };
  user: string;
};

export const useQueue = () => {
  const fetchOptions = getFetchOptions();

  onMounted(async () => {
    await fetchAndSetQueue();
  });

  const queue = ref<GenerationJob[]>([]);

  const fetchQueue = async () => {
    const endpoint = `/api/generate/queue`;
    return await $fetch<GenerationJob[]>(endpoint, fetchOptions);
  };

  const fetchAndSetQueue = async () => {
    queue.value = await fetchQueue();
  };

  return {
    queue,
    fetchQueue,
    fetchAndSetQueue,
  };
};
