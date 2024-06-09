<template>
  <div>
    <a-button type="primary" @click="emit('showModal')">{{buttonName}}</a-button>
    <a-modal
        :visible="props.open"
        :title="props.title"
        @ok="emit('handleOk')"
        @cancel="emit('cancel')"

    >
      <slot name="slot_form"></slot>

      <template #footer>
        <slot name="footer">
        </slot>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>

const props = defineProps<{
  title : string
  buttonName: string
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'showModal'): void
  (e: 'cancel'): void
  (e: 'handleOk'): void
}>()

</script>

<style scoped lang="scss">
:deep(.ant-modal-footer) {
  display: none;
}
</style>