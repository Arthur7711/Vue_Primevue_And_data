<script lang="ts" setup>
import { postDocumentReports } from "@/api/reports";
import Loader from "@/components/Custom/components/Loader/Loader";
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type IImportingQuery } from "../types";
import Button from "@/components/Custom/components/Button/Button";
const props = defineProps<{
  month: string;
  year: string | number;
  params: IImportingQuery;
  errorMessage: string;
}>();
const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="report_warn">
    <GrayError />
    <h1>Something went wrong</h1>
    <span
      >An error occurred while importing, please try again or create task
      in</span
    >
    <a target="_blank" href="https://start.saber3d.net/#/helpdesk">Helpdesk</a>
    <Button
      @click="
        $router.push(
          `/reports/${route.path.split('/')[2]}?month=${
            props.params.month
          }&year=${props.params.year}&doc_id=${props.params.doc_id}&studio_id=${
            props.params.studio_id
          }&status=in_queue`
        )
      "
      :color-scheme="'secondary'"
    >
      <template #content> <TryAgainIcon /> Try again </template>
    </Button>
    {{ errorMessage }}
  </div>
</template>

<style lang="scss">
.report_warn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
