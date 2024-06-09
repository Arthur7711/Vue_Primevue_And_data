<script lang="ts" setup></script>

<template>
    <div class="status_layout">
        <slot name="content"></slot>
    </div>
</template>

<style lang="scss">
.status_layout {
    width: 610px;
    background-color: #fff;
    border: 1px $neutrals-border-default solid;
    border-radius: 12px;
    padding: 32px 24px 40px 24px;
}
</style>