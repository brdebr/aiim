<template>
  <div class="card-game-container">
    <div class="image-card">
      <IoView v-if="firstCard" :image="firstCard" />
    </div>
    <div class="card-game-buttons">
      <v-btn
        variant="outlined"
        icon
        size="small"
        color="yellow"
      >
        <v-icon>mdi-replay</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="large"
        color="red"
        class="qw-mx-2"
      >
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="small"
        color="blue-lighten-1"
      >
        <v-icon>mdi-star</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="large"
        color="secondary"
        class="qw-mx-2"
      >
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="small"
        color="purple-lighten-1"
      >
        <v-icon>mdi-shimmer</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
const { getDimensions } = useImageUtils();
const { currentCards } = await useCardGame();

const firstCard = computed(() => currentCards.value?.[0]);
const isWide = computed(() => {
  return getDimensions(firstCard.value).isWide;
});

</script>
<style lang="scss">
.card-game-container {
  @apply qw-absolute;
  @apply qw-pt-2 qw-pb-[52px];
  .image-card, .io-view, .io-view > img {
    @apply qw-w-full qw-h-full;
  }
  .card-game-buttons {
    @apply qw-absolute qw-bottom-20 qw-px-3;
    @apply qw-w-full qw-flex qw-justify-center qw-items-center qw-gap-4;
  }
}
</style>