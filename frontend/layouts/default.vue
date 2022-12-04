<template>
  <div class="layout-container mobile-layout">
    <v-app-bar :elevation="0" :color="'indigo-darken-4'" border="t-md b-md s-lg e-lg" density="compact">
      <v-app-bar-title class="!qw-mx-0">
        <div class="qw-mx-2 qw-flex qw-items-center">
          <div class="qw-flex qw-gap-3 qw-items-center qw-select-none qw-mr-auto" @click="$router.push('/')">
            <img src="/logo-min.png" class="qw-h-6 qw-w-6"/>
            <span>
              AI Image Manager
            </span>
          </div>
          <div class="qw-hidden sm:qw-block qw-mr-6">
            <v-btn variant="outlined" size="x-small" icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </div>
          <div class="qw-hidden sm:qw-block">
            <v-btn variant="outlined" size="x-small" icon @click="searchDrawer = !searchDrawer">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </div>
        </div>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-if="false"
      temporary
    >
      <v-list>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <slot/>
    </v-main>
    <v-navigation-drawer
      v-model="searchDrawer"
      location="right"
      color="indigo-darken-4"
      :width="drawerWidth"
      temporary
    >
      <div class="qw-flex qw-flex-col qw-gap-5 qw-px-3 qw-py-6">
        <div class="qw-text-center">
          Search
        </div>
        <v-text-field
          v-model="search.prompt"
          label="Prompt"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <v-text-field
          v-model="search.negativePrompt"
          label="Negative prompt"
          class="qw-mb-3"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        />
        <div class="qw-flex qw-gap-4">
          <v-text-field
            v-model.number="search.steps"
            label="Steps"
            class="qw-mb-3"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
          <v-text-field
            v-model.number="search.cfg"
            label="CFG"
            class="qw-mb-3"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </div>
        <div class="qw-flex qw-gap-4">
          <v-text-field
            v-model.number="search.width"
            label="Width"
            class="qw-mb-3"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
          <v-text-field
            v-model.number="search.height"
            label="Height"
            class="qw-mb-3"
            variant="outlined"
            density="compact"
            hide-details
            clearable
          />
        </div>
        <ClientOnly>
          <v-select
            v-model="search.sampler"
            label="Sampler"
            class="qw-mb-3"
            variant="outlined"
            density="compact"
            hide-details
            :items="Samplers"
            clearable
          />
          <v-select
            v-model="search.model"
            label="Model"
            class="qw-mb-3"
            variant="outlined"
            density="compact"
            hide-details
            :items="modelsAsPairs"
            item-title="0"
            item-value="1"
            clearable
          />
        </ClientOnly>
        <div class="qw-flex qw-gap-3 qw-items-center">
          <v-btn variant="outlined" class="qw-flex-grow">
            Filter
          </v-btn>
          <v-btn @click="clearSearch" icon variant="outlined" size="x-small" class="!qw-rounded-sm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>
    <v-bottom-navigation
      v-if="userId"
      class="bottom-bar"
      mode="shift"
      :elevation="0"
      density="comfortable"
      border="t-md b-md s-lg e-lg"
      bg-color="indigo-darken-4"
      grow hide-on-scroll
    >
      <v-btn v-for="item in bottomNavigationItems" :to="item.route" :key="item.route" :value="item.route">
        <v-icon>
          {{ item.icon }}
        </v-icon>
        <span class="!qw-text-[10px]">
          {{ item.label }}
        </span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>
<script setup lang="ts">
import { Samplers, modelHashesMap } from '~~/constants';

const breakpoints = useBreakpoints({
  mobile: 915,
  wide: 1080,
})

const drawerWidth = computed(() => {
  if(breakpoints.isSmallerOrEqual('mobile')) return 325;
  if(breakpoints.isSmallerOrEqual('wide')) return 400;
  return 500;
})

const modelsAsPairs = Object.entries(modelHashesMap);

type ImageSearchType = {
  prompt: string;
  negativePrompt: string;
  steps: number;
  cfg: number;
  width: number;
  height: number;
  sampler: typeof Samplers[number];
  model: typeof modelsAsPairs[number][1];
}

const search = reactive<Partial<ImageSearchType>>({});

const clearSearch = () => {
  search.prompt = undefined;
  search.negativePrompt = undefined;
  search.steps = undefined;
  search.cfg = undefined;
  search.width = undefined;
  search.height = undefined;
  search.sampler = undefined;
  search.model = undefined; 
}

// const search = reactive<ImageSearchType>({
//   prompt: '',
//   negativePrompt: '',
//   steps: 28,
//   cfg: 7.5,
//   width: 768,
//   height: 768,
//   sampler: 'Euler a',
//   model: '2c02b20a',
// });

const layoutStore = useLayoutStore();
const { bottomNavigationItems } = storeToRefs(layoutStore);

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);

const searchDrawer = ref(false);

useHead({
  meta: [
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
  ],
})

</script>
<style lang="scss">
.v-application {
  @apply qw-h-[calc(100vh-104px)] sm:qw-h-[calc(100vh-var(--v-layout-bottom))];
}
.mobile-layout {
  height: 100%;
  width: 100%;
  &, .v-main > * {
    background: linear-gradient(to top, hsl(180deg 63% 25%) -15%, #000640 100%);
  }
}

// Fix these first rendering with a lower width
.v-toolbar, .v-bottom-navigation {
  width: 100%;
}
</style>
