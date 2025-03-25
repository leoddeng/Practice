<script setup>
import { onMounted, ref } from "vue";
const weekDays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const sections = ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节", "第九节", "第十节"];
const subjects = [
  "语文", "数学", "英语",
  "物理", "化学", "生物",
  "政治", "历史", "地理",
  "体育"
];

// 为每个学科定义背景颜色
const subjectColors = {
  "语文": "#FFCCCC", // 浅红色
  "数学": "#CCE5FF", // 浅蓝色
  "英语": "#FFFFCC", // 浅黄色
  "物理": "#CCFFCC", // 浅绿色
  "化学": "#FFCCFF", // 浅粉色
  "生物": "#CCCCFF", // 浅紫色
  "政治": "#FFE5CC", // 浅橙色
  "历史": "#E5CCFF", // 浅紫罗兰色
  "地理": "#CCFFE5", // 浅青绿色
  "体育": "#FFD9CC", // 浅珊瑚色
};
const timeTable = ref();
onMounted(() => {
  let source
  timeTable.value.addEventListener('dragstart', (e) => {
    source = e.target
    console.dir(source);

  });
  timeTable.value.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  timeTable.value.addEventListener('dragenter', (e) => {
  });
  timeTable.value.addEventListener('drop', (e) => {

    if (source.dataset.type === 'subject' && e.target.dataset.draggable && !e.target.children.length) {
      const cloneNode = source.cloneNode(true);
      cloneNode.dataset.type = ''
      cloneNode.dataset.droppable = false
      cloneNode.addEventListener('click', () => {
        console.log('remove');
        cloneNode.remove()
      })
      e.target.appendChild(cloneNode);
    }
  });
})
</script>

<template>
  <div class="timeTable" ref="timeTable">
    <div class="class-list">
      <div draggable="true" data-type="subject" v-for="item in subjects" :key="item" class="subject"
        :style="{ backgroundColor: subjectColors[item] }">
        {{ item }}
      </div>
    </div>
    <div class="class-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="item in weekDays" :key="item">{{ item }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="section in sections" :key="section">
            <td>{{ section }}</td>
            <td v-for="day in weekDays" :key="day" data-draggable="true"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.timeTable {
  display: flex;
  gap: 12px;
}

.class-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 12px;
}

.subject {
  width: 100px;
  /* 与表格格子宽度一致 */
  height: 50px;
  /* 与表格格子高度一致 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #333;
  font-weight: bold;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
}

table {
  width: 100%;
  border: 1px solid #ddd;
}

th,
td {
  width: 100px;
  /* 与学科 div 宽度一致 */
  height: 50px;
  /* 与学科 div 高度一致 */
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background-color: #f9f9f9;
}
</style>