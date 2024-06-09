<template>
  <v-chart
    ref="chartRef"
    :update-options="{ notMerge: true }"
    class="chart"
    :option="option"
    autoresize
    @click="segmentClick"
    @legendselectchanged="segmentClick"
  />
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { computed, provide, ref, watch, watchEffect } from "vue";
import { allocationColors } from "@/assets/scss/chartColors";
import type {
  GroupBy,
  ISeriasFormaterParams,
  IInitialProjects,
} from "@/pages/Allocation/types";
const chartRef = ref();
use([
  DataZoomComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer,
]);

provide(THEME_KEY, "light");

interface IInitialComputedData {
  name: string;
  type: string;
  stack: string;
  emphasis: {
    focus: string;
  };
  label: {
    show: boolean;
    position: string;
  };
  data: number[];
}
export interface IInitialData {
  date: string[];
  projects: {
    name: string;
    data: number[];
  }[];
}
export interface ISelectedItem {
  target: boolean;
  name: string;
}
const props = defineProps<{
  initialData: IInitialData;
}>();
const emit = defineEmits<{
  (e: "selected_item", value: GroupBy): void;
}>();
const initialData = ref();
const selectedLegend = ref<ISeriasFormaterParams>();
let selected = ref([]);
const selectedItem = ref<ISelectedItem>({
  target: false,
  name: "",
});
const segmentClick = (params: ISeriasFormaterParams): any => {
  let paramsName: string;
  if (params.seriesName) {
    paramsName = params.seriesName;
  } else {
    paramsName = params.name;
  }
  if (selectedItem.value.name && selectedItem.value.name === paramsName) {
    selectedItem.value.target = !selectedItem.value.target;
  } else {
    selectedItem.value.target = true;
    selectedItem.value.name = paramsName as string;
  }
  emit("selected_item", selectedItem.value as GroupBy);
  selectedLegend.value = params;
};
watchEffect(() => (initialData.value = props.initialData));

const initialComputedData = computed(() =>
  initialData.value.projects?.map((item: IInitialProjects) => {
    return {
      name: item.name,
      type: "bar",
      stack: "log",
      emphasis: {
        focus: "series",
      },
      label: {
        show: false,
        position: "top",
      },
      data: item.data,
    };
  })
);

const sortedData = computed(() => {
  const calculateSum = (sData: number[]) =>
    sData.reduce((acc, value) => acc + value, 0);
  return initialComputedData.value?.sort(
    (a: IInitialComputedData, b: IInitialComputedData) =>
      calculateSum(b.data) - calculateSum(a.data)
  );
});
const getLabel = () => {
  return {
    show: true,
    position: "top",
    formatter: function (params: ISeriasFormaterParams) {
      let val = 0;
      option.value.series?.forEach((s: IInitialComputedData) => {
        val += s.data[params.dataIndex];
      });
      return val ? val.toFixed(2) : " ";
    },
  };
};

const topLabelData = computed(() => {
  let result = sortedData.value;
  result[result?.length - 1].label = getLabel();
  return result;
});
const startZoom = computed(() => {
  const datesLength = computed(() => initialData.value?.date.length);
  switch (true) {
    case datesLength.value > 25:
      return 50;
    case datesLength.value > 17:
      return 40;
    case datesLength.value > 11:
      return 20;
    default:
      return 0;
  }
});

const endZoom = computed(() => 100);
const option = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: "y",
    className: "echarts-tooltip echarts-tooltip-dark",
    formatter: (params: ISeriasFormaterParams[]) => {
      const values = computed(() => params.sort((a, b) => b.value - a.value));
      const test = [];
      let sum = 0;
      values.value.forEach((el, i) => {
        if (i < 5) {
          if (!el.value) return;
          else
            test.push(`
            <div class="tooltip-items">
              <span class="circle" style="background-color: ${el.color};  margin-right: 10px"></span>
              <div class="test_class">
                <span>${el.seriesName}</span>
                <span style="margin-left: 30px">${el.value}</span>
              </div>
            </div>
          `);
        }
      });
      params.forEach((el, i) => {
        if (i > 4 && el.value) sum += el.value;
      });
      test.unshift(`<div>${params[0].name}</div>`);
      test.push(
        sum === 0
          ? ""
          : `<div class="test_class"><span>Others: </span><span>${sum.toFixed(
              2
            )}</span></div>`
      );
      return `<div class="test_class_container">${test.join("")}</div>`;
    },
  },
  color: allocationColors,
  legend: {
    type: "scroll",
    right: 0,
    orient: "vertical",
    align: "left",
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
      width: 250,
      rich: {
        title: { align: "left" },
        value: { align: "right" },
      },
    },
    data: topLabelData.value.map((item: IInitialComputedData) => item.name),
    formatter: (name: string) => {
      const foundStack = [...topLabelData.value].find(
        (item) => item.name === name
      );
      if (foundStack) {
        const value = foundStack.data.reduce(
          (acc: number, i: number) => acc + i,
          0
        );
        return (
          `{title|${name}}` +
          `{value|${value % 1 === 0 ? value : value.toFixed(2)}}`
        );
      }
    },
  },
  grid: {
    left: "0",
    right: "300px",
    bottom: "40px",
    containLabel: true,
  },
  // dataZoom: [
  //   {
  //     type: "slider",
  //     bottom: "0%",
  //     start: startZoom,
  //     end: endZoom,
  //   },
  // ],
  xAxis: {
    type: "category",
    data: initialData.value.date,
  },
  yAxis: {
    type: "value",
  },
  series: topLabelData.value,
});

watch(
  () => topLabelData.value,
  () => {
    option.value.legend.data = topLabelData.value.map(
      (item: IInitialComputedData) => item.name
    );
    option.value.xAxis.data = initialData.value.date;
    option.value.series = topLabelData.value;
  }
);

watch(
  () => selectedLegend.value,
  (val) => {
    let selectedValue =
      val && val.seriesName ? val.seriesName : selectedLegend.value?.name;

    if (selectedValue) {
      if (!selected.value.includes(selectedValue)) {
        selected.value.push(selectedValue);
        option.value = {
          ...option.value,
          legend: { ...option.value.legend, data: [`${selectedValue}`] },
          series: topLabelData.value.filter(
            (item: IInitialComputedData) => item.name === selectedValue
          ),
        };
        option.value.series[option.value.series.length - 1].label = getLabel();
      } else {
        selected.value = selected.value.filter(
          (item) => item !== selectedValue
        );
        option.value = {
          ...option.value,
          legend: {
            ...option.value.legend,
            data: topLabelData.value.map(
              (item: IInitialComputedData) => item.name
            ),
          },
          series: topLabelData.value.map(
            (item: IInitialComputedData, index: number) => {
              if (index == topLabelData.value.length - 1) {
                return { ...item, label: getLabel() };
              } else {
                return { ...item, label: {} };
              }
            }
          ),
        };
      }
    }
  }
);
</script>

<style lang="scss">
.echarts-tooltip-dark {
  max-height: 20vh !important;
  overflow: hidden !important;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.tooltip-items {
  display: flex;
  align-items: center;
}

.test_class {
  display: flex !important;
  justify-content: space-between !important;
  width: 100%;
}

.chart {
  height: 460px;
  width: 100%;
}
</style>
