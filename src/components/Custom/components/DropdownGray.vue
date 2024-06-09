<script lang="ts" setup>
import Dropdown from "primevue/dropdown";
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  dropTypes?: any[];
  optionLabel?: string;
  defaultIndex?: number;
  isUpdated: boolean;
  placeholder?: string;
}>();
const selectedType = ref();

onMounted(() => {
  if (props.dropTypes && !isNaN(props.defaultIndex as number)) {
    selectedType.value = props.dropTypes[props.defaultIndex as number];
  }
});

const emit = defineEmits<{
  (e: "change-event", value: { [key: string]: any }): void;
}>();
watch(
  () => selectedType.value,
  () => {
    emit("change-event", selectedType.value);
  }
);
</script>

<template>
  <div class="dropdown_gray_border_container">
    <Dropdown
      v-if="isUpdated"
      class="drop_all"
      :options="dropTypes"
      :placeholder="placeholder"
      v-model="selectedType"
      :panelClass="'dropdown_gray_border_panel'"
      :optionLabel="optionLabel"
    >
      <template #option="{ option }">
        <div class="dropdown_gray_border_container_option">
          <div>{{ option[optionLabel as string] }}</div>
          <span v-if="selectedType?.id === option.id"
            ><DropdownSelectedIcon
          /></span>
        </div>
      </template>
    </Dropdown>
    <Loader v-else />
  </div>
</template>

<style lang="scss">
.dropdown_gray_border_container {
  .drop_all {
    //border: none;
    height: 36px;
    border-radius: 8px;
    display: flex;
    background: none;
    .p-dropdown-label,
    .p-inputtext {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      padding: 8px 12px 8px 16px !important;
      font-weight: 600;
    }
  }
  .p-dropdown-item .p-highlight {
    background: none !important;
  }
  .p-dropdown:not(.p-disabled).p-focus {
    box-shadow: none;
    outline: none;
    background: none !important;
  }
  .p-dropdown-label {
    padding: 0 !important;
  }
}
.dropdown_gray_border_container_option {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dropdown_gray_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item.p-highlight:not(:hover) {
  background: none !important;
  color: #162031;
}
.dropdown_gray_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item.p-highlight:hover {
  background: #f4f5f8 !important;
  color: #162031;
}
.dropdown_gray_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item:hover {
  background: #f4f5f8 !important;
}
</style>
