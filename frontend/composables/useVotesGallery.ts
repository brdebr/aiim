import { ImageObject } from "~~/types";
import { VoteType } from "./useCardGame";

export type Vote = {
  id: string;
  vote: VoteType;
  imageId: string;
  userId: string;
  createdAt: string;
  image: ImageObject;
}

export type VotedImageObjectsPageResponse = {
  count: number;
  results: Vote[];
};

export type VoteCountsByUserResponse = [
  {
    vote: VoteType;
    _count: number;
  }
]

// const allVotedImages = ref<VoteWithImage[]>(currentImagesFetched.value?.results.map(el => {
//   const { image, ...rest } = el;
//   return {
//     ...rest,
//     ...image,
//   }
// }) || []);

export const VotedResponseToVotes = (response: VotedImageObjectsPageResponse): Vote[] => {
  return response.results;
};

export type VoteWithImage = Omit<Vote, "image"> & ImageObject;

export const useVotesGallery = () => {
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);
  const votedImages = ref<Vote[]>([]);

  // const parseVotedResponse = (response: VotedImageObjectsPageResponse): Vote[] => {
  //   const { results } = response;
  //   const aux = results.map((el) => {
  //     const { image, ...rest } = el;
  //     return {
  //       ...rest,
  //       ...image,
  //     };
  //   });
  //   return aux;
  // };

  const fetchVotedImages = async (filterType? : VoteType) => {
    const query = new URLSearchParams({
      type: filterType || '',
    });
    const endpoint = `/api/vote/my-votes?${query.toString()}`;
    const response = await $fetch<VotedImageObjectsPageResponse>(endpoint, fetchOptions.value);
    return response.results;
  }

  const fetchVoteCounts = async () => {
    const endpoint = `/api/vote/my-vote-counts`;
    const response = await $fetch<VoteCountsByUserResponse>(endpoint, fetchOptions.value);
    return response;
  }
  const voteCounts = ref<VoteCountsByUserResponse>();
  const voteCountsMap = computed(() => {
    if (!voteCounts.value) {
      return {
        [VoteType.UPVOTE]: 0,
        [VoteType.DOWNVOTE]: 0,
        [VoteType.FAVORITE]: 0,
        [VoteType.TO_MODIFY]: 0,
      } as Record<VoteType, number>;
    }
    return voteCounts.value.reduce((acc, el) => {
      acc[el.vote] = el._count;
      return acc;
    }, {} as Record<VoteType, number>);
  });

  const currentFilter = ref<VoteType>();
  watch(currentFilter, async (newFilter) => {
    const results = await fetchVotedImages(newFilter);
    votedImages.value = results;
  });

  onMounted(async () => {
    if (votedImages.value.length) return;
    const [votesFetched, voteCountsFetched] = await Promise.all([
      fetchVotedImages(),
      fetchVoteCounts(),
    ]);

    votedImages.value = votesFetched;
    voteCounts.value = voteCountsFetched;
  });
  

  return {
    votedImages,
    fetchVotedImages,
    currentFilter,
    voteCounts,
    fetchVoteCounts,
    voteCountsMap,
  }
};