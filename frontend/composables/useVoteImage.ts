import { ImageObject } from '~~/types';
import { getApiBaseURL, getFetchOptions } from '~~/utils/general';
import { VoteType } from './useCardGame';

export const useVoteImage = () => {
  const apiBaseURL = getApiBaseURL();
  const fetchOptions = getFetchOptions();

  const voteLoading = ref(false);

  const voteImage = async (
    image: ImageObject,
    type: VoteType = VoteType.UPVOTE
  ) => {
    voteLoading.value = true;
    const query = new URLSearchParams({
      type,
    });
    await $fetch(`${apiBaseURL}/api/vote/${image.id}?${query}`, {
      ...fetchOptions,
      method: 'POST',
    });
    voteLoading.value = false;
  };

  return {
    voteImage,
    voteLoading,
  };
};
