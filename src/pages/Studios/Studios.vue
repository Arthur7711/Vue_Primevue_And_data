<script setup lang="ts">
// import
import {ref, computed, watch} from "vue";
import CustomSearch from "@/components/CustomSearch.vue";
import {useStudiosStore} from "@/stores/studios";
import {onMounted} from "vue";
// props & store
const {studiosStore, getStudiosFiltersOptions, getProjectsFiltersOptions, getOfficesFiltersOptions, getStudiosList} = useStudiosStore()
// constants

// refs
const selectedFilters = ref({
  name: undefined,
  projects: undefined,
  offices: undefined,
});

const search = ref(null);
const options = ref<{name: { title: string; id: number; }[] | undefined, projects: undefined, offices: undefined}>({
  name: undefined,
  projects: undefined,
  offices: undefined,
});
const tableItemsCount= ref('');


// computed
const studiosOptions = computed(()=>{
  return  studiosStore.studiosFilter.data.map(item => {
      return {title: item.name, id: item.id}

    })
})
const projectOptions = computed(()=>{
  return studiosStore.projectsFilter.data.map(item => {
      return {title: item.name, id: item.id}

    })
})
const officesOptions = computed(()=>{
  return studiosStore.officesFilter.data.map(item => {
      return {title: item.name, id: item.id}
    })
})

// methods
const clearAllFilters = () =>{
  selectedFilters.value.name = undefined
  selectedFilters.value.projects = undefined
  selectedFilters.value.offices = undefined
}

// watch
watch(studiosOptions,()=>{
  options.value.name = studiosOptions.value
}, )
watch(projectOptions,()=>{
  options.value.projects = projectOptions.value
}, )
watch(officesOptions,()=>{
  options.value.offices = officesOptions.value
}, )

watch(selectedFilters.value,  ()=>{
     getStudiosList({
          studiosId: selectedFilters.value.name,
          projectsId: selectedFilters.value.projects,
          officesId: selectedFilters.value.offices
})
})
// hooks
onMounted( () => {
   getStudiosFiltersOptions()
   getProjectsFiltersOptions()
   getOfficesFiltersOptions()
})
</script>
<template>
  <h1 class="page-title">Studios</h1>
  <section class="studios-page">
    <div class="studios-page__filters">
      <div class="studios-page__filters-header">
        <h3>Filters</h3>
        <span @click="clearAllFilters">Clear all</span>
      </div>

      <div class="studios-page__filters-content">
        <CustomSelect
            v-model="selectedFilters.name"
            :options="options.name"
            select-title="Studios"
        />
        <CustomSelect
            v-model="selectedFilters.projects"
            :options="options.projects"
            select-title="Projects"
        />
        <CustomSelect
            v-model="selectedFilters.offices"
            :options="options.offices"
            select-title="Offices"
        />
      </div>
    </div>
    <div class="studios-page__list">
      <div class="studios-page__list-header">
        <div class="studios-page__list-title">
          <h3>Studios list</h3>
          <span>Results: {{tableItemsCount}}</span>
        </div>
        <div class="studios-page__list-search">
          <CustomSearch v-model:model-value="search" />
        </div>
      </div>
      <div class="projects-page__list-table">
        <StudioListTable
            :selectedFilters="selectedFilters"
            :search="search"
            @items-count="(data) => (tableItemsCount = data)"
        />
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.page-title {
  margin-top: 60px;
}
.studios-page {
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
  &__list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
  }
  &__list-title {
    h3 {
      @include Title-H3;
      margin-bottom: 0;
    }

    span {
      @include Body-M-14-Regular;
      color: $neutrals-text-hint;
    }
  }
  &__list-search {
    width: 320px;
  }
  &__list-table {
    width: 100%;
  }
}
</style>
