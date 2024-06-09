<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
const props = defineProps<{
  visible: any;
  type?: "warning" | "normal";
}>();
const isVisible = ref(props.visible);
const emit = defineEmits<{
  (e: "show", val: boolean):void;
}>();
watch(
  () => props.visible,
  () => {
    if (props.visible) {
      isVisible.value = props.visible;
      setTimeout(() => {
        isVisible.value = false;
        emit("show", false);
      }, 5000);
    }
  }
);
</script>

<template>
  <div
    :style="isVisible ? { display: 'flex' } : { display: 'none' }"
    class="custom_notification_container"
  >
    <div
      :style="
        isVisible
          ? {
              display: 'flex',
              borderColor: type === 'normal' || !type ? '#CFD5DD' : 'red',
            }
          : { display: 'none' }
      "
      class="custom_notification"
    >
      <slot></slot>
      <button
        @click="
          () => {
            isVisible = false;
            emit('show', false);
          }
        "
      >
        x
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.custom_notification_container {
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background: none;
}
.custom_notification {
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px #cfd5dd solid;
  gap: 24px;
  box-shadow: 0px 4px 20px 0px #1f272f1a;

  button {
    border: none;
    background: none;
  }

  animation: Notif-enter 5s;
}

@keyframes Notif-enter {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }

  25% {
    transform: translateY(0);
    opacity: 1;
  }

  50% {
    transform: translateY(0);
    opacity: 1;
  }

  75% {
    transform: translateY(0);
    opacity: 1;
  }
  85% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100px);
    opacity: 0;
  }
}
</style>
