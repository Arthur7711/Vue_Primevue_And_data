<template>
  <template v-for="(tag, index) in props.tags" :key="tag">
    <a-tag  :closable="index >= 0" @close.stop="handleClose(tag)">
      {{ tag }}
    </a-tag>
  </template>
  <a-input
      v-if="state.inputVisible"
      ref="inputRef"
      v-model:value="state.inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur.stop="handleInputConfirm"
      @keydown.enter.prevent="handleInputConfirm"
  />
  <a-tag v-else style="background: #fff; border-style: dashed" @click.stop="showInput">
    <plus-outlined />
    Add Alias
  </a-tag>
</template>

<script setup lang="ts">
// import
import { PlusOutlined } from '@ant-design/icons-vue';
import {nextTick, ref, reactive} from "vue";
const inputRef = ref();

interface State {
  tags: string[],
  inputVisible: boolean
  inputValue: string
}
const state = reactive<State>({
  tags: [],
  inputVisible: false,
  inputValue: '',
});


// props & pinia
const props = defineProps<{
  tags: string[]

}>()
// constants

// refs

// computed

// methods

const emit = defineEmits<{
  (e:'update:tags', tags: string[]): void
}>()

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};
const handleClose = (removedTag: string) => {
  emit('update:tags', props.tags.filter(tag => tag !== removedTag))
};
const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  if (inputValue && props.tags.indexOf(inputValue) === -1) {

    emit('update:tags', [...props.tags, inputValue])
    state.inputValue = ''
    state.inputVisible = false

  }
}
// watch
// hooks
</script>

<style scoped lang="scss"></style>