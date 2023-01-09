<template>
  <ClientOnly>
    <v-tooltip location="top" content-class="bg-white text-indigo-darken-4" :max-width="650">
      <template #activator="{ props }">
        <v-icon size="small" class="qw-ml-1" v-bind="props">
          <slot name="icon">
            mdi-help-circle
          </slot>
        </v-icon>
      </template>
      <span class="qw-whitespace-pre-line">
        <slot />
      </span>
    </v-tooltip>
  </ClientOnly>
</template>
