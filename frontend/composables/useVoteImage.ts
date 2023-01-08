import { ImageObject } from '~~/types';
import { VoteType } from '~~/composables/pages/useCardGame';

export const useVoteImage = () => {
  const { sendVoteImage } = useApi();

  const voteLoading = ref(false);

  const voteImage = async (
    image: ImageObject,
    type: VoteType = VoteType.UPVOTE
  ) => {
    voteLoading.value = true;
    sendVoteImage(image, type)
    voteLoading.value = false;
  };

  return {
    voteImage,
    voteLoading,
  };
};
