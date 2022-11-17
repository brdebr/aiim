import { ImageObject } from "~~/types";
import { VoteType } from "./useCardGame";

export const useVoteImage = () => {
  const authStore = useAuthStore();
  const apiBaseURL = useApiBaseURL();
  const { fetchOptions } = storeToRefs(authStore);

  const voteLoading = ref(false);

  const voteImage = async (image: ImageObject, type: VoteType = VoteType.UPVOTE) => {
    voteLoading.value = true;
    const query = new URLSearchParams({
      type,
    });
    await $fetch(`${apiBaseURL}/api/vote/${image.id}?${query}`, {...fetchOptions.value, method: 'POST'});
    voteLoading.value = false;
  }

  return {
    voteImage,
    voteLoading
  }
}