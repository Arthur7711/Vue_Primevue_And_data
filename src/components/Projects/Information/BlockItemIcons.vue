<template>
  <component :is="componentType" :href="href" :target="target">
    <AccountMultipleOutlineIcon v-if="props.icon === 'account-multiple'"/>
    <CalendarBlankOutlineIcon v-else-if="props.icon === 'calendar'"/>
    <MessageTextOutlineIcon v-else-if="props.icon === 'message'"/>
    <EmailOutlineIcon v-else-if="props.icon === 'email'"/>
    <FlagOutlineIcon v-else-if="props.icon === 'flag'"/>
    <TagOutlineIcon v-else-if="props.icon === 'tag'"/>
    <PollIcon v-else-if="props.icon === 'poll'"/>
    <LinkIcon v-else-if="props.icon === 'link'" style="transform: rotate(135deg)"/>
    <div v-else class="icon-placeholder"/>
  </component>
</template>


<script lang="ts" setup>
// import
import {
  TagOutlineIcon,
  CalendarBlankOutlineIcon,
  MessageTextOutlineIcon,
  FlagOutlineIcon,
  PollIcon,
  LinkIcon,
  EmailOutlineIcon,
  AccountMultipleOutlineIcon,
} from 'mdi-vue3'
import {computed} from 'vue'

// props & pinia
const props = defineProps<{
  icon?: string
  value?: any
  type?: string
}>()

// constants

// refs

// computed
const href = computed(() => {
  if (props.type === 'jira-link') return props.value
  else if (props.type === 'mail') return `mailto:${props.value}`
  else return ''
})
const componentType = computed(() => {
  if (href.value) return 'a'
  return 'span'
})
const target = computed(() => {
  if (props.type === 'jira-link') return '_blank'
  return ''
})

// methods

// watch

// hooks
</script>

<style lang="scss" scoped>
.icon-placeholder {
  width: 16px;
  height: 16px;
  background-color: #aaa;
  border-radius: 50%;
}
</style>
