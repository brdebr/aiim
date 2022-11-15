import { ImageObject } from "~~/types";
import { VoteType } from "./useCardGame";

export const useVoteImage = () => {
  const authStore = useAuthStore();
  const apiBaseURL = useApiBaseURL();
  const { fetchOptions } = storeToRefs(authStore);

  const voteImage = async (image: ImageObject, type: VoteType = VoteType.UPVOTE) => {
    console.log(`Voting for ${image.id}`);
    const query = new URLSearchParams({
      type,
    });
    await $fetch(`${apiBaseURL}/api/vote/${image.id}?${query}`, {...fetchOptions.value, method: 'POST'});
  }

  return {
    voteImage,
  }
}