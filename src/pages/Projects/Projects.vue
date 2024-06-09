<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { getProjects } from "../../api/projects";
import { IProject } from "../../api/models/IProjects";
import {
  getOfficesOptions,
  getProjectsOptions,
  getStudiosOptions,
} from "../../api/studios";
import { getMilestones } from "../../api/projects";

const filters = ref({
  project_name: undefined,
  milestone: undefined,
  studios: undefined,
  offices: undefined,
});
const options = ref({
  project_name: undefined,
  milestone: undefined,
  studios: undefined,
  offices: undefined,
});
const tableList = ref([]);
const tableRows = ref<null | IProject[]>(null);
const showLoader = ref(true);
const search = ref("");
const mountedTableRows = ref<null | IProject[]>(null);
const clear = () => {
  filters.value = {
    project_name: undefined,
    milestone: undefined,
    studios: undefined,
    offices: undefined,
  };
};

onMounted(() => {
  try {
    getProjects({}).then(({ data }) => {
      tableRows.value = data;
      mountedTableRows.value = data;
      showLoader.value = false;
    });
    getProjectsOptions().then(({ data }) => {
      options.value.project_name = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
    getMilestones().then(
      ({ data }) =>
        (options.value.milestone = data.map((el) => {
          return { title: el.name, id: el.id };
        }))
    );
    getStudiosOptions().then(({ data }) => {
      options.value.studios = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
    getOfficesOptions().then(({ data }) => {
      options.value.offices = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
  } catch (error) {
    console.log(error);
  }
});

watch(
  filters,
  async () => {
    search.value = "";
    getProjects({
      projects_ids: filters.value.project_name
        ? Array.from(filters.value.project_name)
        : undefined,
      studios_ids: filters.value.studios
        ? Array.from(filters.value.studios)
        : undefined,
      offices_ids: filters.value.offices
        ? Array.from(filters.value.offices)
        : undefined,
      milestones_ids: filters.value.milestone
        ? Array.from(filters.value.milestone)
        : undefined,
    }).then(({ data }) => {
      tableRows.value = data;
    });
    getProjectsOptions({
      offices_ids: filters?.value?.offices,
      studios_ids: filters?.value?.studios,
    }).then(({ data }) => {
      options.value.project_name = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
    getMilestones({
      projects_ids: filters.value?.project_name,
    }).then(
      ({ data }) =>
        (options.value.milestone = data.map((el) => {
          return { title: el.name, id: el.id };
        }))
    );
    getStudiosOptions({
      projects_ids: filters.value?.project_name,
      offices_ids: filters?.value?.offices,
    }).then(({ data }) => {
      options.value.studios = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
    getOfficesOptions({
      projects_ids: filters.value?.project_name,
      studios_ids: filters?.value?.studios,
    }).then(({ data }) => {
      options.value.offices = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
  },
  {
    deep: true,
  }
);
watch(search, () => {
  tableRows.value = mountedTableRows.value.filter((el) => {
    if (
      el?.project_name?.toLowerCase()?.includes(search.value?.toLowerCase())
    ) {
      return el;
    } else if (
      el?.offices?.find((elem) =>
        elem?.toLowerCase()?.includes(search.value?.toLowerCase())
      )
    ) {
      return el;
    } else if (
      el?.studios?.find((elem) =>
        elem?.name?.toLowerCase()?.includes(search.value?.toLowerCase())
      )
    ) {
      return el;
    }
  });
});
</script>
<template>
  <h1 class="page-title">Projects</h1>
  <section class="projects-page">
    <div class="projects-page__filters">
      <div class="projects-page__filters-header">
        <h3>Filters</h3>
        <span @click="clear">Clear all</span>
      </div>
      <div class="projects-page__filters-content">
        <CustomSelect
          v-model="filters.project_name"
          :options="options.project_name"
          select-title="Projects"
          v-if="options.project_name"
        />
        <CustomSelect
          v-model="filters.milestone"
          :options="options.milestone"
          select-title="Milestones"
          v-if="options.milestone"
        />
        <CustomSelect
          v-model="filters.studios"
          :options="options.studios"
          select-title="Studios"
          v-if="options.studios"
        />
        <CustomSelect
          v-model="filters.offices"
          :options="options.offices"
          select-title="Offices"
          v-if="options.offices"
        />
        <p
          v-if="options.offices?.length === 1"
          style="color: #8393a9; font-size: 12px"
        >
          Only one office is available for the selected studio
        </p>
      </div>
    </div>
    <div class="projects-page__list">
      <div class="projects-page__list-box">
        <div class="projects-page__list-title">
          <h3>Project list</h3>
          <span>Results: {{ tableRows?.length }} </span>
        </div>
        <a-input
          v-model:value="search"
          placeholder="Search projects"
          class="search_projects"
        />
      </div>
      <div class="projects-page__list-table">
        <div style="display: flex; justify-content: center">
          <a-spin tip="Loading..." size="large" v-if="showLoader" />
        </div>
        <ProjectListTable
          :filters="filters"
          @refresh-table="(data) => (tableList = data)"
          :item-list="tableRows"
          v-if="!showLoader"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects-page {
  display: flex;
  flex-flow: row;
  border: 1px solid $neutrals-border-default;
  border-radius: 8px;

  &__filters {
    flex: none;
    width: 23%;
    padding: 26px 20px;
    border-right: 1px solid $neutrals-border-default;
  }

  &__filters-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 38px;

    h3 {
      @include Title-H3;
      margin-bottom: 0;
    }

    span {
      @include Button-M;
      color: $primary-text-default;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__filters-content {
    & > * + * {
      margin-top: 20px;
    }
  }

  &__list {
    width: 100%;
  }
  &__list-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 26px 20px;
  }
  &__list-title {
    position: relative;

    h3 {
      @include Title-H3;
      margin-bottom: 0;
    }

    span {
      @include Body-M-14-Regular;
      color: $neutrals-text-hint;
    }
  }
  &__list-table {
    width: 100%;
  }
  .search_projects {
    width: 320px;
    height: 36px;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1.5px solid $neutrals-border-default;
    &:focus {
      box-shadow: none !important;
    }
  }
}
</style>
