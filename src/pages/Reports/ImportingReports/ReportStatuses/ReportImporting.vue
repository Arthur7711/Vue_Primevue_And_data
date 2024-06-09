<script lang="ts" setup>
import {
  type IDocErrors,
  getDocumentsStatus,
  postDocumentReports,
} from "@/api/reports";
import Loader from "@/components/Custom/components/Loader/Loader";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type IImportingQuery } from "../types";
import { onBeforeUnmount } from "vue";
const props = defineProps<{
  month: string;
  year: string | number;
  params: IImportingQuery;
}>();
const router = useRouter();
const route = useRoute();
const process_id = ref<number | null>(null);
const emit = defineEmits<{
  (e: "error", value: { errors: IDocErrors[]; url: string }): void;
  (e: "error_message", value: string): void;
}>();
let getStatuses = setInterval(async () => {
  if (process_id.value) {
    await getDocumentsStatus(process_id.value)
      .then((res) => {
        if (
          res.data.data.errors &&
          res.data.data.errors.length &&
          !res.data.data.errors.filter(
            (el) => el.error_type.toLowerCase() === "server error"
          ).length
        ) {
          emit("error", {
            errors: res.data.data.errors,
            url: res.data.data.import_file.google_url_with_cell,
          });
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&month_int=${
              res.data.data.import_file.month
            }&status=error`
          );
        } else if (res.data.data.status === "done") {
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&month_int=${
              res.data.data.import_file.month
            }&status=done`
          );
        } else if (
          res.data.data.errors &&
          res.data.data.errors.filter(
            (el) => el.error_type.toLowerCase() === "server error"
          ).length
        ) {
          emit("error_message", res.data.data.errors[0].error_type);
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&status=warning`
          );
        }
      })
      .catch((err) => {
        if (err.cause.status > 400) {
          emit("error_message", err.cause.status);
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&status=warning`
          );
        }
      });
  }
}, 3000);
onMounted(async () => {
  if (!route.query?.process_id) {
    await postDocumentReports(props.params.studio_id, props.params.doc_id)
      .then((res) => {
        process_id.value = res.data.data.id;
        if (res.data.data.status === "error") {
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&status=error`
          );
        } else if (res.data.data.status === "done") {
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&status=done`
          );
        }
      })
      .catch((err) => {
        if (err.cause.status > 499) {
          emit(
            "error_message",
            `Error code 500. Message from server: ${err.cause.message.data.error_message}`
          );
          router.push(
            `/reports/${route.path.split("/")[2]}?month=${
              props.params.month
            }&year=${props.params.year}&doc_id=${
              props.params.doc_id
            }&studio_id=${props.params.studio_id}&status=warning`
          );
        }
      });
  } else {
    process_id.value = +route.query.process_id;
  }
  getStatuses;
});

onBeforeUnmount(() => {
  clearInterval(getStatuses);
});
</script>

<template>
  <div class="report_importing">
    <Loader :width="56" :height="56" :line_width="2" />
    <h1>Importing: {{ month }} {{ year }}</h1>
    <span
      >It should only take a few seconds, please do not close the page.</span
    >
  </div>
</template>

<style lang="scss">
.report_importing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
