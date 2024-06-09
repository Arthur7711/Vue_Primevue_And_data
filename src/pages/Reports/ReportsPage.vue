<script lang="ts" setup>
import {
  getAvaliableReportsDates,
  getAvaliableReportsStudios,
  getDocumentsStatusIndividual,
  type IAvaliableReportsStudios,
  type IDocumentStatusIndividual,
  postCreateDocument,
} from "@/api/reports";
import Button from "@/components/Custom/components/Button/Button.vue";
import Notification from "@/components/Custom/components/Notification.vue";
import Checkbox from "primevue/checkbox";
import { onMounted, ref, watch } from "vue";
import DevMode from "@/stores/devMode";
import router from "@/router";
import { useRoute } from "vue-router";

const devYears = [
  `${new Date().getFullYear()}`,
  `${new Date().getFullYear() - 1}`,
];
const studios = ref<IAvaliableReportsStudios[] | null>(null);
const isLoading = ref(false);
const selectedStudio = ref<number | null>(null);
const dates = ref<string[] | null>(null);
const monthNow = ref<{ year: string | number; value: string[] }[] | null>();
const individualDocStatus = ref<IDocumentStatusIndividual[] | null>(null);
const devMode = ref(false);
const route = useRoute();
const notIfOption = ref<{
  show: boolean;
  value: string;
  type: "normal" | "warning";
}>({
  show: false,
  value: ``,
  type: "normal",
});
const defIndex = (arr: IAvaliableReportsStudios[]) => {
  if (route?.query?.studio) {
    return arr.findIndex(
      (el) =>
        el.id ===
        (route!.query!.studio ? (+route!.query!.studio as number) : arr[0].id)
    );
  } else {
    return 0;
  }
};
const formattedDocs = ref<
  { year: string | number; value: IDocumentStatusIndividual[] }[] | null
>(null);
onMounted(async () => {
  devMode.value = DevMode.getActive.value;
  await getAvaliableReportsStudios().then((res) => {
    isLoading.value = false;
    studios.value = res;
    if (res.length === 1) {
      selectedStudio.value = res[0].id;
    }
    isLoading.value = true;
  });
});
watch(
  () => devMode.value,
  async () => {
    if (isLoading.value && selectedStudio.value) {
      localStorage.setItem("devMode", JSON.stringify(devMode.value));
      location.reload();
      await getAvaliableReportsDates(selectedStudio.value).then((res) => {
        dates.value = res;
        !devMode.value
          ? (monthNow.value = availableDatesFormatter(res))
          : (monthNow.value = availableDatesFormatter(devYears));
      });
      await getDocumentsStatusIndividual(selectedStudio.value).then((res) => {
        individualDocStatus.value = res;
        formattedDocs.value = reportsFormatter();
        isLoading.value = true;
      });
    }
  }
);
const devDatesFiller = (el: string) => {
  const allDates: string[] = [];
  for (let i = 1; i < 13; i++) {
    if (i < 10) {
      allDates.push(`${el}-0${i}-05`);
    } else {
      allDates.push(`${el}-${i}-05`);
    }
  }
  return allDates;
};
const reportsFormatter = () => {
  if (individualDocStatus.value && individualDocStatus.value?.length) {
    const years: (string | number)[] = [];
    individualDocStatus.value?.forEach(async (el) => {
      if (!years.includes(el.year)) {
        years.push(el.year as string | number);
      }
    });
    if (devMode.value && !years.includes(new Date().getFullYear() - 1)) {
      years.push(new Date().getFullYear() - 1);
    }
    const res = years.map((el) => {
      return {
        year: el as string | number,
        value: individualDocStatus.value
          ? (individualDocStatus.value?.filter(
              (elem) => elem.year === el
            ) as IDocumentStatusIndividual[])
          : [],
      };
    });
    if (
      new Date().getMonth() === 11 &&
      !years.includes(String(new Date().getFullYear() + 1))
    ) {
      res.unshift({ year: `${new Date().getFullYear() + 1}`, value: [] });
    }
    if (
      !years.includes(String(new Date().getFullYear())) &&
      !years.includes(new Date().getFullYear())
    ) {
      res.unshift({ year: `${new Date().getFullYear()}`, value: [] });
    }
    return res;
  } else return null;
};

const availableDatesFormatter = (dates: string[]) => {
  if (dates && dates.length) {
    if (!devMode.value) {
      const years: string[] = [];
      dates.sort().forEach(async (el) => {
        if (!years.includes(el)) {
          years.push(el.split("-")[0]);
        }
      });
      const res = years.map((el) => {
        return {
          year: el,
          value: dates.filter((elem) => {
            if (elem.split("-")[0] === el) {
              return elem;
            }
          }),
        };
      });
      if (
        new Date().getMonth() === 11 &&
        !years.includes(String(new Date().getFullYear() + 1))
      ) {
        res.unshift({ year: `${new Date().getFullYear() + 1}`, value: [] });
      } else if (
        new Date().getMonth() < 2 &&
        !years.includes(String(new Date().getFullYear()))
      ) {
        res.unshift({ year: `${new Date().getFullYear()}`, value: [] });
      }

      return res;
    } else {
      return dates.map((el) => {
        return {
          year: el,
          value: devDatesFiller(el),
        };
      });
    }
  } else return null;
};

