<template>
  <a-table v-if="itemList.length" :data-source="itemList" :columns="columns" :pagination="false" :scroll="{ y: 440 , x: 2500}">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'project'">
        <div class="projects">
          <div class="projects__name">
            <div class="projects__name-circle" :style="{backgroundColor: record.color}" />
            <router-link :to="{name: '', params: {name: text}}" class="studio-name">{{ text }}
            </router-link>
          </div>
          <div class="projects__icon" @click="handleIsShow(text)">
            <IconEyeOpen v-if="!isShow[text]" />
            <IconEyeClose v-else />
          </div>
        </div>
      </template>
      <template v-else ><span class="content">{{ text }}</span></template>
    </template>

  </a-table>
  <div style="text-align: center; margin-top: 15px; color: #8393A9 " v-else> Select a mount on the chart to see the number of people in the project</div>
</template>


<script setup lang="ts">
// import
import {computed, ref, watch} from "vue";
import {fillTableLine} from "@/utils";
import {useStudioAreaChartData} from "@/stores/charts";
import {useRoute} from "vue-router";
// props & pinia
const emit = defineEmits(['refresh-legend'])
const props = defineProps(['thisMonth', 'activeKey', 'chartTableColor', 'filters', 'dateStart', 'dateEnd'])
const route = useRoute()
// constants
const {chartStore, getStudioChartTableData}= useStudioAreaChartData()
// Ref
const selectedMonth = ref('')
const itemList = computed(()=>{
  return chartStore.chartTable?.map(item=>({...item, color:  props.chartTableColor?.find(project=>project?.name === item.project? project.color: '')?.color}))
})
const columns = ref([
  fillTableLine('Projects', 'project', {width: "14.8rem", sorter: (a: any, b: any) => a.project < b.project }),
  fillTableLine('Artists', 'ART', ),
  fillTableLine('IT', 'IT', ),
  fillTableLine('Directors', 'Directors'),
  fillTableLine('Programming', 'Programming'),
  fillTableLine('Test', 'Test',),
  fillTableLine('Administrators', 'administrators'),
  fillTableLine('Managers', 'Managers'),
  fillTableLine('Release Management', 'Release Management'),
  fillTableLine('Producers', 'producers'),
  fillTableLine('Animators', 'animators'),
  fillTableLine('Support', 'support'),
  fillTableLine('Tech design', 'techDesign', ),
  fillTableLine('Game design', 'Game Design', ),
])
const isShow = ref({})
const itemIndex = ref([])
const findItem = ref(null)
//methods

const handleIsShow = (text) => {
    findItem.value = {index: props.chartTableColor?.findIndex(item => item.name === text)}
    isShow.value = {...isShow.value, [text]: !isShow.value[text] ? true: !isShow.value[text] }
}
// computed

// watch
watch(()=>[ props.chartTableColor], ()=>{

  if(Object.keys( props.chartTableColor).length === 0){
    isShow.value = {}
    findItem.value=null
  }
}, {immediate: true, deep: true})

watch(()=> props.thisMonth, async ()=>{
  selectedMonth.value = props.thisMonth
  const [getYear, getMonth]= selectedMonth.value.split('-')
  await getStudioChartTableData({
    year: Number(getYear),
    month: Number(getMonth),
    studio_id: route.params.id,
    office_id: props.filters.offices,
    project_id: props.filters.projects
  })


}, {immediate: true} )

watch(()=>props.filters, async ()=>{

    selectedMonth.value = props.thisMonth
    const [getYear, getMonth]= selectedMonth.value.split('-')
    await getStudioChartTableData({
      year: Number(getYear),
      month: Number(getMonth),
      studio_id: route.params.id,
      office_id: props.filters.offices,
      project_id: props.filters.projects
    })


}, {deep: true})

watch(() => findItem.value, (value) =>{
if (findItem.value){
  emit('refresh-legend', value)
}
}, )
// hooks
</script>
<style scoped lang="scss">
.content {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.projects {
  display: flex;
  align-items: center;
  justify-content: space-between ;
  &__name {
    display: flex;
    align-items: center;
  }
  &__name-circle {
    width: 8px;
    height: 8px;
    margin-right: 10px;
    background-color: #007bff;
    border-radius: 50%;
  }
}

</style>
