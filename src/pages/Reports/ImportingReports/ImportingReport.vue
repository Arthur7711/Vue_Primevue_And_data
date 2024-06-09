<script lang="ts" setup>
import { useRoute } from "vue-router";
import { type IImportingQuery } from "./types";
import StatusLayout from "./StatusLayout.vue";
import ReportImporting from "./ReportStatuses/ReportImporting.vue";
import ReportError from "./ReportStatuses/ReportError.vue";
import { ref, watch } from "vue";
import ErrorList from "./ReportStatuses/ErrorList.vue";
import ReportWarning from "./ReportStatuses/ReportWarning.vue";
import ReportDone from "./ReportStatuses/ReportDone.vue";
import { type IDocErrors } from "@/api/reports";
const route = useRoute();
const query = ref<IImportingQuery>(route.query as unknown as IImportingQuery);
const errors = ref<{ errors: IDocErrors[]; url: string } | null>(null);
const error_message = ref("");
watch(
  () => route,
  () => {
    query.value = route.query as unknown as IImportingQuery;
  },
  { deep: true }
);

</script>

<template>
  <div class="importing_reports_page">
    <div class="importing_reports_page-toplinks">
      <div>
        <span @click="$router.push('/reports')">Reports /</span>
        <span>Importing report</span>
      </div>
      <h1>Importing report</h1>
    </div>
    <section
      class="importing_reports_page-section"
      v-if="query.status === 'in_queue' || query.status === 'importing'"
    >
      <StatusLayout>
        <template #content>
          <ReportImporting
            @error_message="(val) => (error_message = val)"
            @error="(val) => (errors = val)"
            :month="query.month"
            :year="query.year"
            :params="query"
          />
        </template>
      </StatusLayout>
    </section>
    <section
      class="importing_reports_page-section"
      v-else-if="query.status === 'error'"
    >
      <StatusLayout>
        <template #content>
          <ReportError
            @error="(val) => (errors = val)"
            :month="query.month"
            :year="query.year"
            :params="query"
          />
        </template>
      </StatusLayout>
      <!-- {{ errors }} -->
      <ErrorList
        v-if="errors?.url && errors?.errors"
        :url="errors.url"
        :errors="errors.errors"
        :month="query.month"
        :year="query.year"
        :params="query"
      />
    </section>
    <section
      class="importing_reports_page-section"
      v-else-if="query.status === 'warning'"
    >
      <StatusLayout>
        <template #content
          ><ReportWarning
            :error-message="error_message"
            :month="query.month"
            :year="query.year"
            :params="query"
        /></template>
      </StatusLayout>
    </section>
    <section
      class="importing_reports_page-section"
      v-else-if="query.status === 'done'"
    >
      <StatusLayout>
        <template #content
          ><ReportDone
            :month="query.month"
            :year="query.year"
            :params="query"
          />
        </template>
      </StatusLayout>
    </section>
  </div>
</template>

<style lang="scss">
@import "./ImportingReports.scss";
</style>
