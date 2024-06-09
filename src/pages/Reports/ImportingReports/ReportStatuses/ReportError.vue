<script lang="ts" setup>
import {
  type IDocErrors,
  deleteDocument,
  getDocumentsStatus,
  postCreateDocument,
  postDocumentReports,
} from "@/api/reports";
import Loader from "@/components/Custom/components/Loader/Loader";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { type IImportingQuery } from "../types";
import Button from "@/components/Custom/components/Button/Button.vue";
import { ref } from "vue";
import DevMode from "@/stores/devMode";
const props = defineProps<{
  month: string;
  year: string | number;
  params: IImportingQuery;
}>();
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const reportDate = ref("");
const emit = defineEmits<{
  (e: "error", value: { errors: IDocErrors[]; url: string }): void;
}>();
const notifOption = ref<{
  show: boolean;
  value: string;
  type: "normal" | "warning";
}>({
  show: false,
  value: ``,
  type: "normal",
});
onMounted(async () => {
  if (route.query?.process_id) {
    await getDocumentsStatus(+route.query.process_id).then((res) => {
      emit("error", {
        errors: res.data.data.errors,
        url: res.data.data.import_file.google_url_with_cell,
      });
    });
  }
  route.query;
});

const handleRegeneration = async () => {
  isLoading.value = true;
  route.query?.studio_id &&
    route.query?.doc_id &&
    (await deleteDocument(+route.query.studio_id, +route.query.doc_id)
      .then(async () => {
        route.query?.studio_id &&
          (await postCreateDocument(
            +route!.query!.studio_id,
            `${route!.query!.year}-${route!.query!.month_int}-05`
          ).then(() => {
            isLoading.value = false;
            router.push(`/reports`);
          }));
      })
      .catch((err) => {
        isLoading.value = false;
        notifOption.value = {
          value: JSON.parse(err.cause.message.data.error_message).error.message,
          show: true,
          type: "warning",
        };
      }));
};
</script>

<template>
  <div class="report_error">
    <div class="report_error-topcontainer">
      <RedError />
      <h1>Importing error</h1>
      <span>We found errors in the report, their list will be below.</span>
    </div>
    <Button
      v-if="DevMode.getActive.value"
      :is-update="isLoading"
      @click="() => handleRegeneration()"
      :color-scheme="'tertiary'"
    >
      <template #content>
        <RegenIcon :color="'#1860DC'" /> Regeneration
      </template>
    </Button>
    <Button
      :disable="isLoading"
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
  </div>
  <Notification :visible="notifOption.show" :type="notifOption.type">{{
    notifOption.value
  }}</Notification>
</template>

<style lang="scss">
.report_error {
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
  }
}
</style>
