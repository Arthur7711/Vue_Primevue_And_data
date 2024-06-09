<template>
  <div ref="blockRef" :class="{ 'block-item_large': props.bigLetters }" class="block-item">
    <div class="block-item__header">
      <div v-if="loading || itemProps.icon" class="block-item__header-icon">
        <IconLoading v-if="loading"/>
        <BlockItemIcons v-else :icon="itemProps.icon" :type="itemProps.inputType" :value="props.modelValue"/>
      </div>
      <a-tooltip :mouse-enter-delay="0.3" color="rgba(0,0,0,0.7)" placement="top">
        <template #title>
          <span>{{ itemProps.title }}</span>
        </template>
        <div class="block-item__header-title">{{ itemProps.title }}</div>
      </a-tooltip>
    </div>
    <div class="block-item__content">
      <BlockItemStatistic
        v-if="itemProps.inputType === 'statistic'"
        :big-letters="props.bigLetters"
        :data="props.modelValue"
        :placeholder="itemProps.placeholder"
      />
      <BlockItemInput
        v-else-if="itemProps.inputType === 'input' || !itemProps.inputType"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        @custom-click="toggleInputField(true)"
        @custom-blur="saveCellContent"
      />
      <BlockItemInput
        v-else-if="itemProps.inputType === 'jira-link'"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        @custom-click="toggleInputField(true)"
        @custom-blur="handleJiraLinkSave"
      />
      <BlockItemInput
        v-else-if="itemProps.inputType === 'mail'"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        @custom-click="toggleInputField(true)"
        @custom-blur="saveCellContent"
      />
      <BlockItemDateRange
        v-else-if="itemProps.inputType === 'date-range'"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        @custom-click="toggleInputField(true)"
        @custom-blur="saveCellContent"
      />
      <BlockItemDate
        v-else-if="itemProps.inputType === 'date' || itemProps.inputType === 'date-short'"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        :date-short="itemProps.inputType === 'date-short'"
        @custom-click="toggleInputField(true)"
        @custom-blur="saveCellContent"
      />
      <BlockItemTag
        v-else-if="itemProps.inputType === 'tag'"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        @custom-click="toggleInputField(true)"
        @custom-blur="saveCellContent"
      />
      <BlockItemPeople
        v-else-if="itemProps.inputType === 'people'"
        v-model="modelValue"
        :placeholder="itemProps.placeholder"
        :show-input="showInput"
        :options="options"
        @custom-click="toggleInputField(true)"
        @custom-blur="saveCellContent"
      />
      <BlockItemProgress
        v-else-if="itemProps.inputType === 'progress'"
        :data="modelValue"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import
import {putProjectInfo} from '@/api/projects'
import {useRoute} from 'vue-router'

import {computed, ref, watch} from 'vue'
import type {Ref} from 'vue'
import dayjs from 'dayjs'

// types & interfaces
export interface IBlockItem {
  title: string
  placeholder: string
  icon?: string
  inputType: string
  dbName: string[]
  value: any
}

export interface IBlockItemStatistic {
  counter: undefined | number
  list: any[]
}

type Props = {
  itemProps: IBlockItem
  
  modelValue?: any
  bigLetters?: boolean
  pageLoading?: boolean
  options?: object[]
}

