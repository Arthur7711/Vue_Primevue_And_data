<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Button from "@/components/Custom/components/Button/Button.vue";
import { type IDocumentStatusIndividual, deleteDocument } from "@/api/reports";
import DropdownGray from "@/components/Custom/components/DropdownGray.vue";
import OverlayTooltip from "@/pages/Reports/ImportingReports/OverlayTooltip.vue";
import DevMode from "@/stores/devMode";
const props = defineProps<{
  year: string | number;
  data: IDocumentStatusIndividual[];
  avaliableDates: { year: string | number; value: string[] };
  index: number;
  isUpdate: boolean;
  studioId: number | null;
}>();
const isOpen = ref(false);
const selectedMonth = ref<{ id: number; type: string } | null>(null);
const showIcon = (position: "in" | "out", id: number, year: number): void => {
  switch (position) {
    case "in":
      document.getElementById(
        "monthselect_outicon_" + id + "_" + year
      )!.style.opacity = "1";
      document.getElementById(
        "monthselect_a_" + id + "_" + year
      )!.style.textDecoration = "underline";
      break;
    case "out":
      document.getElementById(
        "monthselect_outicon_" + id + "_" + year
      )!.style.opacity = "0";
      document.getElementById(
        "monthselect_a_" + id + "_" + year
      )!.style.textDecoration = "none";
      break;
    default:
      break;
  }
};
const months = ref<
  | {
      id: number;
      name: string;
      imported: boolean;
      status: string;
      url: string;
    }[]
  | null
>(null);

onMounted(() => {
  props.index === 0 || props.index === 1 ? (isOpen.value = true) : null;
  if (props.data) {
    months.value = props.data.map((el) => {
      return {
        id: el.id,
        name: new Date(`${el.year}.${el.month}.01`).toLocaleString("en", {
          month: "long",
        }),
        imported:
          el?.last_process && el?.last_process
            ? el?.last_process.status === "done"
            : false,
        url: el.google_url,
        status: el?.last_process ? el?.last_process.status : "in_queue",
      };
    });
  }
});

const DateNow = new Date();
const emit = defineEmits<{
  (e: "change", val: string | number): void;
  (e: "regenError", val: string): void;
  (e: "update"): void;
}>();
const handleRegenerate = async (
  studio_id: number,
  doc_id: number,
  i: number,
  isDelete?: boolean
) => {
  await deleteDocument(studio_id, doc_id)
    .then(() => {
      if (!isDelete) {
        handleChange(
          `${props.data[i].year}-${
            props.data[i].month < 10
              ? "0" + props.data[i].month
              : props.data[i].month
          }-05`
        );
      } else {
        emit("update");
      }
    })
    .catch((err) => {
      emit(
        "regenError",
        JSON.parse(err.cause.message.data.error_message).error.message
      );
    });
};
const handleChange = (value: string | number) => {
  emit("change", value);
};

watch(
  () => props.data,
  () => {
    if (props.data) {
      months.value = props.data.map((el) => {
        return {
          id: el.id,
          name: new Date(`${el.year}.${el.month}.01`).toLocaleString("en", {
            month: "long",
          }),
          imported:
            el?.last_process && el?.last_process
              ? el?.last_process.status === "done"
              : false,
          url: el.google_url,
          status: el?.last_process ? el?.last_process.status : "in_queue",
        };
      });
    }
    selectedMonth.value = null;
  }
);
</script>

