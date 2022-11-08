import { apiBaseURL } from "~~/constants";
import { ImageObject } from "~~/types";

export const useVotes = async () => {
  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);

  const fetchVotedImageIds = async () => {
    const endpoint = `/api/vote/voted-image-ids`;
    const response = await $fetch<string[]>(endpoint, fetchOptions.value);
    return response;
  };
  const { data: votedImageIdsResponse } = await useAsyncData<string[]>('initial-voted-ids-fetch', fetchVotedImageIds);
  const votedImageIds = ref<string[]>(votedImageIdsResponse.value || []);

  const voteImage = async (image: ImageObject) => {
    console.log(`Voting for ${image.id}`);
    await $fetch(`${apiBaseURL}/api/vote/${image.id}`, {...fetchOptions.value, method: 'POST'});
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