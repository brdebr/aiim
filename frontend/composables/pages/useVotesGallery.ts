import { ImageObject } from '~~/types';
import { scrollToTop } from '~~/utils/general';
import { VoteType } from './useCardGame';
import { ImageSearchType, useSearchLogic } from '~~/composables/useSearchLogic';

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

export type VoteTab = {
  value: VoteType;
  icon: string;
  color: string;
};

export const useVotesGallery = () => {
  const {
    fetchVotedImages,
    fetchVotedImagesSearch,
    fetchVoteCounts,
    fetchTotalImages
  } = useApi();

  const votedImages = ref<Vote[]>([]);
  const totalImages = ref<number>(0);

  const lastVoteImage = computed(() => {
    return votedImages.value[votedImages.value.length - 1];
  });

  const currentVoteTypeFilter = ref<VoteType>(VoteType.FAVORITE);
  watch(currentVoteTypeFilter, async (newFilter) => {
    const results = await fetchVotedImages(newFilter);
    votedImages.value = results;
  });

  const fetchInitialVotes = async () => {
    const results = await fetchVotedImages(currentVoteTypeFilter.value);
    votedImages.value = results;
  };

  const fetchNextPage = async () => {
    if (!lastVoteImage.value) return;
    const response = await fetchVotedImages(
      currentVoteTypeFilter.value,
      lastVoteImage.value.id
    );
    votedImages.value = votedImages.value.concat(response);
  };

  const {
    foundImages,
    searchObj,
    clearSearchObj,
    searchFirstPage,
    searchNextPage,
    totalSearchResults,
    clearSearchResult
  } = useSearchLogic<Vote>({
    pageSize: DEFAULT_GALLERY_PAGE_SIZE,
    searchFn: async (params: ImageSearchType, query?: URLSearchParams) => {
      const searchImagesResult = await fetchVotedImagesSearch(params, query);
      return searchImagesResult;
    }
  })

  const performSearch = async () => {
    scrollToTop();
    await searchFirstPage({
      type: currentVoteTypeFilter.value
    });
    votedImages.value = foundImages.value || [];
  };
  const performSearchNextPage = async () => {
    await searchNextPage({
      type: currentVoteTypeFilter.value
    });
    votedImages.value = foundImages.value || [];
  };

  const clearSearch = async () => {
    clearSearchObj();
    scrollToTop();
    fetchInitialVotes();
  };

  const refresh = () => {
    scrollToTop();
    clearSearchObj();
    clearSearchResult();
    fetchInitialVotes();
  };


  // Vote counts
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

  onMounted(async () => {
    const [voteCountsFetched, totalImagesFetched] =
      await Promise.all([
        fetchVoteCounts(),
        fetchTotalImages(),
        fetchInitialVotes(),
      ]);

    totalVotes.value = voteCountsFetched.count;
    voteCounts.value = voteCountsFetched.results;
    totalImages.value = totalImagesFetched;
  });

  const tabs: VoteTab[] = [
    {
      value: VoteType.FAVORITE,
      color: 'blue-lighten-1',
      icon: 'mdi-star',
    },
    {
      value: VoteType.UPVOTE,
      color: 'secondary',
      icon: 'mdi-heart',
    },
    {
      value: VoteType.TO_MODIFY,
      color: 'purple-lighten-1',
      icon: 'mdi-shimmer',
    },
    {
      value: VoteType.DOWNVOTE,
      color: 'red',
      icon: 'mdi-window-close',
    },
    {
      value: VoteType.EMPTY,
      color: 'white',
      icon: 'mdi-image-check',
    },
  ];

  const percentagesMap = computed(() => {
    return tabs.reduce((acc, tab) => {
      acc[tab.value] = (
        (voteCountsMap.value[tab.value] / totalVotes.value) *
        100
      ).toFixed(2);
      return acc;
    }, {} as Record<VoteType, string>);
  });

  return {
    votedImages,
    fetchVotedImages,
    currentVoteTypeFilter,
    voteCounts,
    totalVotes,
    voteCountsMap,
    totalImages,
    fetchNextPage,
    percentagesMap,
    tabs,
    foundImages,
    performSearch,
    performSearchNextPage,
    clearSearch,
    refresh,
    searchObj,
    totalSearchResults,
  };
};
