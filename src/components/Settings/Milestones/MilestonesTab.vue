<template>
  <a-table
    :columns="columns"
    :data-source="itemList"
    :pagination="false"
    class="milestone-table"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'color'">
        <div
          class="milestone-table__color-marker color-marker"
          :class="{ [`color-marker_${markerType(record.stage)}`]: true }"
        ></div>
      </template>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
// import
import { ref } from "vue";
import { fillTableLine } from "@/utils";
import { useRouter } from "vue-router";
// props & pinia

// constants

// refs
const columns = ref([
  fillTableLine("Stage", "stage", { width: 150 }),
  fillTableLine("Color", "color", { width: 50 }),
  fillTableLine("Description", "description"),
]);
const itemList = ref([
  { stage: "pitch", description: "pitch" },
  { stage: "concept", description: "concept" },
  { stage: "feasibility", description: "pitch" },
  { stage: "prototype", description: "prototype" },
  { stage: "1st playable", description: "1st playable" },
  { stage: "vertical slice", description: "vertical slice" },
  { stage: "vertical chunk", description: "vertical chunk" },
  { stage: "alpha", description: "alpha" },
  { stage: "content complete", description: "content complete" },
  { stage: "beta", description: "beta" },
  { stage: "code lock", description: "code lock" },
  { stage: "certification", description: "certificition" },
  { stage: "RTM", description: "RTM" },
  { stage: "post launch", description: "post launch" },
  { stage: "cancelled", description: "cancelled" },
  { stage: "blocked/on hold", description: "blocked/on hold" },
  { stage: "complete", description: "complete" },
]);

// computed

// methods
const markerType = (stage: string) =>
  stage
    .toLowerCase()
    .replace(/\//g, " ")
    .replace(/\s/g, "-")
    .replace(/-+/g, "-");

// watch

// hooks
</script>

<style scoped lang="scss">
.milestone-table {
  &__color-marker {
    width: 50px;
    height: 25px;
    border-radius: 5px;
    border: 2px solid black;
  }
}
</style>
