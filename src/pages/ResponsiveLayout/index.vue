<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from 'vue'
const width = ref(200)
const height = ref(200)
const area = ref()
const callback = (entries) => {
  entries.forEach(entry => {
    const { width: w, height: h } = entry.contentRect;
    width.value = parseInt(w)
    height.value = parseInt(h)
    refreshRem()
  });
};

const refreshRem = () => {
  const docEl = document.documentElement;
  const width = area.value.getBoundingClientRect().width;
  const rem = width / 10;
  docEl.style.fontSize = rem + 'px';
  console.log(rem);
}

const resizeObserver = new ResizeObserver(callback);
onMounted(() => {
  resizeObserver.observe(area.value);
})
</script>

<template>
  <div class="responsiveLayout">
    <h1 class="title">拖拽右下角更改布局大小</h1>
    <div class="control">
      <label for="x">width:</label>
      <input type="text" id="x" v-model="width">
      <label for="y">height:</label>
      <input type="text" id="y" v-model="height">
    </div>
    <div class="area" :style="{ width: width + 'px', height: height + 'px' }" ref="area">
      可更改大小的布局区域
    </div>
  </div>
</template>

<style scoped>
.responsiveLayout {
  font-size: 16px;
}

input {
  height: 24px;
  width: 64px;
}

.title,
.control {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  top: 1%;
  font-size: 32px;
}

.control {
  top: 6%;
}

.area {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 80vw;
  max-height: 80vh;
  background-color: pink;
  resize: both;
  font-size: .8rem;
}
</style>