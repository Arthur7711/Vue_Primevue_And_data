<template>
  <CustomBreadcrumbs :breadcrumbs="breadcrumbs" style="margin-top: 70px"/>
  <div style="display: flex; align-items: center;">
    <h1 class="page-title">{{ studiosStore.studioName?.name }}</h1>
    <div class="page-title__item" >
      <div class="page-title__item-total">
        <div style="margin-top: 2px;">
        <IconStaffCount/>
        </div>
        <span v-if="studiosStore.studiosStaff?.staff_count">{{studiosStore.studiosStaff?.staff_count}}</span>
        <span v-else style="text-align: center; white-space: nowrap">No data</span>
      </div>

      <span class="page-title__item-progress-up"  v-if="studiosStore.studiosStaff?.staff_new_count">
        <IconArrowUp class="page-title__item-progress-up-arrow" />
        <span class="page-title__item-progress-up-count">{{studiosStore.studiosStaff?.staff_new_count}}</span>
      </span>
      <span class="page-title__item-progress-down" v-else-if="studiosStore.studiosStaff?.staff_fired_count">
        <IconArrowUp class="page-title__item-progress-down-arrow" />
        <span class="page-title__item-progress-down-count">{{studiosStore.studiosStaff?.staff_new_count}}</span>
      </span>
      <span v-else></span>
    </div>
  </div>

  <section class="studios-tab-page">
    <a-tabs :activeKey="activeTab" @change="tabClick" class="studios-tab-page__tabs" animated>
      <a-tab-pane key="StudiosProjects" tab="Projects">
        <slot name="projects" />
      </a-tab-pane>
      <a-tab-pane key="StudiosDepartments" tab="Departments">
        <slot name="departments" />
      </a-tab-pane>
      <a-tab-pane key="StudiosHR" tab="HR">
        <slot name="hr" />
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script setup lang="ts">
// import
import {computed, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconStaffCount from "@/components/icons/IconStaffCount.vue";
import IconArrowUp from "@/components/icons/IconArrowUp.vue";
import {useStudiosStore} from "@/stores/studios";

// props
const {studiosStore, getStudioName, getStudiosStaffCount} = useStudiosStore()
const route = useRoute(), router = useRouter()

// constants


// refs

// computed
const breadcrumbs = computed(() => {
  return ['Studios', studiosStore.studioName?.name]
})
const activeTab = computed(() => route.name?.toString())

// methods

const tabClick = (name: string) => {
  router.push({ name, params: { studios: route.params.studios } })
}

// hooks
onMounted(async ()=>{
  await getStudioName(route.params.id)
  await getStudiosStaffCount(route.params.id)
})
</script>

<style scoped lang="scss">
.studios-tab-page {}

.page-title {
  &__item {
    margin-left: 8px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    width: 90px;
    justify-content: space-between;
  }
  &__item-total {
    width: 51px;
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;

    gap: 2px;
    color: $neutrals-text-secondary;
    @include Body-L-16-Bold();
  }
  &__item-progress-up {
    background-color: $success-background-default;
    border-radius: 12px;
    width: 35px;
    height: 16px;
    padding: 2px 4px;
    display: flex;
    align-items: center
  }
  &__item-progress-up-arrow {
    min-width: 10px;
    min-height: 10px;
  }
  &__item-progress-up-count {
    color: $neutrals-text-invert;
    @include Body-XS-10-Bold();
  }
  &__item-progress-down {
    background-color: $danger-background-default ;
    border-radius: 12px;
    width: 35px;
    height: 16px;
    padding: 2px 4px;
    display: flex;
    align-items: center
  }
  &__item-progress-down-arrow {
    min-width: 10px;
    min-height: 10px;
  }
  &__item-progress-down-count {
    color: $neutrals-text-invert;
    @include Body-XS-10-Bold();
  }
}



</style>
