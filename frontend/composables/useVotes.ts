import { apiBaseURL } from "~~/constants";
import { ImageObject } from "~~/types";

export const useVotes = () => {
  const fetchOptions = useFetchOptions();
  
  const votedImageIds = ref<string[]>([]);
  const fetchVotedImageIds = async () => {
    const endpoint = `/api/vote/voted-image-ids`;
    const response = await $fetch<string[]>(endpoint, fetchOptions.value);
    votedImageIds.value = response;
    return response;
  };

  const voteImage = async (image: ImageObject) => {
    console.log(`Voting for ${image.id}`);
    await $fetch(`${apiBaseURL}/api/vote/${image.id}`, {...fetchOptions.value, method: 'POST'});
    votedImageIds.value.push(image.id);
  }

  const isVoted = (imageId: string) => {
    return votedImageIds.value.includes(imageId);
  }

  onMounted(() => {
    fetchVotedImageIds();
  });

  return {
    votedImageIds,
    voteImage,
    isVoted,
  }
}