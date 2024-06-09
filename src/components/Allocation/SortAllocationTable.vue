<script lang="ts" setup>
import { onMounted } from "vue";
import { watch } from "vue";
import { ref } from "vue";

const props = defineProps<{
  field?: string | ((item: any) => string) | undefined;
  order?: number;
  this_field: string;
}>();
const emit = defineEmits<{
  (
    e: "sort",
    val: { field: string | undefined; order: number | undefined }
  ): void;
}>();
const orderDir = ref<number | undefined>(props.order);
onMounted(() => {
  if (props.field !== props.this_field) {
    orderDir.value = undefined;
  }
});
watch(
  () => orderDir.value,
  () => {
    if (props.field !== props.this_field) {
      orderDir.value = undefined;
    }
  }
);
const sortHandler = () => {
  orderDir.value =
    orderDir.value == 1 ? -1 : orderDir.value == -1 ? undefined : 1;
  emit("sort", {
    field: orderDir.value ? props.this_field : undefined,
    order: orderDir.value,
  });
};
</script>

<template>
  <div class="sort_alloc_table" @click="sortHandler">
    <div v-if="field != this_field || !order">
      <img src="@/assets/images/SortDefault.svg" alt="none" />
    </div>
    <div v-if="this_field == field && order == -1">
      <img src="@/assets/images/SortAsc.svg" alt="up" />
    </div>
    <div v-if="this_field == field && order == 1">
      <img src="@/assets/images/SortDesc.svg" alt="down" />
    </div>
  </div>
</template>

<style lang="scss">
.sort_alloc_table {
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