watch(
  () => selectedStudio.value,
  async () => {
    if (selectedStudio.value) {
      isLoading.value = false;
      await getAvaliableReportsDates(selectedStudio.value).then((res) => {
        dates.value = res;

        !devMode.value
          ? (monthNow.value = availableDatesFormatter(res))
          : (monthNow.value = availableDatesFormatter(devYears));
      });
      await getDocumentsStatusIndividual(selectedStudio.value).then((res) => {
        individualDocStatus.value = res;
        formattedDocs.value = reportsFormatter();
        isLoading.value = true;
      });
    }
  }
);
const createNotification = (value: string, type: "normal" | "warning") => {
  notIfOption.value = {
    value: value,
    show: true,
    type: type,
  };
};
const handleUpdate = async () => {
  isLoading.value = false;
  selectedStudio.value &&
    (await getAvaliableReportsDates(selectedStudio.value).then((res) => {
      dates.value = res;

      !devMode.value
        ? // ? res?.length
          (monthNow.value = availableDatesFormatter(res))
        : // : null
          (monthNow.value = availableDatesFormatter(devYears));
    }));
  selectedStudio.value &&
    (await getDocumentsStatusIndividual(selectedStudio.value).then((res) => {
      individualDocStatus.value = res;
      formattedDocs.value = reportsFormatter();
    }));
  isLoading.value = true;
};
const handleCreateDoc = async (date: string) => {
  isLoading.value = false;
  selectedStudio.value &&
    (await postCreateDocument(selectedStudio.value, date)
      .then(async () => {
        notIfOption.value = {
          value: `${new Date(date).toLocaleString("en", {
            month: "long",
          })} report generated`,
          show: true,
          type: "normal",
        };
        selectedStudio.value &&
          (await getAvaliableReportsDates(selectedStudio.value).then((res) => {
            dates.value = res;

            !devMode.value
              ? (monthNow.value = availableDatesFormatter(res))
              : (monthNow.value = availableDatesFormatter(devYears));
          }));
        selectedStudio.value &&
          (await getDocumentsStatusIndividual(selectedStudio.value).then(
            (res) => {
              individualDocStatus.value = res;
              formattedDocs.value = reportsFormatter();
            }
          ));
        isLoading.value = true;
      })
      .catch(async () => {
        notIfOption.value = {
          value: `Failed to create`,
          show: true,
          type: "warning",
        };
        isLoading.value = true;
      }));
};
</script>

<template>
  <div class="reports_page">
    <div class="reports_page-reports--container">
      <div class="reports_page-reports--container--select">
        <h1>Reports:</h1>
        <DropdownNonBorder
          v-if="studios && studios.length > 1"
          :drop-types="studios"
          :default-index="defIndex(studios)"
          :option-label="'name'"
          @change-event="(val: IAvaliableReportsStudios) => {
            router.push('/reports?studio='+val.id)
            selectedStudio = val.id
            }"
        />
        <span
          class="reports_page-reports--container--span--studios"
          v-else-if="studios && studios.length === 1"
          >{{ studios[0].name }}</span
        >
        <span
          class="reports_page-reports--container--span--studios"
          v-else-if="studios && isLoading"
          >no available studios</span
        >
        <span v-else class="reports_page-reports--container--span--studios">
          <Loader />
        </span>
      </div>
      <div class="reports_page-reports--container--checkbox_devMode">
        <Checkbox
          :model-value="devMode"
          @click="devMode = !devMode"
          :binary="true"
        />
        Dev Mode
      </div>
    </div>
    <div
      v-if="individualDocStatus && !individualDocStatus.length"
      class="reports_page-generate--container"
    >
      <div class="reports_page-generate--container--content">
        <div class="reports_page-generate--container--content--spanGroup">
          <span>Generate first report</span>
          <span
            >Generate an up-to-date report by clicking on the button below</span
          >
        </div>
        <Button
          v-if="!DevMode.getActive.value"
          @click="() => dates && handleCreateDoc(dates[0])"
          :disable="!dates || !dates.length"
          :color-scheme="'primary'"
          :is-update="!isLoading"
          ><template #content>
            {{
              dates && dates.length
                ? "Generate " +
                  new Date(dates[0]).toLocaleString("en", {
                    month: "long",
                  })
                : "no available dates"
            }}</template
          >
        </Button>
        <Dropdown
          v-else
          :placeholder="'Generate'"
          @change-event="(val: any) => handleCreateDoc(val.id)"
          :option-label="'title'"
          :is-loading="!isLoading"
          :dropTypes="
            monthNow
              ? monthNow
                  .filter((el) => el.year == new Date().getFullYear())[0]
                  .value.map((el) => {
                    return {
                      id: el,
                      title: new Date(el).toLocaleString('en', {
                        month: 'long',
                      }),
                    };
                  })
              : []
          "
        />
      </div>
    </div>
    <div v-else-if="individualDocStatus && individualDocStatus?.length">
      <MonthSelector
        v-for="(docs, i) of formattedDocs"
        :key="docs.year"
        :index="i"
        :studio-id="selectedStudio"
        :is-update="!isLoading"
        @change="(value) => handleCreateDoc(`${value}`)"
        @update="() => handleUpdate()"
        :avaliable-dates="
          monthNow?.length
            ? monthNow.filter((el) => el.year == docs.year)[0]
            : { year: docs.year, value: [] }
        "
        @regen-error="(val) => createNotification(val, 'warning')"
        :year="docs.year"
        :data="docs.value"
      />
    </div>
  </div>
  <Notification
    @show="(val) => (notIfOption.show = val)"
    :visible="notIfOption.show"
    :type="notIfOption.type"
    >{{ notIfOption.value }}</Notification
  >
</template>

<style lang="scss">
@import "./ReportsPage.scss";
</style>
