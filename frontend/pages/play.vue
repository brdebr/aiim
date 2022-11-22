<template>
  <div class="card-game-container">
    <div class="card-game-info-btn">
      <v-btn
        variant="outlined"
        icon
        size="x-small"
        color="white"
        @click="showingInfo = !showingInfo"
        v-if="!showingInfo"
      >
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>
    </div>
    <div v-if="showingInfo" class="card-game-info" @click="showingInfo = !showingInfo">
      <div class="qw-flex qw-flex-col qw-gap-4">
        <div>
          {{ displayingImage.prompt }}
        </div>
        <template v-if="displayingImage.negativePrompt">
          <hr>
          <div>
            {{ displayingImage.negativePrompt }}
          </div>
        </template>
      </div>
      <div class="qw-flex qw-gap-4">
        <div>
          {{ displayingImage.width }}px - {{ displayingImage.height }}px
        </div>
        <div>
          {{ displayingImage.fileSize }}
        </div>
      </div>
      <div class="qw-flex qw-gap-4">
        <div>
          Seed: {{ displayingImage.seed }}
        </div>
        <div>
          Date: {{ displayingImage.generatedAt }}
        </div>
      </div>
      <div class="qw-flex qw-gap-4">
        <div>
          Sampler: {{ displayingImage.sampler }}
        </div>
        <div>
          Steps: {{ displayingImage.steps }}
        </div>
        <div>
          Seed: {{ displayingImage.seed }}
        </div>
      </div>
    </div>
    <div class="image-card">
      <IoView v-if="displayingImage" :image="displayingImage" />
    </div>
    <div class="card-game-buttons">
      <v-btn
        v-for="button in actionButtons"
        variant="outlined"
        icon
        :size="button.size"
        :color="button.color"
        @click="button.voteType ? voteFn(button.voteType) : button.fn()"
      >
        <v-icon>{{ button.icon }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
const { firstImage: displayingImage, recoverLastFromBuffer, voteFn } = await useCardGame();

const actionButtons = [
  {
    icon: 'mdi-replay',
    color: 'yellow',
    class: '',
    size: 'small',
    fn: recoverLastFromBuffer,
  },
  {
    icon: 'mdi-window-close',
    color: 'red',
    size: 'large',
    class: 'qw-mx-2',
    voteType: VoteType.DOWNVOTE,
  },
  {
    icon: 'mdi-star',
    color: 'blue-lighten-1',
    size: 'small',
    class: '',
    voteType: VoteType.FAVORITE,
  },
  {
    icon: 'mdi-heart',
    color: 'secondary',
    size: 'large',
    class: 'qw-mx-2',
    voteType: VoteType.UPVOTE,
  },
  {
    icon: 'mdi-shimmer',
    color: 'purple-lighten-1',
    size: 'small',
    class: '',
    voteType: VoteType.TO_MODIFY,
  },
]

const showingInfo = ref(false);

useHead({
  title: 'Card Game',
})

</script>
<style lang="scss">
.card-game-container {
  @apply qw-absolute;
  @apply qw-pt-2 qw-pb-[52px];
  @apply qw-w-full qw-h-[calc(100%-var(--v-layout-bottom))];
  .image-card, .io-view, .io-view > img {
    @apply qw-w-full qw-h-full;
  }
  .card-game-buttons {
    @apply qw-absolute qw-bottom-[var(--v-layout-bottom)];
    @apply qw-pb-8 qw-pt-9 qw-px-3;
    @apply qw-w-full qw-flex qw-justify-center qw-items-center qw-gap-4;
    background: rgb(0,0,0);
    background: linear-gradient(0deg, rgba(0, 0, 0, 1) -0%, rgba(9,9,119,0) 100%);
  }
  .card-game-info {
    @apply qw-absolute qw-top-3 qw-px-3;
    @apply qw-w-full qw-flex qw-flex-col qw-gap-4;
    > div {
      @apply qw-bg-white/45 qw-p-2 qw-rounded qw-backdrop-filter qw-backdrop-blur-md;
    }
    @apply qw-text-sm;
  }
  .card-game-info-btn {
    @apply qw-absolute qw-top-4 qw-right-0 qw-px-3;
  }
}
</style>