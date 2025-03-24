<script setup>
import { onBeforeMount, onUnmounted, ref } from "vue";
import Loading from "../../components/Loading.vue";
const port = ref("8000");
const btnInfo = ref("");
const content = ref("");
const disabled = ref(true);
const isFetch = ref(false)
const handleStart = () => {
  let cnt = 1;
  btnInfo.value = "正在启动服务器"
  let intervalHandle = setInterval(() => {
    btnInfo.value = "正在启动服务器" + ".".repeat(cnt % 4);
    cnt++
  }, 500);

  fetch(`http://localhost:8080?port=${port.value}&type=start&server=streamingOutput`)
    .then(() => {
      clearInterval(intervalHandle);
      btnInfo.value = "服务器已启动";
      disabled.value = true
    })
    .catch((err) => {
      clearInterval(intervalHandle);
      btnInfo.value = err;
      disabled.value = false
    })
};
const handleFetchByStreaming = async () => {
  isFetch.value = true;
  const response = await fetch(`http://localhost:${port.value}?method=streaming`);
  const reader = response.body.getReader();
  let result;

  // 读取数据流
  while (!(result = await reader.read()).done) {
    const chunk = new TextDecoder().decode(result.value);
    // 将新接收到的部分添加到输出
    content.value += chunk;
  }
  isFetch.value = false
};
const handleFetchBySSE = async () => {
  isFetch.value = true
  const eventSource = new EventSource(`http://localhost:${port.value}?method=sse`);

  // 监听服务器推送的消息
  eventSource.onmessage = (event) => {
    content.value += event.data + '  ';
  };

  // 监听连接打开事件
  eventSource.onopen = () => {
    console.log("Connection established");
  };
  eventSource.addEventListener('finished', () => {
    eventSource.close()
    isFetch.value = false
  })

  // 监听错误事件
  eventSource.onerror = (error) => {
    console.error("Error occurred:", error);
  };
};
onBeforeMount(() => {
  handleStart()
})
onUnmounted(() => {
  fetch(`http://localhost:8080?port=${port.value}&type=close`)
})
</script>

<template>
  <div>
    <div>
      <input v-model="port" type="text" placeholder="请输入服务器的端口号" />
      <button @click="handleStart" :disabled="disabled">启动</button>
      {{ btnInfo }}
    </div>
    <button @click="handleFetchByStreaming">获取一段信息(流)</button>
    <button @click="handleFetchBySSE">获取一段信息(sse)</button>
    <div class="content">{{ content }}<Loading v-show="isFetch"></Loading>
    </div>
  </div>
</template>

<style scoped>
.content {
  border: 1px solid black;
  height: 200px;
  width: 200px;
}
</style>
