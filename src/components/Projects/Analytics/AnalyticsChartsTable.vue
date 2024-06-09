<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {fillTableLine} from "@/utils";
import type {
  IEmitAnalyticsChartsTable,
  IIndex,
  IIsSHow,
} from "@/components/Projects/Analytics/types";

const emit = defineEmits<IEmitAnalyticsChartsTable>();
// const props = defineProps<IPropsAnalyticsChartsTable>();
const props = defineProps<{
  itemList: any[];
  activeKey: string;
  thisMonth: string;
  coloredData: any[];
}>();
const selectedMonth = ref<string>("");
const isShow = ref<IIsSHow>({});
const findItem = ref<IIndex>({});
const handleIsShow = (text) => {
  // findItem.value = {
  //   index: props.itemList.findIndex((item) => item.project === text),
  // };
  // isShow.value = {
  //   ...isShow.value,
  //   [text]: !isShow.value[text] ? true : !isShow.value[text],
  // };
  // itemListComputed.value
  findItem.value = {
    index: props.itemList.findIndex((el) => el.name === text),
  };
  // console.log(111, findItem.value);
  isShow.value = {
    ...isShow.value,
    [text]: !isShow.value[text] ? true : !isShow.value[text],
  };
};
const itemListComputed = computed(() => props.itemList);
const columns = computed(() =>
  props.activeKey === "1"
    ? [
        fillTableLine("Projects", "projects", {
          width: "22.125rem",
          sorter: true,
        }),
        fillTableLine("Headcount", "headcount"),
      ]
    : [
        fillTableLine("Department", "department", {
          width: "22.125rem",
          sorter: true,
        }),
        fillTableLine("Headcount", "headcount"),
      ]
);
// watch(
//   () => props.activeKey,
//   () => {
//     isShow.value = {};
//   }
// );

watch(
  () => props.thisMonth,
  () => {
    selectedMonth.value = props.thisMonth;
  },
  { immediate: true }
);

watch(
  () => findItem.value,
  (value) => {
    if (value) {
      emit("refresh-legend", value);
    }
  },
  { immediate: true }
);
</script>
<template>
  <a-table
    :data-source="itemListComputed"
    :columns="columns"
    :pagination="false"
    :scroll="{ y: 200 }"
  >
    <template #bodyCell="{ column, text, record }">
      <template
        v-if="
          column.dataIndex === 'projects' || column.dataIndex === 'department'
        "
      >
        <div class="projects">
          <div class="projects__name">
            <div v-if="record?.name" style="display: flex;align-items: center;gap: 5px;">
              <div
                :style="{
                  height: '10px',
                  width: '10px',
                  borderRadius: '50%',
                  background: coloredData.find((el) => el.name === record.name)
                    .color,
                }"
              />
              {{ record.name }}
            </div>
            <p v-else>{{ "N/A" }}</p>
          </div>
          <div class="projects__icon" @click="handleIsShow(record?.name)">
            <IconEyeOpen v-if="!isShow[record?.name]" />
            <IconEyeClose v-else />
          </div>
        </div>
      </template>
      <template v-else>
        <span class="content">{{ record?.headcount }}</span>
      </template>
    </template>
  </a-table>
</template>

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
  justify-content: space-between;
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
