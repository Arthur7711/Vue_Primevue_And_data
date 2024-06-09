<script setup lang="ts">
// import
import { computed, ref, watch } from "vue";
import { fillTableLine } from "@/utils";
import { onMounted } from "vue";
import { useStudiosStore } from "@/stores/studios";
import type { IData } from "@/api/models/IStudios";
import { antSort } from "@/utils/antSort";
import useFiltersStore from "../../stores/filtersStore";
import { useRouter } from "vue-router";
import type { IStudioObject } from "./types";

// props & store
const router = useRouter();

const navigateToStaff = (info: IStudioObject) => {
  useFiltersStore.addFilterValues({
    studios: [info.id],
    offices: info.offices?.map((el) => el?.id),
    projects: info.projects?.map((el) => el?.id),
  });
  router.push({
    name: "Staff",
  });
};
const {
  studiosStore,
  getStudiosFiltersOptions,
  getProjectsFiltersOptions,
  getOfficesFiltersOptions,
  getStudiosList,
} = useStudiosStore();
const props = defineProps({
  search: { type: null },
  selectedFilters: {type: Object}
});
const emit = defineEmits(["items-count"]);

// refs
const columns = ref([
  fillTableLine("Studio", "name", {
    sorter: (a: IData, b: IData) => antSort(a.name, b.name),
  }),
  fillTableLine("Staff", "staff", {
    sorter: (a: IData, b: IData) => a.staff - b.staff,
  }),
  fillTableLine("Projects", "projects"),
  fillTableLine("Offices", "offices"),
]);
// methods

// computed

const filteredItems = computed(() => {
  if (!props.search) return studiosStore.studiosList.data;
  return studiosStore.studiosList.data.filter((item) => {
    return Object.values(item).some((value) => {
      if (Array.isArray(value)) {
        return value.some((val: { name: string }) =>
          val.name.toLowerCase().includes(props.search.toLowerCase())
        );
      }
      return String(value).toLowerCase().includes(props.search.toLowerCase());
    });
  });
});

// const filterValues = computed(() => {
//   const filters = {
//     studios_ids: [],
//     projects_ids: [],
//     offices_ids: [],
//   };
//   filters.studios_ids = Array.from(
//     new Set(filteredItems.value.map((studio) => studio.id))
//   );
//   filters.projects_ids = Array.from(
//     new Set(
//       filteredItems.value.flatMap((studio) =>
//         studio.projects.map((project) => project.id)
//       )
//     )
//   );
//   filters.offices_ids = Array.from(
//     new Set(
//       filteredItems.value.flatMap((studio) =>
//         studio.offices.map((office) => office.id)
//       )
//     )
//   );
//
//   return filters;
// });
// watch

watch(()=>props.selectedFilters.name,()=>{
    getProjectsFiltersOptions({studios_ids: props.selectedFilters.name});
    getOfficesFiltersOptions({studio_ids: props.selectedFilters.name});
}, {deep:true})

watch(()=>props.selectedFilters.projects, ()=>{
  getStudiosFiltersOptions({projects_ids: props.selectedFilters.projects});
  getOfficesFiltersOptions({project_ids: props.selectedFilters.projects});
}, {deep:true})

watch(()=>props.selectedFilters.offices, ()=>{
  getStudiosFiltersOptions({offices_ids: props.selectedFilters.offices});
  getProjectsFiltersOptions({offices_ids: props.selectedFilters.offices});

}, {deep:true})

watch(()=>filteredItems.value, ()=>{
  emit("items-count", filteredItems.value.length)
})
// watch(
//   () => filterValues.value,
//    (value) => {
//      // console.log('filter', filterValues.value)
//      getStudiosFiltersOptions(value);
//      getProjectsFiltersOptions(value);
//      getOfficesFiltersOptions(value);
//     emit("items-count", filteredItems.value.length);
//   }
// );

// hooks
onMounted( () => {
   getStudiosList();
});
</script>
<template>
  <a-table :data-source="filteredItems" :columns="columns" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'name'">
        <router-link
          :to="{ name: 'StudiosProjects', params: { id: record.id } }"
          class="studio-name"
          >{{ text }}
        </router-link>
      </template>
      <template v-else-if="column.dataIndex === 'staff'"
        ><span class="staff-name" @click="() => navigateToStaff(record)">{{
          text
        }}</span></template
      >
      <template v-else-if="column.dataIndex === 'projects'">
        <CustomTag v-for="item in record[column.dataIndex].slice(0, 3)">
          <router-link
            :to="{
              name: 'ProjectInformation',
              params: { project: `${item.id}` },
            }"
            class="project-name"
            >{{ item.name }}</router-link
          >
        </CustomTag>
        <LinkDropdown
          style="max-height: 70px"
          v-if="text.length > 3"
          :title="`${text.length - 3}`"
          :options="record[column.dataIndex].slice(3, text.length)"
        />
      </template>
      <template v-else-if="column.dataIndex === 'offices'">
        <CustomTag v-for="item in record[column.dataIndex]" type="neutral">{{
          item.name
        }}</CustomTag>
      </template>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>
</template>
<style scoped lang="scss">
.project-name {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.studio-name {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.staff-name {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
