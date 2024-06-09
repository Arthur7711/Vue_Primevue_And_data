
<script lang="ts" setup>
import OverlayPanel from "primevue/overlaypanel";
import { onMounted, ref } from "vue";
const props = defineProps<{
    appendToId: string
}>()
const op = ref();
const toggle = (event:any) => {
    op.value.toggle(event);
}
</script>

<template>
    <div>
        <div class="overlay_tooltip_open_button" @click="toggle">
            
            <slot name="open_button"></slot>
        </div>
        <OverlayPanel ref="op">
          <slot name="content"></slot>
        </OverlayPanel>
    </div>
</template>

<style lang="scss">
.p-overlaypanel {
    border-radius: 8px;
}
.p-overlaypanel-content {
    padding: 12px;
}
</style>

