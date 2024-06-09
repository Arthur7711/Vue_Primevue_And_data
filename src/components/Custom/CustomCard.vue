<template>
  <Card class="card">
    <template #header>
      <div class="card__header">
        <slot name="header"/>
      </div>
    </template>
    <template #content>
      <div class="card__content">
        <slot name="content"/>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
// import

// types & interfaces

// props & pinia

// constants

// refs

// computed

// methods

// watch

// hooks
</script>

<style scoped lang="scss">
.card {
  &__header {
    display: flex;
    gap: 20px;
    @include Title-H4;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid $neutrals-border-default;
    &-grouping {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 25px;
      overflow: hidden;
      @include Body-M-14-Regular;
    }
    :nth-child(2) {
      //padding: 0;
      margin-top: 1.5px;
    }
  }
  &__content {
    min-height: 315px;
    display: flex;
    justify-content: center;
  }
}
</style>
