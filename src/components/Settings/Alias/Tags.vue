<template>
  <div>
    <template v-for="(tag, index) in state.tags" :key="tag">
      <a-tag  :closable="index >= 0" @close="handleClose(tag)">
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
        @blur="handleInputConfirm"
        @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else style="background: #fff; border-style: dashed" @click.stop="showInput">
      <plus-outlined />
      New Tag
    </a-tag>
  </div>
  </template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
interface State {
  tags: string[],
  inputVisible: boolean
  inputValue: string

}

const {modelValue} = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits(['update:modelValue'])

const inputRef = ref();

const state = reactive<State>({
  tags: modelValue,
  inputVisible: false,
  inputValue: '',
});

const handleClose = (removedTag: string) => {
  const tags = state.tags.filter(tag => tag !== removedTag);
    state.tags = tags;
    emit('update:modelValue', tags)

};

const showInput = () => {
  state.inputVisible = true;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  const inputValue = state.inputValue;
  let tags = state.tags;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];

  }
  Object.assign(state, {
    tags,
    inputVisible: false,
    inputValue: '',
  });
  emit('update:modelValue', state.tags)

};

</script>