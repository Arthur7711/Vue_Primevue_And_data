<template>
  {{ computedDate }}
</template>
<script setup lang="ts">
// imports
import {computed} from 'vue'
import type {Dayjs} from 'dayjs'
import dayjs from 'dayjs'

// props
const props = defineProps<{
  date: Dayjs | string;
  format?: string;
}>()

// constants

// refs

// computed
const computedDate = computed(() => {
  if (!props.date) return ''
  return dayjs(props.date).format(props.format ?? 'DD MMMM YYYY')
  // return new Date(props.date).toLocaleDateString('ru-RU', options)
})

// methods

// hooks
</script>
<style lang="scss" scoped></style>
