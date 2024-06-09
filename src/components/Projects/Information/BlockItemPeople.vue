<template>
  <div class="people-select" :class="classes" tabindex="-1" @blur="handleMainBlur">
    <div class="people-select__inner" v-show="showInput || modelValue?.length" @click="open = true">
      <a-select ref="refSelect"
                v-model:value="modelValue"
                :bordered="false"
                :field-names="{value: 'id', label: 'displayname'}"
                :filter-option="filter"
                :open="open"
                :options="prefilteredOptions"
                class="people-select__select"
                mode="multiple"
                @blur="handleBlur"
                @focus="handleFocus"
      >
        <template #option="{ avatar_url, displayname, id, samaccountname }">
          <div class="people-select__option">
            <a-avatar :size="28" :src="avatar_url" class="people-select__avatar"/>
            {{ displayname }}
          </div>
        </template>
        <template #tagRender="{ value: val, label, closable, onClose, option }">
          <div v-if="modelValue.findIndex(i => i === option?.id) < 5" class="people-select__tag">
            <a-tooltip placement="top">
              <template #title>
                <span>{{ label }}</span>
              </template>
              <a-avatar :size="28" :src="option?.avatar_url" class="people-select__avatar"/>
            </a-tooltip>
          </div>
          <div v-if="modelValue.findIndex(i => i === option?.id) === 5" class="people-select__tag">
            <a-avatar :size="28" class="people-select__avatar people-select__avatar_placeholder">
              +{{ modelValue.length - 5 }}
            </a-avatar>
          </div>
        </template>
      </a-select>
      <div :class="{
            'people-select__add-icon_plus': fullListIsAvailable,
            'people-select__add-icon_minus': !fullListIsAvailable
          }"
           class="people-select__add-icon"
           @click="toggleAdding">
        <MinusIcon/>
        <PlusIcon/>
      </div>
    </div>
    <div v-show="!showInput && !modelValue.length" @click="handlePlaceholderClick">
      <div :class="{
            'people-select__add-icon_plus': fullListIsAvailable,
            'people-select__add-icon_minus': !fullListIsAvailable
          }"
           class="people-select__add-icon"
      >
        <MinusIcon/>
        <PlusIcon/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import
import {PlusIcon, MinusIcon} from 'mdi-vue3'

// types & interfaces
import {computed, ref} from 'vue'

type Props = {
  modelValue: any
  showInput: boolean
  placeholder: string
  options: object[]
}

// props & pinia
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'custom-click', 'custom-blur'])

// constants

// refs
const fullListIsAvailable = ref(false)
const refSelect = ref()
const open = ref(false)
const timer = ref()

// computed
const modelValue = computed({
  get() {
    return props.modelValue ?? []
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const classes = computed(() => ({
  'people-select_padding': modelValue.value.length
}))
const prefilteredOptions = computed(() => {
  if (fullListIsAvailable.value) {
    return (props.options?.length ? props.options : []).filter(item => true)
  } else {
    let result = []
    modelValue.value?.forEach(id => {
      const item = props.options?.find(item => item.id === id)
      if (item) result.push(item)
    })
    return result
  }
})

// methods
const filter = (input, selectOption) => {
  return selectOption.displayname.toLowerCase().includes(input?.toLowerCase())
}
const handleBlur = () => {
  emit('custom-blur')
  open.value = false
  fullListIsAvailable.value = false
}
const handleFocus = () => {
  if (timer.value) clearTimeout(timer.value)
  open.value = true
}
const handlePlaceholderClick = async () => {
  emit('custom-click')
  await new Promise((resolve) => setTimeout(resolve, 0))
  fullListIsAvailable.value = true
  open.value = true
}
const handleMainBlur = () => {
  open.value = false
  timer.value = setTimeout(() => {
    fullListIsAvailable.value = false
  }, 200)
}
const toggleAdding = () => {
  fullListIsAvailable.value = !fullListIsAvailable.value
  if (fullListIsAvailable.value) open.value = true
}

// watch

// hooks
</script>

<style lang="scss" scoped>
.people-select {
  
  &__inner {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: -4px;
  }
  &__select {
    width: calc(100% - 20px);
  }
  &__option {}
  &__tag {}
  &__avatar {
    cursor: pointer;
    border: 2px solid white;
    &_placeholder {
      display: flex;
      
      align-items: center;
      justify-content: center;
      font-size: 10px !important;
      font-weight: 600;
      line-height: 12px;
      
      letter-spacing: 0;
      text-align: center;
      background-color: #0C3B92;
    }
  }
  &__add-icon {
    position: relative;
    width: 27px;
    height: 24px;
    color: #8393A9;
    cursor: pointer;
    border: 1px dashed #E2E5EA;
    border-radius: 50%;
    transition: 300ms;
    
    svg:first-child, svg:last-child {
      position: absolute;
      transition: 300ms;
    }
    
    &_plus {
      transform: rotate(0deg);
      svg:first-child {
        opacity: 1;
      }
      svg:last-child {
        opacity: 0;
      }
    }
    &_minus {
      transform: rotate(90deg);
      svg:first-child {
        opacity: 0;
      }
      svg:last-child {
        opacity: 1;
      }
    }
  }
  
  &:deep(.ant-select-selection-overflow) {
    & > div:not(.ant-select-selection-overflow-item-suffix) {
      &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5), &:nth-child(6) {
        margin-left: -8px;
      }
    }
  }
  &:deep(.ant-select-selection-search) {
    display: inline-block;
  }
  &_padding:deep(.ant-select-selection-search):before {
    content: '';
    display: block;
    width: 8px;
  }
}
</style>
