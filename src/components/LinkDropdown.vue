<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  title: string;
  options: { id: number; name: string }[];
  where?: string;
  paramName?: string;
  diactive?: boolean;
}>();

const visible = ref(false);
</script>
<template>
  <a-dropdown v-model="visible">
    <button
      class="title"
      @click=""
      :style="{ color: diactive ? 'black' : '#1860d1' }"
    >
      +{{ title }}
    </button>
    <template #overlay>
      <a-menu style="max-height: 256px; overflow: hidden; overflow-y: auto">
        <a-menu-item v-for="item of options">
          <span v-if="diactive">{{ item?.name }}</span>
          <router-link
            :to="{
              name: where || 'ProjectInformation',
              params: { [paramName || 'project']: `${item?.id}` },
            }"
            class="studio-name"
            v-else
          >
            {{ item?.name }}
          </router-link>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<style scoped lang="scss">
.title {
  border: 1px solid $neutrals-border-default;
  font-size: 12px;
  display: inline;
  border-radius: 5px;
  cursor: pointer;
  background: transparent;
}
</style>
