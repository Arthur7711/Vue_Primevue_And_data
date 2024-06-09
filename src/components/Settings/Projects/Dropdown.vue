<script lang="ts" setup>
import Dropdown from "primevue/dropdown";
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  dropTypes?: any[];
  optionLabel?: string;
  defaultIndex?: number;
  dropPInfo?: string;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  showClear?: boolean;
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
  <div class="dropdown_border_container">
    <Dropdown
      v-if="!isLoading"
      class="drop_all"
      :style="{ width: props.dropPInfo, overflowX: 'hidden' }"
      :panelStyle="
        props.dropPInfo
          ? {
              width: props.dropPInfo,
              overflowX: 'hidden',
              whitespase: 'nowrap',
              textOverflow: 'ellipsis',
            }
          : {}
      "
      :options="dropTypes"
      :disabled="!!disabled"
      :placeholder="placeholder"
      v-model="selectedType"
      :panelClass="'dropdown_border_panel'"
      :optionLabel="optionLabel"
      :showClear="!!showClear"
    >
      <template #option="{ option }">
        <div class="dropdown_border_container_option">
          <div>{{ optionLabel ? option[optionLabel] : "" }}</div>
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
.dropdown_border_container {
  .p-placeholder {
    color: $neutrals-text-secondary;
  }
  .drop_all {
    //border: none;
    width: 100%;
    height: 2.25rem;
    border-radius: 8px;
    display: flex;
    font-size: 28px !important;
    background: none;
    .p-dropdown-label,
    .p-inputtext {
      font-size: 28px;
      &::placeholder {
        // color: $neutrals-text-secondary;
        color: blue !important;
      }
      font-size: 14px;
      display: flex;
      margin-left: 10px;
      align-items: center;
    }
  }
  .drop_p_Info {
    width: 100%;
  }
  .p-dropdown-item .p-highlight {
    background: none !important;
  }
  .p-dropdown.p-disabled {
    box-shadow: none;
    outline: none;
    background: #e2e5ea !important;
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
.dropdown_border_container_option {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dropdown_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item.p-highlight:not(:hover) {
  background: none !important;
  color: #162031;
}
.dropdown_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item.p-highlight:hover {
  background: #f4f5f8 !important;
  color: #162031;
}

.dropdown_border_panel.p-dropdown-panel
  .p-dropdown-items
  .p-dropdown-item:hover {
  background: #f4f5f8 !important;
}
</style>