<template>
  <section>
    <div class="month_selected_container">
      <div @click="isOpen = !isOpen" class="month_selected_container-yeargroup">
        <div class="month_selected_container-yeargroup--selector">
          <span>{{ year }}</span>
          <OpenerIcon
            :style="!isOpen ? { rotate: '180deg' } : { rotate: '0deg' }"
          />
        </div>
      </div>
      <GenerateButtons
        v-if="isOpen"
        :avaliable-dates="avaliableDates"
        :data="data"
        :is-update="isUpdate"
        :months="months"
        :year="year"
        @change="(val) => handleChange(val)"
      />
      <div
        class="month_selected_container-wrapper"
        v-if="isOpen && months && months.length"
      >
        <div
          id="month_selected_container-wrapper--mapper"
          class="month_selected_container-wrapper--mapper"
          v-for="(month, i) in months"
          @mouseenter="() => showIcon('in', month.id, +year)"
          @mouseleave="() => showIcon('out', month.id, +year)"
        >
          <a
            target="_blank"
            :id="'monthselect_a_' + month.id + '_' + +year"
            :href="month.url"
            >{{ month.name }}
            <OutLinkSquareIcon
              style="opacity: 0"
              :id="'monthselect_outicon_' + month.id + '_' + +year"
              class="month_selected_container-wrapper--mapper--outicon"
            />
          </a>
          <div class="month_selected_container_devmode_button_group">
            <Button
              v-if="DevMode.getActive.value"
              :color-scheme="'tertiary'"
              :is-update="
                selectedMonth?.id === month.id &&
                selectedMonth?.type === 'regen' &&
                isUpdate
              "
              @click="
                async () => {
                  selectedMonth = { id: month.id, type: 'regen' };
                  await handleRegenerate(studioId!, data[i].id, i);
                }
              "
              ><template #content>
                <div class="button_content_import_icon_content">
                  <RegenIcon :color="'#1860DC'" /> <span>Regeneration</span>
                </div>
              </template></Button
            >
            <Button
              v-if="DevMode.getActive.value"
              :color-scheme="'danger'"
              :is-update="
                selectedMonth?.id === month.id &&
                selectedMonth?.type === 'delete' &&
                isUpdate
              "
              @click="
                async () => {
                  selectedMonth = { id: month.id, type: 'delete' };
                  await handleRegenerate(studioId!, data[i].id, i, true);
                }
              "
              ><template #content>
                <div class="button_content_import_icon_content">
                  <TrashIcon class="button_content_delete_icon_icon" />Delete
                </div>
              </template></Button
            >
          </div>
          <div class="button_content_import_icon" v-if="month.imported">
            <div class="button_content_import_icon_imported">
              <span class="button_content_import_icon--span">Imported</span>
              <OverlayTooltip
                :append-to-id="'month_selected_container-wrapper--mapper'"
                ><template #open_button> <InfoIcon /> </template
                ><template #content>
                  <OverlayTooltipContent :data="data[i]" /> </template
              ></OverlayTooltip>
            </div>
          </div>
          <!-- <Button
              :color-scheme="'danger'"
              v-if="
                data[i].last_process && data[i].last_process.status === 'error'
              "
              @click="
                $router.push(
                  `/reports/${data[i].google_id}?month=${month.name}&year=${
                    data[i].year
                  }&doc_id=${data[i].id}&studio_id=${
                    data[i].studio_id
                  }&status=${
                    data[i]?.last_process
                      ? data[i]?.last_process.status +
                        '&process_id=' +
                        data[i]?.last_process.id
                      : 'in_queue'
                  }`
                )
              "
              ><template #content>
                <div class="button_content_import_icon">
                  <ErrorIconTriangle style="width: 17px; height: 15px" />
                  <span>View error</span>
                </div>
              </template></Button
            >
            <Button
              :color-scheme="'secondary'"
              v-else-if="
                data[i].last_process &&
                (data[i].last_process.status === 'importing' ||
                  data[i].last_process.status === 'validation')
              "
              @click="
                $router.push(
                  `/reports/${data[i].google_id}?month=${month.name}&year=${
                    data[i].year
                  }&doc_id=${data[i].id}&studio_id=${
                    data[i].studio_id
                  }&status=${
                    data[i]?.last_process
                      ? 'importing&process_id=' + data[i]?.last_process.id
                      : 'in_queue'
                  }`
                )
              "
              ><template #content>
                <div class="button_content_import_icon">
                  <SandClock style="width: 17px; height: 15px" />
                  <span>View progress</span>
                </div>
              </template></Button
              > -->
          <div
            v-else
            class="month_selected_container-wrapper--mapper--section_button_group"
          >
            <Button
              @click="
                $router.push(
                  `/reports/${data[i].google_id}?month=${month.name}&year=${data[i].year}&doc_id=${data[i].id}&studio_id=${data[i].studio_id}&status=in_queue`
                )
              "
              ><template #content>
                <div class="button_content_import_icon">
                  <ImportIcon />
                  <span>Import</span>
                </div>
              </template></Button
            >
          </div>
        </div>
      </div>
      <div
        class="month_selected_container-wrapper"
        v-else-if="isOpen && ((months && !months.length) || !months)"
      >
        <div
          id="month_selected_container-wrapper--mapper"
          class="month_selected_container-wrapper--mapper--empty"
        >
          <div v-if="DateNow.getMonth() === 11">
            Please generate a report for January
          </div>
          <div v-else>Please generate a report</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.month_selected_container {
  width: 610px;
  margin-top: 32px;

  &-yeargroup {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &--selector {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;

      span {
        color: #162031;
        font-weight: 600;
        font-size: 22px;
      }
    }
  }

  &-wrapper {
    border: 1px $neutrals-border-default solid;
    border-radius: 8px;
    margin-top: 24px;
    overflow: hidden;

    &:first-child {
      border-radius: 8px 8px 8px 8px !important;
    }

    &--mapper {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0px;
      border-bottom: 1px $neutrals-border-default solid;
      padding: 18px 16px;
      height: 56px;
      &:hover {
        background-color: $neutrals-background-semi;
      }

      a {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
      }

      &:first-child {
        border-radius: 8px 8px 0px 0px !important;
      }

      &:last-child {
        border-radius: 0px 0px 8px 8px !important;
      }
      .button_content_import_icon_content {
        display: flex;
        justify-content: space-between;
        gap: 7.4px;
        align-items: center;
        &--span {
          color: $neutrals-text-secondary;
          font-size: 14px;
          font-weight: 400;
        }

        &:nth-child(2) {
          margin-right: -5px;
        }
        &_imported {
          display: flex;
          justify-content: end;
          align-items: start;
        }
      }
      .button_content_import_icon {
        display: flex;
        justify-content: space-between;
        gap: 7.4px;
        align-items: end;
        &--span {
          color: $neutrals-text-secondary;
          font-size: 14px;
          font-weight: 400;
        }

        &:nth-child(2) {
          margin-right: -5px;
        }
        &_imported {
          display: flex;
          justify-content: end;
          align-items: start;
        }
      }

      &--empty {
        background-color: #fff;
        border-radius: 8px;
        border: 1px $neutrals-border-default solid;
        padding: 18px 16px;
        overflow: hidden;
        display: flex;
        height: 56px;
        justify-content: center;
        align-items: center;
        color: $neutrals-text-hint;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
  // .monthselector_button_import {
  //   max-width: 101px;
  // }
}

.custom-tooltip-month-select .p-tooltip-text {
  background-color: rgb(0, 0, 0);
  color: #ffffff;
  min-height: 25px;
  padding-bottom: 5px;
  padding-top: 1px;
  font-size: 14px;
  min-width: max-content;
}
.month_selected_container-wrapper--mapper--section_button_group {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.button_content_delete_icon_icon {
  stroke: #fff;
  fill: #fff;
  color: #fff;
}
.month_selected_container_devmode_button_group {
  display: flex;
  width: 100%;
  justify-content: end;
  padding: 2%;
}
</style>
