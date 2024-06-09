<script lang="ts" setup>
import { type IDocErrors } from "@/api/reports";
import { type IImportingQuery } from "../types";
const props = defineProps<{
  month: string;
  year: string | number;
  params: IImportingQuery;
  url: string;
  errors: IDocErrors[];
}>();
</script>

<template>
  <div class="error_list">

    <div class="error_list-topcontainer">
      <h1>Error list</h1>
      <span>Correct the errors by clicking on the links to the table</span>
      <span> cells and try to upload the report again.</span>
    </div>
    <section class="error_list-table">
      <div class="error_list-table--header">
        <span>Error type</span>
        <span>Error</span>
        <span>Place in spreadsheet</span>
      </div>
      <div class="error_list-table--wrapper">
        <div v-for="err in errors" class="error_list-table--wrapper--body">
          <span>{{ err.error_type }}</span
          ><span>{{ err.value }}</span
          > 
          <a
            :href="url.replace('__CELL_RANGE__', err.cell ? err.cell.toLocaleString() : '')"
            target="_blank"
            >{{ err.cell }}</a
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.error_list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  width: 610px;
  background-color: #fff;
  border: 1px $neutrals-border-default solid;
  border-radius: 12px;
  padding: 10px 0px 20px 0px;

  &-topcontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    padding-left: 16px;
    align-items: start;
  }

  &-table {
    width: 100%;

    &--wrapper--body,
    &--header {
      width: 100%;
      height: 36px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      padding: 0px 0px 0px 15px;
    }

    &--header {
      span {
        color: $neutrals-background-strong;
      }

      border-bottom: 2px $neutrals-background-semi solid;
    }

    &--wrapper {
      max-height: 300px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        min-width: 7px;
        max-width: 7px;
        background: white;
        box-shadow: none;
      }

      &::-webkit-scrollbar-track {
        background: rgb(255, 255, 255);
        box-shadow: none;
      }

      &::-webkit-scrollbar-thumb {
        display: block;
        overflow: visible;
        opacity: 1;
        border-radius: 5px;
        background: #b4b4b4;
      }

      &--body {
        padding-top: 5px;
        height: max-content;
        & > :nth-child(2) {
          color: $danger-background-default;
        }

        & > :nth-child(3) {
          color: $primary-text-default;
        }

        box-sizing: border-box;
        border-bottom: 1px $neutrals-background-semi solid;
      }
    }
  }
}
</style>
