<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {fillTableLine} from '@/utils'
import Action from './Action.vue'
import ChartMilestoneTable from './ChartMilestoneTable.vue'
import type {IMIlestones} from '../../../api/models/IProjects'
import Success from '../../icons/Success.vue'
import InProgressVue from '../../icons/InProgress.vue'
import Incomplit from '../../icons/Incomplit.vue'
import {useRoute} from 'vue-router'
import useProjectStore from '../../../stores/project'

const props = defineProps<{
  itemList: IMIlestones[];
  options: {
    value: string;
    id: string | number;
  }[];
}>()

const route = useRoute()
const columns = ref([
  fillTableLine('', 'status', {width: '50px'}),
  fillTableLine('Milestone', 'milestone', {width: '150px'}),
  fillTableLine('Comments', 'comment', {width: '350px'}),
  fillTableLine('MM', 'sum_man_month', {width: '50px'}),
  fillTableLine('Average headcount', 'avg_headcount', {width: '100px'}),
  fillTableLine('Headcount chart', 'headcount_chart', {width: '350px'}),
  fillTableLine('Action', 'action', {width: '50px'}),
])
const selectedRow = ref<number | string>(useProjectStore.milestoneId.value)

watch(
  () => useProjectStore.milestoneId.value,
  () => {
    selectedRow.value = Number(useProjectStore.milestoneId.value)
  }
)
</script>
<template>
  <a-table
    :data-source="itemList"
    :columns="columns"
    :pagination="false"
    class="project_table"
    :custom-row="(record: IMIlestones) =>{
      return {
          onClick: () => {
            useProjectStore.changeMilestoneId(`${record.milestone_id}`);
            useProjectStore.changeMilestoneName(`${record.milestone.name}`)
        }
      }
    }"
    :rowClassName="
      (record) => (selectedRow === record.milestone_id ? 'selected' : null)
    "
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'status'">
        <div class="status">
          <Success v-if="text === 'complete'"/>
          <InProgressVue v-else-if="text === 'in_progress'"/>
          <Incomplit v-if="text === 'incomplete'"/>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'milestone'">
        <h4>{{ text.name }}</h4>
        <p class="date_info">
          {{ `${record.date_start} - ${record.date_end}` }}
        </p>
      </template>
      <template v-else-if="column.dataIndex === 'comment'">
        <p class="date_info">
          {{ text || 'No comment' }}
        </p>
      </template>
      <template v-else-if="column.dataIndex === 'sum_man_month'">
        <h4>
          {{ text }}
        </h4>
      </template>
      <template v-else-if="column.dataIndex === 'avg_headcount'">
        <h4>{{ text }}</h4>
        <p class="date_info">
          min. {{ record.min_headcount }} — max. {{ record.max_headcount }}
        </p>
      </template>
      <template v-else-if="column.dataIndex === 'headcount_chart'">
        <ChartMilestoneTable
          :id="record.milestone_id"
          :project_id="`${route.params.project}`"
        />
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <Action
          :options="options"
          :id="record.milestone.id"
          :date_start="record.date_start"
          :date_end="record.date_end"
          :name="record.milestone.name"
          :comment="record.comment"
        />
      </template>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
.project-name {
  color: $primary-text-default;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

.project_table {
  &:deep(.ant-table-cell) {
    align-self: flex-start;
    tr {
      th {
        width: 250px !important;
      }
    }
    .date_info {
      color: $neutrals-text-secondary;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
    .status {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

:global(.selected) {
  background: #e2e5ea;
}
</style>
