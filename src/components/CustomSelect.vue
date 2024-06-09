<template>
  <div class="custom-select">
    <div class="custom-select__title">{{ props.selectTitle }}</div>
    <div style="border-radius: 8px; border: 1px solid #e2e5ea">
      <a-select
          v-model:value="modelValue"
          class="custom-select__input"
          mode="multiple"
          :dropdown-class-name="'hideSelectedItems'"
          :max-tag-count="props.maxTagCount? props.maxTagCount: 'responsive'"
          style="width: 100%"
          :dropdownStyle="dropdownStyle"
          :placeholder="props.placeholder"
          :get-popup-container="getSelectContainer"
          :bordered="false"
          showArrow
          allow-clear
          :filterOption="
        (inputValue, option) => {
          return option?.key.toLowerCase().includes(inputValue);
        }
      "
          optionFilterProp="title"
      >
        <a-select-option
          v-for="item in computedOptions"
          :value="item.title"
          :key="item.title"
        >
          <span v-if="item.title">{{ item.title }}</span>
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script setup lang="ts">
// import
import {
  computed,
 type ComputedRef,
  ref,
} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
type ComputedType = { [p: number]: string };
// types
type TOptions = {
  title: string,
  id: string | number
}
type TModelValue = (string | number)[] | undefined;
// props
const props = defineProps<{
  options: TOptions[] | null
  selectTitle: string
  modelValue: TModelValue
  maxTagCount?: number
  fixed?: boolean
  placeholder?: string
}>();
const emit = defineEmits<{(e: "update:modelValue", value: TModelValue): void}>();

const selectedItems = ref<string[] | undefined >([]);
const options = ref<TOptions[] | null>();

const dropdownStyle: ComputedRef<ComputedType> = computed(() => {
  if (props.fixed) return { position: "fixed" };
  return {};
});

const modelValue = computed({
  get() {
      selectedItems.value = props.options
          ?.filter((el) => (props.modelValue || []).includes(el.id))
          .map((it) => it.title);
      return selectedItems.value;

  },
  set(value) {
    emit(
      "update:modelValue",
        (props.options || []).filter((el) => value?.includes(el.title)).map((it) => it.id)
    );
  },
});

const getSelectContainer = (e: HTMLElement) => {
  return e.parentNode as HTMLElement
};

const computedOptions = computed(() =>
  props.options?.filter((el) => !selectedItems.value?.includes(el.title))
);

</script>

<style lang="scss">
.custom-select {
  &__title {
    @include Body-M;
    color: $neutrals-text-secondary;
  }

  &__input {
    width: 100%;
  }
  .ant-select-multiple .ant-select-selector {
    max-height: 5.7rem !important;
    overflow-y: scroll !important;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.ant-select-dropdown,
.hideSelectedItems,
.ant-select-dropdown-placement-bottomLeft {
  position: absolute !important;
}
</style>
