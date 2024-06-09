<script lang="ts" setup>
import Dropdown from "primevue/dropdown";
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  dropTypes: any[];
  optionLabel: string;
  defaultIndex?: number;
}>();
const selectedType = ref();

onMounted(() => {
  if (props.dropTypes && !isNaN(props.defaultIndex as number)) {
    selectedType.value = props.dropTypes[props.defaultIndex as number];
  }
});

const emit = defineEmits<{
  (e: "change-event", value: { [key: string]: any } | any): void;
}>();
watch(
  () => selectedType.value,
  () => {
    emit("change-event", selectedType.value);
  }
);
</script>

<template>
  <div class="dropdown_none_border_container">
    <Dropdown
      class="drop_all"
      :options="dropTypes"
      v-model="selectedType"
      :panelClass="'dropdown_none_border_panel'"
      :optionLabel="optionLabel"
    >
      <template #option="{ option }">
        <div class="dropdown_none_border_container_option">
          <div>{{ option[optionLabel] }}</div>
          <span v-if="selectedType?.id === option.id"
            ><DropdownSelectedIcon
          /></span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<style lang="scss">
.dropdown_none_border_container {
  .drop_all {
    border: none;
    display: flex;
    font-size: 28px !important;
    background: none;
    .p-dropdown-label,
    .p-inputtext {
      font-size: 28px;
      color: $primary-text-default;
    }
  }
  .p-dropdown-item .p-highlight {
    background: none !important;
  }
  .p-dropdown:not(.p-disabled).p-focus {
    box-shadow: none;
    outline: none;
    border: none;
    background: none !important;
  }
  .p-dropdown-label {
    padding: 0 !important;
  }
}
.dropdown_none_border_container_option {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dropdown_none_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item.p-highlight:not(:hover) {
  background: none !important;
  color: #162031;
}
.dropdown_none_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item.p-highlight:hover {
  background: #f4f5f8 !important;
  color: #162031;
}
.dropdown_none_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item:hover {
  background: #f4f5f8 !important;
}
</style>
