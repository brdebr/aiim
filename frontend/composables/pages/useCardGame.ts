import { ImageObject } from '~~/types';
import { getFetchOptions } from '~~/utils/general';
import { useVoteImage } from '~~/composables/useVoteImage';

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  FAVORITE = 'FAVORITE',
  TO_MODIFY = 'TO_MODIFY',
  TO_UPSCALE = 'TO_UPSCALE',
  EMPTY = '',
}

export const useCardGame = async () => {
  const { fetchCardsPage } = useApi();

  onMounted(async () => {
    currentCards.value = await fetchCardsPage();
  });

  const { voteImage, voteLoading } = useVoteImage();

  const rerollCards = async () => {
    const newCards = await fetchCardsPage();
    currentCards.value = currentCards.value.concat(newCards);
  };

  const currentCards = ref<ImageObject[]>([]);
  watch(
    currentCards,
    (newVal) => {
      if (newVal.length > 3) return;
      rerollCards();
    },
    { deep: true }
  );

  const firstImage = computed(() => currentCards.value?.[0]);

  const BUFFER_SIZE = 5;
  const buffer = ref<ImageObject[]>([]);
  watch(
    buffer.value,
    (newBuffer) => {
      if (newBuffer.length > BUFFER_SIZE) {
        newBuffer.pop();
      }
    },
    { deep: true }
  );

  const saveLastToBuffer = () => {
    if (!currentCards.value.length) return;
    const aux = currentCards.value.shift();
    buffer.value.unshift(aux as ImageObject);
    return aux;
  };

  const recoverLastFromBuffer = () => {
    if (!buffer.value.length) return;
    const aux = buffer.value.shift();
    currentCards.value.unshift(aux as ImageObject);
    return aux;
  };

  const voteFn = async (voteType: VoteType) => {
    const image = saveLastToBuffer();
    if (!image) return;
    await voteImage(image, voteType);
  };

  return {
    rerollCards,
    fetchCardsPage,
    currentCards,
    voteLoading,
    recoverLastFromBuffer,
    voteFn,
    firstImage,
  };
};
