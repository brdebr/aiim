import { ImageObject } from "~~/types";
import { useVoteImage } from "./useVoteImage";

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  FAVORITE = 'FAVORITE',
  TO_MODIFY = 'TO_MODIFY',
  TO_UPSCALE = 'TO_UPSCALE',
}

export const useCardGame = async () => {
  onMounted(async () => {
    if (currentCards.value.length) {
      return;
    }
    currentCards.value = await fetchCardsPage();
  });

  const authStore = useAuthStore();
  const { fetchOptions } = storeToRefs(authStore);
  const { voteImage } = useVoteImage();

  const fetchCardsPage = async () => {
    const endpoint = `/api/images/card-game`;
    const response = await $fetch<ImageObject[]>(endpoint, fetchOptions.value);
    return response;
  };

  const voteCard = async (image: ImageObject, vote: VoteType) => {
    const query = new URLSearchParams({
      type: vote,
    });
    const endpoint = `/api/vote/${image.id}${query.toString()}`;
    await $fetch(endpoint, {...fetchOptions.value, method: 'POST'});
  }

  const rerollCards = async () => {
    const newCards = await fetchCardsPage();
    currentCards.value = currentCards.value.concat(newCards);
  };

  const { data: initialImages } = await useAsyncData<ImageObject[]>('initial-card-game-fetch', fetchCardsPage);

  const currentCards = ref(initialImages.value || []);
  watch(currentCards, (newVal) => {
    if (newVal.length > 3) return;
    rerollCards();
  }, { deep: true });

  const firstImage = computed(() => currentCards.value?.[0]);

  const BUFFER_SIZE = 5;
  const buffer = ref<ImageObject[]>([]);
  watch(buffer.value, (newBuffer) => {
    if (newBuffer.length > BUFFER_SIZE) {
      newBuffer.pop();
    }
  }, { deep: true });

  const saveLastToBuffer = () => {
    if(!currentCards.value.length) return;
    const aux = currentCards.value.shift();
    buffer.value.unshift(aux as ImageObject);
  };

  const recoverLastFromBuffer = () => {
    if(!buffer.value.length) return;
    const aux = buffer.value.shift();
    currentCards.value.unshift(aux as ImageObject);
  };

  const likeFn = () => {
    voteImage(firstImage.value, VoteType.UPVOTE);
    saveLastToBuffer();
  };
  const dislikeFn = () => {
    voteImage(firstImage.value, VoteType.DOWNVOTE);
    saveLastToBuffer();
  };
  const favoriteFn = () => {
    voteImage(firstImage.value, VoteType.FAVORITE);
    saveLastToBuffer();
  };
  const extraFn = () => {
    voteImage(firstImage.value, VoteType.TO_MODIFY);
    saveLastToBuffer();
  };

  return {
    rerollCards,
    fetchCardsPage,
    currentCards,
    voteCard,
    recoverLastFromBuffer,
    likeFn,
    dislikeFn,
    favoriteFn,
    extraFn,
    firstImage,
  };
}