<script lang="ts" setup>
import {
  deleteDocument,
  postCreateDocument,
  postDocumentReports,
} from "@/api/reports";
import Loader from "@/components/Custom/components/Loader/Loader";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type IImportingQuery } from "../types";
import Button from "@/components/Custom/components/Button/Button.vue";
import DevMode from "@/stores/devMode";
const props = defineProps<{
  month: string;
  year: string | number;
  params: IImportingQuery;
}>();
const router = useRouter();
const route = useRoute();
const handleRegeneration = async () => {
  route.query.studio_id &&
    route.query.doc_id &&
    (await deleteDocument(+route.query.studio_id, +route.query.doc_id).then(
      async () => {
        route.query.studio_id &&
          (await postCreateDocument(
            +route.query.studio_id,
            route.query.month_int as string
          ).then(() => {
            router.push(`/reports`);
          }));
      }
    ));
};
</script>

<template>
  <div class="report_done">
    <div class="report_done-topcontainer">
      <GreenDone />
      <h1>Importing success</h1>
      <span>The report was imported successfully</span>
    </div>
    <Button
      v-if="DevMode.getActive.value"
      @click="() => handleRegeneration()"
      :color-scheme="'tertiary'"
    >
      <template #content> Regeneration </template>
    </Button>
    <Button @click="$router.push(`/reports`)" :color-scheme="'secondary'">
      <template #content> Back to reports </template>
    </Button>
  </div>
</template>

<style lang="scss">
.report_done {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  &-topcontainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & h1 {
      font-size: 22px;
      font-weight: 600;
    }
    & span {
      color: $neutrals-text-secondary;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
