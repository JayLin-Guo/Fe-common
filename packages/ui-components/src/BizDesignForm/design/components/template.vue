<template>
  <div class="use-template" v-if="state.visible" :class="{ active: state.visible }">
    <span class="close icon-close" @click="state.visible = false"></span>
    <div class="no-date" v-if="state.list.length === 0">暂无可用模板</div>
    <div class="list" v-else>
      <div class="item" v-for="(item, index) in state.list" :key="index" @click="selectClick(item)">
        <img :src="item.imgPath" alt="" />{{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emits = defineEmits(['click'])

const state =
  reactive <
  any >
  {
    visible: false,
    list: []
  }
const open = () => {
  state.visible = true
  init()
}
const init = () => {
  // const template = import.meta.globEager('./template/*.ts')
  // // console.log(template)
  // state.list = []
  // Object.keys(template).forEach(key => {
  //   const file = template[key]
  //   state.list.push({
  //     imgPath: file.imgPath,
  //     title: file.title,
  //     formData: file.formData
  //   })
  // })
}
const selectClick = item => {
  emits('click', item.formData)
  state.visible = false
}
defineExpose({
  open
})
</script>
<style lang="scss" scoped>
@use '@/components/BizDesignForm/design.scss';
</style>
