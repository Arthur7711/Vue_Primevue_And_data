<template>

    <Menu />
    <div class="app">
      <RouterView />
      </div>
    <a-alert
      :message="useErrorStore.errorText.value"
      type="error"
      class="message"
      v-if="useErrorStore.errorText.value && useErrorStore.showError.value"
    />
    <a-alert
      :message="useErrorStore.successText.value"
      type="success"
      class="message"
      v-if="useErrorStore.successText.value && useErrorStore.showSuccess.value"
    />
</template>

<script setup lang="ts">
// imports
import { onMounted } from "vue";
import userStore from "@/stores/user";
import useErrorStore from "./stores/messages";
// props & pinia

onMounted(async () => {
  await userStore.auth();
}); 
</script>

<style scoped>
.app {
  padding:24px;
  background-color: #F9FAFB;
}
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 200px;
  z-index: 99999;
}
</style>
