<script lang="ts" setup>
import { computed, ref } from 'vue'
const show = ref(false)
const g = ref(true)
const i = ref(false)
const m = ref(false)
const expression = ref('')
const content = ref()
const mode = computed(() => {
  let mode = ''
  if (g.value) {
    mode += 'g'
  }
  if (i.value) {
    mode += 'i'
  }
  if (m.value) {
    mode += 'm'
  }
  return mode
})
const handleChange = (type) => {
  try {
    const regex = new RegExp(expression.value || 'a^', mode.value)
    const dom = content.value
    dom.innerHTML = dom.innerText.replace(regex, `<span style="background-color: skyblue;border-radius:2px;margin:2px;padding:0 4px">$&</span>`)
    if (type === 'input') return
    const range = document.createRange(); // 创建一个新的范围对象
    const selection = window.getSelection(); // 获取当前选区
    range.selectNodeContents(dom); // 将范围设置为整个内容
    range.collapse(false); // 将光标设置在内容的末尾
    if (selection) {
      selection.removeAllRanges(); // 清除当前选区
      selection.addRange(range); // 添加新的选区
    }

  } catch (error) {
    console.warn(error)
  }

}
const helperList = [
  { label: '^', desc: '匹配字符串或行的开始' },
  { label: '$', desc: '匹配字符串或行的结束' },
  { label: '\\b', desc: '匹配单词边界' },
  { label: '\\B', desc: '匹配非单词边界' },
  { label: '\\d', desc: '匹配数字字符（等价于 [0-9]）' },
  { label: '\\D', desc: '匹配非数字字符（等价于 [^0-9]）' },
  { label: '\\w', desc: '匹配字母、数字或下划线（等价于 [A-Za-z0-9_]）' },
  { label: '\\W', desc: '匹配非字母、数字或下划线（等价于 [^A-Za-z0-9_]）' },
  { label: '\\s', desc: '匹配空白字符（包括空格、制表符、换行符等）' },
  { label: '\\S', desc: '匹配非空白字符' },
  { label: '.', desc: '匹配除换行符以外的任意单个字符' },
  { label: '*', desc: '匹配前面的子表达式零次或多次' },
  { label: '+', desc: '匹配前面的子表达式一次或多次' },
  { label: '?', desc: '匹配前面的子表达式零次或一次' },
  { label: '{n}', desc: '匹配前面的子表达式恰好 n 次' },
  { label: '{n,}', desc: '匹配前面的子表达式至少 n 次' },
  { label: '{n,m}', desc: '匹配前面的子表达式至少 n 次，至多 m 次' },
  { label: '[]', desc: '字符集合，匹配括号内的任意一个字符' },
  { label: '()', desc: '分组，将多个字符组合为一个整体进行匹配' },
  { label: '|', desc: '逻辑或，匹配左边或右边的表达式' },
  { label: '(?=exp)', desc: '零宽度正预测先行断言，断言此位置后面能匹配表达式 exp' },
  { label: '(?!exp)', desc: '零宽度负预测先行断言，断言此位置后面不能匹配表达式 exp' },
  { label: '(?<=exp)', desc: '零宽度正回顾后发断言，断言此位置前面能匹配表达式 exp' },
  { label: '(?<!exp)', desc: '零宽度负回顾后发断言，断言此位置前面不能匹配表达式 exp' },
  { label: '\\1, \\2, ...', desc: '反向引用，引用分组捕获的内容' },
];
</script>

<template>
  <div class="container">
    <div class="regex">
      <div class="expresssion">
        <div class="input_wrapper">
          <input type="text" v-model="expression" @input="handleChange('input')" />
        </div>
        <div class="mode">
          <span class="modeValue">{{ mode }}</span>
          <button class="mode-btn" @click="show = !show">
            mode
          </button>
          <div class="mode-list" v-show="show">
            <div class="mode-item">
              <label for="g">global</label>
              <input v-model="g" type="checkbox" name="g" id="g">
            </div>
            <div class="mode-item">
              <label for="i">case-insensitive</label>
              <input v-model="i" type="checkbox" name="i" id="i">
            </div>
            <div class="mode-item">
              <label for="m">multiline</label>
              <input v-model="m" type="checkbox" name="m" id="m">
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="textarea" ref="content" contenteditable="true" @input="handleChange('textarea')" />
      </div>
    </div>
    <div class="helper">
      <div class="helper-item" v-for="item in helperList" :key="item.label">
        <div class="label">{{ item.label }}</div>
        <div class="desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 10px;
}

.expresssion,
.content,
input,
.textarea {
  width: 100%;
  height: 100%;
  font-size: 16px;
  border-radius: 12px;
  resize: none;
  box-sizing: border-box;
}

input,
.textarea {
  padding: 12px 24px;
  border: none;
  background-color: #052529;
  color: skyblue;
  caret-color: white
}

.textarea {
  padding: 12px;
  color: white;
}

input {
  position: relative;
  outline: none;
}

.input_wrapper {
  flex: 1;
  position: relative;
}

.input_wrapper::before,
.input_wrapper::after {
  z-index: 1;
  position: absolute;
  color: white;
  content: '/';
  top: 8px;
}

.input_wrapper::before {
  left: 12px;
}

.input_wrapper::after {
  right: 2px;
}

.expresssion {
  position: relative;
  background-color: #052529;
  display: flex;
  margin-bottom: 24px;
  height: 32px;
}

.mode {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.mode-btn {
  margin-left: 12px;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 2px;
  cursor: pointer;
  border-radius: 4px;
}

.mode-list {
  width: 150px;
  margin-top: 12px;
  position: absolute;
  top: 100%;
  border-radius: 12px;
  padding: 12px;
  background-color: white;
  color: black;
}

.mode-item {

  display: flex;
  gap: 12px;
  justify-content: space-between;
}

input[type="checkbox"] {
  width: auto;
}

.content {
  flex: 1;
}

.container {
  color: skyblue;
  display: flex;
  background-color: #03191b;
  padding: 24px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.regex {
  height: 100%;
  min-width: 75vw;
  display: flex;
  flex-direction: column;
}

.helper {
  border: 1px solid white;
  padding: 12px;
  width: 25vw;
  background-color: #052529;
  border-radius: 12px;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: white;
  overflow-y: scroll;
}

.helper-item {
  display: flex;
  gap: 12px;
  align-items: center;
}

.label {
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  background-color: #03191b;
}
</style>