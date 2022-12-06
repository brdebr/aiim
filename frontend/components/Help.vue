<template>
  <ClientOnly>
    <v-tooltip location="top" content-class="bg-white text-indigo-darken-4">
      <template #activator="{ props }">
        <v-icon size="small" class="qw-ml-1" v-bind="props">
          mdi-help-circle
        </v-icon>
      </template>
      <span class="qw-whitespace-pre-line">
        <slot />
      </span>
    </v-tooltip>
  </ClientOnly>
</template>