// props & pinia
const props = withDefaults(defineProps<Props>(), {
  itemProps: {
    title: '',
    placeholder: '',
    icon: '',
    inputType: '',
    dbName: [],
    value: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'jira-link-save'])
const route = useRoute()

// constants

// refs
const editEmail = ref(false)
const blockRef: Ref<HTMLElement | undefined> = ref()
const allowInput: Ref<boolean> = ref(props.itemProps?.inputType === 'progress')
const lastSavedValue = ref()
const savingValue = ref(false)

// computed
const loading = computed(() => props.pageLoading || savingValue.value)
const showInput = computed(() => {
  return !!(
    (allowInput.value || props.itemProps?.inputType === 'tag' && modelValue.value?.length)
    && props.itemProps?.inputType !== 'statistic'
  )
})
const modelValue = computed({
  get() {
    if (props.itemProps?.inputType === 'input') return props.modelValue || ''
    else if (props.itemProps?.inputType === 'date-range') return props.modelValue || []
    else if (props.itemProps?.inputType === 'date') return props.modelValue
    else if (props.itemProps?.inputType === 'tag') return props.modelValue
    else if (props.itemProps?.inputType === 'progress') return props.modelValue || 0
    else return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

// methods
const handleJiraLinkSave = () => {
  if (!modelValue) return
  emit('jira-link-save')
}
const clickListener = ({target}: { target: any }) => {
  const datePicker = document.querySelector('.ant-picker-panels')
  const dropdown = document.querySelector('.ant-select-dropdown')
  if (
    !blockRef.value?.contains(target)
    && (!datePicker || !datePicker?.contains(target))
    && (!dropdown || !dropdown?.contains(target))
  ) {
    toggleInputField(props.itemProps?.inputType === 'progress')
  }
}
const toggleInputField = (value: boolean) => {
  if (allowInput.value && allowInput.value === value || props.itemProps?.inputType === 'statistic') return
  allowInput.value = value
  if (value) document.addEventListener('click', clickListener)
  else document.removeEventListener('click', clickListener)
}
const saveCellContent = async (forced) => {
  const _forced = forced === true
  let params = {}
  let value = modelValue.value
  
  const prevValue = JSON.stringify(lastSavedValue.value)
  const curValue = JSON.stringify(modelValue.value)
  if (!_forced && (!modelValue.value || prevValue === curValue)) return
  
  savingValue.value = true
  if (props.itemProps?.inputType === 'date-range') {
    value = {}
    if (modelValue.value[0]) value.date_from = dayjs(modelValue.value[0])?.format('YYYY-MM-DD')
    if (modelValue.value[1]) value.date_to = dayjs(modelValue.value[1])?.format('YYYY-MM-DD')
    if (Object.keys(value).length === 0) return
  } else if (props.itemProps?.inputType === 'date') value = dayjs(modelValue.value)?.format('YYYY-MM-DD')
  else if (props.itemProps?.dbName[1] === 'main_sku_price') {
    if (typeof modelValue.value === 'string') {
      value = Number(modelValue.value.replace(/\D/g, ''))
      modelValue.value = value
    }
  }
  if (props.itemProps?.inputType === 'date-range') params = {info: value}
  else if (props.itemProps?.dbName.length === 2) params[props.itemProps?.dbName[0]] = {[props.itemProps?.dbName[1]]: value}
  else if (props.itemProps?.dbName.length === 1) params[props.itemProps?.dbName[0]] = value
  
  try {
    await putProjectInfo(String(route.params.project), params)
  } catch (e) {
    console.log(e)
  } finally {
    savingValue.value = false
  }
}

// watch
watch(() => loading.value, (value) => {
  if (!value) {
    lastSavedValue.value = JSON.parse(JSON.stringify([modelValue.value]))[0]
  }
})

// hooks
</script>

<style lang="scss" scoped>
.block-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #fff;
  
  @include Body-M;
  
  &_large {
    flex-flow: column;
    
    .block-item__header {
      width: 100%;
      margin: 0;
    }
    
    .block-item__content {
      width: 100%;
      @include Title-H2();
      color: $neutrals-text-secondary;
    }
  }
  
  &__header {
    display: flex;
    flex: none;
    align-items: center;
    width: 200px;
    margin-right: 12px;
    color: $neutrals-text-secondary;
  }
  
  &__header-icon {
    display: inline-block;
    flex: none;
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  
  &__header-title {
    display: inline-block;
    // width: 136px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  &__placeholder {
    display: block;
    width: max-content;
    max-width: 230px;
    padding: 0 7px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  
  &__input > * {
    width: 100%;
    height: 20px;
  }
  
  &__content {
    width: calc(100% - 200px);
    height: 20px;
    text-align: left;
  }
  
  &__link {
    display: block;
    max-width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<style>
.block-item__placeholder {
  display: block;
  width: max-content;
  max-width: 230px;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>
