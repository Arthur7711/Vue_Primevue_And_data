<script lang="ts" setup>
import { type IDocumentStatusIndividual } from "@/api/reports";
import Button from "../Custom/components/Button/Button.vue";

const props = defineProps<{
  months:
    | {
        id: number;
        name: string;
        imported: boolean;
        status: string;
        url: string;
      }[]
    | null;
  avaliableDates: { year: string | number; value: string[] };
  isUpdate: boolean;
  year: string | number;
  data: IDocumentStatusIndividual[];
}>();
const DateNow = new Date();
const getMonth = (): string => {
  return `${new Date().getFullYear()}.${
    new Date().getMonth() < 11 ? new Date().getMonth() + 1 : "01"
  }.${new Date().getDate()}`;
};
const getNextMonth = (): string => {
  return `${new Date().getFullYear()}.${
    new Date().getMonth() + 1
  }.${new Date().getDate()}`;
};
const dateFiller = () => {
  const dates = props.avaliableDates?.value
    ?.map((el) => {
      return {
        id: el,
        title: new Date(el).toLocaleString("en", { month: "long" }),
      };
    })
    .filter((elem) => {
      let res = true;
      props.months &&
        props.months.forEach((el) => {
          if (elem.title === el.name) {
            res = false;
          }
        });
      return res;
    });
  return dates;
};
</script>

<template>
  <div class="generate_buttons-container">
    <!--Aval && !dec-->
    <Button
      v-if="avaliableDates?.value && avaliableDates?.value?.length === 1"
      :is-update="isUpdate"
      :size="'s'"
      :color-scheme="'secondary'"
      @click="
        (e) => {
          e.stopPropagation();
          $emit('change', avaliableDates?.value[0]);
        }
      "
      ><template #content>
        Generate
        {{
          new Date(avaliableDates?.value[0]).toLocaleString("en", {
            month: "long",
          })
        }}
      </template></Button
    >
    <!--!aval && !dec-->
    <Button
      v-else-if="
        !avaliableDates?.value?.length &&
        DateNow.getMonth() < 11 &&
        DateNow.getDate() < 5 &&
        DateNow.getFullYear() - 1 !== year
      "
      v-tooltip.top="{
        value: `Will be available on ${new Date(getMonth()).toLocaleString(
          'en',
          {
            month: 'long',
          }
        )} 5th`,
        escape: true,
        class: 'custom-tooltip-month-select',
      }"
      :disable="true"
      ><template #content>
        Generate
        {{
          new Date(getMonth()).toLocaleString("en", {
            month: "long",
          })
        }}
      </template></Button
    >
    <!--!aval && dec-->
    <span
      @click="(e) => e.stopPropagation()"
      v-else-if="
        (!avaliableDates?.value?.length &&
          DateNow.getMonth() == 11 &&
          DateNow.getFullYear() === year) ||
        (data.length === 12 && DateNow.getFullYear() - 1 === year)
      "
    ></span>
    <!--!aval && !dec && day < 5-->
    <Button
      v-else-if="
        !avaliableDates?.value?.length &&
        DateNow.getMonth() < 11 &&
        DateNow.getDate() >= 5 &&
        DateNow.getFullYear() === year
      "
      v-tooltip.top="{
        value: `Will be available on 
        ${new Date(
          new Date(DateNow.getFullYear(), DateNow.getMonth() + 1)
        ).toLocaleString('en', {
          month: 'long',
        })} 5th`,
        escape: true,
        class: 'custom-tooltip-month-select',
      }"
      :disable="true"
      ><template #content>
        Generate
        {{
          new Date(
            new Date(DateNow.getFullYear(), DateNow.getMonth() + 1)
          ).toLocaleString("en", {
            month: "long",
          })
        }}
      </template></Button
    >
    <Button
      v-else-if="!avaliableDates?.value?.length && DateNow.getMonth() == 11"
      v-tooltip.top="{
        value: `Will be available on January 5th`,
        escape: true,
        class: 'custom-tooltip-month-select',
      }"
      :disable="true"
      ><template #content>
        Generate
        {{
          new Date(getMonth()).toLocaleString("en", {
            month: "long",
          })
        }}
      </template></Button
    >
    <DropdownGray
      @click="(e: Event) => e.stopPropagation()"
      @change-event="val =>$emit('change',val!.id)"
      v-else-if="avaliableDates?.value && avaliableDates?.value?.length > 1"
      placeholder="Generate"
      :is-updated="!isUpdate"
      :option-label="'title'"
      :dropTypes="dateFiller()"
    />
  </div>
</template>

<style lang="scss">
.generate_buttons-container {
  //   width: 118px;
  display: flex;
  justify-content: end;
}
</style>
