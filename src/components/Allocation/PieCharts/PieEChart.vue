<template>
  <div class="chartSection" v-if="seriesData?.length == 0">
    <a-spin size="large" />
  </div>
  <v-chart
    v-else
    class="chart"
    :option="option"
    @click="segmentClick"
    autoresize
    @legendselectchanged="segmentClick"
  />
</template>

<script setup lang="ts">
// import
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";
import { allocationColors } from "@/assets/scss/chartColors";
import { ref, computed } from "vue";
import { CHART_GROUPS, useAllocationStore } from "@/stores/allocation";
import { type ECElementEvent } from "echarts";
import { type IOptions } from "@/components/SideBar/types";
import { useRoute } from "vue-router";
import { type ISeriasFormaterParams } from "@/pages/Allocation/types";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);

// types & interfaces
export interface ISelectedItem {
  target: boolean;
  name: string;
}

// props & pinia
const props = defineProps<{
  legendWidth: number | undefined;
  group: (typeof CHART_GROUPS)[number];
}>();
const emit = defineEmits<{
  (e: "selected_item", value: ISelectedItem): void;
}>();
const { allocationsStore } = useAllocationStore();
const route = useRoute();
// constants
// const group = props.group as typeof CHART_GROUPS[number];
// refs
const options = ref<IOptions>();
const selectedItem = ref<ISelectedItem>({
  target: false,
  name: "",
});
// computed

const seriesData = computed(() => {
  return (
    allocationsStore.pieCharts[props.group==='department_group'?'project_group':props.group]?.data.map(({ name, data }) => ({
      name,
      value: data.reduce((acc, i) => acc + i, 0).toFixed(2),
    })) || []
  );
});

const segmentClick = (params: ECElementEvent) => {
  if (selectedItem.value.name && selectedItem.value.name === params.name) {
    selectedItem.value.target = !selectedItem.value.target;
  } else {
    selectedItem.value.target = true;
    selectedItem.value.name = params.name;
  }
  emit("selected_item", selectedItem.value);
};

const option = computed(() => {
  return {
    tooltip: {
      trigger: "item",
      formatter: function (item: any) {
        return `<div class="piechart_tooltip_tooltip">
    ${item.marker}
    <span> ${item.name}</span>
    <span class='piechart_tooltip_span_bold'> ${item.value}</span>
    <span class='piechart_tooltip_span_bold'> (${item.percent}%)</span>
  </div>`;
      },
    },

    color: allocationColors,
    legend: {
      type: "scroll",
      right: "right",
      orient: "vertical",
      icon: "circle",
      pageIcons: {
        vertical: [
          "image://data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjUzNTIgOS4wMzQwNkMxMS4yNDE5IDkuMzI3MzkgMTAuNzY2MyA5LjMyNzM5IDEwLjQ3MyA5LjAzNDA2TDUuNDY2NzUgNC4wMjc4M0M1LjE3MzQyIDMuNzM0NSA1LjE3MzQyIDMuMjU4OTIgNS40NjY3NSAyLjk2NTZDNS43NjAwNyAyLjY3MjI3IDYuMjM1NjUgMi42NzIyNyA2LjUyODk4IDIuOTY1NkwxMS41MzUyIDcuOTcxODJDMTEuODI4NSA4LjI2NTE1IDExLjgyODUgOC43NDA3MyAxMS41MzUyIDkuMDM0MDZaIiBmaWxsPSIjMTYyMDMxIi8+CjxwYXRoIGQ9Ik0wLjQ2NDYwNCA5LjAzNDI2QzAuNzU3OTA0IDkuMzI3NTggMS4yMzM1IDkuMzI3NTggMS41MjY4IDkuMDM0MjZMNi41MzMwNSA0LjAyODAzQzYuODI2MzggMy43MzQ3IDYuODI2MzggMy4yNTkxMiA2LjUzMzA1IDIuOTY1OEM2LjIzOTczIDIuNjcyNDcgNS43NjQxNSAyLjY3MjQ3IDUuNDcwODIgMi45NjU4TDAuNDY0NjA0IDcuOTcyMDJDMC4xNzEzMDQgOC4yNjUzNSAwLjE3MTMwNCA4Ljc0MDkzIDAuNDY0NjA0IDkuMDM0MjZaIiBmaWxsPSIjMTYyMDMxIi8+Cjwvc3ZnPgo=",
          "image://data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuNDY0NzkxIDIuOTY1OTRDMC43NTgxMTggMi42NzI2MSAxLjIzMzcgMi42NzI2MSAxLjUyNzAzIDIuOTY1OTRMNi41MzMyNSA3Ljk3MjE3QzYuODI2NTggOC4yNjU1IDYuODI2NTggOC43NDEwOCA2LjUzMzI1IDkuMDM0NEM2LjIzOTkzIDkuMzI3NzMgNS43NjQzNSA5LjMyNzczIDUuNDcxMDIgOS4wMzQ0TDAuNDY0NzkxIDQuMDI4MThDMC4xNzE0NjQgMy43MzQ4NSAwLjE3MTQ2MyAzLjI1OTI3IDAuNDY0NzkxIDIuOTY1OTRaIiBmaWxsPSIjMTYyMDMxIi8+CjxwYXRoIGQ9Ik0xMS41MzU0IDIuOTY1NzRDMTEuMjQyMSAyLjY3MjQyIDEwLjc2NjUgMi42NzI0MiAxMC40NzMyIDIuOTY1NzRMNS40NjY5NSA3Ljk3MTk3QzUuMTczNjIgOC4yNjUzIDUuMTczNjIgOC43NDA4OCA1LjQ2Njk1IDkuMDM0MkM1Ljc2MDI3IDkuMzI3NTMgNi4yMzU4NSA5LjMyNzUzIDYuNTI5MTggOS4wMzQyTDExLjUzNTQgNC4wMjc5OEMxMS44Mjg3IDMuNzM0NjUgMTEuODI4NyAzLjI1OTA3IDExLjUzNTQgMi45NjU3NFoiIGZpbGw9IiMxNjIwMzEiLz4KPC9zdmc+Cg==",
        ],
      },
      textStyle: {
        overflow: "breakAll",
        lineHeight: 14,
        width: props.legendWidth,
        rich: {
          title: { align: "left" },
          value: { align: "right" },
          value2: { align: "right" },
        },
      },
      data: seriesData.value,
      formatter: (name: string) => {
        const value = seriesData.value.find(
          (item) => item.name === name
        )?.value;
        if (value !== undefined) {
          return (
            `{title|${name.length > 20 ? name.slice(0, 18) + "..." : name}}` +
            `{value|${value}}` +
            `{value2|${
              value
                ? " (" +
                  (
                    (+value / allocationsStore.pieCharts[props.group]?.sum) *
                    100
                  ).toFixed(2) +
                  "%)"
                : ""
            }}`
          );
        }
      },
    },
    series: [
      {
        type: "pie",
        radius: ["100%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: false,
          position: "center",
        },
        stack: "log",
        emphasis: {
          focus: "self",
        },
        width: "50%",
        data: seriesData.value,
      },
    ],
  };
});
// methods

// watch

// hooks
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
}
.tooltip-items {
  display: flex;
  align-items: center;
}
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
:deep {
  .piechart_tooltip_span_bold {
    font-weight: 600 !important;
  }
}
.chartSection {
  align-items: center;
  display: flex;
}
</style>
