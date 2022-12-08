import { ImageObject } from '~~/types';
import { getFetchOptions } from '~~/utils/general';
import { VoteType } from './useCardGame';

export type Vote = {
  id: string;
  vote: VoteType;
  imageId: string;
  userId: string;
  createdAt: string;
  image: ImageObject;
};

export type VotedImageObjectsPageResponse = {
  count: number;
  results: Vote[];
};

export type VoteCountsByUserResponse = {
  count: number;
  results: VoteCountsByUserResponseResults;
};

export type VoteCountsByUserResponseResults = {
  vote: VoteType;
  _count: number;
}[];

export const useVotesGallery = () => {
  const fetchOptions = getFetchOptions();
  const votedImages = ref<Vote[]>([]);

  const lastVoteImage = computed(() => {
    return votedImages.value[votedImages.value.length - 1];
  });

  const fetchTotalImages = async () => {
    const endpoint = `/api/images/total`;
    const response = await $fetch<number>(endpoint, fetchOptions);
    return response;
  };
  const totalImages = ref<number>(0);

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

  const fetchNextPage = async () => {
    if (!lastVoteImage.value) return;
    const response = await fetchVotedImages(
      currentFilter.value,
      lastVoteImage.value.id
    );
    votedImages.value = votedImages.value.concat(response);
  };

  const fetchVoteCounts = async () => {
    const endpoint = `/api/vote/my-vote-counts`;
    const response = await $fetch<VoteCountsByUserResponse>(
      endpoint,
      fetchOptions
    );
    return response;
  };
  const voteCounts = ref<VoteCountsByUserResponseResults>();
  const totalVotes = ref(0);
  const voteCountsMap = computed(() => {
    if (!voteCounts.value) {
      return {
        [VoteType.UPVOTE]: 0,
        [VoteType.DOWNVOTE]: 0,
        [VoteType.FAVORITE]: 0,
        [VoteType.TO_MODIFY]: 0,
        [VoteType.TO_UPSCALE]: 0,
      } as Record<VoteType, number>;
    }
    return voteCounts.value.reduce((acc, el) => {
      acc[el.vote] = el._count;
      return acc;
    }, {} as Record<VoteType, number>);
  });

  const currentFilter = ref<VoteType>(VoteType.FAVORITE);
  watch(currentFilter, async (newFilter) => {
    const results = await fetchVotedImages(newFilter);
    votedImages.value = results;
  });

  onMounted(async () => {
    const [voteCountsFetched, totalImagesFetched, votesFetched] =
      await Promise.all([
        fetchVoteCounts(),
        fetchTotalImages(),
        fetchVotedImages(currentFilter.value),
      ]);

    totalVotes.value = voteCountsFetched.count;
    voteCounts.value = voteCountsFetched.results;
    totalImages.value = totalImagesFetched;
    votedImages.value = votesFetched;
  });

  return {
    votedImages,
    fetchVotedImages,
    currentFilter,
    voteCounts,
    totalVotes,
    fetchVoteCounts,
    voteCountsMap,
    totalImages,
    fetchTotalImages,
    fetchNextPage,
  };
};
