<template>
  <ClientOnly>
    <Teleport to="#toolbar-append">
      <slot/>
    </Teleport>
  </ClientOnly>
</template>