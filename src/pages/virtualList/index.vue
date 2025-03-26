<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
const store = []
let start = 0
const limit = 30
let end = start + limit
let offset_x = start
let offset_y = end
for (let i = 1; i <= 100000; i++) {
  store.push({ id: i, data: i, visiable: false })
}
const data = ref(store.slice(start, end))
const list = ref()
let io = null
let firstItem = null
let endItem = null
const listItem = ref()
const addSentinel = () => {
  if (!firstItem && !endItem) {
    firstItem = document.createElement('span')
    endItem = document.createElement('span')
    firstItem.setAttribute("data-type", 'first')
    endItem.setAttribute("data-type", 'end')
    io.observe(firstItem)
    io.observe(endItem)
  }
  console.log(list.value.children.length);

  const sencondNdoe = list.value.children[1]
  const lastSencondNode = list.value.children[list.value.length - 1]
  list.value.insertBefore(firstItem, sencondNdoe)
  list.value.insertBefore(endItem, lastSencondNode)
}
onMounted(() => {
  io = new IntersectionObserver((entries) => {
    console.log(entries);
    if (entries.length > 1) return
    const { target, isIntersecting } = entries[0]
    const type = target.dataset.type
    if (type === 'first' && !isIntersecting) {
      start++;
      offset_x++;
      const sencondNdoe = list.value.children[offset_x + 2]
      list.value.insertBefore(firstItem, sencondNdoe)
      return
    }
    if (type === 'end' && !isIntersecting) {
      end--
      offset_y--
      const lastSencondNode = list.value.children[offset_y]
      list.value.insertBefore(endItem, lastSencondNode)
      return
    }
    if (type === 'end' && isIntersecting) {
      if (end < store.length) {
        end = end + limit >= store.length ? store.length : end + limit
        data.value = store.slice(start, end)
        nextTick(() => {
          addSentinel()
          offset_x = 0
        })
      }
    }
  }, { root: list.value })
  addSentinel()
})
</script>

<template>
  <div>
    <ul ref="list">
      <li ref="listItem" v-for="(item, index) in data" :key="item.id" :data-index="index">
        {{ item.data }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
li {
  list-style: none;
  border: 1px solid black;
}

ul {
  padding: 12px;
  height: 300px;
  border: 1px solid black;
  overflow-y: scroll;
}
</style>