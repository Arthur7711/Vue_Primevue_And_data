<template>
  <div ref="containerRef" class="statistic">
    <div class="statistic__counter" :class="{'statistic__counter_big-letters': bigLetters}">
      <span v-if="data.counter !== undefined">{{ data.counter }}</span>
      <span v-else>{{ placeholder }}</span>
    </div>
    <div v-if="data.list.length"
         :class="dropdownClasses"
         class="statistic__dropdown"
    >
      <a-dropdown :overlayStyle="dropdownWidth"
                  :trigger="['click']"
                  placement="bottomRight"
                  @visibleChange="handleVisibleChange"
      >
        <div class="statistic__dropdown-icon-wrapper" @click.prevent>
          <ChevronDownIcon
            :class="{'statistic__dropdown-icon_upside-down': dropdownOpened}"
            class="statistic__dropdown-icon"
          />
        </div>
        <template #overlay>
          <a-menu class="statistic__dropdown-menu">
            <a-menu-item
              v-for="item in data.list"
              :key="item.id"
              class="statistic__dropdown-menu-item"
              @click="handleVisibleChange(false)"
            >
              <div v-if="Array.isArray(item)" style="display:flex; justify-content: space-between">
                <span>{{ item[0] }}</span>
                <span style="color:#576B8B;">{{ item[1] }}</span>
              </div>
              <span v-else>{{ item }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import
import {ChevronDownIcon} from 'mdi-vue3'
import {computed, ref, watch} from 'vue'

// types & interfaces

// props & pinia
const props = defineProps<{
  data: object,
  placeholder: string
  bigLetters: boolean
}>()
// constants

// refs
const dropdownOpened = ref(false)
const dropdownWidth = ref({})
const containerRef = ref()
// computed
const dropdownClasses = computed(() => ({
  'statistic__dropdown_opened': dropdownOpened.value,
  'statistic__dropdown_big': props.bigLetters,
  'statistic__dropdown_small': !props.bigLetters
}))

// methods
const handleVisibleChange = (value) => {
  dropdownOpened.value = value
}

// watch
watch(() => dropdownOpened.value, (value) => {
  if (value) {
    dropdownWidth.value = {width: `${containerRef.value.closest('.block-item__content').clientWidth}px`}
  }
})

// hooks
</script>

<style lang="scss" scoped>
.statistic {
  position: relative;
  display: flex;
  &__counter {
    padding: 0 7px;
    &_big-letters {
      padding: 0;
    }
  }
  &__dropdown {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    &_opened {
      background-color: #ECEFF3;
    }
    &_big {
      top: -15px;
      width: 36px;
      height: 36px;
      border-radius: 8px;
    }
    &_small {
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      
      .statistic__dropdown-icon-wrapper {
        width: 18px;
      }
    }
  }
  &__dropdown-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__dropdown-icon {
    width: 28px;
    cursor: pointer;
    border-radius: 50%;
    outline: none;
    transition: 200ms;
    &_upside-down {
      transform: rotate(180deg);
    }
  }
  &__dropdown-menu {
    margin-top: 14px;
    margin-right: -8px;
    border-radius: 8px;
    max-height: 180px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, .3);
      border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
}
</style>
