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
    <div
      v-if="showingInfo"
      class="card-game-info"
      @click="showingInfo = !showingInfo"
    >
      <div class="qw-flex qw-flex-col qw-gap-4">
        <div>
          {{ displayingImage.prompt }}
        </div>
        <template v-if="displayingImage.negativePrompt">
          <hr />
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
        <div>Seed: {{ displayingImage.seed }}</div>
        <div>Date: {{ displayingImage.generatedAt }}</div>
      </div>
      <div class="qw-flex qw-gap-4">
        <div>Sampler: {{ displayingImage.sampler }}</div>
        <div>Steps: {{ displayingImage.steps }}</div>
        <div>Seed: {{ displayingImage.seed }}</div>
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
        @click="button.voteType ? voteFn(button.voteType) : button.fn?.()"
      >
        <v-icon>{{ button.icon }}</v-icon>
      </v-btn>
    </div>
  </div>
  <ToolbarAppend>
    <div class="qw-flex qw-gap-3 qw-items-center">
      <Help>
        <template #default>
          <div class="qw-mt-1">
            Keyboard shortcuts
          </div>
          <hr class="qw-my-2 qw-border-blue-gray-200">
          <div>
            <kbd>Shift</kbd> + <kbd>Arrow Left</kbd>: Downvote <br />
            <kbd>Shift</kbd> + <kbd>Arrow Up</kbd>: Favorite <br />
            <kbd>Shift</kbd> + <kbd>Arrow Right</kbd>: Upvote <br />
            <kbd>Shift</kbd> + <kbd>Arrow Down</kbd>: Rewind <br />
            <kbd>Shift</kbd> + <kbd>0</kbd>: To Modify <br />
          </div>
        </template>
        <template #icon>
          mdi-keyboard
        </template>
      </Help>
    </div>
  </ToolbarAppend>
</template>
<script setup lang="ts">
useHead({
  title: "Card Game",
});
const {
  firstImage: displayingImage,
  recoverLastFromBuffer,
  voteFn,
} = await useCardGame();

const keys = useMagicKeys()
const debounceOptions = { debounce: 250 }

const shiftArrowLeft = keys['Shift+ArrowLeft']
watchDebounced(shiftArrowLeft, () => {
  voteFn(VoteType.DOWNVOTE)
}, debounceOptions)

const shiftArrowUp = keys['Shift+ArrowUp']
watchDebounced(shiftArrowUp, () => {
  voteFn(VoteType.FAVORITE)
}, debounceOptions)

const shiftArrowRight = keys['Shift+ArrowRight']
watchDebounced(shiftArrowRight, () => {
  voteFn(VoteType.UPVOTE)
}, debounceOptions)

const shiftArrowDown = keys['Shift+ArrowDown']
watchDebounced(shiftArrowDown, () => {
  recoverLastFromBuffer()
}, debounceOptions)

const shiftZero = keys['Shift+0']
watchDebounced(shiftZero, () => {
  voteFn(VoteType.TO_MODIFY)
}, debounceOptions)

const actionButtons = [
  {
    icon: "mdi-replay",
    color: "yellow",
    class: "",
    size: "small",
    fn: recoverLastFromBuffer,
  },
  {
    icon: "mdi-window-close",
    color: "red",
    size: "large",
    class: "qw-mx-2",
    voteType: VoteType.DOWNVOTE,
  },
  {
    icon: "mdi-star",
    color: "blue-lighten-1",
    size: "small",
    class: "",
    voteType: VoteType.FAVORITE,
  },
  {
    icon: "mdi-heart",
    color: "secondary",
    size: "large",
    class: "qw-mx-2",
    voteType: VoteType.UPVOTE,
  },
  {
    icon: "mdi-shimmer",
    color: "purple-lighten-1",
    size: "small",
    class: "",
    voteType: VoteType.TO_MODIFY,
  },
];

const showingInfo = ref(false);
</script>
<style lang="scss">
.card-game-container {
  @apply qw-absolute;
  @apply qw-pt-2 qw-pb-[52px];
  @apply qw-w-full qw-h-[calc(100%-var(--v-layout-bottom))];
  .image-card {
    @apply qw-w-full qw-h-full qw-place-items-center qw-grid qw-grid-cols-1 qw-grid-rows-1 qw-px-2;
    .io-view {
      @apply qw-w-full qw-h-full qw-flex;
    }
  }
  .card-game-buttons {
    @apply qw-absolute qw-bottom-[var(--v-layout-bottom)];
    @apply qw-pb-5 qw-pt-8 qw-px-3;
    @apply qw-w-full qw-flex qw-justify-center qw-items-center qw-gap-4;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 1) -0%,
      rgba(9, 9, 119, 0) 100%
    );
  }
  .card-game-info {
    @apply qw-absolute qw-z-10 qw-top-3 qw-px-3;
    @apply qw-w-full qw-flex qw-flex-col qw-gap-4;
    > div {
      @apply qw-bg-white/45 qw-p-2 qw-rounded qw-backdrop-filter qw-backdrop-blur-md;
    }
    @apply qw-text-sm;
  }
  .card-game-info-btn {
    @apply qw-absolute qw-top-4 qw-right-0 qw-px-3 qw-z-10;
  }
}
</style>
