import { ImageObject } from '~~/types';
import { VoteType } from '~~/composables/pages/useCardGame';
import { useVoteImage } from './useVoteImage';

export const useVotes = async () => {
  const { voteImage: voteImageFetch } = useVoteImage();
  const { fetchVotedImageIds } = useApi();

  onMounted(async () => {
    if (votedImageIds.value.length) {
      return;
    }
    await refresh();
    votedImageIds.value = votedImageIdsResponse.value || [];
  });


  const { data: votedImageIdsResponse, refresh } = await useAsyncData<string[]>(
    'initial-voted-ids-fetch',
    fetchVotedImageIds
  );
  const votedImageIds = ref<string[]>(votedImageIdsResponse.value || []);

  const voteImage = async (
    image: ImageObject,
    type: VoteType = VoteType.UPVOTE
  ) => {
    voteImageFetch(image, type);
    votedImageIds.value.push(image.id);
  };

  const isVoted = (imageId: string) => {
    return votedImageIds.value.includes(imageId);
  };

  return {
    votedImageIds,
    voteImage,
    isVoted,
  };
};
