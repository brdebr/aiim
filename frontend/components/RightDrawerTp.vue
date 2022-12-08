<template>
  <ClientOnly>
    <Teleport to="#right-drawer">
      <slot />
    </Teleport>
  </ClientOnly>
</template>
