<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
const routes = router.getRoutes().filter(route => route.path !== "/");

</script>

<template>
  <div class="home">
    <RouterLink v-for="route in routes" :to="route.path">{{ route.name }}</RouterLink>
  </div>

</template>

<style scoped>
.home {
  display: grid;
  gap: 12px;
}
</style>