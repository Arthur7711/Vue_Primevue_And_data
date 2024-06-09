<template>
  <div  class="pie-charts" ref="pieChartsWrapper">
    <div v-for="group in chartList" :key="group.value" :class="{ 'hidden-grid': props.isShowWidget[group.value] }">
        <CustomCard>
          <template #header>M/M by {{group.label}} </template>
          <template #content>
            <PieEChart :legend-width="legendWidth" :group="group.value" @selected_item="value => $emit('selected_item',{...value, group_By: group.value})"/>
          </template>
        </CustomCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import
import {ref, watch} from 'vue'
import {debounce, upperCaseFirstLetter} from '@/utils'
import {CHART_GROUPS} from '@/stores/allocation'
import type {IWidgetItems} from "@/components/Allocation/WidgetsMenu.vue";
import type {ISelectedItem} from "@/components/Allocation/Barchart.vue";
import type {GroupBy} from "@/pages/Allocation/types";
// types & interfaces
interface IInitialData {
  date: string[],
  projects: TProject[]
}
type TProject = {
  name: string,
  data: number[]
}

// props & pinia
const props = defineProps<{
  sidebarIsOpen: boolean,
  initialData: IInitialData,
  isShowWidget: IWidgetItems
}>()
const emit = defineEmits<{
  (e: 'selected_item', value: GroupBy): void,
}>()
// constants

// refs
const pieChartsWrapper = ref()
const legendWidth = ref()
const chartList = ref(
  CHART_GROUPS.map(group => ({
    value: group,
    label: group.split('_')
      .map(word => upperCaseFirstLetter(word))
      .join(' ')
  })).slice(1)
)

// computed


// methods
const resizeListener = debounce(() => {
  legendWidth.value = (pieChartsWrapper.value?.clientWidth - 20) / 5 || undefined
}, 500, false)

// watch
watch(() => props.sidebarIsOpen, resizeListener, {immediate: true})

// hooks

</script>

<style lang="scss" scoped>
.pie-charts {
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-columns: calc(50% - 10px) calc(50% - 10px);
  width: 100%;
}
.hidden-grid {
  display: none;
}
</style>
