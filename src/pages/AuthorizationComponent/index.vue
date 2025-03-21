<script lang="ts" setup>
import { ref } from 'vue';
import Authorization from './Authorization.vue';
const selected = ref('admin');
</script>

<template>
  <div class="authorization">
    <div class="selector">
      <label for="role-select">Choose roles:</label>
      <select v-model="selected" id="role-s">
        <option value="admin">admin</option>
        <option value="guest">guest</option>
        <option value="editor">editor</option>
      </select>
    </div>
    <div>
      <Authorization :permission="selected">
        {{ selected }}
      </Authorization>
    </div>
  </div>
</template>

<style scoped>
.selector {
  display: flex;
  flex-direction: column;
}

label {
  font-family: sans-serif;
  font-size: 1rem;
  padding-right: 10px;
}

select {
  font-size: 0.9rem;
  padding: 2px 5px;
}
</style>