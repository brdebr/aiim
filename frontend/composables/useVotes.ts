import { ImageObject } from "~~/types";
import { VoteType } from "./useCardGame";
import { useVoteImage } from "./useVoteImage";

export const useVotes = async () => {
  const authStore = useAuthStore();
  const { voteImage: voteImageFetch } = useVoteImage();
  const { fetchOptions } = storeToRefs(authStore);

  onMounted(async () => {
    if (votedImageIds.value.length) {
      return;
    }
    await refresh();
    votedImageIds.value = votedImageIdsResponse.value || [];
  });

  const fetchVotedImageIds = async () => {
    const endpoint = `/api/vote/voted-image-ids`;
    const response = await $fetch<string[]>(endpoint, fetchOptions.value);
    return response;
  };
  const { data: votedImageIdsResponse, refresh } = await useAsyncData<string[]>('initial-voted-ids-fetch', fetchVotedImageIds);
  const votedImageIds = ref<string[]>(votedImageIdsResponse.value || []);

  const voteImage = async (image: ImageObject, type: VoteType = VoteType.UPVOTE) => {
    voteImageFetch(image, type);
    votedImageIds.value.push(image.id);
  }

  const isVoted = (imageId: string) => {
    return votedImageIds.value.includes(imageId);
  }

  return {
    votedImageIds,
    voteImage,
    isVoted,
  }
}