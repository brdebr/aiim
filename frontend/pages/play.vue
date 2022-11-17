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
        variant="outlined"
        icon
        size="small"
        color="yellow"
        :loading="voteLoading"
        @click="recoverLastFromBuffer"
      >
        <v-icon>mdi-replay</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="large"
        color="red"
        class="qw-mx-2"
        :loading="voteLoading"
        @click="dislikeFn"
      >
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="small"
        color="blue-lighten-1"
        :loading="voteLoading"
        @click="favoriteFn"
      >
        <v-icon>mdi-star</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="large"
        color="secondary"
        class="qw-mx-2"
        :loading="voteLoading"
        @click="likeFn"
      >
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn
        variant="outlined"
        icon
        size="small"
        color="purple-lighten-1"
        :loading="voteLoading"
        @click="extraFn"
      >
        <v-icon>mdi-shimmer</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
// const { getDimensions } = useImageUtils();
const { firstImage: displayingImage, recoverLastFromBuffer, dislikeFn, favoriteFn, likeFn, extraFn, voteLoading } = await useCardGame();

const showingInfo = ref(false);

// const isWide = computed(() => {
//   return getDimensions(firstImage.value).isWide;
// });

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
  .card-game-info {
    @apply qw-absolute qw-top-3 qw-px-3;
    @apply qw-w-full qw-flex qw-flex-col qw-gap-4;
    > div {
      @apply qw-bg-white/45 qw-p-2 qw-rounded qw-backdrop-filter qw-backdrop-blur-md;
      // @apply qw-text-white;
    }
    @apply qw-text-sm;
  }
  .card-game-info-btn {
    @apply qw-absolute qw-top-4 qw-right-0 qw-px-3;
  }
}
</style>