<template>
  <div class="image-gallery" v-if="galleryObjects.length">
    <slot name="prepend" />
    <div
      v-for="vote in galleryObjects"
      :key="vote.id"
      :data-id="vote.id"
      class="voted-image-container"
      :class="getClassObject(vote)"
    >
      <ImageCardDetailed :vote="vote" />
    </div>
    <slot name="append" />
    <div ref="bottomEl" class="qw-absolute qw-bottom-0 qw-h-[250px] qw-w-px" />
  </div>
</template>
<script lang="ts" setup>
import { Vote } from '~~/composables/useVotesGallery';
import { ImageObject } from '~~/types';

const getClassObject = (vote: Vote) => {
  const { isTall, isWide } = getImageDimensions(vote.image);
  return {
    tall: isTall,
    wide: isWide,
  };
};
const galleryObjects = computed<Vote[]>(() => {
  if (props.votes) {
    return props.votes;
  } else {
    return (props.images || []).map((image) => ({
      id: `i--${image.id}`,
      image,
    })) as Vote[];
  }
});

const bottomEl = ref<HTMLElement>();
useIntersectionObserver(
  bottomEl,
  useThrottleFn(() => {
    emit('more');
  }, 1000)
);

const props = defineProps<{
  images?: ImageObject[];
  votes?: Vote[];
}>();

const emit = defineEmits<{
  (event: 'more'): void;
}>();
</script>
<style lang="scss" scoped>
.image-gallery {
  position: relative;
  display: grid;
  grid-gap: 6px;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  @media screen and (max-width: 915px) {
    // One column on mobile
    & {
      grid-template-columns: 1fr;
    }
  }
  @media screen and (min-width: 915px) {
    .tall {
      grid-row-end: span 2;
    }
    .wide {
      grid-column-end: span 2;
    }
  }
}
</style>
