<script setup>
defineProps(['permission'])
const roles = [
  'admin', 'editor', 'guest'
]
</script>

<template>
  <template v-if="roles.includes(permission)">
    <slot name="extra"></slot>
    <slot></slot>
  </template>
</template>

<style lang="scss" scoped></style>