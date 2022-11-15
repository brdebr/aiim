import { ImageObject } from "~~/types";

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
    const cards = await fetchCardsPage();
    currentCards.value = currentCards.value.concat(cards);
  };
  
  const { data: initialImages } = await useAsyncData<ImageObject[]>('initial-card-game-fetch', fetchCardsPage);
  
  const currentCards = ref(initialImages.value || []);

  return {
    rerollCards,
    fetchCardsPage,
    currentCards,
    voteCard,
  };
}