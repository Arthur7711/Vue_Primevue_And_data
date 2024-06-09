<script setup lang="ts">
import Button from "../Custom/components/Button/Button.vue";
import IconClose24px from "../icons/IconClose24px.vue";

const props = defineProps<{
  modelValue?: boolean;
  content?: string;
  title?: string;
  approvedButtonName?: string;
  buttonColorSchema?: "primary" | "secondary" | "tertiary" | "danger";
  disableSubmitButton?: boolean;
  closeOnSubmit?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submitted"): void;
}>();
const isOpen = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <div @click="isOpen" v-if="props.modelValue" class="dialog">
    <div @click.stop class="dialog-window">
      <div class="dialog-window__header">
        <h3>{{ props.title }}</h3>
        <IconClose24px @click.stop="isOpen" />
      </div>
      <slot name="form"></slot> 
      <p class="dialog-window__content" v-html="props.content"></p>
      <div class="dialog-window__buttons">
        <Button
          @click.stop="isOpen"
          style="margin-right: 10px"
          :colorScheme="'secondary'"
        >
          <template #content> Cancel </template>
        </Button>
        <Button
          :colorScheme="buttonColorSchema ? buttonColorSchema : 'danger'"
          :disabled="disableSubmitButton"
          @click="
            () => {
              closeOnSubmit ? isOpen() : null;
              emit('submitted');
            }
          "
        >
          <template #content>
            <slot name="button_right_icon"></slot>
            {{ props.approvedButtonName }}
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog {
  z-index: 100;
  background-color: rgba(22, 32, 49, 0.7);
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-window {
  min-height: 148px;
  width: 420px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px 16px 16px 16px;

  &__header {
    display: flex;
    justify-content: space-between;
    padding: 0 !important;
    align-items: center;
    h3 {
      margin: 0 !important;
    }
  }
  &__buttons {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
